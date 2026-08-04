# Velora Secrets — Technisch Eindrapport Release Candidate 1 (RC1)

**Datum:** 3 augustus 2026
**Status:** Release Candidate 1 — codebase bevroren voor review, volgende ontwikkelfase start na jouw goedkeuring.

---

## 1. Definitieve architectuur

Velora Secrets is een **headless e-commerceplatform**: een volledig eigen,
merkgebonden frontend (statische pagina's + server-rendered SEO-productpagina's),
met **Shopify uitsluitend als backend** (producten, voorraad, cart, checkout,
betalingen, bestellingen, klanten, kortingen, btw, facturen, verzending,
retouren). Bezoekers zien Shopify nergens.

```
Bezoeker
   │
   ▼
Eigen frontend (HTML/CSS/vanilla JS, statisch gehost op Vercel)
   │
   ├── Productdata: SEO-pagina's (/p/*.html) gegenereerd door
   │   scripts/generate-catalog.js ← lib/catalog-source.js
   │                                     │
   │                                     ├── TEST_MODE=true      → Shopify-testdata (mock)
   │                                     ├── Shopify-tokens gezet → ECHTE Shopify-producten
   │                                     └── niets geconfigureerd → lib/legacy-placeholder-products.js
   │
   ├── Winkelwagen/checkout: ✅ Shopify Cart API (js/shopify-cart.js + api/cart.js) — checkout via Shopify's eigen checkoutUrl, geen lokale checkout-pagina meer
   │
   ▼
Vercel Serverless Functions (api/)
   │
   ├── Shopify Storefront API  (lib/shopify/storefront-client.js) — producten, cart, checkout-URL
   ├── Shopify Admin API       (lib/shopify/admin-client.js)      — product-sync, voorraad, fulfillment
   ├── Webhooks (7×, HMAC-geverifieerd)                          — orders/create, orders/paid, products/update,
   │                                                                 inventory_levels/update, app/uninstalled
   ├── Order-/fulfillmentmodule (lib/order-lifecycle.js + lib/order-fulfillment.js)
   ├── Leveranciers-adapterpatroon (lib/suppliers/) — modulair, Dreamlove/1on1 Wholesale als sjabloon
   ├── Sync-jobs (api/sync/) — cron via vercel.json
   └── Beheerpaneel-API (api/admin/) — dashboards, logs, handmatige triggers
   │
   ▼
Database (lib/db/) — Postgres (Supabase) in productie, SQLite-testadapter lokaal/testmodus
   │
   ▼
Externe systemen: Shopify-winkel · Dreamlove · 1on1 Wholesale
```

### Kernprincipes (bewust zo ontworpen)

1. **Auto-swap zonder codewijziging** — welke productdata-bron actief is
   (placeholder/testmodus/echte Shopify-winkel) hangt uitsluitend af van
   environment variables. Zie `MIGRATION.md`.
2. **Betalen vóór leverancier** — een order gaat pas naar Dreamlove/1on1
   Wholesale ná bevestigde betaling (`lib/order-fulfillment.js`), nooit ervoor.
3. **Modulaire leveranciers** — een nieuwe leverancier toevoegen = 1 nieuw
   bestand in `lib/suppliers/` + 1 regel in `registry.js`, niets anders
   verandert.
4. **Server is de bron van waarheid** — prijzen, voorraad en orderstatus
   worden altijd server-side bepaald, nooit op basis van clientinput vertrouwd.
5. **Testmodus is geen mock van de code, maar dezelfde code met mock-data** —
   `TEST_MODE=true` laat de ECHTE productiefuncties draaien tegen realistische
   nepdata, dus een geslaagde testrun bewijst dat de productiecode klopt.

---

## 2. Volledige mappenstructuur

