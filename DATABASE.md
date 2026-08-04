# Database — orders, klanten, sync-logs, tracking, auditlogs

## Wat dit is

De volledige order-/fulfillmentmodule (levenscyclus: ontvangen → betaald →
naar leverancier → in verwerking → verzonden → afgeleverd/retour), plus
synchronisatielogs en auditlogs, staan in een echte Postgres-database.

## Opzetten (Supabase, aanbevolen)

1. Maak een gratis project aan op [supabase.com](https://supabase.com).
2. Ga naar **SQL Editor** → plak de inhoud van `db/schema.sql` → **Run**.
3. Ga naar **Project Settings → Database → Connection string** → kopieer de
   **URI**-variant (begint met `postgresql://`).
4. Zet die als `DATABASE_URL` in Vercel (Production-omgeving — zie
   MIGRATION.md voor hoe je dit per omgeving instelt).

Elke andere Postgres-provider werkt ook — het enige vereiste is een geldige
`DATABASE_URL`-connection string en dat `db/schema.sql` daar is uitgevoerd.

## Zonder DATABASE_URL: de SQLite-testadapter

Als `DATABASE_URL` niet is ingesteld, gebruikt de site automatisch
`lib/db/adapters/sqlite-adapter.js` — een structurele testvariant op basis
van Node's ingebouwde `node:sqlite`. Dit is **uitsluitend voor lokaal
ontwikkelen/testen**, nooit voor productie:

- Data verdwijnt bij elke herstart (in-memory database, geen bestand).
- SQLite en Postgres verschillen op detailniveau (type-afdwinging, functies).
- Er is geen enkele manier om dit te gebruiken tussen meerdere serverless-
  aanroepen in Vercel heen — elke aanroep krijgt zijn eigen, lege database.

Dit is dezelfde soort bewuste, gedocumenteerde beperking als `TEST_MODE` voor
de Shopify/leverancier-koppelingen (zie TESTMODE.md) — een eerlijke, werkende
stand-in om de logica te kunnen testen zonder netwerktoegang tot een echte
database, niet een verkapte "het werkt toch wel"-aanname.

## Belangrijkste tabellen

| Tabel | Doel |
|---|---|
| `orders` + `order_items` | De bestelling zelf en de regels erin |
| `order_status_history` | De volledige, zichtbare levenscyclus per order |
| `supplier_order_links` | Welke leverancier voert welke order uit |
| `tracking_events` | Track & Trace-gegevens |
| `sync_logs` | Operationele status (sync-jobs, webhooks) |
| `audit_logs` | Verantwoording (handmatige acties in het beheerpaneel) |

## De order-levenscyclus

Zie `lib/order-lifecycle.js` voor de exacte, in code afgedwongen regels.
Samengevat: `received → paid → sent_to_supplier → processing → shipped →
delivered`, met `returned` bereikbaar vanaf `shipped`/`delivered`, en
`cancelled` bereikbaar vanaf de vroege statussen. Een ongeldige overgang
(bv. `shipped` direct na `received`) wordt geweigerd, zowel in de
applicatielogica als (als laatste verdedigingslinie) door een
CHECK-constraint in `db/schema.sql`.

## Belangrijke, bewuste regel: betalen vóór leverancier

Een order wordt pas naar Dreamlove/1on1 Wholesale doorgestuurd nadat de
status `paid` is bereikt — nooit eerder. Dit voorkomt dat een nog-niet-
betaalde of geannuleerde bestelling toch een product bij de leverancier in
gang zet. Zie `lib/order-fulfillment.js`.
