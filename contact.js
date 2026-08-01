/* ============================================================
   api/popular-searches.js — Vercel serverless function
   ------------------------------------------------------------
   Geeft de daadwerkelijk populairste zoekopdrachten terug (bijgehouden
   door api/track-search.js), gesorteerd op aantal keer gezocht. Als er
   nog geen KV gekoppeld is of nog geen data verzameld — geeft een lege
   lijst terug (search.js valt dan zelf terug op de statische
   config.js-lijst, zie daar).
   ============================================================ */
const { kvGet } = require('./_kv');

const COUNTS_KEY = 'popular-searches-counts';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Alleen GET-verzoeken toegestaan.' });
  }

  const limit = Math.min(Number(req.query?.limit) || 6, 20);

  try {
    const counts = (await kvGet(COUNTS_KEY)) || {};
    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([term]) => term);
    return res.status(200).json({ terms: top });
  } catch (err) {
    return res.status(200).json({ terms: [] });
  }
};
