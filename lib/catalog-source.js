// lib/catalog-source.js
//
// DIT BESTAND is de kern van "automatisch overschakelen zonder de frontend
// aan te passen". scripts/generate-catalog.js roept UITSLUITEND getCatalog()
// hieronder aan — nooit rechtstreeks Shopify. Welke bron daadwerkelijk
// gebruikt wordt, hangt af van de environment variables:
//
//   1. TEST_MODE=true                              -> Shopify Storefront API in testmodus (mock-data, zie lib/test-mode.js)
//   2. SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN gezet -> ECHTE Shopify-producten
//   3. Niets van het bovenstaande                   -> lege catalogus (0 producten, geen placeholder-/nepdata)
//
// Zodra je dus de echte Shopify-tokens instelt (zie MIGRATION.md), hoeft er
// GEEN regel code in de frontend (shop.html/product.html/js/main.js/etc.) te
// veranderen — je draait alleen opnieuw `node scripts/generate-catalog.js`
// (of dit gebeurt automatisch, zie vercel.json build-hook), en de website
// toont automatisch de echte producten uit Shopify.
//
// SHOPIFY-PRODUCT-TAGGING-CONVENTIE (zie ook SHOPIFY-CATALOG-MAPPING.md):
// Om een Shopify-product correct in de bestaande categorie-structuur te
// laten verschijnen, geef je het in Shopify de volgende tags mee:
//   cat:voor-haar          (verplicht — één van: voor-haar/voor-hem/voor-koppels/lingerie-bdsm/wellness)
//   sub:rabbit-vibrators   (verplicht — de subcategorie-slug, zie shop.html-megamenu's)
//   featured               (optioneel — verschijnt dan in de homepage-favorieten)
//   nieuw / sale / bestseller (optioneel — één badge-tag)

const { fetchProducts } = require('./shopify/storefront-client');
const { isTestMode } = require('./test-mode');

function isShopifyConfigured() {
  return !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN);
}

// Zet Shopify's Storefront API-productvorm om naar de bestaande, eenvoudige
// vorm die de frontend al kent (id/name/brand/price/salePrice/cat/sub/tag/featured).
function normalizeShopifyProduct(node, index) {
  const tags = node.tags || [];
  const catTag = tags.find(t => t.startsWith('cat:'));
  const subTag = tags.find(t => t.startsWith('sub:'));
  const badgeTag = tags.find(t => ['nieuw', 'sale', 'bestseller'].includes(t));
  const variant = node.variants && node.variants.edges[0] && node.variants.edges[0].node;
  const price = variant ? parseFloat(variant.price.amount) : parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAt = node.compareAtPriceRange && parseFloat(node.compareAtPriceRange.minVariantPrice.amount);

  return {
    id: node.id, // Shopify's eigen gid:// -ID — uniek en stabiel, hoeft niet numeriek te zijn
    handle: node.handle,
    name: node.title,
    brand: node.vendor || 'Onbekend merk',
    price: compareAt && compareAt > price ? compareAt : price,
    salePrice: compareAt && compareAt > price ? price : null,
    cat: catTag ? catTag.replace('cat:', '') : 'overig',
    sub: subTag ? subTag.replace('sub:', '') : 'overig',
    tag: badgeTag || null,
    featured: tags.includes('featured'),
    stock: variant ? variant.quantityAvailable : null,
    description: node.descriptionHtml || '',
    // variantId is verplicht voor "In winkelwagen" (Shopify's Cart API werkt op
    // variant-niveau, niet op product-niveau). Bewuste beperking: dit pakt
    // altijd de EERSTE/standaard-variant — echte kleur-/maatkeuze die naar een
    // andere Shopify-variant-ID mapt is nog niet gebouwd.
    variantId: variant ? variant.id : null
  };
}

async function getCatalog() {
  if (isTestMode() || isShopifyConfigured()) {
    const result = await fetchProducts({ first: 250 });
    return result.edges.map((edge, i) => normalizeShopifyProduct(edge.node, i));
  }
  // Nog geen Shopify geconfigureerd -> lege catalogus. Bewust GEEN
  // placeholder-/nepdata meer: deze productieversie draait uitsluitend op
  // echte Shopify-producten, zodra die gekoppeld zijn.
  return [];
}

function getCatalogSourceLabel() {
  if (isTestMode()) return 'Shopify (testmodus — mock-data)';
  if (isShopifyConfigured()) return 'Shopify (echte productiewinkel: ' + process.env.SHOPIFY_STORE_DOMAIN + ')';
  return 'Geen Shopify geconfigureerd — catalogus is leeg totdat SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN zijn ingesteld.';
}

module.exports = { getCatalog, getCatalogSourceLabel, isShopifyConfigured };