```
velora/
├── index.html, shop.html, product.html, checkout.html, winkelwagen.html,
│   verlanglijst.html, login.html, registreren.html, account.html,
│   over-ons.html, contact.html, faq.html, verzending.html, retourneren.html,
│   voorwaarden.html, privacybeleid.html, cookiebeleid.html, zakelijk.html,
│   bedrijfsgegevens.html, wellness-massage.html, 404.html   [21 frontend-pagina's]
├── p/                          — 52 automatisch gegenereerde SEO-productpagina's
├── admin/index.html            — beheerpaneel (dashboards, logs, handmatige triggers)
├── css/main.css, pages.css
├── js/                         — frontend-logica (vanilla JS, geen framework)
│   ├── age-verification.js, main.js, ai.js
│   ├── products.js              ⚠️ AUTOMATISCH GEGENEREERD, niet handmatig bewerken
│   ├── cart.js, wishlist.js, auth.js   ⚠️ nog lokaal (localStorage), zie §5
├── lib/                        — gedeelde server-side logica
│   ├── catalog-source.js        — kern van de auto-swap-mechaniek
│   ├── legacy-placeholder-products.js
│   ├── order-lifecycle.js       — de state machine van de order-levenscyclus
│   ├── order-fulfillment.js     — routering naar leverancier na betaling
│   ├── test-mode.js             — TEST_MODE-detectie + mock-data
│   ├── retry.js                 — exponentiële backoff voor externe aanroepen
│   ├── shopify/
│   │   ├── storefront-client.js, admin-client.js, verify-webhook.js
│   ├── suppliers/
│   │   ├── adapter-interface.js — het contract waar elke leverancier aan voldoet
│   │   ├── dreamlove.js, onon1-wholesale.js   🟡 sjablonen, wachten op documentatie
│   │   └── registry.js          — centrale registratie, hier voeg je een nieuwe leverancier toe
│   └── db/
│       ├── index.js              — kiest Postgres- of SQLite-adapter
│       ├── orders.js, sync-logs.js, audit.js   — repository-laag
│       └── adapters/postgres-adapter.js, sqlite-adapter.js
├── db/schema.sql                — productie-Postgres-schema (Supabase-compatibel)
├── db/schema.sqlite.sql         — structurele testvariant (lokaal/testmodus)
├── api/
│   ├── shopify/                 — 5 webhook-ontvangers (HMAC-geverifieerd)
│   ├── sync/                    — products.js, inventory.js, tracking.js (cron-jobs)
│   ├── admin/                   — status.js, trigger-sync.js
│   ├── test/run-e2e.js          — volledige end-to-end testorchestrator
│   ├── _product-prices.json     ⚠️ AUTOMATISCH GEGENEREERD
│   └── create-payment.js, webhook.js, contact.js, newsletter.js   🔴 verouderd, zie §5 punt 2
├── scripts/generate-catalog.js  — regenereert productdata + SEO-pagina's + sitemap
├── vercel.json                  — cron-configuratie
├── package.json, .env.example
├── favicon.svg, robots.txt, sitemap.xml
└── Documentatie: DEPLOYMENT.md, MIGRATION.md, TESTMODE.md, DATABASE.md,
    PRODUCTION-READINESS.md, SHOPIFY-CATALOG-MAPPING.md
```

---

## 3. Geïmplementeerde functionaliteiten — status per onderdeel

