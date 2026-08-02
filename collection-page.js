/* ============================================================
   assets/checkout-page.js — rendering + validatie voor checkout.html
   ------------------------------------------------------------
   Bevat GEEN eigen winkelwagen-, korting- of productlogica: alles
   komt uit window.velora*-functies (cart.js, discount.js) en
   VELORA_CONFIG.checkout (config.js).

   Bij een geldig formulier wordt een ECHTE Mollie-betaling
   aangevraagd via /api/create-payment.js (Vercel serverless
   function) en stuurt de browser door naar Mollie's eigen
   betaalpagina. Bevestiging van de betaling zelf loopt via
   api/webhook.js (server-naar-server, buiten de browser om) — de
   winkelwagen wordt daarom NIET client-side geleegd bij het
   versturen van het formulier, alleen bij een bevestigde terugkeer.
   Vereist: products.js, config.js, cart.js, discount.js — alle
   vóór dit bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const fmt = window.veloraFmt;
  const { shippingMethods, paymentMethods } = window.VELORA_CONFIG.checkout;

  const form = document.getElementById('checkoutForm');

  /* ---------- Terugkeer vanaf Mollie na een betaalpoging ---------- */
  const returnedOrderId = new URLSearchParams(window.location.search).get('order');
  if (returnedOrderId) {
    window.veloraClearCart?.();
    document.querySelector('.checkout').innerHTML = `
      <div class="cart-page__empty" style="grid-column:1/-1;">
        <h1 style="margin-bottom:12px;">Bedankt — we verwerken je betaling</h1>
        <p>Ordernummer <strong>${window.veloraEscapeHTML(returnedOrderId)}</strong>. Zodra Mollie de betaling bevestigt, ontvang je een orderbevestiging per e-mail vanaf noreply@velorasecrets.nl. Lukt dat niet binnen enkele minuten, neem dan contact op via <a href="contact.html">het contactformulier</a> met je ordernummer.</p>
        <a href="index.html" class="btn btn--primary">Verder winkelen</a>
      </div>`;
    return;
  }
  const shippingContainer = document.getElementById('shippingOptions');
  const paymentContainer = document.getElementById('paymentOptions');
  const summaryContainer = document.getElementById('checkoutSummary');

  let selectedShippingId = shippingMethods[0]?.id;
  let selectedPaymentId = paymentMethods[0]?.id;

  /* ---------- Lege winkelwagen: geen zin om af te rekenen ---------- */
  const cart = window.veloraGetCart();
  if (!cart.length) {
    document.querySelector('.checkout').innerHTML = `
      <div class="cart-page__empty" style="grid-column:1/-1;">
        <p>Je winkelwagen is leeg — er valt niets af te rekenen.</p>
        <a href="index.html" class="btn btn--primary">Ontdek producten</a>
      </div>`;
    return;
  }

  /* ---------- Verzend-/betaalopties renderen vanuit config.js ---------- */
  function renderOptions(container, options, selectedId, groupName, onSelect) {
    container.innerHTML = options
      .map(
        (opt) => `
      <label class="checkout__option ${opt.id === selectedId ? 'is-selected' : ''}" data-option-id="${opt.id}">
        <span class="checkout__option-left">
          <input type="radio" name="${groupName}" value="${opt.id}" class="visually-hidden" ${opt.id === selectedId ? 'checked' : ''}>
          <span class="checkout__option-radio"></span>
          <span>
            <span class="checkout__option-label">${opt.label}</span>
            ${opt.description ? `<br><span class="checkout__option-desc">${opt.description}</span>` : ''}
            ${opt.cardBrands ? `<span class="checkout__card-brands">${opt.cardBrands.map((b) => `<span class="payment-badge">${b}</span>`).join('')}</span>` : ''}
          </span>
        </span>
        ${opt.price !== undefined ? `<span class="checkout__option-price">${opt.price === 0 ? 'Gratis' : fmt(opt.price)}</span>` : ''}
      </label>`
      )
      .join('');

    container.querySelectorAll('.checkout__option').forEach((el) => {
      el.addEventListener('click', () => {
        onSelect(el.dataset.optionId);
        renderOptions(container, options, el.dataset.optionId, groupName, onSelect);
        renderSummary();
      });
    });
  }

  /* ---------- Besteloverzicht: hergebruikt cart.js + discount.js volledig ---------- */
  function renderSummary() {
    const totals = window.veloraGetCartTotals();
    const discountAmount = window.veloraCalculateDiscountAmount(totals.subtotal);
    const applied = window.veloraGetAppliedDiscount();
    const shipping = shippingMethods.find((m) => m.id === selectedShippingId);
    const shippingCost = totals.freeShippingRemaining > 0 ? shipping?.price || 0 : 0;
    const total = totals.subtotal - discountAmount + shippingCost;

    summaryContainer.innerHTML = `
      <h3>Besteloverzicht</h3>
      ${window.veloraGetCart()
        .map(
          (item) => `
        <div class="checkout__summary-item">
          <div class="checkout__summary-media"><span class="checkout__summary-qty">${item.qty}</span></div>
          <span class="checkout__summary-title">${item.title}</span>
          <span class="checkout__summary-price">${fmt(item.price * item.qty)}</span>
        </div>`
        )
        .join('')}

      <div class="cart-page__row" style="margin-top:16px;"><span>Subtotaal</span><span>${fmt(totals.subtotal)}</span></div>
      ${applied ? `<div class="cart-page__row"><span>Korting (${applied.code})</span><span>−${fmt(discountAmount)}</span></div>` : ''}
      <div class="cart-page__row"><span>Verzending</span><span>${shippingCost === 0 ? 'Gratis' : fmt(shippingCost)}</span></div>
      <div class="cart-page__row cart-page__row--total"><span>Totaal</span><span>${fmt(total)}</span></div>
    `;
  }

  renderOptions(shippingContainer, shippingMethods, selectedShippingId, 'shipping', (id) => (selectedShippingId = id));
  renderOptions(paymentContainer, paymentMethods, selectedPaymentId, 'payment', (id) => (selectedPaymentId = id));
  renderSummary();

  /* ---------- Formuliervalidatie ---------- */
  const requiredFields = {
    ckEmail: { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Vul een geldig e-mailadres in.' },
    ckFirstName: { validate: (v) => v.trim().length >= 2, message: 'Vul je voornaam in.' },
    ckLastName: { validate: (v) => v.trim().length >= 2, message: 'Vul je achternaam in.' },
    ckAddress: { validate: (v) => v.trim().length >= 5, message: 'Vul je straat en huisnummer in.' },
    ckPostal: { validate: (v) => /^[0-9]{4}\s?[a-zA-Z]{2}$/.test(v.trim()), message: 'Vul een geldige postcode in (bv. 1234 AB).' },
    ckCity: { validate: (v) => v.trim().length >= 2, message: 'Vul je woonplaats in.' },
  };

  function showError(id, message) {
    const input = document.getElementById(id);
    const errorEl = document.querySelector(`[data-error-for="${id}"]`);
    input?.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  Object.keys(requiredFields).forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => showError(id, ''));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    Object.entries(requiredFields).forEach(([id, rule]) => {
      const input = document.getElementById(id);
      const valid = rule.validate(input.value);
      showError(id, valid ? '' : rule.message);
      if (!valid) isValid = false;
    });
    if (!isValid) {
      document.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* Echte Mollie-betaling aanvragen via de serverless function in
       /api/create-payment.js. Die endpoint bestaat alleen als deze site
       op Vercel draait mét de juiste omgevingsvariabelen (zie
       .env.example) — open je alleen de statische bestanden lokaal
       (bv. rechtstreeks in de browser), dan bestaat /api niet en krijg
       je hieronder een duidelijke foutmelding i.p.v. een stille crash. */
    const submitBtn = form.querySelector('button[type="submit"]');
    const orderId = `VS-${Date.now()}`;
    const cart = window.veloraGetCart();
    const totals = window.veloraGetCartTotals();
    const appliedDiscount = window.veloraGetAppliedDiscount ? window.veloraGetAppliedDiscount() : null;
    const shipping = shippingMethods.find((m) => m.id === selectedShippingId);
    const shippingCost = totals.freeShippingRemaining > 0 ? shipping?.price || 0 : 0;
    const customerEmail = document.getElementById('ckEmail').value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met verwerken…';

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          /* Alleen product-ID + hoeveelheid — het te betalen bedrag wordt
             door de server zelf herberekend uit de echte prijzenlijst
             (api/_product-prices.json), nooit uit een kant-en-klaar
             bedrag dat de browser zou kunnen manipuleren. */
          items: cart.map((item) => ({ id: item.id, qty: item.qty })),
          discountCode: appliedDiscount?.code || null,
          shippingCost,
          description: `Bestelling ${orderId} — Velora Secrets`,
          orderId,
          customerEmail,
          paymentMethodId: selectedPaymentId,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Serverfout (${response.status})`);
      }

      const { checkoutUrl } = await response.json();
      if (!checkoutUrl) throw new Error('Geen betaal-URL ontvangen van de server.');

      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Betaling aanmaken mislukt:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Bestelling plaatsen';
      const errorBanner = document.getElementById('checkoutApiError') || document.createElement('p');
      errorBanner.id = 'checkoutApiError';
      errorBanner.className = 'checkout__api-error';
      errorBanner.textContent = `Kon de betaling niet starten (${err.message}). Draait deze site niet op Vercel met de juiste omgevingsvariabelen? Zie .env.example.`;
      form.prepend(errorBanner);
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
