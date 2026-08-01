/* ============================================================
   assets/recently-viewed.js — "recent bekeken"-module
   ------------------------------------------------------------
   Enige bron voor recent-bekeken-state. Onthoudt de laatst bekeken
   product-ID's in localStorage (meest recent eerst, geen
   duplicaten), dus blijft behouden tussen pagina's — net als
   winkelwagen en wishlist.
   Vereist: config.js (VELORA_CONFIG), vóór dit bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const { storageKey: KEY, maxItems: MAX_ITEMS } = window.VELORA_CONFIG.recentlyViewed;

  function getIds() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  /* Publiek: markeer een product als bekeken. Zet het vooraan, haalt
     eerdere duplicaten weg, knipt af op het ingestelde maximum. */
  window.veloraTrackRecentlyViewed = function (productId) {
    let ids = getIds().filter((id) => id !== productId);
    ids.unshift(productId);
    ids = ids.slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(ids));
  };

  /* Publiek: geeft de daadwerkelijke productobjecten terug (uit
     products.js), in bekeken-volgorde, met optionele uitsluiting
     (bv. het product dat nu net bekeken wordt) en limiet. */
  window.veloraGetRecentlyViewed = function ({ excludeId, limit = MAX_ITEMS } = {}) {
    const ids = getIds().filter((id) => id !== excludeId);
    return ids
      .map((id) => window.VELORA_PRODUCTS.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, limit);
  };
})();
