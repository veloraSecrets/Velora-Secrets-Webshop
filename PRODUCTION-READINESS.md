# Productie-gereedheid — Velora Secrets headless platform

Eerlijke stand van zaken: wat is er daadwerkelijk productie-klaar gebouwd, en
wat kan pas écht "productie-klaar" zijn zodra jij bepaalde dingen hebt
aangeleverd (credentials, leverancier-documentatie). Code kan nooit
"productie-klaar" zijn voor systemen die niet bestaan — dat is geen kwaliteit
die ik kan opvoeren, maar een kwestie van externe afhankelijkheden.

## ✅ Volledig gebouwd, getest, klaar om te koppelen

- **Database & order-/fulfillmentmodule** — `db/schema.sql` (Postgres/Supabase), volledige levenscyclus (`lib/order-lifecycle.js`: received→paid→sent_to_supplier→processing→shipped→delivered/returned/cancelled), repository-laag (`lib/db/orders.js`/`sync-logs.js`/`audit.js`). Zie `DATABASE.md`.
- **Frontend ↔ Shopify-koppeling** — `lib/catalog-source.js` + `scripts/generate-catalog.js`: schakelt automatisch tussen Shopify (test/echt) en placeholders, regenereert `js/products.js` + `api/_product-prices.json` + statische SEO-productpagina's (`/p/*.html`) + `sitemap.xml`. Zie `SHOPIFY-CATALOG-MAPPING.md`.
- **Winkelwagen & checkout uitsluitend via Shopify** — `js/shopify-cart.js` + `api/cart.js` + uitgebreide `lib/shopify/storefront-client.js` (create/add/update/remove/get). Oude lokale cart.js/checkout.html volledig verwijderd. "Afrekenen" verwijst naar Shopify's eigen `checkoutUrl`. Getest: 7 (client) + 8 (API) + volledige flow-simulatie.
- **Shopify Storefront API-client** (producten, cart, checkout-URL) — `lib/shopify/storefront-client.js`
- **Shopify Admin API-client** (product-upsert, voorraad, fulfillment) — `lib/shopify/admin-client.js`
- **Webhook-verificatie** (HMAC-SHA256, Shopify's officiële methode) — `lib/shopify/verify-webhook.js`
- **7 webhook-ontvangers**: orders/create, orders/paid, products/update, inventory_levels/update, app/uninstalled — allemaal met HMAC-verificatie, functioneel getest. **Belangrijke regel**: een order gaat pas naar de leverancier ná bevestigde betaling (`lib/order-fulfillment.js`), nooit ervoor.
- **Retry-logica met exponentiële backoff** op alle echte Shopify-aanroepen — `lib/retry.js`
- **Modulair leveranciers-adapterpatroon** — `lib/suppliers/` — nieuwe leverancier toevoegen = 1 nieuw bestand + 1 regel in `registry.js`
- **Sync-jobs** (producten/voorraad/tracking) met Vercel Cron-configuratie — `vercel.json`. De tracking-sync werkt nu tegen de echte database (openstaande leverancierskoppelingen) en zet de orderstatus automatisch door naar `shipped`.
- **Beheerpaneel** (`/admin`) — orderstatistieken per levenscyclusstatus, ordermonitoring-tabel, synchronisatiegeschiedenis, auditlog, leveranciersstatus, handmatige triggers, actieve-winkel/database-indicator
- **Volledige end-to-end testmodus** — `TEST_MODE=true`, test nu de ECHTE productiecode (database, levenscyclus, routering, tracking-sync), zie `TESTMODE.md`
- **Migratiepad development → productie** zonder codewijziging — `MIGRATION.md`

## ⏳ Kan pas écht werken zodra jij dit aanlevert

| Onderdeel | Wat ik nodig heb van jou |
|---|---|
| Shopify-koppeling zelf | Winkel + custom app + tokens (zie DEPLOYMENT.md) |
| Database | Een Supabase- (of andere Postgres-)project + `DATABASE_URL` (zie DATABASE.md) — zonder deze draait alles op de SQLite-testadapter, niet geschikt voor productie |
| Dreamlove-integratie | Hun API/feed-documentatie (`lib/suppliers/dreamlove.js` is een kant-en-klaar sjabloon) |
| 1on1 Wholesale-integratie | Hun API/feed-documentatie (`lib/suppliers/onon1-wholesale.js` idem) |
| Betalingen | Verlopen via Shopify zelf in deze architectuur — geen aparte actie nodig zodra de Shopify-winkel/checkout is ingesteld |
| SKU-mapping (leverancier ↔ Shopify) | Ontstaat pas zodra er een echte leverancier-koppeling is — nu nog TODO's in `api/sync/inventory.js` |

## Nog niet gebouwd (volgende mijlpalen)

- Multi-variant productselectie (kleur/maat) in de cart-flow — nu ondersteunt
  elk product maar 1 Shopify-variant; de eerdere nep-kleurselector die niet
  naar echte varianten mapte is bewust verwijderd i.p.v. misleidend gehouden.
- Klantaccount-koppeling met Shopify's eigen customer-systeem (nu alleen
  e-mailadres opgeslagen bij een order, geen volledige Shopify-customer-sync).
- Retour-workflow (status `returned` bestaat en is bereikbaar, maar er is nog
  geen UI/proces om een retour daadwerkelijk te initiëren/verwerken).
- Notificaties bij fouten (bv. een Slack/e-mail-alert als een sync-job faalt)
  — nu alleen zichtbaar via het beheerpaneel, niet pro-actief gemeld.
