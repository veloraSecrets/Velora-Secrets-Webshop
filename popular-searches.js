/* ============================================================
   api/ai-chat.js — Vercel serverless function
   ------------------------------------------------------------
   Klaar om Velora AI aan een ECHTE AI-service te koppelen (bv. de
   Anthropic Messages API of OpenAI). Nu nog een eerlijke placeholder
   — geen nepantwoorden — zodat ai.js hier veilig op kan terugvallen
   naar de bestaande, regelgebaseerde flow (search/compare/advisor +
   trefwoord-antwoorden) zolang dit niet is ingevuld.

   Zo koppel je een echte AI-service:
   1. Zet een API-sleutel in Vercel (bv. ANTHROPIC_API_KEY).
   2. Vervang de placeholder hieronder door een echte aanroep, bv.:

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: 300,
            system: 'Je bent Velora AI, de klantenservice-assistent van Velora Secrets...',
            messages: [{ role: 'user', content: message }],
          }),
        });
        const data = await res.json();
        return res.status(200).json({ reply: data.content[0].text });

   3. Geef de productcatalogus (window.VELORA_PRODUCTS-achtige data)
      mee in de system-prompt of via function calling, zodat de
      AI-service ook productadvies met echte data kan geven.
   ============================================================ */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Alleen POST-verzoeken toegestaan.' });
  }

  const message = (req.body?.message || '').trim();
  if (!message) {
    return res.status(400).json({ error: 'Geen bericht meegegeven.' });
  }

  if (!process.env.AI_SERVICE_API_KEY) {
    // Bewust GEEN nepantwoord — ai.js herkent deze 501 en valt
    // automatisch terug op de bestaande, regelgebaseerde flow.
    return res.status(501).json({
      error: 'Nog geen echte AI-service gekoppeld.',
      volgendeStap: 'Zet AI_SERVICE_API_KEY in Vercel en vul de aanroep in api/ai-chat.js in (zie de instructies in de bestandskop).',
    });
  }

  // TODO: hier komt de echte aanroep naar de gekozen AI-service zodra
  // AI_SERVICE_API_KEY is ingesteld — zie voorbeeld in de bestandskop.
  return res.status(501).json({ error: 'AI_SERVICE_API_KEY is gezet, maar de aanroep zelf is nog niet ingevuld in api/ai-chat.js.' });
};
