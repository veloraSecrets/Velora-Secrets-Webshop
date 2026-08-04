// api/test/run-e2e.js
//
// Volledige end-to-end testflow, uitsluitend bedoeld om vóór livegang te
// draaien met TEST_MODE=true: productimport -> synchronisatie -> proefbestelling
// -> betaling -> automatische leverancier-routering -> Track & Trace ->
// orderstatus 'shipped'. Dit roept NU de daadwerkelijke productiecode aan
// (lib/db/orders.js, lib/order-fulfillment.js, api/sync/tracking.js) —
// geen aparte, vereenvoudigde testsimulatie meer. Zo bewijst een geslaagde
// testrun ook echt dat de productiecode klopt, niet alleen een kopie ervan.
//
// Dit endpoint weigert bewust te draaien als TEST_MODE niet aanstaat.

const { isTestMode, getMockTestOrder } = require('../../lib/test-mode');
const { upsertProduct } = require('../../lib/shopify/admin-client');
const { getSuppliers } = require('../../lib/suppliers/registry');
const { routeOrderToSupplier } = require('../../lib/order-fulfillment');
const orders = require('../../lib/db/orders');
const syncLog = require('../../lib/db/sync-logs');
const trackingJob = require('../sync/tracking');

async function runStep(steps, name, fn) {
  const started = Date.now();
  try {
    const result = await fn();
    steps.push({ step: name, ok: true, durationMs: Date.now() - started, result });
    return result;
  } catch (err) {
    steps.push({ step: name, ok: false, durationMs: Date.now() - started, error: err.message });
    throw Object.assign(new Error(`Stap "${name}" mislukt: ${err.message}`), { steps });
  }
}

async function runFullE2ETest() {
  if (!isTestMode()) {
    throw new Error('TEST_MODE staat niet aan. Zet TEST_MODE=true (in Preview/Development-omgeving, NOOIT Production) om de testflow te draaien.');
  }

  const steps = [];

  // Stap 1: productimport (leverancier -> lokale catalogus ophalen)
  let catalog;
  await runStep(steps, 'Productimport van leveranciers', async () => {
    catalog = [];
    for (const supplier of getSuppliers()) {
      const products = await supplier.fetchCatalog();
      catalog.push(...products.map(p => ({ ...p, supplier: supplier.name })));
    }
    return { productenGevonden: catalog.length };
  });

  // Stap 2: synchronisatie naar Shopify (mock upsert in testmodus)
  await runStep(steps, 'Synchronisatie naar Shopify', async () => {
    const created = [];
    for (const p of catalog) {
      const product = await upsertProduct({ title: p.title, vendor: p.brand });
      created.push(product.id);
    }
    return { productenGesynchroniseerd: created.length };
  });

  // Stap 3: proefbestelling ECHT aanmaken in de database (status: received)
  const testOrderPayload = getMockTestOrder();
  const orderRecord = await runStep(steps, 'Proefbestelling aangemaakt in database', async () => {
    const existing = await orders.getOrderByShopifyId(testOrderPayload.id);
    if (existing) return existing; // idempotent bij herhaalde testruns
    return orders.createOrder({
      shopifyOrderId: testOrderPayload.id,
      orderNumber: testOrderPayload.name,
      email: 'e2e-test@velorasecrets.nl',
      financialStatus: 'pending',
      totalAmount: testOrderPayload.total_price,
      currency: 'EUR',
      shippingAddress: testOrderPayload.shipping_address,
      items: testOrderPayload.line_items.map(li => ({ sku: li.sku, title: li.title, quantity: li.quantity, price: 24.95 }))
    });
  });

  // Stap 4: order op 'paid' zetten (simuleert de orders/paid-webhook)
  const paidOrder = await runStep(steps, 'Order op "paid" gezet', async () => {
    if (orderRecord.status === 'paid') return orderRecord; // idempotent
    return orders.updateOrderStatus(orderRecord.id, 'paid', 'E2E-test: betaling gesimuleerd');
  });

  // Stap 5: automatische leverancier-routering (ECHTE productiefunctie)
  const routing = await runStep(steps, 'Automatisch naar leverancier gerouteerd', async () => {
    const result = await routeOrderToSupplier(paidOrder, testOrderPayload);
    if (!result.routed) throw new Error(result.reason || 'Routering mislukt zonder reden.');
    return result;
  });

  // Stap 6+7: Track & Trace ophalen + orderstatus bijwerken (ECHTE sync-job)
  await runStep(steps, 'Track & Trace opgehaald en orderstatus bijgewerkt (sync-job)', async () => {
    return trackingJob.runTrackingSync();
  });

  // Verificatie: order moet nu op 'shipped' staan
  const finalOrder = await runStep(steps, 'Eindstatus geverifieerd', async () => {
    const fresh = await orders.getOrderById(orderRecord.id);
    if (fresh.status !== 'shipped') {
      throw new Error(`Verwachtte status 'shipped', kreeg '${fresh.status}'.`);
    }
    return fresh;
  });

  const timeline = await orders.getOrderTimeline(orderRecord.id);

  await syncLog.log({ type: 'e2e-test', ok: true, count: steps.length });
  return { ok: true, steps, orderTimeline: timeline.map(t => t.status) };
}

module.exports = async function handler(req, res) {
  const secret = process.env.ADMIN_PANEL_SECRET;
  if (!secret || req.headers['x-admin-secret'] !== secret) {
    res.status(401).json({ error: 'Niet geautoriseerd.' });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const result = await runFullE2ETest();
    res.status(200).json(result);
  } catch (err) {
    await syncLog.log({ type: 'e2e-test', ok: false, error: err.message });
    res.status(500).json({ ok: false, error: err.message, steps: err.steps || [] });
  }
};

module.exports.runFullE2ETest = runFullE2ETest;
