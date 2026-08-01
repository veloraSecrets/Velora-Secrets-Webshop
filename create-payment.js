/* ============================================================
   api/track-search.js — Vercel serverless function
   ------------------------------------------------------------
   Telt een afgeronde zoekopdracht op in Vercel KV, zodat
   "Populaire zoekopdrachten" echt kan reflecteren wat bezoekers
   daadwerkelijk zoeken (i.p.v. een vaste lijst). Fire-and-forget
   vanaf de frontend — het antwoord wordt niet gebruikt.

   Alle tellingen staan in ÉÉN KV-sleutel (popular-searches-counts,
   { term: aantal, ... }) — voorkomt dat er een aparte "lijst alle
   sleutels op"-operatie nodig is om later de top-N te bepalen.
   ============================================================ */
const { kvGet, kvSet } = require('./_kv');

const COUNTS_KEY = 'popular-searches-counts';
const MAX_TRACKED_TERMS = 300; // voorkomt onbeperkte groei

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Alleen POST-verzoeken toegestaan.' });
  }

  const term = (req.body?.term || '').trim().toLowerCase();
  // Te korte of te lange termen negeren — geen zin in het tellen van
  // losse letters tijdens het typen of hele zinnen.
  if (term.length < 3 || term.length > 40) {
    return res.status(200).json({ tracked: false });
  }

  try {
    const counts = (await kvGet(COUNTS_KEY)) || {};
    counts[term] = (counts[term] || 0) + 1;

    // Bij te veel unieke termen: alleen de top MAX_TRACKED_TERMS bewaren.
    const entries = Object.entries(counts);
    const trimmed = entries.length > MAX_TRACKED_TERMS
      ? Object.fromEntries(entries.sort((a, b) => b[1] - a[1]).slice(0, MAX_TRACKED_TERMS))
      : counts;

    await kvSet(COUNTS_KEY, trimmed);
    return res.status(200).json({ tracked: true });
  } catch (err) {
    // Best-effort: als KV niet gekoppeld is, gewoon stil negeren —
    // dit mag de zoekfunctie zelf nooit verstoren.
    return res.status(200).json({ tracked: false });
  }
};
