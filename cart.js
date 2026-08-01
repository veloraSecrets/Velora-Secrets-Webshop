/* ============================================================
   assets/brands-page.js — logica voor brands.html
   ------------------------------------------------------------
   Leest uitsluitend window.VELORA_BRANDS + window.VELORA_PRODUCTS
   (products.js) — geen eigen merkdata. Het aantal producten per
   merk wordt live geteld, nooit hardcoded.
   ============================================================ */
(() => {
  'use strict';

  const gridEl = document.getElementById('brandsGrid');
  const searchInput = document.getElementById('brandSearch');

  function productCountFor(brandName) {
    return window.VELORA_PRODUCTS.filter((p) => p.vendor === brandName).length;
  }

  function render(filterText) {
    const q = (filterText || '').trim().toLowerCase();
    const brands = window.VELORA_BRANDS.filter((b) => !q || b.name.toLowerCase().includes(q));

    if (!brands.length) {
      gridEl.innerHTML = `<p class="brands-empty">Geen merken gevonden voor "${filterText}".</p>`;
      return;
    }

    gridEl.innerHTML = brands
      .map(
        (b) => `
      <a href="collection.html?brand=${encodeURIComponent(b.name)}" class="brand-card">
        <div class="brand-card__mark">${b.name.charAt(0)}</div>
        <div class="brand-card__name">${b.name}</div>
        <div class="brand-card__desc">${b.description}</div>
        <div class="brand-card__count">${productCountFor(b.name)} producten</div>
      </a>`
      )
      .join('');
  }

  searchInput.addEventListener('input', () => render(searchInput.value));
  render('');
})();
