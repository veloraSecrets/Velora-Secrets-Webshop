/* ============================================================
   api/newsletter.js — Vercel serverless function
   ------------------------------------------------------------
   Verwerkt nieuwsbrief-aanmeldingen:
   1. Genereert een echt unieke kortingscode per aanmelding
      (WELKOM10-XXXXXX), niet de gedeelde statische WELKOM10-code.
   2. Slaat het e-mailadres + code op in Vercel KV (voor
      e-mailmarketing én om de code later te kunnen valideren).
   3. Verstuurt een welkomstmail met de code via Resend — dezelfde,
      al werkende integratie als de orderbevestigingen.

   Rate limiting: zelfde bewezen best-effort patroon als
   api/contact.js en api/supplier/sync-products.js.
   ============================================================ */
const { Resend } = require('resend');
const { kvSet, kvGet } = require('./_kv');

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const recentRequestsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (recentRequestsByIp.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  recentRequestsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function generateUniqueCode() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WELKOM10-${suffix}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Alleen POST-verzoeken toegestaan.' });
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'onbekend').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Te veel aanmeldingen. Probeer het over enkele minuten opnieuw.' });
  }

  const email = (req.body?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY ontbreekt. Zet deze omgevingsvariabele in Vercel (zie .env.example).' });
  }

  try {
    // Al eerder aangemeld? Geef dezelfde code terug i.p.v. een nieuwe te
    // genereren — voorkomt dat iemand meerdere welkomstkortingen krijgt
    // door zich herhaaldelijk aan te melden met hetzelfde adres.
    const existing = await kvGet(`newsletter:email:${email}`);
    const isNewSubscriber = !existing;
    const code = existing?.code || generateUniqueCode();

    await kvSet(`newsletter:email:${email}`, {
      email,
      code,
      subscribedAt: existing?.subscribedAt || new Date().toISOString(),
    });
    await kvSet(`newsletter:code:${code}`, {
      email,
      discountPercent: 10,
      used: existing?.used || false,
      createdAt: existing?.subscribedAt || new Date().toISOString(),
    });

    // Alleen bij een ECHT nieuwe aanmelding een welkomstmail versturen —
    // bij een herhaalde aanmelding met hetzelfde adres krijgt de
    // bezoeker anders elke keer opnieuw dezelfde mail (spam-achtig).
    // De code zelf wordt in beide gevallen gewoon teruggegeven aan het
    // formulier, dus de gebruikerservaring blijft identiek.
    if (isNewSubscriber) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Velora Secrets <noreply@velorasecrets.nl>',
        to: email,
        subject: 'Welkom bij Velora Secrets — hier is je 10% kortingscode',
        html: `
          <p>Welkom bij Velora Secrets!</p>
          <p>Bedankt voor je aanmelding. Gebruik onderstaande code bij het afrekenen voor 10% korting op je eerste bestelling:</p>
          <p style="font-size:20px; font-weight:bold; letter-spacing:1px;">${code}</p>
          <p>Deze code is persoonlijk en uniek voor jouw aanmelding.</p>
          <p>Met warme groet,<br>Team Velora Secrets</p>
        `,
      });
    }

    return res.status(200).json({ success: true, code });
  } catch (err) {
    console.error('Nieuwsbrief-aanmelding mislukt:', err.message);
    return res.status(502).json({ error: 'Aanmelding kon niet verwerkt worden. Probeer het later opnieuw.' });
  }
};
