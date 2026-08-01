/* ============================================================
   assets/cart.js — winkelwagen-module
   ------------------------------------------------------------
   Enige bron voor winkelwagen-logica. Andere modules/pagina's
   voegen producten toe via het publieke window.veloraAddToCart(),
   nooit door zelf aan localStorage te schrijven.
   Vereist: products.js (veloraFmt) en config.js (VELORA_CONFIG),
   beide vóór dit bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const fmt = window.veloraFmt;
  const { storageKey: CART_KEY, freeShippingThreshold: FREE_SHIPPING } = window.VELORA_CONFIG.cart;

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderCart();
  }
  window.veloraAddToCart = function (product, qty = 1) {
    const cart = getCart();
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.qty += qty;
    else cart.push({ ...product, qty });
    setCart(cart);
    openCart();
  };

  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const shippingFill = document.getElementById('cartShippingFill');
  const shippingText = document.getElementById('cartShippingText');

  function openCart() { cartDrawer?.classList.add('is-open'); cartOverlay?.classList.add('is-open'); }
  function closeCart() { cartDrawer?.classList.remove('is-open'); cartOverlay?.classList.remove('is-open'); }
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  function renderCart() {
    if (!cartItemsEl) return;
    const cart = getCart();
    if (!cart.length) {
      cartItemsEl.innerHTML = '<div class="cart-empty">Je winkelwagen is nog leeg.</div>';
    } else {
      cartItemsEl.innerHTML = cart
        .map(
          (item, i) => `
        <div class="cart-item">
          <div class="cart-item__media"></div>
          <div>
            <div class="cart-item__title">${item.title}</div>
            <div class="cart-item__price">${item.qty} × ${fmt(item.price)}</div>
          </div>
          <button class="cart-item__remove" data-remove="${i}">Verwijder</button>
        </div>`
        )
        .join('');
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);
    if (cartSubtotal) cartSubtotal.textContent = fmt(total);
    if (cartCount) { cartCount.textContent = count; cartCount.hidden = count === 0; }
    if (shippingFill) {
      const pct = Math.min(100, (total / FREE_SHIPPING) * 100);
      shippingFill.style.width = pct + '%';
    }
    if (shippingText) {
      shippingText.firstChild.textContent =
        total >= FREE_SHIPPING ? 'Je verzending is gratis! ' : `Nog ${fmt(FREE_SHIPPING - total)} tot gratis verzending `;
    }
    cartItemsEl.querySelectorAll('[data-remove]').forEach((b) =>
      b.addEventListener('click', () => {
        const cart2 = getCart();
        cart2.splice(Number(b.dataset.remove), 1);
        setCart(cart2);
      })
    );
  }
  renderCart();

  /* Delegatie: elke knop met data-add-to-cart="JSON" werkt overal,
     ook op later dynamisch ingevoegde content (product-/collectiepagina). */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    try {
      const product = JSON.parse(btn.dataset.addToCart);
      const qtyInput = document.getElementById('Quantity');
      const qty = qtyInput ? Number(qtyInput.value) : 1;
      window.veloraAddToCart(product, qty);
    } catch (err) {
      console.error('Kon product niet toevoegen:', err);
    }
  });
  /* ============================================================
     Publieke API-uitbreiding — t.b.v. cart.html
     ------------------------------------------------------------
     Uitsluitend toevoegingen: de bestaande cart-logica hierboven is
     niet aangeraakt. Deze functies hergebruiken dezelfde private
     getCart/setCart, zodat er nergens een tweede kopie van de
     winkelwagen-leeslogica ontstaat. Elke wijziging via deze API
     loopt door setCart(), dus ook de drawer (renderCart hierboven)
     blijft vanzelf gesynchroniseerd.
     ============================================================ */
  window.veloraGetCart = function () {
    return getCart();
  };

  window.veloraGetCartTotals = function () {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const itemCount = cart.reduce((s, i) => s + i.qty, 0);
    const freeShippingRemaining = Math.max(0, FREE_SHIPPING - subtotal);
    const freeShippingPct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
    return { subtotal, itemCount, freeShippingThreshold: FREE_SHIPPING, freeShippingRemaining, freeShippingPct };
  };

  window.veloraUpdateCartItemQty = function (id, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    if (qty <= 0) {
      setCart(cart.filter((i) => i.id !== id));
    } else {
      item.qty = qty;
      setCart(cart);
    }
  };

  window.veloraRemoveFromCart = function (id) {
    window.veloraUpdateCartItemQty(id, 0);
  };

  window.veloraClearCart = function () {
    setCart([]);
  };
})();
