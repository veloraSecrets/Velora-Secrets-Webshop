#!/usr/bin/env node
// scripts/generate-catalog.js
//
// Draai dit script om js/products.js en api/_product-prices.json te
// (her)genereren vanuit de actieve catalogus-bron (lib/catalog-source.js).
// Dit is DE stap die "automatisch de echte Shopify-producten tonen zodra
// de backend gereed is" mogelijk maakt: welke bron gebruikt wordt hangt
// alleen af van environment variables (zie catalog-source.js) — dit script
// zelf verandert nooit.
//
// Wanneer draaien:
//   - Handmatig tijdens ontwikkelen: `node scripts/generate-catalog.js`
//   - Automatisch bij elke Vercel-deploy: zet dit als (onderdeel van het)
//     Vercel Build Command, of koppel het aan een Deploy Hook die een
//     Shopify products/update-webhook triggert (zie DEPLOYMENT.md).
//
// BELANGRIJK: dit script overschrijft js/products.js volledig. De bestaande
// helper-functies (veloraFormatPrice/veloraFilterProducts/veloraSearchProducts/
// veloraProductCardHTML) worden ONGEWIJZIGD meegeschreven — de frontend-code
// die deze functies aanroept (main.js, shop.html, etc.) hoeft dus nooit te
// veranderen, alleen de data erboven.

const fs = require('fs');
const path = require('path');
const { getCatalog, getCatalogSourceLabel } = require('../lib/catalog-source');

function extractHeaderFooter() {
  // Leest header/footer LIVE uit index.html (i.p.v. een losse kopie te
  // onderhouden) zodat design-wijzigingen aan de navigatie automatisch
  // doorwerken in de gegenereerde SEO-productpagina's.
  const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
  const headerMatch = indexHtml.match(/(<header class="site-header">[\s\S]*?<\/header>)/);
  const footerMatch = indexHtml.match(/(<footer class="site-footer">[\s\S]*?<\/footer>[\s\S]*?<button class="ai-chat-bubble"[\s\S]*?<\/button>)/);
  if (!headerMatch || !footerMatch) {
    throw new Error('Kon header/footer niet extraheren uit index.html — is de structuur gewijzigd?');
  }
  // Zelfde sanity-check als eerder handmatig toegepast (voorkomt de eerder
  // gevonden bug waarbij een niet-gulzige regex bij het EERSTE </button> stopt).
  if (footerMatch[1].split('<footer').length - 1 !== 1) {
    throw new Error('Footer-extractie leverde onverwacht meerdere <footer>-tags op.');
  }
  return { header: headerMatch[1], footer: footerMatch[1] };
}

function stripHtmlTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function generateSEOProductPages(products) {
  const { header, footer } = extractHeaderFooter();
  const outDir = path.join(__dirname, '..', 'p');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Oude gegenereerde pagina's eerst opruimen, zodat een product dat niet
  // meer in de catalogus zit ook geen verdwaalde SEO-pagina achterlaat.
  fs.readdirSync(outDir).filter(f => f.endsWith('.html')).forEach(f => fs.unlinkSync(path.join(outDir, f)));

  let written = 0;
  products.forEach(p => {
    const handle = p.handle || `product-${p.id}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const plainDescription = p.description ? stripHtmlTags(p.description) : `${p.name} — ${p.brand}, discreet verpakt en snel geleverd bij Velora Secrets.`;
    const metaDescription = plainDescription.slice(0, 155);
    const priceDisplay = 'salePrice' in p && p.salePrice ? p.salePrice : p.price;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      brand: { '@type': 'Brand', name: p.brand },
      description: plainDescription,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: priceDisplay,
        availability: p.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        url: `https://velorasecrets.nl/p/${handle}.html`
      }
    };

    const page = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="../favicon-192.png">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.name} — Velora Secrets</title>
