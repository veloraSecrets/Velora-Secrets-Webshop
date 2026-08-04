// api/shopify/webhook-app-uninstalled.js
//
// Shopify-webhook-abonnement: app/uninstalled.
// Als de custom app (per ongeluk) verwijderd wordt uit de Shopify-winkel,
// stoppen alle Admin API-aanroepen te werken — zonder signaal zou dit pas
// opvallen als klanten al een tijd geen bevestigingsmails/fulfillments meer
// krijgen. Dit endpoint logt het direct zichtbaar in het beheerpaneel.

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

  await syncLog.log({
    type: 'app-uninstalled', ok: false,
    error: 'De Shopify custom app is verwijderd uit de winkel — alle Admin API-koppelingen (sync/orders/fulfillment) werken nu NIET meer totdat de app opnieuw wordt geïnstalleerd en een nieuw token wordt ingesteld.'
  });

  res.status(200).json({ ok: true });
};
