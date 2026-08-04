// api/shopify/webhook-products-update.js
//
// Shopify-webhook-abonnement: products/update.
// In een leverancier-gestuurde catalogus is het belangrijk om te WETEN als
// een product handmatig in Shopify is aangepast (bv. een medewerker past per
// ongeluk een prijs aan die de volgende sync toch weer overschrijft) — dit
// endpoint logt dat zichtbaar in het beheerpaneel, zodat zulke conflicten niet
// stilzwijgend verdwijnen.

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

  const product = req.body;
  await syncLog.log({
    type: 'product-update-webhook', ok: true,
    productId: product.id, title: product.title,
    note: 'Product gewijzigd in Shopify (handmatig of door sync) — controleer bij twijfel of dit een handmatige wijziging was die de volgende leverancier-sync ongewenst zal overschrijven.'
  });

  res.status(200).json({ ok: true });
};