<meta name="description" content="${metaDescription.replace(/"/g, '&quot;')}">
<link rel="canonical" href="https://velorasecrets.nl/p/${handle}.html">
<meta property="og:type" content="product">
<meta property="og:title" content="${p.name} — Velora Secrets">
<meta property="og:description" content="${metaDescription.replace(/"/g, '&quot;')}">
<meta property="og:url" content="https://velorasecrets.nl/p/${handle}.html">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/pages.css">
</head>
<body>
<script src="../js/age-verification.js"></script>
<a href="#main" class="skip-link">Ga direct naar de inhoud</a>
${header.replace(/href="([a-z0-9.\-]+\.html)/gi, 'href="../$1').replace(/src="(css|js)\//g, 'src="../$1/').replace(/href="(css|js)\//g, 'href="../$1/')}
<nav class="breadcrumbs" aria-label="Kruimelpad" id="main">
  <a href="../index.html">Home</a> / <a href="../shop.html">Collectie</a> / <span>${p.name}</span>
</nav>
<div class="product-detail">
  <div>
    <div class="product-gallery-main" aria-hidden="true"></div>
  </div>
  <div>
    <p class="pd-brand">${p.brand}</p>
    <h1 class="pd-title">${p.name}</h1>
    <p class="pd-price">${priceDisplay ? '€ ' + Number(priceDisplay).toFixed(2).replace('.', ',') : ''}</p>
    <p class="pd-desc">${plainDescription}</p>
    <div class="pd-actions">
      <a href="../product.html?id=${encodeURIComponent(p.id)}" class="btn btn-dark">Bekijk &amp; bestel dit product</a>
    </div>
    <div class="pd-trust">
      <span>✓ Discreet verpakt, geen vermelding van de inhoud</span>
      <span>✓ Gratis verzending vanaf €50</span>
      <span>✓ 30 dagen bedenktijd</span>
    </div>
  </div>
</div>
${footer.replace(/href="([a-z0-9.\-]+\.html)/gi, 'href="../$1').replace(/href="(mailto:|tel:)/gi, 'href="$1')}
</body>
</html>
`;
    fs.writeFileSync(path.join(outDir, `${handle}.html`), page, 'utf-8');
    written++;
  });

  return written;
}

// Deze vier helper-functies zijn IDENTIEK aan de handgeschreven versie die
// al in js/products.js stond — bewust hier nogmaals gedefinieerd (als string)
// zodat het gegenereerde bestand zelfstandig leesbaar blijft en niet afhangt
// van een build-time-concat-stap.
const HELPER_FUNCTIONS_SOURCE = `
function veloraFormatPrice(n) {
  return '€ ' + n.toFixed(2).replace('.', ',');
}

function veloraSearchProducts(query) {
  var q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  return VELORA_PRODUCTS.filter(function (p) {
    return p.name.toLowerCase().indexOf(q) !== -1 || p.brand.toLowerCase().indexOf(q) !== -1;
  });
}

function veloraFilterProducts(opts) {
  opts = opts || {};
  return VELORA_PRODUCTS.filter(function (p) {
    if (opts.cat && p.cat !== opts.cat) return false;
    if (opts.sub && p.sub !== opts.sub) return false;
    if (opts.sale && !p.salePrice) return false;
    if (opts.featured && !p.featured) return false;
    return true;
  });
}

function veloraProductCardHTML(p) {
  var tagHTML = '';
  if (p.tag === 'nieuw') tagHTML = '<span class="product-tag tag-new">Nieuw</span>';
  else if (p.tag === 'sale') tagHTML = '<span class="product-tag tag-sale">Sale</span>';
  else if (p.tag === 'bestseller') tagHTML = '<span class="product-tag tag-best">Bestseller</span>';

  var priceHTML = p.salePrice
    ? veloraFormatPrice(p.salePrice) + ' <del>' + veloraFormatPrice(p.price) + '</del>'
    : veloraFormatPrice(p.price);

  var isFav = (typeof veloraIsInWishlist === 'function') && veloraIsInWishlist(p.id);

  return (
    '<div class="product-card" style="position:relative;">' +
      '<a href="product.html?id=' + p.id + '" style="display:block;">' +
        '<div class="product-media">' + tagHTML + '</div>' +
        '<div class="product-info">' +
          '<p class="product-brand">' + p.brand + '</p>' +
          '<p class="product-name">' + p.name + '</p>' +
          '<p class="product-price">' + priceHTML + '</p>' +
        '</div>' +
      '</a>' +
      '<button type="button" class="wishlist-toggle' + (isFav ? ' is-active' : '') + '" data-product-id="' + p.id + '" ' +
        'aria-label="' + (isFav ? 'Verwijder uit verlanglijst' : 'Toevoegen aan verlanglijst') + '" ' +
        'style="position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:15px;color:' + (isFav ? 'var(--accent-orange)' : 'var(--ink)') + ';">' +
        (isFav ? '♥' : '♡') +
      '</button>' +
    '</div>'
  );
}

var VELORA_CAT_LABELS = {
  'voor-haar': 'Voor Haar',
  'voor-hem': 'Voor Hem',
  'voor-koppels': 'Voor Koppels',
  'lingerie-bdsm': 'Lingerie & BDSM',
  'wellness': 'Wellness & Massage'
};
`;

async function main() {
  const products = await getCatalog();
  const sourceLabel = getCatalogSourceLabel();

  // Elk product heeft een JS-veilige ID nodig als er ooit niet-numerieke
  // Shopify gid://-ID's binnenkomen — de bestaande frontend gebruikt id
  // uitsluitend als opaque waarde (in URL's en localStorage-sleutels), dus
  // een string-ID werkt net zo goed als het oude numerieke ID.
  const productLines = products.map(p => {
    const idLiteral = typeof p.id === 'number' ? p.id : `'${String(p.id).replace(/'/g, "\\'")}'`;
    const variantIdLiteral = p.variantId ? `'${String(p.variantId).replace(/'/g, "\\'")}'` : 'null';
    return `  { id: ${idLiteral}, name: ${JSON.stringify(p.name)}, brand: ${JSON.stringify(p.brand)}, ` +
      `price: ${p.price}, salePrice: ${p.salePrice === null || p.salePrice === undefined ? 'null' : p.salePrice}, ` +
      `cat: ${JSON.stringify(p.cat)}, sub: ${JSON.stringify(p.sub)}, tag: ${p.tag ? JSON.stringify(p.tag) : 'null'}, ` +
      `featured: ${!!p.featured}, variantId: ${variantIdLiteral} }`;
  });

  const jsOutput = `/* ============================================
   VELORA SECRETS — PRODUCTCATALOGUS
   ============================================
   AUTOMATISCH GEGENEREERD door scripts/generate-catalog.js — NIET handmatig
   bewerken, wijzigingen gaan verloren bij de volgende generatie.
   Actieve bron op moment van genereren: ${sourceLabel}
   Gegenereerd op: ${new Date().toISOString()}
*/

var VELORA_PRODUCTS = [
${productLines.join(',\n')}
];
${HELPER_FUNCTIONS_SOURCE}`;

  const jsPath = path.join(__dirname, '..', 'js', 'products.js');
  fs.writeFileSync(jsPath, jsOutput, 'utf-8');

  // Server-side prijsdata voor de betaalflow — rechtstreeks uit het
  // in-memory products-array, geen fragiele regex-parsing van js/products.js meer nodig.
  const prices = {};
  products.forEach(p => {
    prices[String(p.id)] = { price: p.price, salePrice: p.salePrice === undefined ? null : p.salePrice };
  });
  const pricesPath = path.join(__dirname, '..', 'api', '_product-prices.json');
  fs.writeFileSync(pricesPath, JSON.stringify(prices, null, 2), 'utf-8');

  console.log(`✓ Catalogus gegenereerd vanuit: ${sourceLabel}`);
  console.log(`✓ ${products.length} producten geschreven naar js/products.js`);
  console.log(`✓ Prijsdata geschreven naar api/_product-prices.json`);

  const pagesWritten = generateSEOProductPages(products);
  console.log(`✓ ${pagesWritten} statische, doorzoekbare productpagina's gegenereerd in /p/`);

  updateSitemapWithProducts(products);
  console.log(`✓ sitemap.xml aangevuld met productpagina's`);

  return { count: products.length, source: sourceLabel, seoPages: pagesWritten };
}

function updateSitemapWithProducts(products) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf-8');

  // Eerder gegenereerde product-URL's verwijderen (herkenbaar aan /p/) vóórdat
  // de actuele lijst wordt toegevoegd — voorkomt duplicaten/verdwaalde entries
  // bij opeenvolgende generaties.
  sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/velorasecrets\.nl\/p\/[\s\S]*?<\/url>/g, '');

  const productUrls = products.map(p => {
    const handle = p.handle || `product-${p.id}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    return `  <url>\n    <loc>https://velorasecrets.nl/p/${handle}.html</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
  }).join('\n');

  sitemap = sitemap.replace('</urlset>', productUrls + '\n</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
}

if (require.main === module) {
  main().catch(err => {
    console.error('✗ Catalogus genereren mislukt:', err.message);
    process.exit(1);
  });
}

module.exports = { generateCatalog: main };
