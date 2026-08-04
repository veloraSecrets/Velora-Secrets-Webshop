// api/shopify/webhook-order-create.js
//
// Shopify-webhook-abonnement: orders/create (Shopify → Instellingen →
// Notificaties → Webhooks, of via de Admin API).
// Maakt de order aan in de eigen database (status 'received'). Als de order
// bij aankomst al betaald is (financial_status === 'paid' — gebeurt vaak bij
// directe betaalmethoden), wordt 'ie meteen doorgezet naar 'paid' en
// automatisch naar de juiste leverancier gerouteerd. Is 'ie nog niet betaald,
// dan wacht de order op de aparte orders/paid-webhook (zie
// webhook-orders-paid.js) — NOOIT vóór betaling naar een leverancier sturen.
//
// KRITIEK: verifieert de HMAC-handtekening vóórdat de order-body wordt
// vertrouwd — zonder die check zou willekeurig wie een nep-orderwebhook
// kunnen sturen en zo een gratis product bij een leverancier kunnen bestellen.

const { verifyShopifyWebhook } = require('../../lib/shopify/verify-webhook');
const { routeOrderToSupplier } = require('../../lib/order-fulfillment');
const orders = require('../../lib/db/orders');
const syncLog = require('../../lib/db/sync-logs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  let verified;
  try {
    verified = verifyShopifyWebhook(rawBody, hmacHeader);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
  if (!verified) {
    await syncLog.log({ type: 'order-webhook', ok: false, error: 'Ongeldige HMAC-handtekening — verzoek genegeerd.' });
    res.status(401).json({ error: 'Ongeldige webhook-handtekening.' });
    return;
  }

  const shopifyOrder = req.body;

  try {
    // Idempotent: Shopify kan webhooks meer dan eens afleveren (at-least-once
    // delivery) — bij een dubbele aflevering hergebruiken we de bestaande order
    // i.p.v. een dubbele aan te maken (shopify_order_id is UNIQUE in de database).
    let orderRecord = await orders.getOrderByShopifyId(String(shopifyOrder.id));
    if (!orderRecord) {
      orderRecord = await orders.createOrder({
        shopifyOrderId: String(shopifyOrder.id),
        orderNumber: shopifyOrder.name,
        email: shopifyOrder.email,
        financialStatus: shopifyOrder.financial_status,
        totalAmount: shopifyOrder.total_price,
        currency: shopifyOrder.currency,
        shippingAddress: shopifyOrder.shipping_address,
        items: (shopifyOrder.line_items || []).map(li => ({
          sku: li.sku, title: li.title, quantity: li.quantity, price: li.price
        }))
      });
      await syncLog.log({ type: 'order-webhook', ok: true, orderId: orderRecord.shopify_order_id, note: 'Order aangemaakt' });
    }

    let routing = { routed: false, reason: 'not-yet-paid' };
    if (shopifyOrder.financial_status === 'paid' && orderRecord.status === 'received') {
      orderRecord = await orders.updateOrderStatus(orderRecord.id, 'paid', 'Order kwam al betaald binnen (financial_status=paid bij orders/create)');
      routing = await routeOrderToSupplier(orderRecord, shopifyOrder);
      if (routing.routed) {
        orderRecord = { ...orderRecord, status: 'sent_to_supplier' };
      }
    }

    res.status(200).json({ ok: true, orderId: orderRecord.id, status: orderRecord.status, routing });
  } catch (err) {
    await syncLog.log({ type: 'order-webhook', ok: false, orderId: shopifyOrder && shopifyOrder.id, error: err.message });
    res.status(200).json({ ok: false, error: err.message }); // 200: voorkomt onnodige Shopify-webhook-retries
  }
};
