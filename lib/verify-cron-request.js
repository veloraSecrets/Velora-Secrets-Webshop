// lib/verify-cron-request.js
//
// Beveiligt de sync-cron-endpoints (api/sync/*.js) tegen willekeurige externe
// aanroepen. Zonder deze check kon IEDEREEN die de (volledig voorspelbare)
// URL kent, bv. /api/sync/products, een synchronisatie triggeren — gevonden
// tijdens de uitgebreide audit.
//
// Accepteert twee geldige aanroepers:
//   1. Vercel Cron zelf — stuurt de header "Authorization: Bearer $CRON_SECRET"
//      mee als CRON_SECRET is ingesteld in Vercel (zie DEPLOYMENT.md).
//   2. Het beheerpaneel — handmatige trigger via api/admin/trigger-sync.js,
//      die zelf al apart beveiligd is met ADMIN_PANEL_SECRET (die trigger
//      roept de sync-functies rechtstreeks aan, niet via HTTP, dus komt
//      sowieso niet langs deze check — zie trigger-sync.js).

function verifyCronRequest(req) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // Nog niet geconfigureerd: bewust WEIGEREN i.p.v. stilzwijgend toestaan —
    // beter een sync die (nog) niet draait dan een onbeveiligd open endpoint.
    return { ok: false, reason: 'CRON_SECRET niet geconfigureerd — cron-endpoint is dicht totdat dit is ingesteld.' };
  }
  const authHeader = req.headers['authorization'] || '';
  if (authHeader === `Bearer ${cronSecret}`) {
    return { ok: true };
  }
  return { ok: false, reason: 'Ongeldige of ontbrekende Authorization-header.' };
}

module.exports = { verifyCronRequest };
