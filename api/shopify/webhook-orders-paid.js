// api/shopify/webhook-orders-paid.js
//
// Shopify-webhook-abonnement: orders/paid.
// Vangt het geval op waarbij een order NIET al betaald was bij orders/create
// (bv. bij een betaalmethode die pas later bevestigd wordt) — zodra Shopify
// meldt dat de betaling binnen is, zetten we de order op 'paid' en routeren
// we 'm meteen naar de juiste leverancier (dezelfde regel als in
// webhook-order-create.js: nooit vóór betaling naar de leverancier).

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
    res.status(401).json({ error: 'Ongeldige webhook-handtekening.' });
    return;
  }

  const shopifyOrder = req.body;

  try {
    const orderRecord = await orders.getOrderByShopifyId(String(shopifyOrder.id));
    if (!orderRecord) {
      // Zou niet moeten gebeuren (orders/create hoort altijd eerder te vuren),
      // maar defensief afhandelen i.p.v. te crashen.
      await syncLog.log({ type: 'orders-paid-webhook', ok: false, orderId: shopifyOrder.id, error: 'Order niet gevonden in database — orders/create-webhook mogelijk gemist.' });
      res.status(200).json({ ok: false, reason: 'order-not-found' });
      return;
    }

    let updatedOrder = orderRecord;
    if (orderRecord.status === 'received') {
      updatedOrder = await orders.updateOrderStatus(orderRecord.id, 'paid', 'Betaling bevestigd via orders/paid-webhook');
    }

    const routing = await routeOrderToSupplier(updatedOrder, shopifyOrder);
    if (routing.routed) {
      updatedOrder = { ...updatedOrder, status: 'sent_to_supplier' };
    }
    await syncLog.log({ type: 'orders-paid-webhook', ok: true, orderId: orderRecord.shopify_order_id, note: JSON.stringify(routing) });

    res.status(200).json({ ok: true, orderId: updatedOrder.id, status: updatedOrder.status, routing });
  } catch (err) {
    await syncLog.log({ type: 'orders-paid-webhook', ok: false, orderId: shopifyOrder && shopifyOrder.id, error: err.message });
    res.status(200).json({ ok: false, error: err.message });
  }
};
