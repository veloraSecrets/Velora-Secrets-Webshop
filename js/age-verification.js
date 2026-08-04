/* ============================================
   VELORA SECRETS — LEEFTIJDSVERIFICATIE
   ============================================
   Moet als EERSTE script na <body> laden (niet in <head> — crasht op
   document.body, die bestaat daar nog niet). Toont een blokkerende
   overlay tot de bezoeker bevestigt 18+ te zijn. Onthoudt de keuze
   in localStorage zodat dit niet elke pagina opnieuw hoeft. */

(function () {
  'use strict';

  var STORAGE_KEY = 'velora_age_verified';
  var usingSessionFallback = false;

  try {
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
  } catch (e) {
    // localStorage niet beschikbaar (bv. privénavigatie) — val terug op sessionStorage
    // zodat de keuze in ieder geval blijft staan bij verdere navigatie binnen dezelfde tab/sessie.
    usingSessionFallback = true;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'true') return;
    } catch (e2) {
      // Ook sessionStorage niet beschikbaar — de gate wordt dan gewoon elke pagina getoond.
    }
  }

  var overlay = document.createElement('div');
  overlay.id = 'ageGateOverlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'ageGateTitle');
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:9999;background:#2B2A28;color:#FBF8F4;' +
    'display:flex;align-items:center;justify-content:center;padding:24px;' +
    'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center;';

  overlay.innerHTML =
    '<div style="max-width:420px;">' +
      '<div style="width:48px;height:48px;border:1px solid #E2A385;border-radius:4px;' +
        'display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-family:Georgia,serif;">VS</div>' +
      '<h1 id="ageGateTitle" style="font-family:Georgia,\'Times New Roman\',serif;font-size:26px;margin:0 0 14px;">' +
        'Ben je 18 jaar of ouder?</h1>' +
      '<p style="color:#CFC8C0;font-size:14.5px;line-height:1.6;margin:0 0 32px;">' +
        'Deze website bevat producten en content die uitsluitend bedoeld zijn voor volwassenen. ' +
        'Bevestig dat je 18 jaar of ouder bent om verder te gaan.</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
        '<button id="ageGateConfirm" style="padding:14px 28px;border-radius:999px;border:none;' +
          'background:#E8641F;color:#fff;font-size:13px;font-weight:700;letter-spacing:.04em;' +
          'text-transform:uppercase;cursor:pointer;">Ja, ik ben 18+</button>' +
        '<button id="ageGateDecline" style="padding:14px 28px;border-radius:999px;' +
          'border:1px solid #55504B;background:transparent;color:#FBF8F4;font-size:13px;font-weight:700;' +
          'letter-spacing:.04em;text-transform:uppercase;cursor:pointer;">Nee, verlaat de site</button>' +
      '</div>' +
    '</div>';

  function mount() {
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var confirmBtn = document.getElementById('ageGateConfirm');
    var declineBtn = document.getElementById('ageGateDecline');
    confirmBtn.focus();

    confirmBtn.addEventListener('click', function () {
      try {
        if (usingSessionFallback) {
          sessionStorage.setItem(STORAGE_KEY, 'true');
        } else {
          localStorage.setItem(STORAGE_KEY, 'true');
        }
      } catch (e) { /* geen enkele opslag beschikbaar — gate komt dan elke pagina terug */ }
      document.body.style.overflow = '';
      overlay.remove();
    });

    declineBtn.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });

    // Focus-trap: Tab/Shift+Tab cirkelt tussen de 2 knoppen, niets erachter is bereikbaar
    // (les uit eerdere QA-ronde: zonder trap kon een toetsenbordgebruiker de gate omzeilen).
    overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      if (document.activeElement === confirmBtn) {
        declineBtn.focus();
      } else {
        confirmBtn.focus();
      }
    });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
