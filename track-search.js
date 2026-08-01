/* ============================================================
   api/webhook.js — Vercel serverless function
   ------------------------------------------------------------
   Mollie roept dit endpoint aan bij elke statuswijziging van een
   betaling (dat is wat je als webhookUrl meegeeft bij het aanmaken
   van de betaling in create-payment.js). Wij vragen de actuele
   status altijd opnieuw op bij Mollie zelf — vertrouw nooit op
   gegevens die in het webhook-verzoek zelf zouden staan, dat is
   eenvoudig te vervalsen; de bevestigde status komt alleen via een
   directe, geauthenticeerde aanroep naar Mollie's eigen API.

   Bij een geslaagde betaling: verstuurt een echte orderbevestiging
   via Resend vanaf noreply@velorasecrets.nl, en kent Velora
   Rewards-punten toe (€1 = 1 punt) — beide bewust in eigen try/catch,
   zodat het één het ander nooit kan blokkeren.

   Vereist: MOLLIE_API_KEY, RESEND_API_KEY (zie .env.example).
   ============================================================ */
const { createMollieClient } = require('@mollie/api-client');
const { Resend } = require('resend');
const { kvGet, kvSet } = require('./_kv');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  if (!process.env.MOLLIE_API_KEY) {
    console.error('MOLLIE_API_KEY ontbreekt — webhook kan de betaalstatus niet controleren.');
    return res.status(500).json({ error: 'MOLLIE_API_KEY ontbreekt.' });
  }

  const paymentId = req.body?.id;
  if (!paymentId) {
    return res.status(400).json({ error: 'Ontbrekend payment-ID in webhook-body.' });
  }

  const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

  let payment;
  try {
    payment = await mollieClient.payments.get(paymentId);
  } catch (err) {
    console.error('Kon betaling niet ophalen bij Mollie:', err);
    return res.status(502).json({ error: 'Kon betaalstatus niet ophalen bij Mollie.' });
  }

  // Alleen bij een daadwerkelijk bevestigde, betaalde status een e-mail
  // versturen — niet bij "open", "pending" of geannuleerde betalingen.
  if (!payment.isPaid()) {
    return res.status(200).json({ received: true, status: payment.status });
  }

  const customerEmail = payment.metadata?.customerEmail;
  const orderId = payment.metadata?.orderId || paymentId;

  // ---------- Velora Rewards: punten toekennen (€1 = 1 punt) ----------
  // Bewust los van de e-mailbevestiging hieronder: als dit faalt (bv.
  // KV nog niet gekoppeld), moet de klant zijn bevestiging gewoon
  // krijgen. Alleen loggen, nooit de rest van de flow blokkeren.
  if (customerEmail) {
    try {
      const amount = Number(payment.amount?.value || 0);
      const pointsEarned = Math.floor(amount);
      const key = `rewards:email:${customerEmail.toLowerCase()}`;
      const existing = await kvGet(key);
      await kvSet(key, { points: (existing?.points || 0) + pointsEarned });
    } catch (err) {
      console.warn(`Rewards-punten voor order ${orderId} konden niet worden toegekend:`, err.message);
    }
  }

  if (!customerEmail) {
    console.warn(`Betaling ${paymentId} is betaald, maar er is geen customerEmail in de metadata — geen bevestiging verstuurd.`);
    return res.status(200).json({ received: true, emailSent: false });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY ontbreekt — kan geen orderbevestiging versturen.');
    return res.status(200).json({ received: true, emailSent: false, warning: 'RESEND_API_KEY ontbreekt' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Velora Secrets <noreply@velorasecrets.nl>',
      to: customerEmail,
      subject: 'Je bestelling is bevestigd — Velora Secrets',
      html: `
        <p>Bedankt voor je bestelling bij Velora Secrets.</p>
        <p>We hebben je betaling ontvangen en pakken je bestelling zorgvuldig en discreet in — zonder logo of productomschrijving op de verpakking.</p>
        <p><strong>Ordernummer:</strong> ${orderId}</p>
        <p>Vragen? Antwoord op deze e-mail of neem contact op via support@velorasecrets.nl.</p>
        <p>Met warme groet,<br>Team Velora Secrets</p>
      `,
    });
    return res.status(200).json({ received: true, emailSent: true });
  } catch (err) {
    console.error('Resend-verzending mislukt:', err);
    // Belangrijk: ondanks de mislukte e-mail toch 200 teruggeven aan Mollie,
    // anders blijft Mollie de webhook herhaaldelijk opnieuw aanroepen voor
    // een betaling die al wél correct is verwerkt.
    return res.status(200).json({ received: true, emailSent: false, error: 'Resend-verzending mislukt' });
  }
}
