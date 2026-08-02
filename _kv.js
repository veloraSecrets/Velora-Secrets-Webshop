/* ============================================================
   api/rewards.js — Vercel serverless function
   ------------------------------------------------------------
   Haalt het puntensaldo van Velora Rewards op voor een e-mailadres.
   Regels: €1 besteed = 1 punt, 500 punten = €5 korting, 1000 punten
   = €10 korting (zie ook api/rewards-redeem.js en de puntentoekenning
   in api/webhook.js).

   Zonder ingelogde-sessie-systeem (auth.js heeft nog geen backend)
   wordt het e-mailadres als queryparameter meegegeven — zodra er
   ooit een echt sessiesysteem is, vervangt dat alleen de manier
   waarop het e-mailadres bepaald wordt, niet de rest van deze logica.
   ============================================================ */
const { kvGet } = require('./_kv');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Alleen GET-verzoeken toegestaan.' });
  }

  const email = (req.query?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in.' });
  }

  try {
    const points = (await kvGet(`rewards:points:${email}`)) || 0;

    return res.status(200).json({
      email,
      points,
      rewards: [
        { pointsRequired: 500, discountEuros: 5, available: points >= 500 },
        { pointsRequired: 1000, discountEuros: 10, available: points >= 1000 },
      ],
    });
  } catch (err) {
    console.error('Rewards-opzoeking mislukt:', err.message);
    return res.status(502).json({ error: 'Kon je puntensaldo niet ophalen. Probeer het later opnieuw.' });
  }
};
