# Velora Secrets — Wijzigingsoverzicht

Dit document geeft een compleet overzicht van de webshop in zijn huidige
staat: wat werkt, wat er is toegevoegd, en wat nog open staat. 23 pagina's,
28 JavaScript-modules, 9 API-routes.

## ✅ Volledig werkend

### Webshop-kern
- 141 producten, 16 merken, volledige catalogus met zoeken/filteren
- Winkelwagen, wishlist, kortingscodes (statisch én dynamisch via Rewards)
- Checkout met Mollie (iDEAL, creditcard, PayPal, Apple Pay, Bancontact e.a.)
- Orderbevestiging per e-mail via Resend, betaalstatus altijd opnieuw geverifieerd bij Mollie zelf (nooit vertrouwd op de webhook-body)
- Contactformulier met honeypot + rate limiting, écht werkend via Resend
- Persoonlijke aanbevelingen ("Vaak samen gekocht", "Ook interessant", "Aanbevolen voor jou")

### 18+ Leeftijdsgate (nieuw)
Blokkeert de volledige site (scroll uitgeschakeld, hoogste z-index) totdat de bezoeker bevestigt 18+ te zijn. Verschijnt als eerste, vóór alles — ook vóór de nieuwsbrief-popup. Persistent via localStorage: eenmaal bevestigd, nooit meer gevraagd.

### Nieuwsbrief-popup: timing en robuustheid
Verschijnt nu pas ná leeftijdsbevestiging (nooit gelijktijdig), getriggerd door exit-intent met een tijd-fallback (8 sec) voor mobiel. Sluitknop en verzendknop functioneel opnieuw bevestigd met een echte DOM-simulatie inclusief event-bubbling.

### Velora AI: alleen het icoon standaard
Het automatische-begroetingsbubbel-mechanisme is volledig verwijderd (niet alleen uitgeschakeld) — JS-logica, HTML op alle 23 pagina's, CSS en de nu-ongebruikte vertaalsleutels. De chat opent voortaan uitsluitend na een klik op het icoon.

### Nieuwsbrief volledig verwijderd
Op verzoek volledig weggehaald: het formulier (footer + popup), `newsletter.js`, `api/newsletter.js`, alle bijbehorende CSS, en de nieuwsbrief-vermelding in de privacyverklaring (alle 7 talen). Velora Rewards is hierdoor niet geraakt — die gebruikt dezelfde onderliggende kortingscode-opslag (nu neutraal hernoemd van `newsletter:code:` naar `discount:code:`) en blijft volledig functioneel, opnieuw end-to-end getest.

### Footer & contact geoptimaliseerd
Van 6 naar 2 e-mailadressen (support@ + info@) — overzichtelijker en professioneler, zowel in de footer als op de contactpagina.

