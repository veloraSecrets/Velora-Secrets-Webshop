/* ============================================================
   assets/search.js — zoek-module
   ------------------------------------------------------------
   Enige bron voor het zoekpaneel. Nu nog eenvoudig (openen/sluiten
   + suggestiechips vullen het veld); een toekomstige uitbreiding
   naar live filteren op window.VELORA_PRODUCTS hoort hier thuis,
   niet in main.js of een van de *-page.js-bestanden.
   ============================================================ */
(() => {
  'use strict';

  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  searchToggle?.addEventListener('click', () => searchPanel.classList.toggle('is-open'));

  document.querySelectorAll('.search-chip').forEach((c) =>
    c.addEventListener('click', () => {
      const input = c.closest('.search-panel').querySelector('input');
      if (input) input.value = c.textContent;
    })
  );

  /* ============================================================
     Fase 3 — zoekmotor + recente zoekopdrachten
     ------------------------------------------------------------
     Publieke functies, herbruikt door search.html (search-page.js)
     én door het zoekpaneel in de header hieronder — geen enkele
     andere plek in de site mag zelf door VELORA_PRODUCTS heen
     zoeken, dat zou dezelfde matchlogica dupliceren.
     ============================================================ */

  /* Publiek: doorzoekt naam, categorie, subcategorie, merk en tags.
     Simpele case-insensitive substring-match — bewust eenvoudig
     gehouden, makkelijk later te vervangen door bv. een fuzzy-search
     zonder dat search.html of het zoekpaneel hoeven te veranderen. */
  window.veloraSearchProducts = function (query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];
    return window.VELORA_PRODUCTS.filter((p) => {
      const haystack = [
        p.title,
        p.category,
        p.vendor,
        window.VELORA_SUBCATEGORY[p.id] || '',
        ...(window.VELORA_TAGS[p.id] || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  };

  /* Dynamische populaire zoekopdrachten (echt bijgehouden via
     api/track-search.js) — op de achtergrond opgehaald zodra deze
     module laadt, zodat veloraGetPopularSearches() hieronder
     synchroon kan blijven (geen wijziging nodig aan de aanroep in
     search-page.js). Zolang dit nog niet is opgehaald — of als er
     nog geen KV gekoppeld is — blijft de bestaande, statische lijst
     gewoon werken. */
  let dynamicPopularSearches = null;
  fetch('/api/popular-searches?limit=6')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data?.terms?.length) dynamicPopularSearches = data.terms;
    })
    .catch(() => { /* geen backend gekoppeld — blijft bij de statische lijst */ });

  window.veloraGetPopularSearches = function () {
    return dynamicPopularSearches || window.VELORA_CONFIG.search.popularSearches;
  };

  function getRecentSearches() {
    try { return JSON.parse(localStorage.getItem(window.VELORA_CONFIG.search.recentSearchesStorageKey)) || []; }
    catch { return []; }
  }

  window.veloraGetRecentSearches = function () {
    return getRecentSearches();
  };

  /* Publiek: registreert een zoekopdracht (meest recent eerst, geen
     duplicaten, afgekapt op het ingestelde maximum). Lege termen
     worden genegeerd. */
  window.veloraTrackRecentSearch = function (query) {
    const q = (query || '').trim();
    if (!q) return;
    const { recentSearchesStorageKey: KEY, maxRecentSearches: MAX } = window.VELORA_CONFIG.search;
    let terms = getRecentSearches().filter((t) => t.toLowerCase() !== q.toLowerCase());
    terms.unshift(q);
    terms = terms.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(terms));
  };

  window.veloraClearRecentSearches = function () {
    localStorage.removeItem(window.VELORA_CONFIG.search.recentSearchesStorageKey);
  };

  /* ---------- Live zoeken in het zoekpaneel zelf ---------- */
  const searchInput = searchPanel?.querySelector('input');
  const liveResultsEl = document.createElement('div');
  liveResultsEl.className = 'search-live-results';
  searchPanel?.querySelector('.search-panel__inner')?.appendChild(liveResultsEl);

  function renderLiveResults(query) {
    if (!query.trim()) {
      liveResultsEl.innerHTML = '';
      return;
    }
    const results = window.veloraSearchProducts(query).slice(0, 5);
    if (!results.length) {
      liveResultsEl.innerHTML = `<p class="search-live-empty">Geen producten gevonden voor "${window.veloraEscapeHTML(query)}".</p>`;
      return;
    }
    const fmt = window.veloraFmt;
    liveResultsEl.innerHTML = results
      .map(
        (p) => `
      <a href="product.html?id=${p.id}" class="search-live-item">
        <span class="search-live-item__media"></span>
        <span class="search-live-item__title">${p.title}</span>
        <span class="price">${fmt(p.price)}</span>
      </a>`
      )
      .join('');
  }

  searchInput?.addEventListener('input', () => renderLiveResults(searchInput.value));

  /* Enter -> naar de volledige zoekresultatenpagina (het zoekveld zit
     niet in een <form>, dus we luisteren rechtstreeks naar Enter). */
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });
})();
