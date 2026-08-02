/* ============================================================
   assets/search-page.js — rendering voor search.html
   ------------------------------------------------------------
   Bevat GEEN eigen zoeklogica: window.veloraSearchProducts (search.js)
   doet het daadwerkelijke matchen. Deze module filtert/sorteert de
   resultaten daarvan en zet ze op het scherm — hetzelfde patroon als
   collection-page.js voor de collectiepagina.
   Vereist: products.js, config.js, search.js — alle vóór dit bestand
   geladen (zie de scripttags in search.html).
   ============================================================ */
(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';

  const titleEl = document.getElementById('searchTitle');
  const descEl = document.getElementById('searchDesc');
  const toolbar = document.getElementById('searchToolbar');
  const body = document.getElementById('searchBody');
  const emptyStateEl = document.getElementById('searchEmptyState');
  const landingEl = document.getElementById('searchLanding');
  const grid = document.getElementById('collectionGrid');
  const countEl = document.getElementById('collectionCount');
  const categoryFiltersEl = document.getElementById('categoryFilters');
  const brandFiltersEl = document.getElementById('brandFilters');
  const sortSelect = document.getElementById('sortSelect');

  /* ---------- Geen zoekopdracht: populaire/recente zoekopdrachten tonen ---------- */
  function renderLanding() {
    titleEl.textContent = 'Waar ben je naar op zoek?';
    descEl.textContent = 'Typ een zoekterm hierboven, of kies een van de suggesties.';
    landingEl.hidden = false;

    const recent = window.veloraGetRecentSearches();
    const popular = window.veloraGetPopularSearches();

    landingEl.innerHTML = `
      ${
        recent.length
          ? `<div class="search-landing__group">
              <div class="search-landing__header">
                <h2>Recent gezocht</h2>
                <button type="button" id="clearRecentSearches">Wissen</button>
              </div>
              <div class="search-landing__chips">
                ${recent.map((t) => `<a class="search-chip" href="search.html?q=${encodeURIComponent(t)}">${t}</a>`).join('')}
              </div>
            </div>`
          : ''
      }
      <div class="search-landing__group">
        <h2>Populaire zoekopdrachten</h2>
        <div class="search-landing__popular-grid">
          ${popular
            .map(
              (t) => `
              <a href="search.html?q=${encodeURIComponent(t)}" class="search-popular-tile">
                <span class="search-popular-tile__media"></span>
                <span class="search-popular-tile__label">${t}</span>
              </a>`
            )
            .join('')}
        </div>
      </div>
    `;

    document.getElementById('clearRecentSearches')?.addEventListener('click', () => {
      window.veloraClearRecentSearches();
      renderLanding();
    });
  }

  /* ---------- Geen resultaten: alternatieve aanbevelingen tonen ---------- */
  /* Beveiliging: escaped user input vóór het in innerHTML terechtkomt
     (window.veloraEscapeHTML, gedeeld via main.js) — 'query' komt
     rechtstreeks uit de URL (?q=...) en is dus NOOIT vertrouwd. */
  function renderNoResults() {
    body.hidden = true;
    toolbar.hidden = true;
    emptyStateEl.hidden = false;

    const suggestions = window.VELORA_PRODUCTS.filter((p) => p.badge === 'Bestseller').slice(0, 4);
    emptyStateEl.innerHTML = `
      <div class="search-empty">
        <h2>Geen resultaten voor "${window.veloraEscapeHTML(query)}"</h2>
        <p>Controleer de spelling, gebruik een korter zoekwoord, of bekijk onderstaande suggesties.</p>
      </div>
      <div class="section__header section__header--left"><div><h2>Misschien vind je dit interessant</h2></div></div>
      <div class="product-rail__scroller">
        ${suggestions.map((p) => window.veloraProductCardHTML(p, { showQuickAdd: false })).join('')}
      </div>
    `;
  }

  /* ---------- Wel resultaten: filters/sort/grid ---------- */
  function getActiveFilters() {
    const categories = [...document.querySelectorAll('[data-category-filter]:checked')].map((c) => c.dataset.categoryFilter);
    const brands = [...document.querySelectorAll('[data-brand-filter]:checked')].map((c) => c.dataset.brandFilter);
    const priceRanges = [...document.querySelectorAll('[data-price-filter]:checked')].map((c) => c.dataset.priceFilter.split('-').map(Number));
    const onlyInStock = document.querySelector('[data-availability-filter="in-stock"]')?.checked;
    return { categories, brands, priceRanges, onlyInStock };
  }

  function applyFiltersAndSort(baseResults) {
    const { categories, brands, priceRanges, onlyInStock } = getActiveFilters();

    let results = baseResults.filter((p) => {
      const matchesCategory = categories.length === 0 || categories.includes(p.category);
      const matchesBrand = brands.length === 0 || brands.includes(p.vendor);
      const matchesPrice = priceRanges.length === 0 || priceRanges.some(([min, max]) => p.price >= min && p.price <= max);
      const matchesAvailability = !onlyInStock || window.VELORA_AVAILABILITY[p.id] !== false;
      return matchesCategory && matchesBrand && matchesPrice && matchesAvailability;
    });

    switch (sortSelect.value) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      // 'relevance': volgorde van veloraSearchProducts blijft behouden
    }
    return results;
  }

  function renderGrid(products) {
    countEl.textContent = `${products.length} product${products.length === 1 ? '' : 'en'}`;
    grid.innerHTML = products.map((p) => window.veloraProductCardHTML(p, { wrapInRailItem: false })).join('');
    window.veloraSyncWishlistUI?.();
  }

  /* ---------- Init ---------- */
  if (!query.trim()) {
    renderLanding();
  } else {
    const baseResults = window.veloraSearchProducts(query);
    window.veloraTrackRecentSearch(query);
    // Fire-and-forget: telt mee voor "Populaire zoekopdrachten" (zie
    // api/track-search.js). Bewust geen await/foutafhandeling die de
    // rest van de zoekpagina zou kunnen blokkeren.
    fetch('/api/track-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: query }),
    }).catch(() => { /* geen backend gekoppeld — negeren */ });

    if (!baseResults.length) {
      titleEl.textContent = `Zoekresultaten voor "${query}"`;
      descEl.textContent = '';
      renderNoResults();
    } else {
      titleEl.textContent = `Zoekresultaten voor "${query}"`;
      descEl.textContent = `We vonden ${baseResults.length} product${baseResults.length === 1 ? '' : 'en'}.`;
      toolbar.hidden = false;
      body.hidden = false;

      const categories = [...new Set(baseResults.map((p) => p.category))];
      categoryFiltersEl.innerHTML = categories
        .map((cat) => `<label class="filter-option"><input type="checkbox" data-category-filter="${cat}"> ${cat}</label>`)
        .join('');
      const brands = [...new Set(baseResults.map((p) => p.vendor))];
      brandFiltersEl.innerHTML = brands
        .map((b) => `<label class="filter-option"><input type="checkbox" data-brand-filter="${b}"> ${b}</label>`)
        .join('');

      function rerender() {
        renderGrid(applyFiltersAndSort(baseResults));
      }
      document.querySelectorAll('[data-category-filter], [data-brand-filter], [data-price-filter], [data-availability-filter]').forEach((el) =>
        el.addEventListener('change', rerender)
      );
      sortSelect.addEventListener('change', rerender);

      rerender();

      /* Mobiele filterdrawer — gedeelde functie uit main.js, exact
         dezelfde als op de collectiepagina, geen eigen kopie hier. */
      window.veloraInitFilterDrawer();
    }
  }
})();
