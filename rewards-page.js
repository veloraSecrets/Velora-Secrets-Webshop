/* ============================================================
   rewards-page.js — Velora Rewards-weergavepagina
   ------------------------------------------------------------
   Roept het echte /api/rewards (saldo) en /api/rewards-redeem
   (inwisselen) aan. Bij inwisselen wordt de teruggekregen code
   direct opgeslagen als toegepaste korting via de bestaande
   window.veloraApplyDynamicDiscount (discount.js) — zichtbaar
   zodra de klant naar de winkelwagen gaat, geen dubbele logica.
   ============================================================ */
(() => {
  'use strict';

  const lookupBox = document.getElementById('rewardsLookup');
  const contentBox = document.getElementById('rewardsContent');
  const errorEl = document.getElementById('rewardsError');
  const emailInput = document.getElementById('rewardsEmail');
  const fmt = window.veloraFmt;

  function renderRewards(data) {
    lookupBox.hidden = true;
    contentBox.hidden = false;
    contentBox.innerHTML = `
      <div class="rewards-balance">
        <div class="rewards-balance__points">${data.points}</div>
        <div class="rewards-balance__label">punten</div>
      </div>
      <div class="rewards-tiers">
        ${data.rewards
          .map(
            (tier) => `
          <div class="rewards-tier ${tier.available ? 'rewards-tier--available' : ''}">
            <div>
              <strong>${tier.pointsRequired} punten</strong>
              <span>${fmt(tier.discountEuros)} korting</span>
            </div>
            <button type="button" class="btn ${tier.available ? 'btn--primary' : 'btn--ghost'}" data-redeem="${tier.pointsRequired}" ${tier.available ? '' : 'disabled'}>
              ${tier.available ? 'Inwisselen' : `Nog ${tier.pointsRequired - data.points} punten nodig`}
            </button>
          </div>`
          )
          .join('')}
      </div>
      <p id="redeemMessage"></p>
    `;

    contentBox.querySelectorAll('[data-redeem]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const pointsRequired = Number(btn.dataset.redeem);
        btn.disabled = true;
        btn.textContent = 'Bezig...';
        try {
          const res = await fetch('/api/rewards-redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, pointsRequired }),
          });
          const result = await res.json();
          if (!res.ok || !result.success) throw new Error(result.error || `Server gaf status ${res.status}`);

          window.veloraApplyDynamicDiscount(result.code, 'fixed', result.discountEuros, `${fmt(result.discountEuros)} Rewards-korting toegepast`);
          document.getElementById('redeemMessage').textContent = `Gelukt! Code ${result.code} is toegepast — ga naar je winkelwagen om af te rekenen.`;
          // Verversen met het nieuwe (lagere) saldo, zonder de pagina te herladen.
          const refreshed = await fetch(`/api/rewards?email=${encodeURIComponent(data.email)}`).then((r) => r.json());
          renderRewards(refreshed);
        } catch (err) {
          console.error('Inwisselen mislukt:', err);
          document.getElementById('redeemMessage').textContent = `Inwisselen lukte niet (${err.message}).`;
          btn.disabled = false;
          btn.textContent = 'Inwisselen';
        }
      });
    });
  }

  document.getElementById('rewardsLookupBtn')?.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }
    errorEl.textContent = '';
    try {
      const res = await fetch(`/api/rewards?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server gaf status ${res.status}`);
      renderRewards(data);
    } catch (err) {
      console.error('Rewards-opzoeking mislukt:', err);
      errorEl.textContent = `Kon je punten niet ophalen (${err.message}). Is er nog geen backend gekoppeld?`;
    }
  });
})();
