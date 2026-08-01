/* ============================================================
   api/contact.js — Vercel serverless function
   ------------------------------------------------------------
   Verwerkt het contactformulier (contact.html) echt: valideert
   server-side, weert spam, en verstuurt een echte e-mail via
   Resend naar de klantenservice — geen simulatie.

   Vereist: RESEND_API_KEY (zie .env.example). Optioneel:
   CONTACT_RECIPIENT_EMAIL (standaard support@velorasecrets.nl als
   die niet gezet is).

   Spambeveiliging, in twee lagen die geen externe database nodig
   hebben:
   1. Honeypot-veld ("website") — onzichtbaar voor mensen, de
      meeste eenvoudige bots vullen het toch in. Is het ingevuld,
      dan doen we alsof het gelukt is (géén mail versturen, geen
      foutmelding) — zo leert een bot niet dat 'ie ontdekt is.
   2. Tijdcontrole — het formulier stuurt mee wanneer de pagina is
      geladen; een reactie binnen 3 seconden is vrijwel altijd een
      bot, geen mens die een bericht heeft getypt.

   Rate limiting is BEWUST best-effort: een in-memory Map per
   IP-adres, die alleen binnen dezelfde "warme" serverless-instance
   werkt. Bij een koude start (nieuwe instance) is de teller weer
   leeg. Voor harde garanties bij hoog volume is een externe store
   (bv. Vercel KV of Upstash Redis) nodig — dat is bewust niet
   toegevoegd, want dat is nieuwe infrastructuur die niet gevraagd is.
   ============================================================ */
const { Resend } = require('resend');

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minuten
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_SECONDS_BEFORE_SUBMIT = 3;

// Overleeft alleen binnen dezelfde warme instance — zie toelichting hierboven.
const recentRequestsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (recentRequestsByIp.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  recentRequestsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

const ALLOWED_TOPICS = ['Bestelling', 'Product', 'Retour', 'Zakelijk', 'Overig'];

function validate(body) {
  const errors = {};
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();
  const topic = (body.topic || 'Overig').trim();

  if (name.length < 2) errors.name = 'Vul je naam in (minimaal 2 tekens).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Vul een geldig e-mailadres in.';
  if (message.length < 10) errors.message = 'Je bericht moet minimaal 10 tekens bevatten.';
  if (message.length > 5000) errors.message = 'Je bericht mag maximaal 5000 tekens bevatten.';
  if (!ALLOWED_TOPICS.includes(topic)) errors.topic = 'Ongeldig onderwerp.';

  return { valid: Object.keys(errors).length === 0, errors, clean: { name, email, message, topic } };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Alleen POST-verzoeken toegestaan.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: 'RESEND_API_KEY ontbreekt. Zet deze omgevingsvariabele in het Vercel-dashboard (zie .env.example).',
    });
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'onbekend').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Te veel berichten verstuurd. Probeer het over een paar minuten opnieuw.' });
  }

  const body = req.body || {};

  // ---------- Laag 1: honeypot ----------
  if (body.website) {
    // Bewust een "succesvolle" reactie: nooit laten merken dat dit een val was.
    return res.status(200).json({ success: true });
  }

  // ---------- Laag 2: tijdcontrole ----------
  const loadedAt = Number(body.formLoadedAt);
  if (!loadedAt || (Date.now() - loadedAt) / 1000 < MIN_SECONDS_BEFORE_SUBMIT) {
    return res.status(200).json({ success: true });
  }

  // ---------- Server-side validatie ----------
  const { valid, errors, clean } = validate(body);
  if (!valid) {
    return res.status(400).json({ error: 'Controleer de gemarkeerde velden.', fieldErrors: errors });
  }

  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'support@velorasecrets.nl';

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Velora Secrets — Contactformulier <noreply@velorasecrets.nl>',
      to: recipient,
      replyTo: clean.email,
      subject: `[Contactformulier] ${clean.topic} — ${clean.name}`,
      html: `
        <p><strong>Naam:</strong> ${escapeHtml(clean.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(clean.email)}</p>
        <p><strong>Onderwerp:</strong> ${escapeHtml(clean.topic)}</p>
        <p><strong>Bericht:</strong></p>
        <p>${escapeHtml(clean.message).replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color:#888; font-size:12px;">Verstuurd via het contactformulier op velorasecrets.nl · IP: ${escapeHtml(ip)}</p>
      `,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contactformulier-verzending mislukt:', err);
    return res.status(502).json({ error: 'Kon je bericht niet versturen. Probeer het later opnieuw of mail direct naar support@velorasecrets.nl.' });
  }
};
