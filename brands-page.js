/* ============================================================
   assets/auth.js — authenticatie-module
   ------------------------------------------------------------
   Enige bron voor login/registratie/sessie-status. Bevat GEEN
   mock-gebruikers of nepdata: elke functie hieronder roept een
   echt /api/auth/*-endpoint aan, precies zoals checkout-page.js
   /api/create-payment aanroept. Die endpoints bestaan nog niet
   (net als /api/create-payment vóórdat Mollie gekoppeld was) —
   zodra je een echte auth-oplossing bouwt/koppelt (eigen backend,
   Auth0, Supabase, Clerk, etc.), hoeft alleen de serverkant van
   /api/auth/login, /api/auth/register, /api/auth/logout en
   /api/auth/me gebouwd te worden. Deze module en alle *-page.js-
   bestanden die 'm gebruiken hoeven dan niet te veranderen.

   Sessies lopen via een httpOnly-cookie die de (toekomstige)
   server zet — er wordt bewust NIETS van gebruikersdata in
   localStorage bewaard, dat hoort bij een echte sessie niet
   client-side opgeslagen te worden.
   ============================================================ */
(() => {
  'use strict';

  async function postJSON(url, body) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data.error || `De server gaf een foutmelding (status ${res.status}).` };
      }
      return { success: true, ...data };
    } catch (err) {
      console.error(`Aanroep naar ${url} mislukt:`, err);
      return {
        success: false,
        error: 'Kon geen verbinding maken met de authenticatie-server. Is er nog geen backend gekoppeld aan /api/auth/*?',
      };
    }
  }

  /* Publiek: huidige ingelogde gebruiker ophalen, of null als er geen
     (geldige) sessie is. Faalt de aanroep zelf (bv. omdat het endpoint
     nog niet bestaat), dan behandelen we dat hetzelfde als "niet
     ingelogd" — nooit een verzonnen gebruiker teruggeven. */
  window.veloraGetCurrentUser = async function () {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch (err) {
      return null;
    }
  };

  window.veloraLogin = function ({ email, password }) {
    return postJSON('/api/auth/login', { email, password });
  };

  window.veloraRegister = function ({ name, email, password }) {
    return postJSON('/api/auth/register', { name, email, password });
  };

  window.veloraLogout = async function () {
    return postJSON('/api/auth/logout', {});
  };

  /* Publiek: te gebruiken bovenaan elke account-pagina (account.html,
     orders.html, addresses.html, profile.html). Stuurt door naar
     login.html met een terug-link als er geen sessie is; geeft anders
     de ingelogde gebruiker terug. */
  window.veloraRequireAuth = async function () {
    const user = await window.veloraGetCurrentUser();
    if (!user) {
      const redirectTo = window.location.pathname.split('/').pop();
      window.location.href = `login.html?redirect=${encodeURIComponent(redirectTo)}`;
      return null;
    }
    return user;
  };

  /* Header-accountlink op elke pagina bijwerken op basis van de echte
     sessiestatus — wijst naar login.html (uitgelogd, standaard in de
     statische HTML) of account.html (ingelogd). Zolang er nog geen
     echte /api/auth/me-backend bestaat, blijft dit altijd op
     "uitgelogd" staan — dat is correct, geen bug. */
  window.veloraGetCurrentUser().then((user) => {
    const link = document.getElementById('headerAccountLink');
    if (!link) return;
    if (user) {
      link.href = 'account.html';
      link.setAttribute('aria-label', `Account (${user.name || user.email})`);
    }
  });
})();
