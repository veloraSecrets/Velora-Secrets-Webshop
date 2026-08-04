// lib/db/orders.js
//
// Repository voor de volledige order-/fulfillmentmodule. Elke statuswijziging
// gaat door updateOrderStatus(), die ALTIJD eerst lib/order-lifecycle.js
// raadpleegt — een ongeldige overgang (bv. "shipped" direct na "received")
// wordt hier al geweigerd, nog vóórdat het de database bereikt.

const db = require('./index');
const lifecycle = require('../order-lifecycle');

async function createOrder({ shopifyOrderId, orderNumber, email, financialStatus, totalAmount, currency, shippingAddress, items }) {
  let customerId = null;
  if (email) {
    const existing = await db.query('SELECT id FROM customers WHERE email = $1', [email]);
    if (existing.length) {
      customerId = existing[0].id;
    } else {
      const inserted = await db.query(
        'INSERT INTO customers (email) VALUES ($1) RETURNING id',
        [email]
      );
      customerId = inserted[0].id;
    }
  }

  const orderRows = await db.query(
    `INSERT INTO orders (shopify_order_id, order_number, customer_id, status, financial_status, total_amount, currency, shipping_address)
     VALUES ($1, $2, $3, 'received', $4, $5, $6, $7) RETURNING *`,
    [shopifyOrderId, orderNumber || null, customerId, financialStatus || null, totalAmount || null, currency || 'EUR', JSON.stringify(shippingAddress || {})]
  );
  const order = orderRows[0];

  await db.query(
    `INSERT INTO order_status_history (order_id, status, note) VALUES ($1, 'received', 'Order aangemaakt vanuit Shopify-webhook')`,
    [order.id]
  );

  if (items && items.length) {
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, sku, title, quantity, price, supplier_name) VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.sku, item.title, item.quantity, item.price, item.supplierName || null]
      );
    }
  }

  return order;
}

async function getOrderByShopifyId(shopifyOrderId) {
  const rows = await db.query('SELECT * FROM orders WHERE shopify_order_id = $1', [shopifyOrderId]);
  return rows[0] || null;
}

async function getOrderById(orderId) {
  const rows = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  return rows[0] || null;
}

async function updateOrderStatus(orderId, newStatus, note) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} niet gevonden.`);
  }
  if (!lifecycle.isValidTransition(order.status, newStatus)) {
    throw new Error(`Ongeldige statusovergang: "${order.status}" -> "${newStatus}" is niet toegestaan.`);
  }

  await db.query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newStatus, orderId]);
  await db.query('INSERT INTO order_status_history (order_id, status, note) VALUES ($1, $2, $3)', [orderId, newStatus, note || null]);

  return { ...order, status: newStatus };
}

async function getOrderTimeline(orderId) {
  return db.query('SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY created_at ASC', [orderId]);
}

async function linkSupplierOrder(orderId, supplierName, supplierOrderId, estimatedShipDate) {
  const rows = await db.query(
    `INSERT INTO supplier_order_links (order_id, supplier_name, supplier_order_id, status, estimated_ship_date)
     VALUES ($1, $2, $3, 'submitted', $4) RETURNING *`,
    [orderId, supplierName, supplierOrderId, estimatedShipDate || null]
  );
  return rows[0];
}

async function addTrackingEvent(supplierOrderLinkId, { trackingNumber, trackingUrl, carrier, status }) {
  const rows = await db.query(
    `INSERT INTO tracking_events (supplier_order_link_id, tracking_number, tracking_url, carrier, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [supplierOrderLinkId, trackingNumber, trackingUrl, carrier, status]
  );
  return rows[0];
}

async function getOpenSupplierLinks() {
  // "Open" = nog geen tracking-event heeft — dit is precies wat
  // api/sync/tracking.js langsloopt om te pollen bij de leverancier.
  return db.query(`
    SELECT sol.* FROM supplier_order_links sol
    LEFT JOIN tracking_events te ON te.supplier_order_link_id = sol.id
    WHERE te.id IS NULL AND sol.status != 'failed'
  `);
}

async function listOrders({ status, limit = 50 } = {}) {
  if (status) {
    return db.query(
      `SELECT o.*, c.email AS email FROM orders o LEFT JOIN customers c ON c.id = o.customer_id
       WHERE o.status = $1 ORDER BY o.created_at DESC LIMIT $2`,
      [status, limit]
    );
  }
  return db.query(
    `SELECT o.*, c.email AS email FROM orders o LEFT JOIN customers c ON c.id = o.customer_id
     ORDER BY o.created_at DESC LIMIT $1`,
    [limit]
  );
}

async function getDashboardStats() {
  const rows = await db.query('SELECT status, COUNT(*) as count FROM orders GROUP BY status', []);
  const stats = {};
  lifecycle.STATUSES.forEach(s => { stats[s] = 0; });
  rows.forEach(r => { stats[r.status] = Number(r.count); });
  return stats;
}

module.exports = {
  createOrder, getOrderByShopifyId, getOrderById, updateOrderStatus, getOrderTimeline,
  linkSupplierOrder, addTrackingEvent, getOpenSupplierLinks, listOrders, getDashboardStats
};
