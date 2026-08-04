// api/cart.js
//
// Enige cart-endpoint dat de frontend aanroept. Houdt het Storefront-token
// server-side (bewust conservatiever dan strikt noodzakelijk — Shopify's
// eigen ontwerp staat een client-side token toe, maar dit endpoint past bij
// de rest van de architectuur waar alle Shopify-aanroepen via api/-routes
// lopen, en voorkomt dat elke statische pagina de tokenconfiguratie moet kennen).
//
// De browser bewaart uitsluitend het Shopify cart-ID (in localStorage, zie
// js/shopify-cart.js) — de cart-INHOUD zelf is altijd Shopify's eigen
// bron-van-waarheid, nooit lokaal gedupliceerd. Dit endpoint is een dunne
// doorgeefluik naar lib/shopify/storefront-client.js.

const storefront = require('../lib/shopify/storefront-client');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { action, cartId, merchandiseId, quantity, lineId } = req.body || {};

  try {
    let cart;
    switch (action) {
      case 'create':
        if (!merchandiseId || !Number.isInteger(quantity) || quantity <= 0) {
          res.status(400).json({ error: 'merchandiseId en een geldige quantity zijn verplicht.' });
          return;
        }
        cart = await storefront.createCart([{ merchandiseId, quantity }]);
        break;

      case 'add':
        if (!cartId || !merchandiseId || !Number.isInteger(quantity) || quantity <= 0) {
          res.status(400).json({ error: 'cartId, merchandiseId en een geldige quantity zijn verplicht.' });
          return;
        }
        cart = await storefront.addCartLines(cartId, [{ merchandiseId, quantity }]);
        break;

      case 'update':
        if (!cartId || !lineId || !Number.isInteger(quantity) || quantity < 0) {
          res.status(400).json({ error: 'cartId, lineId en een geldige quantity zijn verplicht.' });
          return;
        }
        if (quantity === 0) {
          cart = await storefront.removeCartLine(cartId, lineId);
        } else {
          cart = await storefront.updateCartLine(cartId, lineId, quantity);
        }
        break;

      case 'remove':
        if (!cartId || !lineId) {
          res.status(400).json({ error: 'cartId en lineId zijn verplicht.' });
          return;
        }
        cart = await storefront.removeCartLine(cartId, lineId);
        break;

      case 'get':
        if (!cartId) {
          res.status(400).json({ error: 'cartId is verplicht.' });
          return;
        }
        cart = await storefront.getCart(cartId);
        if (!cart) {
          res.status(404).json({ error: 'Winkelwagen niet gevonden (mogelijk verlopen of al afgerekend).' });
          return;
        }
        break;

      default:
        res.status(400).json({ error: 'Onbekende actie. Gebruik "create", "add", "update", "remove" of "get".' });
        return;
    }

    res.status(200).json({ ok: true, cart });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
