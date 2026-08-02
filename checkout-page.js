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

### Allerlaatste productie-audit: geheugenlekken, ongebruikte bestanden, 5 end-to-end scenario's
Ongebruikte bestanden: geen gevonden — elk .js-bestand en elke afbeelding wordt daadwerkelijk gebruikt. Geheugenlekken: gecontroleerd op opstapelende event-listeners bij herhaald renderen (winkelwagen, AI-chat) — alle render-functies overschrijven `innerHTML` volledig (oude listeners verdwijnen samen met hun elementen) of gebruiken event-delegatie op documentniveau (precies één keer geregistreerd bij het laden). Geen leaks gevonden.
Vijf expliciete klantscenario's end-to-end getest met broncode-simulatie: (1) homepage→product→winkelwagen→afrekenen, (2) AI-chat→productadvies→daadwerkelijk toevoegen aan winkelwagen via de AI-productkaart, (3) zoeken→filteren→productpagina, (4) favorieten→alles toevoegen aan winkelwagen, (5) responsive-structuur (breakpoints) bevestigd aanwezig voor de belangrijkste onderdelen. Scenario 5 blijft beperkt tot structurele bevestiging — geen browser beschikbaar voor visuele confirmatie.

### Laatste volledige audit: 4 nieuwe bevindingen gefixt
Dode code verwijderd (`veloraT`, een wees-functie van de allang verwijderde AI-begroeting). Een Nederlandse-spelling-mismatch gefixt: "betaalmethoden" matchte niet met het AI-trefwoord "betal". Twee echte invoervalidatie-bugs in de winkelwagen gefixt: negatieve hoeveelheden werden zonder controle geaccepteerd (kon het totaalbedrag manipuleren), en een ongeldige (NaN) hoeveelheid werd letterlijk als NaN opgeslagen i.p.v. het item te verwijderen. Beide nu gevalideerd met een ondergrens van 1 en een bovengrens van 99 stuks per product.
Uitgebreide AI-test met 20+ vragen (FAQ's, categorieën, productvragen, edge cases als lege/onzinnige invoer, hoofdletters, leestekens) — alle correct afgehandeld.
Bevestigd: geen Cloudinary-integratie in dit project (producten gebruiken CSS-gradient-placeholders, geen externe afbeeldingshost).

### Eerlijke content: beloftes en reviews
Ongegarandeerde leveringsbelofte ("Voor 22:00 besteld, morgen in huis") overal verwijderd (topbar, USP-strip, verzendbeleid × 7 talen, elke productpagina) — vervangen door neutrale, wel waarmaakbare tekst. Nieuwe "Deel jouw ervaring"-sectie op de homepage met een bewust uitgeschakelde "Schrijf een review"-knop (eerlijk: nog geen echt reviewsysteem gekoppeld), klaar om later aan een echt systeem te koppelen.

### Defensieve fix
`brands-page.js`: ontbrekende null-veiligheid op een event-listener toegevoegd (voorkwam een mogelijke volledige scriptcrash als het zoekveld ooit zou ontbreken).

### Diagnose: gerapporteerde "kapotte" onderdelen bleken aan de broncode-kant correct
AI-knop "Vraag Velora AI", de merkenpagina, de hero-afbeelding en het logo zijn stuk voor stuk grondig gecontroleerd (HTML-balans, CSS-koppeling, JS-functionaliteit, daadwerkelijke bestandsvaliditeit) en bleken alle vier 100% correct in de broncode. Dit wijst op een verouderde/kapotte deployment, niet op een codefout — zie de eerdere GitHub-uploadproblematiek in dit traject.

### Taalmenu: emoji-vlaggen vervangen door SVG
Emoji-vlaggen (🇳🇱🇬🇧🇩🇪...) renderen op Windows/Chrome vaak niet als plaatje maar als letter-code (NL/GB/DE) — een bekende platformbeperking. Vervangen door echte, zelf getekende SVG-vlaggen (data-URI, geen externe afhankelijkheid), consistent op elk platform. Vaste afmetingen (20×14px) voorkomen layout shift. Decoratieve vlag-iconen voorzien van aria-hidden voor schermlezers.

### QA-ronde: 3 echte bugs gevonden en gefixt
1. Megamenu bleef op touchscreens (tablet/mobiel) vast open staan na tikken buiten het menu — geen "klik buiten sluit" voor niet-hover-apparaten. Gefixt.
2. Leeftijdsgate had geen focus-trap: een toetsenbordgebruiker kon met Tab voorbij de gate naar verborgen elementen erachter komen, zonder ooit te bevestigen. Gefixt.
3. Misleidend commentaar in age-verification.js beweerde dat het script in `<head>` moest laden — feitelijk onjuist en potentieel gevaarlijk voor toekomstig onderhoud (zou een echte crash veroorzaken). Gecorrigeerd.

### Review-sectie: luxe donkere stijl
Achtergrond van lichtgroen (`--sage`) naar `--espresso` (donkerzwart), witte titel, lichtgrijze tekst, knopkleur aangepast naar goud voor voldoende contrast (zelfde patroon als de bestaande AI-sectie).

### Taalmenu volledig herbouwd
Had voorheen geen enkele eigen CSS (pure browserstandaard = rommelig oogte). Nu een nette dropdown met witruimte, uitlijning, gelijke regelhoogtes, hover-effecten en een duidelijke markering van de actief geselecteerde taal.

### Footertekst herschreven
Vervangen door een tekst die past bij het merk: stijlvol, volwassen, sensueel zonder plat te worden.

### Favorieten: grondig geverifieerd, geen bug gevonden
Volledige keten (klikken → opslaan → onthouden na herladen → weer verwijderen) end-to-end bewezen te werken via een echte klik-simulatie op het hartje-icoon zelf.

### Eerlijke content: beloftes en reviews
Ongegarandeerde leveringsbelofte ("Voor 22:00 besteld, morgen in huis") overal verwijderd. Nieuwe "Deel jouw ervaring"-sectie op de homepage met een bewust uitgeschakelde "Schrijf een review"-knop, klaar om later aan een echt reviewsysteem te koppelen.

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
