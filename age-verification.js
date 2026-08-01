/* ============================================================
   assets/addresses-page.js — logica voor addresses.html
   ------------------------------------------------------------
   Haalt echte adressen op bij /api/addresses (bestaat nog niet).
   Toont NOOIT verzonnen/voorbeeld-adressen: is het endpoint niet
   bereikbaar, dan zeg je dat expliciet i.p.v. nepdata te tonen.
   "Nieuw adres toevoegen" doet een echte POST naar hetzelfde
   endpoint zodra dat bestaat.
   Vereist: auth.js, vóór dit bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  (async () => {
    const user = await window.veloraRequireAuth();
    if (!user) return;

    document.getElementById('accountLoading').hidden = true;
    document.getElementById('accountContent').hidden = false;

    const listEl = document.getElementById('addressesList');

    async function loadAddresses() {
      try {
        const res = await fetch('/api/addresses', { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`Server gaf status ${res.status}`);
        const { addresses } = await res.json();

        if (!addresses || !addresses.length) {
          listEl.innerHTML = `<div class="account-page__empty"><p>Je hebt nog geen adressen opgeslagen.</p></div>`;
          return;
        }

        listEl.innerHTML = addresses
          .map(
            (a) => `
          <div class="address-card">
            <div class="address-card__body">
              <strong>${a.name}</strong>
              <span>${a.street}</span>
              <span>${a.postalCode} ${a.city}</span>
            </div>
            <button type="button" class="address-card__remove" data-remove-address="${a.id}">Verwijder</button>
          </div>`
          )
          .join('');

        listEl.querySelectorAll('[data-remove-address]').forEach((btn) =>
          btn.addEventListener('click', async () => {
            try {
              const res = await fetch(`/api/addresses/${btn.dataset.removeAddress}`, { method: 'DELETE', credentials: 'same-origin' });
              if (!res.ok) throw new Error(`Server gaf status ${res.status}`);
              loadAddresses();
            } catch (err) {
              console.error('Adres verwijderen mislukt:', err);
            }
          })
        );
      } catch (err) {
        console.error('Kon adressen niet laden:', err);
        listEl.innerHTML = `
          <div class="account-page__empty account-page__empty--error">
            <p>Kon je adressen niet laden. Is er nog geen backend gekoppeld aan <code>/api/addresses</code>?</p>
          </div>`;
      }
    }

    document.getElementById('addAddressBtn')?.addEventListener('click', () => {
      const name = prompt('Naam voor dit adres (bv. "Thuis"):');
      if (!name) return;
      const street = prompt('Straat en huisnummer:');
      const postalCode = prompt('Postcode:');
      const city = prompt('Plaats:');
      if (!street || !postalCode || !city) return;

      fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ name, street, postalCode, city }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Server gaf status ${res.status}`);
          loadAddresses();
        })
        .catch((err) => {
          console.error('Adres toevoegen mislukt:', err);
          alert('Kon het adres niet opslaan. Is er nog geen backend gekoppeld aan /api/addresses?');
        });
    });

    loadAddresses();
  })();
})();
