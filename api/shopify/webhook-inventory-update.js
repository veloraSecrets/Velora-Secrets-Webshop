// api/shopify/webhook-inventory-update.js
//
// Shopify-webhook-abonnement: inventory_levels/update.
// Signaleert wanneer de voorraad in Shopify zelf verandert (bv. door een
// verkoop) — nuttig voor het beheerpaneel om te laten zien dat voorraad ook
// buiten de eigen sync-jobs om beweegt (elke verkoop verlaagt de voorraad
// automatisch al via Shopify zelf; dit endpoint is vooral voor zichtbaarheid/
// logging, niet om zelf iets te corrigeren).

const { verifyShopifyWebhook } = require('../../lib/shopify/verify-webhook');
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

  const payload = req.body;
  await syncLog.log({
    type: 'inventory-update-webhook', ok: true,
    inventoryItemId: payload.inventory_item_id, available: payload.available
  });

  res.status(200).json({ ok: true });
};
