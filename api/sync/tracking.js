// api/sync/tracking.js
//
// Periodieke job (polling) die openstaande dropship-orders (uit de database,
// via orders.getOpenSupplierLinks()) langsloopt en aan de bijbehorende
// leverancier vraagt of er al Track & Trace beschikbaar is. Zodra dat zo is:
//   1. Track & Trace wordt opgeslagen in de database (tracking_events).
//   2. Shopify's fulfillmentCreate wordt aangeroepen — Shopify verstuurt dan
//      ZELF de verzendbevestiging naar de klant, uit naam van Velora Secrets
//      (notifyCustomer: true in admin-client.js).
//   3. De order-status gaat naar 'shipped' (via de order-lifecycle-regels).

const { createFulfillment } = require('../../lib/shopify/admin-client');
const { getSuppliers } = require('../../lib/suppliers/registry');
const orders = require('../../lib/db/orders');
const syncLog = require('../../lib/db/sync-logs');
const { verifyCronRequest } = require('../../lib/verify-cron-request');

async function runTrackingSync() {
  const openLinks = await orders.getOpenSupplierLinks();

  if (openLinks.length === 0) {
    await syncLog.log({ type: 'tracking-sync', ok: true, count: 0, note: 'Geen openstaande leverancierskoppelingen om te controleren.' });
    return { ok: true, count: 0 };
  }

  const suppliersByName = Object.fromEntries(getSuppliers().map(s => [s.name, s]));
  let updated = 0;

  for (const link of openLinks) {
    try {
      const supplier = suppliersByName[link.supplier_name];
      if (!supplier) {
        await syncLog.log({ type: 'tracking-sync', ok: false, supplier: link.supplier_name, error: `Onbekende leverancier "${link.supplier_name}" — niet geregistreerd in registry.js.` });
        continue;
      }

      const tracking = await supplier.fetchTracking(link.supplier_order_id);
      if (!tracking) continue; // nog geen tracking beschikbaar — volgende keer opnieuw proberen

      await orders.addTrackingEvent(link.id, tracking);

      const order = await orders.getOrderById(link.order_id);
      // processing -> shipped is de enige geldige route hiernaartoe (zie
      // order-lifecycle.js); als de order nog op 'sent_to_supplier' staat,
      // eerst naar 'processing' zetten voordat 'shipped' toegestaan is.
      if (order.status === 'sent_to_supplier') {
        await orders.updateOrderStatus(order.id, 'processing', 'Leverancier is de order aan het verwerken (tracking beschikbaar).');
      }
      const freshOrder = await orders.getOrderById(link.order_id);
      if (freshOrder.status === 'processing') {
        await orders.updateOrderStatus(order.id, 'shipped', `Track & Trace ontvangen: ${tracking.trackingNumber} (${tracking.carrier})`);
      }

      await createFulfillment({
        orderId: order.shopify_order_id,
        trackingNumber: tracking.trackingNumber,
        trackingUrl: tracking.trackingUrl,
        trackingCompany: tracking.carrier
      });

      updated++;
    } catch (err) {
      await syncLog.log({ type: 'tracking-sync', ok: false, orderId: link.order_id, error: err.message });
    }
  }

  await syncLog.log({ type: 'tracking-sync', ok: true, count: updated });
  return { ok: true, count: updated };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const auth = verifyCronRequest(req);
  if (!auth.ok) {
    res.status(401).json({ error: auth.reason });
    return;
  }
  try {
    const result = await runTrackingSync();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

module.exports.runTrackingSync = runTrackingSync;
