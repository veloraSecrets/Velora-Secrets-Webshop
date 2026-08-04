// lib/order-fulfillment.js
//
// Gedeelde routeringslogica, gebruikt door zowel webhook-order-create.js
// (wanneer een order al betaald binnenkomt) als webhook-orders-paid.js
// (wanneer een order later alsnog betaald wordt). Bewust hier gecentraliseerd
// i.p.v. in beide webhooks gedupliceerd, zodat er maar één plek is waar de
// "na betaling -> leverancier"-regel staat.
//
// BELANGRIJKE BUSINESS-REGEL: een order wordt PAS naar een leverancier
// doorgestuurd nadat 'ie betaald is — nooit al bij het aanmaken. Dit voorkomt
// dat een nog-niet-betaalde (of gefaalde) bestelling toch een gratis product
// bij Dreamlove/1on1 Wholesale in gang zet.

const orders = require('./db/orders');
const { findSupplierForOrder } = require('./suppliers/registry');
const syncLog = require('./db/sync-logs');

async function routeOrderToSupplier(orderRecord, shopifyOrderPayload) {
  if (orderRecord.status !== 'paid') {
    // Alleen vanuit 'paid' mag naar 'sent_to_supplier' — order-lifecycle.js
    // zou dit ook al weigeren, maar hier voorkomen we zelfs de aanroep.
    return { routed: false, reason: `Order staat op status "${orderRecord.status}", niet "paid".` };
  }

  const supplier = findSupplierForOrder(shopifyOrderPayload);
  if (!supplier) {
    await syncLog.log({
      type: 'order-routing', ok: false, orderId: orderRecord.shopify_order_id,
      error: 'Geen passende leverancier gevonden voor deze order.'
    });
    return { routed: false, reason: 'no-supplier-match' };
  }

  const result = await supplier.submitOrder(shopifyOrderPayload);
  await orders.linkSupplierOrder(orderRecord.id, supplier.name, result.supplierOrderId, result.estimatedShipDate);
  await orders.updateOrderStatus(orderRecord.id, 'sent_to_supplier', `Doorgestuurd naar ${supplier.name} (leverancier-order ${result.supplierOrderId})`);

  await syncLog.log({
    type: 'order-routing', ok: true, orderId: orderRecord.shopify_order_id,
    supplier: supplier.name, count: 1
  });

  return { routed: true, supplier: supplier.name, supplierOrderId: result.supplierOrderId };
}

module.exports = { routeOrderToSupplier };
