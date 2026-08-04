// api/sync/products.js
//
// Wordt periodiek aangeroepen door Vercel Cron (zie vercel.json) — "meerdere
// keren per dag" zoals gevraagd. Loopt over ALLE geregistreerde leveranciers
// (registry.js), haalt hun catalogus op, en zet elk product in Shopify via
// de Admin API (upsertProduct = aanmaken of bijwerken).
//
// Kan ook handmatig getriggerd worden vanuit het beheerpaneel
// (api/admin/trigger-sync.js roept dezelfde functie aan).

const { getSuppliers } = require('../../lib/suppliers/registry');
const { upsertProduct } = require('../../lib/shopify/admin-client');
const syncLog = require('../../lib/db/sync-logs');
const { verifyCronRequest } = require('../../lib/verify-cron-request');

async function runProductSync() {
  const suppliers = getSuppliers();
  const results = [];

  for (const supplier of suppliers) {
    try {
      const products = await supplier.fetchCatalog();
      let created = 0;
      for (const p of products) {
        // TODO: mapping van leverancier-veldnamen naar Shopify's ProductSetInput-schema
        // zodra het echte catalogusformaat van de leverancier bekend is.
        await upsertProduct({
          title: p.title,
          descriptionHtml: p.description,
          vendor: p.brand,
          productType: p.category,
          // externalId hier zou de leverancier-SKU moeten zijn, zodat upsertProduct
          // hetzelfde product herkent bij een volgende sync i.p.v. duplicaten te maken.
        });
        created++;
      }
      results.push({ supplier: supplier.name, ok: true, count: created });
      await syncLog.log({ type: 'product-sync', supplier: supplier.name, ok: true, count: created });
    } catch (err) {
      results.push({ supplier: supplier.name, ok: false, error: err.message });
      await syncLog.log({ type: 'product-sync', supplier: supplier.name, ok: false, error: err.message });
    }
  }

  return results;
}

module.exports = async function handler(req, res) {
  // Vercel Cron roept dit aan als GET; handmatige trigger vanuit het
  // beheerpaneel mag ook POST gebruiken.
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
    const results = await runProductSync();
    res.status(200).json({ ok: true, results });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

module.exports.runProductSync = runProductSync;