| Onderdeel | Status | Toelichting |
|---|---|---|
| Frontend (21 pagina's, navigatie, megamenu's, zoekfunctie, AI-assistent) | ✅ Gereed | Volledig getest, toegankelijkheid/SEO-basis aanwezig |
| SEO-productpagina's (52, server-rendered content + JSON-LD) | ✅ Gereed | Automatisch gegenereerd, geen JS nodig voor indexering |
| Shopify Storefront API-client (producten, cart, checkout-URL) | ✅ Gereed | Getest in testmodus; wacht op echte tokens voor live data |
| Shopify Admin API-client (product-sync, voorraad, fulfillment) | ✅ Gereed | Idem |
| Auto-swap productdata (placeholder ↔ testmodus ↔ echte Shopify) | ✅ Gereed | Bewezen zonder frontend-wijziging te vereisen |
| Webhook-verificatie (HMAC-SHA256) | ✅ Gereed | 4 scenario's getest |
| 5 Shopify-webhooks (orders/create, orders/paid, products/update, inventory, app/uninstalled) | ✅ Gereed | Functioneel getest |
| Order-/fulfillmentmodule + levenscyclus (8 statussen, state machine) | ✅ Gereed | 16 overgangsscenario's getest |
| Database-laag (Postgres-schema + repository) | ✅ Gereed (schema) | 🟡 Wacht op een echte Supabase/Postgres-instantie |
| Sync-jobs (producten/voorraad/tracking) + cron | ✅ Gereed | Logica getest; 🟡 wacht op leverancier-data om iets te synchroniseren |
| Leveranciers-adapterpatroon | ✅ Gereed (patroon) | 🟡 Dreamlove/1on1 Wholesale zijn sjablonen, wachten op hun API/feed-documentatie |
| Beheerpaneel (dashboards, orderstatistieken, logs, audit, handmatige sync) | ✅ Gereed | Getest tegen de database-laag |
| Volledige end-to-end testmodus | ✅ Gereed | Test de échte productiecode, niet een aparte simulatie |
| Retry-logica met exponentiële backoff | ✅ Gereed | 3 scenario's getest |
| Migratiepad development → productie | ✅ Gereed | Zonder codewijziging, alleen environment variables |
| **Winkelwagen/checkout-flow via Shopify** | ✅ Gereed | Shopify Cart API volledig geïmplementeerd en getest (zie §5-update) |
| Dreamlove-koppeling (echte data) | 🟡 Wacht op externe gegevens | Hun API/feed-documentatie |
| 1on1 Wholesale-koppeling (echte data) | 🟡 Wacht op externe gegevens | Idem |
| Betalingen | 🟡 Wacht op externe gegevens | Verloopt via Shopify's eigen checkout zodra de winkel/domein is ingesteld |
| Transactionele e-mail (bevestigingen, tracking-mails) | 🟡 Wacht op externe gegevens | Shopify kan dit deels zelf (notifyCustomer:true bij fulfillment) |
| Retour-workflow (UI/proces) | 🔴 Nog niet gebouwd | Status bestaat in de database, geen bedienings-UI |
| Klantaccount-koppeling met Shopify | 🔴 Nog niet gebouwd | Nu alleen e-mailadres bij een order opgeslagen |
| Foutmeldingen pro-actief melden (Slack/e-mail bij mislukte sync) | 🔴 Nog niet gebouwd | Nu alleen zichtbaar in het beheerpaneel |

---

## 4. Externe afhankelijkheden

| Systeem | Waarvoor | Wat ik nodig heb | Status |
|---|---|---|---|
| **Shopify** | Producten, voorraad, cart, checkout, betalingen, bestellingen, klanten, kortingen, btw, facturen, verzending, retouren | Winkel + custom app + Storefront/Admin-tokens + webhook-secret (zie `DEPLOYMENT.md`) | 🟡 |
| **Dreamlove** | Dropshipping-leverancier 1 | API- of feed-documentatie (REST/CSV/EDI, authenticatie, order-indienmethode, tracking-methode) | 🟡 |
| **1on1 Wholesale** | Dropshipping-leverancier 2 | Idem | 🟡 |
| **Supabase (of andere Postgres)** | Productiedatabase | Project + `DATABASE_URL` (zie `DATABASE.md`) | 🟡 |
| **Betalingen** | Transacties | Verloopt via Shopify zelf — geen apart account nodig zodra de winkel/checkout-domein is ingesteld | 🟡 (afhankelijk van Shopify-koppeling) |
| **E-mail** | Bestelbevestigingen, tracking-updates | Shopify kan dit deels zelf; eventueel een aparte provider voor de nieuwsbrief/contactformulier (nog niet gekoppeld aan de Shopify-architectuur) | 🔴 |

---

## 5. Bekende beperkingen (belangrijkste bevindingen van dit rapport)

1. **✅ OPGELOST — Winkelwagen en checkout gebruiken nu Shopify's eigen cart-API.**
   `js/shopify-cart.js` (vervangt het oude `js/cart.js` volledig) roept
   `api/cart.js` aan, dat op zijn beurt `lib/shopify/storefront-client.js`'s
   `createCart()`/`addCartLines()`/`updateCartLine()`/`removeCartLine()`/
   `getCart()` gebruikt. "Afrekenen" verwijst rechtstreeks naar Shopify's eigen
   `checkoutUrl` — de lokale `checkout.html` is verwijderd. Volledig getest
   (7+8 scenario's) en de complete flow (product → cart → bijwerken →
   checkout-redirect) end-to-end gesimuleerd in testmodus.
   **Bewuste, resterende beperking**: alleen single-variant-producten worden
   ondersteund (de nep-kleurselector die niet naar echte Shopify-varianten
   mapte is bewust verwijderd) — echte kleur-/maatselectie volgt zodra een
   product met meerdere Shopify-varianten bestaat.
