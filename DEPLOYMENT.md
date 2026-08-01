/* ============================================================
   assets/contact-page.js — logica voor contact.html
   ------------------------------------------------------------
   Bevat GEEN eigen mail-/spamlogica: dat zit allemaal server-side
   in api/contact.js. Deze module doet uitsluitend cliëntzijdige
   validatie (snelle feedback vóór het versturen) en roept daarna
   het echte endpoint aan.
   ============================================================ */
(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  // Tijdstempel voor de server-side timing-check tegen bots — gezet
  // zodra de pagina (en dus dit script) laadt.
  const loadedAtInput = document.getElementById('contactFormLoadedAt');
  if (loadedAtInput) loadedAtInput.value = String(Date.now());

  const fields = {
    contactName: { validate: (v) => v.trim().length >= 2, message: 'Vul je naam in (minimaal 2 tekens).' },
    contactEmail: { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Vul een geldig e-mailadres in.' },
    contactMessage: { validate: (v) => v.trim().length >= 10, message: 'Je bericht mag iets uitgebreider (minimaal 10 tekens).' },
  };

  function showError(id, message) {
    const input = document.getElementById(id);
    const errorEl = document.querySelector(`[data-error-for="${id}"]`);
    input?.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  const errorBanner = document.getElementById('contactFormError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorBanner) errorBanner.hidden = true;

    let isValid = true;
    Object.entries(fields).forEach(([id, rule]) => {
      const input = document.getElementById(id);
      const valid = rule.validate(input.value);
      showError(id, valid ? '' : rule.message);
      if (!valid) isValid = false;
    });
    if (!isValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met versturen…';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('contactName').value,
          email: document.getElementById('contactEmail').value,
          topic: document.getElementById('contactTopic').value,
          message: document.getElementById('contactMessage').value,
          website: document.getElementById('contactWebsite')?.value || '',
          formLoadedAt: loadedAtInput?.value,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Serverside veldfouten (zeldzaam, want al client-side gecheckt) tonen
        // we per veld; alle andere fouten als banner boven het formulier.
        if (data.fieldErrors) {
          Object.entries(data.fieldErrors).forEach(([field, msg]) => {
            const idMap = { name: 'contactName', email: 'contactEmail', message: 'contactMessage' };
            if (idMap[field]) showError(idMap[field], msg);
          });
        }
        throw new Error(data.error || `Er ging iets mis (status ${response.status}).`);
      }

      document.getElementById('contactSuccess').hidden = false;
      document.querySelector('.contact-page__fields').hidden = true;
      form.reset();
    } catch (err) {
      console.error('Contactformulier versturen mislukt:', err);
      if (errorBanner) {
        errorBanner.textContent = err.message;
        errorBanner.hidden = false;
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Bericht versturen';
    }
  });

  // Foutmelding meteen wegnemen zodra iemand opnieuw begint te typen
  Object.keys(fields).forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => showError(id, ''));
  });
})();
