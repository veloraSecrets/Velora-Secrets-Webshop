/* ============================================
   VELORA SECRETS — AI-ASSISTENT (regelgebaseerd)
   ============================================
   Geen echte AI-backend — trefwoord-matching tegen een vaste set
   antwoorden, zelfde eerlijke aanpak als het vorige project
   (api/ai-chat.js zou hier ooit een echte AI-service kunnen koppelen;
   tot die tijd is dit systeem transparant regelgebaseerd). */

var VELORA_AI_RULES = [
  { keywords: ['verzend', 'levering', 'levertijd', 'bezorg', 'wanneer'], reply: 'Voor 18:00 uur besteld op werkdagen? Dan wordt je bestelling dezelfde dag verwerkt. Gratis verzending vanaf €50, altijd discreet met Track &amp; Trace. Levertijd: Nederland 1–3 werkdagen, België 2–4 werkdagen, overige EU-landen 2–7 werkdagen. Meer details op onze <a href="verzending.html">verzendpagina</a>.' },
  { keywords: ['retour', 'terugsturen', 'ruilen', 'niet goed'], reply: 'Je hebt 30 dagen bedenktijd. Producten moeten ongeopend en in de originele verpakking terug. Volledige procedure op onze <a href="retourneren.html">retourpagina</a>.' },
  { keywords: ['betaal', 'ideal', 'creditcard', 'paypal'], reply: 'We accepteren iDEAL, creditcard, PayPal, Apple Pay en Bancontact. Alle betalingen verlopen veilig via onze betaalprovider.' },
  { keywords: ['discreet', 'privacy', 'anoniem'], reply: 'Discretie staat bij ons voorop: neutrale verpakking zonder logo, en een neutrale omschrijving op je bankafschrift.' },
  { keywords: ['advies', 'aanrader', 'aanbevel', 'beginner'], reply: 'Voor beginners raden we vaak aan te starten met iets kleins en simpels — bijvoorbeeld uit onze <a href="shop.html?cat=lingerie-bdsm&sub=beginner-sets">Beginner Sets</a> of <a href="shop.html?cat=voor-haar">Voor Haar</a>-collectie.' },
  { keywords: ['contact', 'mail', 'bereikbaar', 'telefoon'], reply: 'Je kan ons bereiken via <a href="contact.html">het contactformulier</a> of support@velorasecrets.nl. We reageren binnen 1 werkdag.' },
  { keywords: ['korting', 'sale', 'aanbieding'], reply: 'Bekijk onze actuele aanbiedingen op de <a href="shop.html?filter=sale">Sale-pagina</a>.' },
  { keywords: ['bestelling', 'order', 'status'], reply: 'Je bestelstatus vind je terug in <a href="account.html">Mijn account</a> zodra je bent ingelogd.' }
];

var VELORA_AI_QUICK_REPLIES = ['Verzending & levering', 'Retourneren', 'Productadvies', 'Betaalmethoden'];

function veloraAiRespond(message) {
  var lower = String(message).toLowerCase();
  for (var i = 0; i < VELORA_AI_RULES.length; i++) {
    var rule = VELORA_AI_RULES[i];
    for (var j = 0; j < rule.keywords.length; j++) {
      if (lower.indexOf(rule.keywords[j]) !== -1) return rule.reply;
    }
  }
  return 'Daar heb ik zo snel geen kant-en-klaar antwoord op — stuur je vraag naar <a href="contact.html">ons supportteam</a>, die helpen je graag verder. Of stel een andere vraag over verzending, retourneren, betalen of productadvies.';
}
