# Leveranciers-CSV importeren — handleiding

## Twee ondersteunde bronnen

**1. Native 1on1-feed (aanbevolen, rijker)**: `data/supplier-feed/datafeed.csv` +
`data/supplier-feed/datafeed-stock.csv`. Wordt automatisch gebruikt zodra
beide bestanden bestaan — geen apart commando nodig:
```
node scripts/import-supplier-products.js
```
**2. Shopify-CSV-exportformaat (fallback)**: `data/supplier-csv/shopify_products.csv`
+ `shopify_stock.csv`. Wordt alleen gebruikt als de native feed hierboven
ontbreekt, of expliciet:
```
node scripts/import-supplier-products.js pad/producten.csv pad/voorraad.csv
```

Na elke import, zoals altijd:
```
node scripts/generate-catalog.js
```

## Over de 5 aangeleverde bestanden (7 augustus) — wat wél/niet gebruikt is

| Bestand | Gebruikt? | Waarom |
|---|---|---|
| `datafeed.csv` | ✅ Ja, als primaire bron | Rijkste, meest volledige feed (861 producten, incl. materiaal/afmetingen/barcode/fabrikant, aparte groothandels- en adviesprijs) |
| `datafeed__1_.csv` (→ `datafeed-stock.csv`) | ✅ Ja, als voorraad/prijs-companion | Lichte, snelle voorraad+prijs-only feed — exact hetzelfde principe als de bestaande sync-architectuur (`lib/suppliers/adapter-interface.js`'s `fetchStockLevels`) |
| `datafeed.xml` | ❌ Nee, bewust overgeslagen | **Dit is de duplicaat waar je op doelde** — bevat exact dezelfde 861 producten als `datafeed.csv`, alleen in XML in plaats van CSV. Zelfde data, andere vorm. |
| `shopify_products.csv` (bijgewerkte versie) | ❌ Nee, vervangen | `datafeed.csv` is rijker en vervangt deze rol. Blijft wel als fallback-pad werken (zie hierboven) mocht je 'm ooit weer nodig hebben. |
| `allimages.zip` (125MB, 3804 bestanden) | ❌ Nee, bewust niet geïmporteerd | Zelfde afbeeldingen die al via URL in `datafeed.csv` beschikbaar zijn (bewezen werkend). 723 van de 1052 producten in de ZIP hebben zelfs geen match in enige productfeed — zou dus deels nutteloos zijn. 125MB lokaal opslaan zou de git-repo/Vercel-deployment fors laten groeien zonder concreet voordeel t.o.v. de al-werkende externe URL's. |

## Discontinued producten

`datafeed.csv` bevat een expliciete `Stock`-status. Producten met status
`Discontinued` (221 van de 861) worden **niet** in de catalogus opgenomen —
ze staan wel meegeteld in het logboek.

## Wat het logboek en validatierapport tonen

Elke import schrijft een `.md`-bestand naar `data/import-logs/` met nieuwe/
gewijzigde/verwijderde producten en: ontbrekende afbeeldingen, ontbrekende
SKU's, dubbele SKU's, ongeldige prijzen (≤0), en categorieën zonder mapping.

## Varianten

Elk product heeft een `variants`-array (per Option1-waarde bij de Shopify-
bron; native-feedproducten hebben momenteel 1 variant per SKU-rij). De rest
van de site gebruikt de eerste/gesommeerde waarden — een echte kleur-/
maatkeuze-UI is een mogelijk vervolgpunt.

## Automatische synchronisatie (productfeed/voorraadfeed/orderfeed-API)

De infrastructuur bestaat al: `lib/suppliers/onon1-wholesale.js` volgt het
bestaande adapter-patroon. Nodig om dit daadwerkelijk te bouwen: de
feed-URL('s), authenticatiemethode, en dataformaat — nu je een écht
voorbeeld van het CSV/XML-formaat hebt aangeleverd, is de kans groot dat
deze feeds ook via een stabiele URL op te halen zijn (de XML bevat zelfs een
`<timestamp>`/`<version>`-element, wat duidt op een live-gegenereerde feed)
— vraag na of er een directe feed-URL bestaat, dan kan dit ingevuld worden.

## Categorie-mapping aanpassen

Twee tabellen, beide bovenin `scripts/import-supplier-products.js`:
`TYPE_TO_CATEGORY` (voor de Shopify-bron) en `RANGE_TO_CATEGORY` +
`CATALOGUE_TO_CAT_OVERRIDE` (voor de native feed). Pas gerust aan.

## Bekende datakwesties in de huidige feeds (van de leverancier, niet oplosbaar door de importer)

- 7 producten hebben een lege/€0-prijs in de bron-feed.
- 6 producten (geurvarianten van 2 massageolie-producten) delen de
  afbeelding van hun hoofdproduct — geen eigen foto in de feed.
- 45 producten hebben geen `Range`-waarde ingevuld (komen in de
  restcategorie "overig" terecht) — waard om na te vragen.
- (Uit de vorige ronde, nu verklaard) SKU N8481 leek eerder "spoorloos" —
  bleek gewoon `Discontinued` te zijn in deze rijkere feed.