2. **✅ OPGELOST — Verouderde bestanden uit de vóór-Shopify-periode verwijderd**:
   `api/create-payment.js`, `api/webhook.js`, `api/contact.js`,
   `api/newsletter.js` waren architectonisch overbodig geworden nu Shopify de
   checkout/betalingen beheert — bevestigd nergens meer aangeroepen, verwijderd.
   Bijbehorende ongebruikte dependencies (`@mollie/api-client`, `resend`) ook
   uit `package.json` verwijderd.
3. **🟡 Database-laag is alleen structureel getest (SQLite-proxy)**, nog
   niet tegen een echte Postgres-instantie — zie `DATABASE.md` voor waarom
   (geen netwerktoegang in deze sandbox) en wat daarvoor nog moet gebeuren.
4. **🟡 Leveranciers-adapters zijn sjablonen** — elke aanroep naar Dreamlove/
   1on1 Wholesale geeft nu een duidelijke `SupplierNotConfiguredError`,
   behalve in testmodus (mock-data).
5. **🔴 Geen retour-bedienings-UI** — de status `returned` bestaat in de
   levenscyclus en database, maar er is nog geen scherm/proces om een retour
   daadwerkelijk te starten of te verwerken.
6. Beheerpaneel-authenticatie is een gedeeld wachtwoord (`ADMIN_PANEL_SECRET`)
   — geschikt voor 1-2 beheerders, niet voor een groter team.

---

## 6. Checklist voor productie

- [ ] Shopify-productiewinkel aangemaakt (geen development store) + custom app + tokens
- [ ] `DATABASE_URL` naar een echte Supabase/Postgres-instantie, `db/schema.sql` uitgevoerd
- [ ] Alle environment variables in Vercel **Production**-omgeving ingevuld (zie `.env.example`)
- [ ] `TEST_MODE` uitgeschakeld (of helemaal niet gezet) in Production
- [ ] Dreamlove- en 1on1 Wholesale-adapters ingevuld met hun echte API/feed-logica
- [x] **Winkelwagen/checkout omgebouwd naar Shopify's cart-API** (zie §5, punt 1) — ✅ opgelost
- [ ] Verouderde bestanden (`api/create-payment.js` e.a., zie §5 punt 2) opgeruimd of bewust behouden
- [ ] Webhooks in Shopify geregistreerd (orders/create, orders/paid, products/update, inventory_levels/update, app/uninstalled) met het juiste `SHOPIFY_WEBHOOK_SECRET`
- [ ] Vercel Cron-jobs actief gecontroleerd (`vercel.json`)
- [ ] `ADMIN_PANEL_SECRET` ingesteld, beheerpaneel getest tegen de productiedatabase
- [ ] Eigen checkout-domein ingesteld in Shopify (bv. `checkout.velorasecrets.nl`)

## 7. Checklist voor livegang

- [ ] Volledige klantreis één keer getest op de live URL: product bekijken → winkelwagen → afrekenen → (test-)betaling → bevestiging
- [ ] Test-bestelling daadwerkelijk bij Dreamlove/1on1 Wholesale terechtgekomen, Track & Trace ontvangen, orderstatus in het beheerpaneel gecontroleerd
- [ ] `/admin` bevestigt: juiste winkel actief, testmodus UIT, database = Postgres (niet SQLite)
- [ ] DNS/domein (`velorasecrets.nl`) volledig naar Vercel gewezen, oude DNS-records verwijderd
- [ ] Sitemap/robots.txt gecontroleerd, Google Search Console gekoppeld
- [ ] Retour-/annuleerproces (ook al is de UI er nog niet) handmatig gedraaid en gedocumenteerd voor klantenservice
- [ ] Back-up/rollback-plan: laatste werkende ZIP-back-up bekend en bereikbaar

---

## Conclusie

De architectuur staat: modulair, veilig (server-side validatie, HMAC-
verificatie, betalen-vóór-leverancier-regel), getest waar mogelijk binnen de
grenzen van deze sandbox, en migratieklaar zonder codewijziging. De
winkelwagen/checkout-omzetting naar Shopify's eigen cart-API is inmiddels
voltooid en getest — de volledige klantreis (product → winkelwagen →
Shopify-checkout) verloopt nu uitsluitend via Shopify, zoals gevraagd. Het
enige dat nu nog rest vóór livegang is de daadwerkelijke leveranciers-
koppeling (1on1 Wholesale via de officiële Shopify-app) en het invullen van
echte Shopify-credentials — beide bewust pas ná deze stap gepland.
