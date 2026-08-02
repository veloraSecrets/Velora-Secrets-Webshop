/* ============================================================
   assets/register-page.js — logica voor register.html
   ------------------------------------------------------------
   Bevat GEEN eigen authenticatielogica: roept uitsluitend
   window.veloraRegister (auth.js) aan. Vereist: auth.js, vóór dit
   bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const form = document.getElementById('registerForm');
  const errorBanner = document.getElementById('authFormError');

  const fields = {
    registerName: { validate: (v) => v.trim().length >= 2, message: 'Vul je naam in (minimaal 2 tekens).' },
    registerEmail: { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Vul een geldig e-mailadres in.' },
    registerPassword: { validate: (v) => v.length >= 8, message: 'Je wachtwoord moet minimaal 8 tekens bevatten.' },
  };

  function showError(id, message) {
    const input = document.getElementById(id);
    const errorEl = document.querySelector(`[data-error-for="${id}"]`);
    input?.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  Object.keys(fields).forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => showError(id, ''));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBanner.hidden = true;

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
    submitBtn.textContent = 'Bezig met aanmaken…';

    const result = await window.veloraRegister({
      name: document.getElementById('registerName').value.trim(),
      email: document.getElementById('registerEmail').value.trim(),
      password: document.getElementById('registerPassword').value,
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Account aanmaken';

    if (!result.success) {
      errorBanner.textContent = result.error;
      errorBanner.hidden = false;
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    window.location.href = window.VELORA_CONFIG.auth.defaultRedirect;
  });
})();
