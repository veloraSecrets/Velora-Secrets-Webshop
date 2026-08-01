/* ============================================================
   assets/newsletter.js — nieuwsbrief-module
   ------------------------------------------------------------
   Enige bron voor nieuwsbrief-aanmeldingen. Koppelt ELK formulier
   met de klasse .newsletter-form (footer én de popup hieronder) aan
   het echte /api/newsletter.js-backend — geen dubbele fetch-logica
   per formulier.
   ============================================================ */
(() => {
  'use strict';

  async function submitNewsletterSignup(email, form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Bezig...';

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Server gaf status ${res.status}`);
      }

      form.innerHTML = `<p class="newsletter-form__success">Bedankt voor je aanmelding! Je 10%-kortingscode <strong>${data.code}</strong> is naar je inbox gestuurd.</p>`;
    } catch (err) {
      console.error('Nieuwsbrief-aanmelding mislukt:', err);
      button.disabled = false;
      button.textContent = originalText;
      let errorEl = form.querySelector('.newsletter-form__error');
      if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.className = 'newsletter-form__error';
        form.appendChild(errorEl);
      }
      errorEl.textContent = `Aanmelden lukte niet (${err.message}). Is er nog geen backend gekoppeld aan /api/newsletter?`;
    }
  }

  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.checkValidity()) {
        emailInput?.reportValidity();
        return;
      }
      submitNewsletterSignup(emailInput.value.trim(), form);
    });
  });

  /* ---------- Nieuwsbrief-popup voor nieuwe bezoekers ----------
     Verschijnt pas NADAT de leeftijdsgate is bevestigd (nooit
     gelijktijdig) — hetzij bij exit-intent (muis richting de
     browserbalk), hetzij na een paar seconden als fallback voor
     mobiel (waar exit-intent niet bestaat). Eenmalig per sessie,
     permanent te sluiten via het kruisje. */
  const popup = document.getElementById('newsletterPopup');
  if (popup) {
    const POPUP_SHOWN_KEY = 'velora_newsletter_popup_shown';
    const AGE_VERIFIED_KEY = 'velora_age_verified';

    function popupAlreadyHandled() {
      try {
        return !!(sessionStorage.getItem(POPUP_SHOWN_KEY) || localStorage.getItem('velora_newsletter_dismissed'));
      } catch (e) {
        return false; // storage niet beschikbaar — dan liever wél tonen dan de kans mislopen
      }
    }

    function showPopupOnce() {
      if (popupAlreadyHandled() || !popup.hidden) return;
      popup.hidden = false;
      try { sessionStorage.setItem(POPUP_SHOWN_KEY, '1'); } catch (e) { /* negeren */ }
    }

    function schedulePopup() {
      if (popupAlreadyHandled()) return;

      // Exit-intent: muis beweegt richting de browserbalk (verlaat de pagina bovenaan).
      const onMouseLeave = (e) => {
        if (e.clientY <= 0) {
          showPopupOnce();
          document.removeEventListener('mouseout', onMouseLeave);
        }
      };
      document.addEventListener('mouseout', onMouseLeave);

      // Fallback voor mobiel/touch (geen exit-intent mogelijk): na 8 seconden.
      setTimeout(showPopupOnce, 8000);
    }

    let ageVerified = false;
    try { ageVerified = localStorage.getItem(AGE_VERIFIED_KEY) === '1'; } catch (e) { /* blijft false */ }

    if (ageVerified) {
      schedulePopup();
    } else {
      // Nog niet bevestigd: wachten op het signaal van age-verification.js
      // in plaats van de popup gelijktijdig met de leeftijdsgate te tonen.
      document.addEventListener('velora:age-verified', schedulePopup, { once: true });
    }

    document.getElementById('newsletterPopupClose')?.addEventListener('click', () => {
      popup.hidden = true;
      try { localStorage.setItem('velora_newsletter_dismissed', '1'); } catch (e) { /* negeren */ }
    });
    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.hidden = true;
    });
  }
})();
