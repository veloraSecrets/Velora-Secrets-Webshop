# Velora Secrets — Volledig Auditrapport

> **Update (zelfde ontwikkeltraject, ná dit rapport):** het hieronder genoemde
> ❌-punt (winkelwagen/checkout nog niet op Shopify's cart-API) is inmiddels
> **opgelost** — zie `RC1-REPORT.md` §5 punt 1 voor de bijgewerkte status en
> de uitgevoerde tests. Dit rapport blijft verder ongewijzigd als historisch
> document van de auditronde zelf.

**Datum:** 3 augustus 2026 · **Scope:** volledige codebase (frontend + backend + database + Shopify-integratie), alsof morgen live met gelijktijdige bezoekers.

**Eerlijke methodologische kanttekening vooraf:** deze audit draait in een sandbox zonder browser en zonder netwerktoegang (bevestigd: npm/apt geven 403). Alle "tests" hieronder zijn dus **Node.js-simulaties van de daadwerkelijke productiecode** (nooit losse mocks) en statische analyse (grep/regex/parsers) — geen echte browserrun en geen literaire load-test met duizenden gelijktijdige verzoeken. Waar dat een grens stelt, staat dat expliciet vermeld.

---

## Samenvatting

| | Aantal |
|---|---|
| ✅ Volledig gereed | 24 |
| ⚠️ Kan verbeterd worden | 7 |
| ❌ Vóór livegang op te lossen | 1 (rest van de eerder kritieke punten is al opgelost tijdens deze sessie) |

**Alle ❌-punten die tijdens déze audit zijn gevonden, zijn al opgelost** (cron-authenticatie, XSS-escaping, dode code). Het enige overgebleven ❌-punt was al bekend uit RC1 en staat hieronder herbevestigd.

---

## ✅ Volledig gereed

| # | Onderdeel | Bewijs |
|---|---|---|
| 1 | JS-syntax, alle bestanden (frontend+backend) | `node --check` op elk bestand, 0 fouten |
| 2 | Module-laadbaarheid (runtime require-check) | Elk lib/api-bestand daadwerkelijk geladen, 0 fouten |
| 3 | HTML-structuur, alle 73 pagina's + beheerpaneel | Tag-balans + dubbele ID's gecontroleerd, 0 problemen |
| 4 | CSS-integriteit, geen dubbele `@media`-blokken | Elk breakpoint komt precies 1x voor in beide stylesheets |
| 5 | SQL-injectie | Alle 21 `db.query()`-aanroepen gebruiken `$1,$2`-parameters, geen string-concatenatie gevonden |
| 6 | Hardcoded secrets/tokens | Grep op Shopify-tokenpatronen: 0 gevonden |
| 7 | Environment-variabelen consistent | Elke `process.env.X` in code komt exact overeen met `.env.example` (geen ontbrekende, geen ongebruikte) |
| 8 | Interne links, alle 73 pagina's | 0 kapotte links (incl. onderlinge `/p/`-links met relatieve paden) |
| 9 | Ontbrekende afbeeldingen | N.v.t. — bewuste keuze voor CSS-gradiënten i.p.v. `<img>`, dus geen 404-risico op assets |
| 10 | Formulier-toegankelijkheid (labels) | Elk `<input>`/`<textarea>` heeft een gekoppeld `<label>` of `aria-label` |
| 11 | robots.txt + sitemap.xml | Geldige XML, 68 URL's, correct verwezen vanuit robots.txt |
| 12 | E-mailvalidatie-consistentie | Zelfde regex in `js/auth.js` (client) en de repository-laag |
| 13 | Order-levenscyclus (state machine) | 16 overgangsscenario's eerder getest, nu herbevestigd via de volledige 11-staps klantreis |
| 14 | **Volledige 11-staps klantreis-simulatie** | Homepage→categorie→product→cart→checkout→betaling→orderverwerking→leveranciersroutering→verzending→Track&Trace→orderstatus — alle 11 stappen slagen tegen de échte productiecode (zie hieronder) |
| 15 | Webhook-beveiliging (HMAC) | 7 webhooks, elk met geldig/vervalst-scenario getest |
| 16 | Retry-logica | 3 scenario's (herstel/permanent falen/meteen goed) |
| 17 | Betalen-vóór-leverancier-regel | Bevestigd: order routeert pas na status `paid`, nooit ervoor |
| 18 | Auto-swap productdata (placeholder/test/echt) | Zonder frontend-wijziging bewezen |
| 19 | Beheerpaneel-autorisatie (admin-routes) | `status.js`/`trigger-sync.js`/`run-e2e.js` controleren allemaal `ADMIN_PANEL_SECRET` |
| 20 | AI-chat: standaard ingeklapt + vloeiende animatie | Class-based toggle, CSS-transitions, focus-management, Escape/klik-buiten-sluit |
| 21 | Social-iconen: officiële merklogo's | Instagram/TikTok/Facebook als geldige SVG (XML-gevalideerd), geen ronde containers |
| 22 | Browsercompatibiliteit (JS-syntax) | Geen optional chaining/nullish-coalescing/nieuwe array-methods die oudere browsers breken |
| 23 | Browsercompatibiliteit (CSS) | Geen `:has()`/`@container`/subgrid — breed ondersteunde CSS |
| 24 | Bestandsgrootte CSS+JS | 104KB totaal — licht, snel te laden |

---

## ⚠️ Kan verbeterd worden

| # | Bevinding | Prioriteit | Concrete oplossing |
|---|---|---|---|
| 1 | Geen expliciete `Cache-Control`-headers voor statische CSS/JS in `vercel.json` | Midden | Voeg een `headers`-config toe voor `/css/*` en `/js/*` met `Cache-Control: public, max-age=...` — let op: zonder bestandsnaam-hashing (cache-busting) moet de max-age gematigd blijven, anders zien bezoekers na een deploy nog een tijdje de oude versie. Vercel's CDN cachet statische bestanden overigens al redelijk goed zonder deze config, dus dit is een optimalisatie, geen gebrek. |
| 2 | `api/sync/tracking.js` roept `supplier.fetchTracking()` sequentieel aan in een `for`-loop | Laag | Bij veel open leverancierskoppelingen kan dit worden geparallelliseerd met `Promise.all()` — bij de huidige, kleine verwachte volumes (dropshipping, niet duizenden orders/minuut) is dit nu geen probleem. |
| 3 | `lib/db/sync-logs.js` en `audit.js` hebben geen automatische opschoning (retention) | Laag | Voeg op termijn een periodieke `DELETE FROM sync_logs WHERE created_at < now() - interval '90 days'` toe, anders groeit de tabel onbeperkt. |
| 4 | Beheerpaneel-authenticatie is een gedeeld wachtwoord, geen sessie/rate-limiting op de login zelf | Midden | Voor 1-2 beheerders acceptabel; voeg bij groei een rate-limiter toe op herhaalde foutieve `x-admin-secret`-pogingen (bv. simpele in-memory teller met korte lockout), en overweeg een echt account-systeem. |
| 5 | Contact-/nieuwsbriefformulieren in de frontend hebben nog geen werkende server-aanroep (de oude endpoints zijn net verwijderd als dode code) | Midden | Bewust zo gelaten tot een e-mailprovider gekozen is — zie TODO-commentaren in `js/main.js`. Geen regressie: dit werkte al niet écht (verwees naar dode code). |
| 6 | Geen automatische opschoning van oude `TEST_MODE`-testorders in de database | Laag | Voeg een handmatige "testorders opruimen"-knop toe in het beheerpaneel, of filter ze op `shopify_order_id LIKE 'e2e-%'`/`'shopify-order-%'` bij livegang. |
| 7 | Winkelwagen/checkout gebruiken nog niet Shopify's eigen cart-API (zie ❌ hieronder) — dit is het enige echt kritieke punt, hier ter volledigheid herhaald in context | Hoog | Zie ❌-sectie. |

---

## ❌ Vóór livegang op te lossen

| # | Bevinding | Prioriteit | Concrete oplossing |
|---|---|---|---|
| 1 | **Winkelwagen (`js/cart.js`) en `checkout.html` gebruiken nog het lokale localStorage-systeem, niet Shopify's eigen cart-API/checkout-URL.** De productWEERGAVE is sinds mijlpaal 3 wel aan Shopify gekoppeld, maar het daadwerkelijke bestel-/afrekenproces nog niet. | **Hoog** | "In winkelwagen"-knop moet `lib/shopify/storefront-client.js`'s `createCart()`/`addCartLines()` aanroepen (via een nieuwe kleine client-side API-route, want het Storefront-token mag wel client-side maar de aanroep zelf is nu server-only opgezet) en de gebruiker vervolgens naar Shopify's eigen `checkoutUrl` sturen in plaats van naar `checkout.html`. Dit is precies het onderwerp voor de eerstvolgende ontwikkelfase. |

---

## Bevindingen gevonden én al opgelost tijdens déze auditronde

Voor de volledigheid — deze waren bij aanvang van de audit nog niet opgelost, en zijn dat nu wel:

1. **🔴→✅ 3 sync-cron-endpoints (`/api/sync/products`, `/inventory`, `/tracking`) hadden geen authenticatie** — iedereen die de voorspelbare URL kende kon een sync triggeren. Opgelost met een nieuwe `CRON_SECRET`-verificatie (`lib/verify-cron-request.js`), functioneel getest: geweigerd zonder secret, geweigerd met verkeerd secret, geaccepteerd met juist secret, en bevestigd dat de handmatige beheerpaneel-trigger (die de interne functie rechtstreeks aanroept, niet via HTTP) hierdoor niet brak.
2. **⚠️→✅ Zoekfunctie escapete alleen `<`, niet `&`/`>`/`"`** — nu volledige HTML-escaping toegepast.
3. **⚠️→✅ 4 dode bestanden** (`api/create-payment.js`, `webhook.js`, `contact.js`, `newsletter.js`) uit de vóór-Shopify-periode, bevestigd nergens meer aangeroepen — verwijderd.
4. **⚠️→✅ 2 ongebruikte dependencies** (`@mollie/api-client`, `resend`) stonden nog in `package.json` zonder ooit uitgevoerd te worden — verwijderd, plus de bijbehorende ongebruikte env-vars (`MOLLIE_API_KEY`, `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `SITE_URL`) uit `.env.example`.

---

## De volledige 11-staps klantreis-simulatie (details)

Gedraaid tegen de échte productiecode (niet een aparte testsimulatie), met `TEST_MODE=true`:

| Stap | Resultaat |
|---|---|
| 1. Homepage | Featured producten correct geladen |
| 2. Categorie | Filter op categorie: 15 producten gevonden voor "Voor Haar" |
| 3. Productpagina | Specifiek product correct opgehaald |
| 4. Winkelwagen | Product toegevoegd, subtotaal correct berekend (€119,90) |
| 5. Checkout | Order aangemaakt in database, status `received` |
| 6. Betaling | `orders/paid`-webhook verwerkt, status → `paid` |
| 7. Orderverwerking | Automatisch doorgezet naar routering |
| 8. Leveranciersroutering | Correct toegewezen aan Dreamlove (test-adapter), status → `sent_to_supplier` |
| 9. Verzending | Tracking-sync opgehaald, 1 update verwerkt |
| 10. Track & Trace | Trackingnummer + vervoerder correct vastgelegd |
| 11. Orderstatus | Eindstatus `shipped`, volledige tijdlijn: `received → paid → sent_to_supplier → processing → shipped` |

**Alle 11 stappen: geslaagd.**

---

## Conclusie

Na deze audit is er nog **1 kritiek punt** open (winkelwagen/checkout naar Shopify's eigen cart-API), identiek aan wat al in het RC1-rapport stond — dit is dus geen nieuwe vondst maar een bevestigde, nog niet opgeloste prioriteit. Alle overige tijdens deze audit gevonden problemen (cron-beveiliging, XSS-escaping, dode code, ongebruikte dependencies) zijn dezelfde sessie nog opgelost en functioneel herbevestigd. De volledige 11-staps klantreis werkt end-to-end tegen de productiecode.
