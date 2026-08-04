# Van development-store naar productiewinkel — zonder herbouw

Dit document beschrijft precies waarom en hoe je van een tijdelijke Shopify
development store naar je uiteindelijke productiewinkel overstapt, zonder dat
er ook maar één regel code of de website zelf opnieuw hoeft te worden gebouwd.

## Waarom dit zonder herbouw kan

Alle code in `lib/shopify/` en `api/` verwijst **nergens** naar een specifieke
winkelnaam, domein of token. Alles komt uit environment variables
(`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`, `SHOPIFY_ADMIN_TOKEN`,
`SHOPIFY_WEBHOOK_SECRET`, `SHOPIFY_LOCATION_ID`, en sinds de databaselaag ook
`DATABASE_URL` — zie DATABASE.md). Dat is bewust zo ontworpen:
welke winkel er "achter" de website zit, is een **runtime-instelling**, geen
**build-tijd-instelling**. Overstappen naar een andere winkel betekent dus:
andere waarden invullen in Vercel, opnieuw deployen (dat gebeurt automatisch
bij een environment-variabele-wijziging) — geen enkele broncodewijziging.

Je kan dit zelf verifiëren: `grep -rn "myshopify.com" lib/ api/` geeft alleen
voorbeeldwaarden in commentaarregels terug, nooit een echte, hardcoded winkel.

## Vercel-omgevingen: de juiste manier om dit te scheiden

Vercel ondersteunt per project **drie omgevingen** met elk hun eigen
environment variables: **Production**, **Preview**, en **Development**.
Gebruik dit zo:

| Omgeving | Wijst naar |
|---|---|
| Production | Je uiteindelijke Shopify-**productiewinkel** + een echte Postgres-**productiedatabase** (`DATABASE_URL`) |
| Preview / Development | De tijdelijke Shopify **development store** — en zonder `DATABASE_URL` ingesteld valt de databaselaag automatisch terug op de SQLite-testadapter (zie DATABASE.md) |

Zo test je altijd veilig tegen de development store (elke preview-deploy,
elke lokale `vercel dev`), terwijl de live site op `velorasecrets.nl` altijd
tegen de echte, productiewinkel praat — zonder dat je ooit per ongeluk tegen
de verkeerde winkel aan het testen bent.

## Stap-voor-stap: de daadwerkelijke overstap

1. **Maak de productiewinkel aan** in Shopify (een normaal betaald abonnement,
   geen development store).
2. **Maak in de productiewinkel een nieuwe custom app** (Instellingen → Apps
   en verkoopkanalen → Apps ontwikkelen), met dezelfde scopes als de
   development-app (zie DEPLOYMENT.md). Dit levert **nieuwe** tokens op — de
   tokens van de development store werken niet in de productiewinkel.
3. **Zet de productiewinkel-waarden in Vercel**, specifiek onder de
   **Production**-omgeving:
   - `SHOPIFY_STORE_DOMAIN` → het `.myshopify.com`-domein van de productiewinkel
   - `SHOPIFY_STOREFRONT_TOKEN`, `SHOPIFY_ADMIN_TOKEN` → de nieuwe tokens
   - `SHOPIFY_LOCATION_ID` → de locatie-ID van de productiewinkel (kan anders
     zijn dan in de development store)
4. **Configureer de webhook opnieuw** in de productiewinkel (orders/create →
   `https://velorasecrets.nl/api/shopify/webhook-order-create`), en zet het
   bijbehorende nieuwe `SHOPIFY_WEBHOOK_SECRET` in Vercel. Elke winkel heeft
   een eigen webhook-secret; die van de development store werkt niet voor de
   productiewinkel.
5. **Vul het eigen domein in** bij Shopify → Instellingen → Domeinen, zodat de
   Shopify-checkout op `checkout.velorasecrets.nl` (of vergelijkbaar) draait
   in plaats van een `.myshopify.com`-adres — dit is nodig om te voldoen aan
   "bezoekers mogen nergens Shopify zien".
6. **Draai de product-/voorraadsync eenmalig handmatig** (via het
   beheerpaneel, `/admin`) tegen de productiewinkel — de productiewinkel start
   leeg, dus de eerste sync na de overstap vult 'm met de actuele catalogus
   van de leveranciers.
7. **Controleer in `/admin`** dat "Actieve winkel" nu de productiewinkel toont
   (niet de development store) vóórdat je klanten toelaat.

## Wat NIET automatisch meeverhuist

- **Testdata** (test-orders, test-producten) uit de development store gaat
  niet mee — dat hoort ook niet, dat was test-data.
- **Webhook-secret en tokens** zijn per winkel uniek en moeten dus opnieuw
  worden aangemaakt (stap 2 en 4 hierboven).
- **Kortingscodes, klantaccounts** die je eventueel al in de development
  store had aangemaakt voor testen, staan niet in de productiewinkel — die
  moet je (als gewenst) opnieuw aanmaken in de productiewinkel zelf.
