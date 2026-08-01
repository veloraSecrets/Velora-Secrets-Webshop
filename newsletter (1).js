/* ============================================================
   assets/login-page.js — logica voor login.html
   ------------------------------------------------------------
   Bevat GEEN eigen authenticatielogica: roept uitsluitend
   window.veloraLogin (auth.js) aan. Vereist: auth.js, vóór dit
   bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const form = document.getElementById('loginForm');
  const errorBanner = document.getElementById('authFormError');

  const fields = {
    loginEmail: { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Vul een geldig e-mailadres in.' },
    loginPassword: { validate: (v) => v.length >= 1, message: 'Vul je wachtwoord in.' },
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
    submitBtn.textContent = 'Bezig met inloggen…';

    const result = await window.veloraLogin({
      email: document.getElementById('loginEmail').value.trim(),
      password: document.getElementById('loginPassword').value,
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Inloggen';

    if (!result.success) {
      errorBanner.textContent = result.error;
      errorBanner.hidden = false;
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const redirectTarget = new URLSearchParams(window.location.search).get('redirect') || window.VELORA_CONFIG.auth.defaultRedirect;
    window.location.href = redirectTarget;
  });
})();
