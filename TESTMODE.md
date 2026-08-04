# Testmodus — de complete keten testen vóór livegang

Met `TEST_MODE=true` kun je het **volledige proces** doorlopen — productimport,
synchronisatie, een proefbestelling, automatische leverancier-routering,
Track & Trace, en het bijwerken van de orderstatus — **zonder dat er al een
echte Shopify-winkel, leverancierskoppeling of betaalprovider hoeft te
bestaan**. Dit is bedoeld om vóór livegang te verifiëren dat de hele keten
logisch in elkaar grijpt.

## Aanzetten

1. Zet in Vercel, **uitsluitend onder de Preview- of Development-omgeving**
   (nooit Production): `TEST_MODE=true`.
2. Zet ook `ADMIN_PANEL_SECRET` (een zelfgekozen wachtwoord voor `/admin`).
3. Open `/admin`, log in, en je ziet een oranje **"TESTMODUS actief"**-banner
   bovenaan — die blijft zichtbaar zolang de variabele aanstaat, zodat je
   nooit per ongeluk denkt dat je tegen een echte winkel werkt.

## Wat er gebeurt in testmodus

- `lib/shopify/storefront-client.js` en `admin-client.js` geven **mock-data**
  terug in plaats van echte Shopify-aanroepen te doen (herkenbaar aan
  `[TESTMODUS]` in productnamen en `test-` in ID's).
- `lib/suppliers/dreamlove.js` en `onon1-wholesale.js` doen hetzelfde voor de
  leveranciers — ze geven een nep-catalogus, nemen een testorder direct aan,
  en leveren direct nep-Track & Trace-gegevens.
- Niets hiervan raakt een echte server, echte winkel, of echt leverancier-
  systeem aan — het is allemaal lokale simulatie binnen de code zelf.

## De volledige test draaien

Klik in `/admin` op **"Volledige end-to-end-test uitvoeren"**. Dit doorloopt
7 stappen en toont per stap of het geslaagd is:

1. Productimport van leveranciers
2. Synchronisatie naar Shopify
3. Proefbestelling aangemaakt
4. Leverancier automatisch bepaald
5. Bestelling doorgestuurd naar leverancier
6. Track & Trace opgehaald
7. Orderstatus bijgewerkt in Shopify (fulfillment)

Als een stap faalt, zie je precies welke en waarom — handig zodra je de
echte Dreamlove/1on1 Wholesale-koppeling invult en wilt verifiëren dat er
niets in de keten kapot is gegaan.

## De betaalflow apart testen

De E2E-test hierboven test bewust NIET de betaling zelf (dat is een aparte
zorg, zie `api/create-payment.js`). Om de betaalflow te testen zodra je een
Mollie-account hebt: gebruik Mollie's **test-API-sleutel** (niet de live-
sleutel) en hun testkaartgegevens — zie
[Mollie's testdocumentatie](https://docs.mollie.com/docs/testing).

## Belangrijk: zet dit NOOIT aan in productie

Als `TEST_MODE=true` op de live site zou staan, zouden **echte
klantbestellingen met nep-data worden beantwoord** — een klant zou denken
dat zijn bestelling is doorgestuurd naar een leverancier, terwijl dat niet zo
is. Controleer dit altijd via de banner in `/admin` vóór je een deployment
naar Production goedkeurt.
