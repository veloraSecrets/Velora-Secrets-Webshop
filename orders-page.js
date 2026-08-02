/* ============================================================
   assets/main.js — algemene sitenavigatie
   ------------------------------------------------------------
   Na de architectuur-opsplitsing bevat dit bestand uitsluitend
   nog navigatie-UI die nergens anders specifiek thuishoort:
   megamenu, mobiel menu, productrail-scrollpijlen. Winkelwagen,
   wishlist, zoeken en AI-assistent staan in hun eigen module
   (cart.js / wishlist.js / search.js / ai.js).

   AUDIT-OPMERKING: de eerdere versie van dit bestand bevatte ook
   bindingen voor tabs/varianten/hoeveelheid/thumbnails op de
   productpagina — die deden echter nooit iets, omdat main.js
   laadt vóórdat product-page.js de content invoegt waar ze op
   moeten binden (dus 0 gevonden elementen). product-page.js bindt
   die elementen al correct zelf (na het invoegen). Dat dubbele,
   niet-functionerende stuk code is bij deze opsplitsing verwijderd.
   ============================================================ */
(() => {
  'use strict';

  /* Publiek: escaped tekst vóór interpolatie in innerHTML. Gebruik dit
     ALTIJD wanneer user-input (URL-parameters, formuliervelden,
     getypte tekst) in een innerHTML-template terechtkomt — anders is
     het een reflected-XSS-risico. Eén gedeelde functie i.p.v. 'm per
     bestand te herhalen. */
  window.veloraEscapeHTML = function (str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  };

  /* ---------- Megamenu (hover met sluitvertraging) ---------- */
  document.querySelectorAll('.nav-item').forEach((item) => {
    const btn = item.querySelector('button');
    if (!btn) return;
    let timer;
    const open = () => {
      clearTimeout(timer);
      document.querySelectorAll('.nav-item').forEach((i) => i !== item && i.classList.remove('is-open'));
      item.classList.add('is-open');
    };
    const closeNow = () => { clearTimeout(timer); item.classList.remove('is-open'); };
    const closeDelayed = () => { timer = setTimeout(closeNow, 180); };
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', closeDelayed);
    btn.addEventListener('click', () => (item.classList.contains('is-open') ? closeNow() : open()));
  });

  /* Klik buiten een open megamenu sluit het — vooral belangrijk op
     touchscreens (tablet/mobiel), waar mouseleave nooit vuurt. */
  document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-item')) return;
    document.querySelectorAll('.nav-item.is-open').forEach((i) => i.classList.remove('is-open'));
  });

  /* ---------- Mobiel menu ---------- */
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  document.getElementById('mobileToggle')?.addEventListener('click', () => {
    mobileNav.classList.add('is-open');
    mobileOverlay.classList.add('is-open');
  });
  document.getElementById('mobileClose')?.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
  });
  mobileOverlay?.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
  });

  /* Collectie-/zoekfilter-drawer (mobiel): gedeelde init-functie i.p.v.
     dat collection-page.js én search-page.js elk hun eigen kopie van
     deze open/sluit-logica hebben. Wordt aangeroepen door beide
     pagina's zodra hun filter-elementen op de pagina staan. */
  window.veloraInitFilterDrawer = function () {
    const filterDrawer = document.getElementById('collectionFilters');
    const filterOverlay = document.getElementById('filterOverlay');
    const filterCloseBtn = document.getElementById('filterClose');
    if (!filterDrawer) return;

    document.getElementById('filterToggle')?.addEventListener('click', () => {
      filterDrawer.classList.add('is-open');
      filterOverlay.style.display = 'block';
      filterCloseBtn.style.display = 'block';
    });
    function closeFilterDrawer() {
      filterDrawer.classList.remove('is-open');
      filterOverlay.style.display = 'none';
    }
    filterCloseBtn?.addEventListener('click', closeFilterDrawer);
    filterOverlay?.addEventListener('click', closeFilterDrawer);
  };

  /* ---------- Rail-scroll (bestsellers e.d.) ---------- */
  document.querySelectorAll('.rail-arrow').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rail = btn.closest('section')?.querySelector('.product-rail__scroller');
      rail?.scrollBy({ left: rail.clientWidth * 0.85 * Number(btn.dataset.scroll), behavior: 'smooth' });
    });
  });
})();