### KRITIEKE BUG GEFIXT: "Afrekenen" deed niets
De hoofdconversieknop van de webshop — zowel in de winkelwagen-drawer (toegankelijk vanaf alle 23 pagina's) als op de winkelwagenpagina zelf — had geen enkele koppeling naar checkout.html. Nu een echte link, robuuster dan een JS-afhankelijke knop.

### Velora AI verder uitgebreid
- Bestaande antwoorden verrijkt met echte klikbare links (verzendbeleid/retourbeleid/leeftijdsbeleid)
- Categorie-navigatie toegevoegd (voor haar/hem/koppels/lingerie/BDSM/wellness)
- Bug gefixt: "verzonden" matchte niet met het trefwoord "verzend" (Nederlandse vervoeging)
- Nieuwe, eerlijke koppelstructuur voor een echte AI-service (`api/ai-chat.js`) — probeert eerst een echte service, valt onzichtbaar terug op het bestaande systeem zolang die niet gekoppeld is

### Zoekfunctie: écht dynamische populaire zoekopdrachten
Nieuwe endpoints `track-search.js`/`popular-searches.js` houden daadwerkelijk bij wat bezoekers zoeken, met een eerlijke terugval naar de statische lijst zolang er nog geen data is. Live-tijdens-typen en categorie/merk-filtering bleken al aanwezig.

### Nieuwsbrief: dubbele-verzending-bug gefixt
Bij een herhaalde aanmelding met hetzelfde e-mailadres werd de kortingscode al correct hergebruikt, maar er ging telkens opnieuw een volledige welkomstmail uit. Nu: mail alleen bij een écht nieuwe aanmelding.

### Velora AI-assistent
- Zichtbaar op elke pagina, VS-badge, subtiele idle/zwaai-animatie
- Twee volledige, geteste gespreksflows:
  - "Voor jezelf of cadeau?" → keuzehulp met automatische vervolgvragen
  - "Vergelijk twee producten" → typen of kiezen uit eerdere aanbevelingen → uitgebreide vergelijkingstabel (materiaal, eigenschappen, gebruik, geluidsniveau, prijs, voor wie geschikt, pluspunten)

### Meertaligheid (7 talen: NL/EN/DE/FR/ES/PT/IT)
- Taalwisselaar rechtsboven op elke pagina, automatische browserdetectie
- 150 vertaalsleutels, geverifieerd identiek in alle 7 talen
- Interface volledig vertaald; de 5 juridische pagina's zijn ook volledig vertaald (inhoudelijk, niet alleen labels)
- Producten blijven bewust Nederlands tot een leverancier/Shopify-koppeling actief is

### Juridische pagina's (7, allemaal premium opgebouwd)
Disclaimer, Privacyverklaring, Cookiebeleid, Verzendbeleid, Retourbeleid,
Algemene voorwaarden, 18+ Leeftijdsbeleid — elk met luxe hero, vertrouwenskaarten,
inhoud in overzichtelijke kaarten, en contact uitsluitend via info@velorasecrets.nl.

### Nieuwsbrief
- Werkend formulier (footer + eenmalige popup voor nieuwe bezoekers)
- Genereert een écht unieke kortingscode per aanmelding, verstuurt een welkomstmail via Resend
- Code is direct inwisselbaar bij het afrekenen

### Velora Rewards
- €1 besteed = 1 punt, automatisch toegekend bij een bevestigde betaling
- 500 punten = €5 korting, 1000 punten = €10 korting
- Eigen pagina (`rewards.html`, gelinkt vanuit het account) om saldo te bekijken en in te wisselen

### SEO & toegankelijkheid
- BreadcrumbList, Product-, Organization- en WebSite-structured data op alle relevante pagina's
- Sitemap (147 URL's), robots.txt, meta descriptions/OG/Twitter Cards overal aanwezig
- WCAG-contrastfix, skip-links, alt-teksten, autocomplete op alle formuliervelden

### Beveiliging
- 2 kritieke reflected-XSS-kwetsbaarheden gevonden en gefixt (zoekquery + orderID werden ongefilterd getoond)
- Content-Security-Policy, rate limiting op contactformulier én betaalaanvraag
- Geen hardcoded sleutels, geen `.env` gecommit

## 🧱 Klaar als fundament, nog niet actief gekoppeld

### Shopify Storefront API
`api/shopify.js` bevat echte, functioneel geteste GraphQL-queries
(productenlijst + winkelwagen/checkout-aanmaak) tegen Shopify's publieke,
stabiele schema. Ontbreekt nog: jouw eigen `SHOPIFY_STORE_DOMAIN` en
`SHOPIFY_STOREFRONT_ACCESS_TOKEN` (zie `.env.example` en
`SHOPIFY-INTEGRATION.md` voor de exacte stappen). Zoals afgesproken wordt de
checkout pas omgezet zodra jouw Shopify-account daadwerkelijk gekoppeld is.

## ⚠️ Moet jij zelf doen (buiten bereik van code)

- Shopify Headless-kanaal instellen + access token aanmaken
- Echte Mollie/Resend/Vercel KV-accounts koppelen in Vercel
- Domeinmigratie (DNS) naar Vercel voltooien
- Een echte testbestelling doorlopen in een browser
- Google Search Console / Analytics / Meta Pixel-ID's invullen

## Bekende, bewuste keuzes

- Lighthouse-scores zijn niet letterlijk gemeten (geen browsertoegang) — wel zijn alle onderliggende best practices toegepast
- Rate limiting is best-effort (in-memory, geen externe store) — voldoende voor normaal gebruik, niet waterdicht tegen grootschalig misbruik
- Productafbeeldingen zijn bewust weggelaten (placeholder-gradients), in afwachting van de leverancierskoppeling
