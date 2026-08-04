# Shopify-producttagging — hoe producten in de juiste categorie verschijnen

De frontend (megamenu's, shop-filters, homepage-favorieten) verwacht dat elk
Shopify-product bepaalde **tags** heeft. Dit is de enige plek waar je iets
hoeft te doen om een Shopify-product goed gecategoriseerd te krijgen — er
hoeft niets in de code te veranderen.

## Verplichte tags

| Tag | Betekenis | Geldige waarden |
|---|---|---|
| `cat:<slug>` | Hoofdcategorie | `voor-haar`, `voor-hem`, `voor-koppels`, `lingerie-bdsm`, `wellness` |
| `sub:<slug>` | Subcategorie | Zie de megamenu's in `index.html` voor de exacte lijst (bv. `rabbit-vibrators`, `zweepjes-en-floggers`) |

Voorbeeld: een product in Shopify met de tags `cat:voor-haar` en
`sub:rabbit-vibrators` verschijnt automatisch onder "Voor Haar → Rabbit
Vibrators" op de site.

## Optionele tags

| Tag | Effect |
|---|---|
| `featured` | Verschijnt in de homepage-favorietensectie |
| `nieuw` | Toont het "Nieuw"-label op de productkaart |
| `sale` | Toont het "Sale"-label (gebruik dit samen met een compare-at-price in Shopify voor de doorgestreepte oude prijs) |
| `bestseller` | Toont het "Bestseller"-label |

## Wat als een tag ontbreekt?

- Geen `cat:`/`sub:`-tag → het product krijgt `overig` als categorie en
  verschijnt niet in een specifiek megamenu-onderdeel (wel gewoon in de
  volledige shop-lijst).
- Geen badge-tag → geen label op de productkaart, dat is prima.

## Waarom tags en niet Shopify-collecties?

Tags zijn eenvoudiger te automatiseren vanuit een leverancier-sync (Dreamlove/
1on1 Wholesale) dan handmatig collecties samenstellen — zodra de leverancier-
adapters echt gekoppeld zijn (`lib/suppliers/dreamlove.js`/`onon1-wholesale.js`),
kan de categorie-mapping daar automatisch worden meegegeven op basis van de
productdata die de leverancier zelf aanlevert.
