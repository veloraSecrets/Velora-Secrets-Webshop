/* ============================================================
   assets/wishlist.js — wishlist-module
   ------------------------------------------------------------
   Enige bron voor wishlist-state. Onthoudt opgeslagen product-ID's
   in localStorage, dus blijft — net als de winkelwagen — behouden
   tussen pagina's. Knoppen hebben een product-ID nodig via
   data-wishlist="123"; zonder ID (bv. oude/losse knoppen) valt
   terug op een puur visuele toggle zonder opslag.
   Vereist: config.js (VELORA_CONFIG), vóór dit bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const { storageKey: WISHLIST_KEY } = window.VELORA_CONFIG.wishlist;

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
    catch { return []; }
  }
  function setWishlist(ids) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  }

  /* Publiek: toggelt een product-ID, geeft de nieuwe status (true = opgeslagen) terug */
  window.veloraToggleWishlist = function (id) {
    const ids = getWishlist();
    const idx = ids.indexOf(id);
    const nowSaved = idx === -1;
    if (nowSaved) ids.push(id);
    else ids.splice(idx, 1);
    setWishlist(ids);
    return nowSaved;
  };

  /* Publiek: zet de visuele status van alle wishlist-knoppen op de
     pagina gelijk aan de opgeslagen data — aanroepen na elke dynamische
     render (product-/collectiepagina, homepage-productrail). */
  window.veloraSyncWishlistUI = function () {
    const saved = getWishlist();
    document.querySelectorAll('[data-wishlist]').forEach((btn) => {
      const id = Number(btn.dataset.wishlist);
      if (id) btn.classList.toggle('is-saved', saved.includes(id));
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wishlist]');
    if (!btn) return;
    const id = Number(btn.dataset.wishlist);
    if (!id) {
      // Geen product-ID beschikbaar: puur visuele toggle, geen opslag
      btn.classList.toggle('is-saved');
      return;
    }
    const nowSaved = window.veloraToggleWishlist(id);
    btn.classList.toggle('is-saved', nowSaved);
  });

  window.veloraSyncWishlistUI();
})();
