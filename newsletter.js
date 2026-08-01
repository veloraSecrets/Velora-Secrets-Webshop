/* ============================================================
   api/create-payment.js — Vercel serverless function
   ------------------------------------------------------------
   Maakt een echte Mollie-betaling aan. Draait uitsluitend
   server-side: MOLLIE_API_KEY komt uit een omgevingsvariabele en
   is nooit zichtbaar voor de browser (in tegenstelling tot een
   sleutel die in checkout-page.js zou staan).

   Wordt aangeroepen door checkout-page.js via:
     POST /api/create-payment
     body: { amount, description, orderId, customerEmail }

   Vereist: MOLLIE_API_KEY en SITE_URL als omgevingsvariabelen
   (zie .env.example). Zonder deze variabelen — bijvoorbeeld bij
   het lokaal openen van de statische bestanden zonder Vercel —
   bestaat deze endpoint niet en geeft checkout-page.js een
   duidelijke foutmelding in plaats van stil te falen.

   Rate limiting is BEWUST best-effort (zelfde patroon als
   api/contact.js): een in-memory Map per IP-adres, alleen geldig
   binnen dezelfde warme serverless-instance. Voorkomt ongelimiteerd
   spammen van Mollie-betalingsaanvragen vanaf één IP; voor harde
   garanties bij hoog volume is een externe store nodig (bewust niet
   toegevoegd, nieuwe infrastructuur die niet gevraagd is).
   ============================================================ */
const { createMollieClient } = require('@mollie/api-client');

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minuten
const RATE_LIMIT_MAX_REQUESTS = 10;
const recentRequestsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (recentRequestsByIp.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  recentRequestsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Alleen POST-verzoeken toegestaan.' });
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'onbekend').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Te veel betaalpogingen. Probeer het over enkele minuten opnieuw.' });
  }

  if (!process.env.MOLLIE_API_KEY) {
    return res.status(500).json({
      error: 'MOLLIE_API_KEY ontbreekt. Zet deze omgevingsvariabele in het Vercel-dashboard (zie .env.example).',
    });
  }

  const { amount, description, orderId, customerEmail, paymentMethodId } = req.body || {};

  if (!amount || !description || !orderId) {
    return res.status(400).json({ error: 'Ontbrekende velden: amount, description en orderId zijn verplicht.' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount moet een positief getal zijn.' });
  }

  /* Onze eigen betaalmethode-ID's (config.js) vertaald naar Mollie's
     eigen, officiële methode-waarden — alleen voor de methoden waar
     die 1-op-1 en met zekerheid bekend zijn. Google Pay en Klarna
     laten we hier BEWUST weg: Google Pay is bij Mollie geen losse
     top-level methode (loopt via de creditcard-flow), en voor Klarna
     bestaan meerdere varianten waarvan de exacte huidige waarde niet
     met zekerheid vaststaat — een verkeerde waarde zou de hele
     betaalaanvraag laten mislukken, dus dan laten we Mollie's eigen
     betaalpagina gewoon alle geactiveerde methoden tonen (zoals nu). */
  const MOLLIE_METHOD_MAP = {
    ideal: 'ideal',
    creditcard: 'creditcard',
    paypal: 'paypal',
    applepay: 'applepay',
    bancontact: 'bancontact',
  };
  const mollieMethod = MOLLIE_METHOD_MAP[paymentMethodId];

  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
  const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

  try {
    const payment = await mollieClient.payments.create({
      amount: { currency: 'EUR', value: amount.toFixed(2) },
      description,
      redirectUrl: `${siteUrl}/checkout.html?order=${encodeURIComponent(orderId)}`,
      webhookUrl: `${siteUrl}/api/webhook`,
      metadata: { orderId, customerEmail: customerEmail || null },
      ...(mollieMethod ? { method: mollieMethod } : {}),
    });

    return res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (err) {
    console.error('Mollie payment-aanmaak mislukt:', err);
    return res.status(502).json({ error: 'Kon geen betaling aanmaken bij Mollie. Controleer de API-sleutel en probeer opnieuw.' });
  }
}
