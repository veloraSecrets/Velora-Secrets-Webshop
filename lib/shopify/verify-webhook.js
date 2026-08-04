// lib/shopify/verify-webhook.js
//
// Verifieert dat een binnenkomend webhook-verzoek écht van Shopify komt, aan de
// hand van de X-Shopify-Hmac-Sha256-header. Dit is Shopify's eigen, publiek
// gedocumenteerde methode (https://shopify.dev/docs/apps/build/webhooks/subscribe/verify-webhooks) —
// zonder deze check zou IEDEREEN een nep-orderwebhook naar /api/shopify/webhook-order-create
// kunnen sturen en zo een gratis product richting een leverancier kunnen laten versturen.
//
// Vereist env var: SHOPIFY_WEBHOOK_SECRET (te vinden bij de webhook-configuratie in Shopify)

const crypto = require('crypto');

function verifyShopifyWebhook(rawBody, hmacHeader) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('SHOPIFY_WEBHOOK_SECRET niet geconfigureerd — webhook kan niet geverifieerd worden.');
  }
  if (!hmacHeader) return false;

  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  // timingSafeEqual voorkomt een timing-attack op de vergelijking zelf.
  const a = Buffer.from(computed);
  const b = Buffer.from(hmacHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = { verifyShopifyWebhook };
