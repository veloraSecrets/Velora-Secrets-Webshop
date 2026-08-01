/* ============================================================
   age-verification.js — 18+ leeftijdsverificatie-gate
   ------------------------------------------------------------
   Blokkeert de VOLLEDIGE site (scroll uitgeschakeld, overlay dekt
   alles) totdat de bezoeker bevestigt 18+ te zijn. Moet als EERSTE
   script in de <head> laden (vóór alle overige content-scripts),
   zodat de gate er al staat vóórdat de rest van de pagina zichtbaar
   wordt — geen flits van onbedekte inhoud.

   Persistent via localStorage: eenmaal bevestigd, nooit meer vragen
   op een volgend bezoek. Werkt op elke pagina (niet alleen de
   homepage), want een bezoeker kan overal binnenkomen.
   ============================================================ */
(() => {
  'use strict';

  const STORAGE_KEY = 'velora_age_verified';

  let alreadyVerified = false;
  try {
    alreadyVerified = localStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {
    // localStorage niet beschikbaar — dan altijd vragen (veiligste keuze,
    // nooit de gate overslaan bij twijfel).
  }

  if (alreadyVerified) return; // niets tonen, niets blokkeren

  // Scroll van de onderliggende pagina blokkeren zolang de gate open staat.
  // Bewust op zowel <html> als <body> — op alleen <html> zetten voorkomt
  // scrollen op iOS Safari niet altijd volledig (bekend Safari-quirk).
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  function buildGate() {
    const overlay = document.createElement('div');
    overlay.id = 'ageGateOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Leeftijdsverificatie');
    overlay.innerHTML = `
      <div class="age-gate__card">
        <div class="age-gate__badge">18+</div>
        <h1 class="age-gate__title">Ben je 18 jaar of ouder?</h1>
        <p class="age-gate__text">Velora Secrets verkoopt producten die uitsluitend bedoeld zijn voor volwassenen. Bevestig je leeftijd om verder te gaan.</p>
        <div class="age-gate__actions">
          <button type="button" class="btn btn--primary" id="ageGateConfirm">Ja, ik ben 18 jaar of ouder</button>
          <button type="button" class="btn btn--ghost" id="ageGateDeny">Nee, ik ben jonger dan 18</button>
        </div>
        <p class="age-gate__footnote">Door verder te gaan ga je akkoord met ons <a href="age-policy.html">18+ leeftijdsbeleid</a>.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('ageGateConfirm').addEventListener('click', () => {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* negeren, sessie werkt dan zonder onthouden */ }
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      overlay.remove();
    });

    document.getElementById('ageGateDeny').addEventListener('click', () => {
      window.location.href = 'https://www.rijksoverheid.nl/';
    });
  }

  buildGate();
})();
