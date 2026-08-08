/* ============================================
   VELORA SECRETS — SHOPIFY-WINKELWAGEN
   ============================================
   Vervangt het oude, lokale (localStorage-only) winkelwagensysteem volledig.
   De browser onthoudt UITSLUITEND het Shopify cart-ID — de cart-INHOUD zelf
   (regels, aantallen, prijzen, checkout-URL) komt altijd rechtstreeks van
   Shopify via api/cart.js. Dit is bewust zo: nooit twee bronnen van waarheid
   die uit elkaar kunnen lopen.

   Werkt zowel in testmodus (TEST_MODE=true, mock-cart) als straks tegen de
   echte Shopify-winkel — de frontend-code hoeft daarvoor niet te veranderen,
   zie lib/catalog-source.js voor hetzelfde principe bij productdata. */

var VELORA_SHOPIFY_CART_ID_KEY = 'velora_shopify_cart_id';

function veloraGetCartId() {
  try {
    return localStorage.getItem(VELORA_SHOPIFY_CART_ID_KEY);
  } catch (e) {
    return null;
  }
}

function veloraSetCartId(cartId) {
  try {
    localStorage.setItem(VELORA_SHOPIFY_CART_ID_KEY, cartId);
  } catch (e) {
    // localStorage niet beschikbaar — de cart werkt dan alleen binnen de huidige paginasessie.
  }
}

function veloraClearCartId() {
  try {
    localStorage.removeItem(VELORA_SHOPIFY_CART_ID_KEY);
  } catch (e) { /* geen opslag beschikbaar */ }
}

async function veloraCartRequest(payload) {
  var res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  var data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Winkelwagen-verzoek mislukt.');
  }
  return data.cart;
}

// Voegt een variant toe aan de winkelwagen — maakt een nieuwe Shopify-cart aan
// als er nog geen cart-ID bekend is, anders wordt aan de bestaande cart toegevoegd.
async function veloraAddToShopifyCart(variantId, quantity) {
  if (!variantId) {
    // Gebeurt zolang er geen Shopify-koppeling actief is (SHOPIFY_STORE_DOMAIN
    // + SHOPIFY_STOREFRONT_TOKEN nog niet ingesteld) — zie lib/catalog-source.js.
    return { ok: false, reason: 'no-variant', message: 'Dit product kan op dit moment nog niet aan de winkelwagen worden toegevoegd.' };
  }
  quantity = parseInt(quantity, 10);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, reason: 'invalid-quantity', message: 'Ongeldig aantal.' };
  }

  var existingCartId = veloraGetCartId();
  try {
    var cart;
    if (existingCartId) {
      try {
        cart = await veloraCartRequest({ action: 'add', cartId: existingCartId, merchandiseId: variantId, quantity: quantity });
      } catch (e) {
        // Bestaande cart-ID is ongeldig geworden (bv. al afgerekend, of testrun
        // verlopen) — begin een nieuwe cart i.p.v. de gebruiker te laten vastlopen.
        cart = await veloraCartRequest({ action: 'create', merchandiseId: variantId, quantity: quantity });
      }
    } else {
      cart = await veloraCartRequest({ action: 'create', merchandiseId: variantId, quantity: quantity });
    }
    veloraSetCartId(cart.id);
    veloraUpdateCartBadgeFromCart(cart);
    return { ok: true, cart: cart };
  } catch (err) {
    return { ok: false, reason: 'request-failed', message: err.message };
  }
}

async function veloraGetShopifyCart() {
  var cartId = veloraGetCartId();
  if (!cartId) return null;
  try {
    var cart = await veloraCartRequest({ action: 'get', cartId: cartId });
    veloraUpdateCartBadgeFromCart(cart);
    return cart;
  } catch (err) {
    // Cart bestaat niet meer (verlopen/afgerekend) — lokale verwijzing opruimen.
    veloraClearCartId();
    veloraUpdateCartBadgeFromCart(null);
    return null;
  }
}

async function veloraUpdateShopifyCartLine(lineId, quantity) {
  var cartId = veloraGetCartId();
  if (!cartId) return null;
  var cart = await veloraCartRequest({ action: 'update', cartId: cartId, lineId: lineId, quantity: quantity });
  veloraUpdateCartBadgeFromCart(cart);
  return cart;
}

async function veloraRemoveShopifyCartLine(lineId) {
  var cartId = veloraGetCartId();
  if (!cartId) return null;
  var cart = await veloraCartRequest({ action: 'remove', cartId: cartId, lineId: lineId });
  veloraUpdateCartBadgeFromCart(cart);
  return cart;
}

function veloraUpdateCartBadgeFromCart(cart) {
  var badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = String(cart ? cart.totalQuantity : 0);
}

// Stuurt de gebruiker door naar Shopify's eigen, beveiligde checkout — er is
// bewust GEEN lokale checkout-pagina meer (zie PRODUCTION-READINESS.md).
function veloraGoToShopifyCheckout(cart) {
  if (cart && cart.checkoutUrl) {
    window.location.href = cart.checkoutUrl;
  }
}
