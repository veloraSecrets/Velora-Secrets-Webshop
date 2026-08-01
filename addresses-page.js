/* ============================================================
   assets/account-page.js — logica voor account.html
   ------------------------------------------------------------
   Vereist een echte sessie via window.veloraRequireAuth (auth.js).
   Zolang er geen /api/auth/*-backend gekoppeld is, stuurt dit
   altijd door naar login.html — dat is verwacht gedrag, geen bug.
   ============================================================ */
(() => {
  'use strict';

  (async () => {
    const user = await window.veloraRequireAuth();
    if (!user) return; // veloraRequireAuth stuurt al door naar login.html

    document.getElementById('accountGreeting').textContent = `Welkom, ${user.name || user.email}`;
    document.getElementById('accountLoading').hidden = true;
    document.getElementById('accountContent').hidden = false;

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await window.veloraLogout();
      window.location.href = 'index.html';
    });
  })();
})();
