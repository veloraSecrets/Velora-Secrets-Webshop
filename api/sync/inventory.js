// api/sync/inventory.js
//
// Lichte, snelle sync die ALLEEN voorraadniveaus bijwerkt — bedoeld om vaker
// te draaien dan de volledige productsync (bv. elk uur i.p.v. 2x per dag).
// Vereist SHOPIFY_LOCATION_ID (de Shopify-locatie waar de voorraad tegen
// wordt geboekt — te vinden in Shopify → Instellingen → Locaties).

const { getSuppliers } = require('../../lib/suppliers/registry');
const { setInventory } = require('../../lib/shopify/admin-client');
const syncLog = require('../../lib/db/sync-logs');
const { verifyCronRequest } = require('../../lib/verify-cron-request');

async function runInventorySync() {
  const locationId = process.env.SHOPIFY_LOCATION_ID;
  if (!locationId) {
    throw new Error('SHOPIFY_LOCATION_ID niet geconfigureerd.');
  }

  const suppliers = getSuppliers();
  const results = [];

  for (const supplier of suppliers) {
    try {
      // TODO: skus moet de lijst zijn van reeds-in-Shopify-bekende SKU's voor
      // deze leverancier (bv. uit een eigen mapping-tabel), niet leeg.
      const stockMap = await supplier.fetchStockLevels([]);
      let updated = 0;
      for (const [sku, quantity] of stockMap.entries ? stockMap.entries() : Object.entries(stockMap)) {
        // TODO: sku -> Shopify inventoryItemId-mapping nodig (op te slaan bij het
        // aanmaken van het product in api/sync/products.js).
        // await setInventory(locationId, inventoryItemId, quantity);
        updated++;
      }
      results.push({ supplier: supplier.name, ok: true, count: updated });
      await syncLog.log({ type: 'inventory-sync', supplier: supplier.name, ok: true, count: updated });
    } catch (err) {
      results.push({ supplier: supplier.name, ok: false, error: err.message });
      await syncLog.log({ type: 'inventory-sync', supplier: supplier.name, ok: false, error: err.message });
    }
  }

  syncLog.updateStatus({ lastInventorySync: new Date().toISOString() });
  return results;
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
    const results = await runInventorySync();
    res.status(200).json({ ok: true, results });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

module.exports.runInventorySync = runInventorySync;
