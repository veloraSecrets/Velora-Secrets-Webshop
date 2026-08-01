/* ============================================================
   api/rewards-redeem.js — Vercel serverless function
   ------------------------------------------------------------
   Wisselt Velora Rewards-punten in voor een kortingscode. Genereert
   een code in hetzelfde formaat als de nieuwsbrief-codes
   (REWARDS-XXXXXX), zodat de bestaande, al-geteste
   veloraApplyDynamicDiscount()-flow (discount.js/cart-page.js)
   hergebruikt kan worden zonder enige wijziging — geen dubbele
   kortingslogica.
   ============================================================ */
const { kvGet, kvSet } = require('./_kv');

const REWARD_TIERS = {
  500: 5,
  1000: 10,
};

function generateRewardCode() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `REWARDS-${suffix}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Alleen POST-verzoeken toegestaan.' });
  }

  const email = (req.body?.email || '').trim().toLowerCase();
  const pointsRequired = Number(req.body?.pointsRequired);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in.' });
  }
  if (!REWARD_TIERS[pointsRequired]) {
    return res.status(400).json({ error: 'Ongeldig aantal punten om in te wisselen. Kies 500 of 1000.' });
  }

  try {
    const record = await kvGet(`rewards:email:${email}`);
    const currentPoints = record?.points || 0;

    if (currentPoints < pointsRequired) {
      return res.status(400).json({ error: `Je hebt niet genoeg punten (${currentPoints}/${pointsRequired}).` });
    }

    const discountEuros = REWARD_TIERS[pointsRequired];
    const code = generateRewardCode();

    await kvSet(`rewards:email:${email}`, { points: currentPoints - pointsRequired });
    await kvSet(`discount:code:${code}`, {
      email,
      discountPercent: null,
      discountEuros,
      used: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, code, discountEuros, remainingPoints: currentPoints - pointsRequired });
  } catch (err) {
    console.error('Rewards-inwisseling mislukt:', err.message);
    return res.status(502).json({ error: 'Inwisselen lukte niet. Probeer het later opnieuw.' });
  }
};
