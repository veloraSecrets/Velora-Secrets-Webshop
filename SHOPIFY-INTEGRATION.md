# Shopify-koppeling — migratieplan

Dit vervangt de eerdere 1on1Wholesale/Vercel KV-scaffolding (verwijderd op
jouw verzoek). Shopify wordt de backend voor producten, voorraad,
bestellingen én betalingen. Je eigen Vercel-site, het design en de URL's
blijven ongewijzigd.

## Wat is al klaar

- **`api/shopify.js`**: echte, functioneel geteste GraphQL-queries tegen
  Shopify's Storefront API — `getShopifyProducts()` (producten + voorraad
  ophalen) en `createShopifyCart()` (winkelwagen aanmaken, geeft een
  `checkoutUrl` naar Shopify's eigen hosted checkout terug). Anders dan bij
  1on1Wholesale is dit een publiek, stabiel schema — de queries zijn
  correct, alleen jouw eigen inloggegevens ontbreken nog.
- **`.env.example`** bijgewerkt met `SHOPIFY_STORE_DOMAIN`,
  `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_API_VERSION`.

## Stap 1 — Shopify-instellingen (jouw kant)

1. Shopify-admin → **Sales channels** → zoek en voeg **Headless** toe.
2. **Add storefront** → geef een naam.
3. **Storefront API permissions** → **Edit** → zet aan: productlezen en
   winkelwagen/checkout-rechten.
4. Noteer het gegenereerde **access token**, je **shop-domein**
   (`jouwwinkel.myshopify.com`) en de API-versie.
5. Zet deze drie in Vercel (Project → Settings → Environment Variables).

## Stap 2 — Producten zichtbaar maken op de site (nog te bouwen)

Dezelfde architectuurkanttekening als eerder: de site laadt producten nu
nog synchroon uit het statische `products.js`. Om Shopify-producten
zichtbaar te maken is een nieuw `/api/products`-endpoint nodig (roept
`getShopifyProducts()` aan) plus een aanpassing van hoe de frontend
producten laadt (async in plaats van synchroon uit een bestand). Dit raakt
bijna elke pagina — een gerichte vervolgstap, bewust niet blind meegenomen.

## Stap 3 — Checkout omzetten naar Shopify (nog te bouwen)

`checkout-page.js` roept nu `/api/create-payment` (Mollie) aan. Voor
Shopify wordt dit: winkelwagen-items omzetten naar Shopify-`variantId`'s →
`createShopifyCart()` aanroepen → doorsturen naar de teruggekomen
`checkoutUrl` (Shopify's eigen hosted checkout, incl. betaling). Dit
vervangt `api/create-payment.js`/`api/webhook.js` se rol geleidelijk.

## Wat expliciet is verwijderd

`api/supplier/` (volledig), `SUPPLIER-INTEGRATION.md`, de Vercel Cron voor
`sync-stock`, en de order-forwarding-hook in `api/webhook.js`. De
kortingscode-/nieuwsbrief-functionaliteit (Vercel KV) blijft ongewijzigd —
die staat los van de leverancierskoppeling.

## Volgende stap

Zodra je de drie Shopify-omgevingsvariabelen hebt ingesteld, kan Stap 2
(producten tonen) gericht opgepakt worden.
