#!/usr/bin/env node
// scripts/import-supplier-products.js
//
// Importeert een leveranciers-productcatalogus (Shopify-CSV-exportformaat —
// dat formaat gebruikt 1on1 Wholesale, ook al draait Velora Secrets zelf
// NIET op Shopify) en zet die om naar het bestaande productformaat.
//
// GEBRUIK (steeds hetzelfde commando, ook bij een nieuwe CSV):
//   node scripts/import-supplier-products.js
//     (leest data/supplier-csv/shopify_products.csv + shopify_stock.csv)
//   node scripts/import-supplier-products.js pad/producten.csv pad/voorraad.csv
//
// Daarna, zoals altijd:
//   node scripts/generate-catalog.js
//
// ELKE RUN: overschrijft lib/supplier-import-products.js VOLLEDIG (voorkomt
// duplicaten vanzelf) EN schrijft een wijzigingslogboek + validatierapport
// naar data/import-logs/.

const fs = require('fs');
const path = require('path');

// ============================================================
// CSV INLEZEN — leverancier levert Windows-1252 (cp1252), NIET UTF-8.
// ============================================================
function parseCsv(filePath) {
  const buffer = fs.readFileSync(filePath);
  const CP1252_EXTRA = {
    0x80:'\u20AC',0x82:'\u201A',0x83:'\u0192',0x84:'\u201E',0x85:'\u2026',
    0x86:'\u2020',0x87:'\u2021',0x88:'\u02C6',0x89:'\u2030',0x8A:'\u0160',
    0x8B:'\u2039',0x8C:'\u0152',0x8E:'\u017D',0x91:'\u2018',0x92:'\u2019',
    0x93:'\u201C',0x94:'\u201D',0x95:'\u2022',0x96:'\u2013',0x97:'\u2014',
    0x98:'\u02DC',0x99:'\u2122',0x9A:'\u0161',0x9B:'\u203A',0x9C:'\u0153',
    0x9E:'\u017E',0x9F:'\u0178'
  };
  // Array + join i.p.v. string += in een lus: bij bestanden van >1MB is dat
  // laatste merkbaar traag in V8 (elke += kan een nieuwe string alloceren).
  // Zelf gemeten: dit bracht het inlezen van datafeed.csv terug van ~2,4s
  // naar <0,1s.
  const chars = new Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const b = buffer[i];
    chars[i] = (b >= 0x80 && b <= 0x9F && CP1252_EXTRA[b]) ? CP1252_EXTRA[b] : String.fromCharCode(b);
  }
  const text = chars.join('');

  const rows = [];
  let row = [];
  let fieldChars = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { fieldChars.push('"'); i++; }
        else { inQuotes = false; }
      } else {
        fieldChars.push(c);
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(fieldChars.join('')); fieldChars = []; }
      else if (c === '\r') { /* genegeerd, \n handelt de regel af */ }
      else if (c === '\n') { row.push(fieldChars.join('')); rows.push(row); row = []; fieldChars = []; }
      else fieldChars.push(c);
    }
  }
  if (fieldChars.length || row.length) { row.push(fieldChars.join('')); rows.push(row); }

  const header = rows[0];
  return rows.slice(1).filter(r => r.length > 1 || r[0]).map(r => {
    const obj = {};
    header.forEach((h, idx) => { obj[h.trim()] = (r[idx] || '').trim(); });
    return obj;
  });
}

// ============================================================
// TYPE -> CATEGORIE/SUBCATEGORIE — bewuste, aanpasbare mapping (geen
// objectieve waarheid, zie IMPORT-GUIDE.md).
// ============================================================
const TYPE_TO_CATEGORY = {
  'Lubricant': { cat: 'wellness', sub: 'glijmiddel' },
  'Butt Plugs': { cat: 'voor-haar', sub: 'anaal-speelgoed' },
  'Anal Beads': { cat: 'voor-haar', sub: 'anaal-speelgoed' },
  'Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Sexual Enhancers': { cat: 'voor-hem', sub: 'overig' },
  'Fun and Games': { cat: 'voor-koppels', sub: 'verrassingspakketten' },
  'Bondage Restraints': { cat: 'lingerie-bdsm', sub: 'handboeien' },
  'Cock Rings': { cat: 'voor-hem', sub: 'penisringen' },
  'Male Masturbators': { cat: 'voor-hem', sub: 'masturbators' },
  'Spanking Paddles and Floggers': { cat: 'lingerie-bdsm', sub: 'zweepjes-en-floggers' },
  'Rabbit Vibrators': { cat: 'voor-haar', sub: 'rabbit-vibrators' },
  'Strap Ons': { cat: 'voor-koppels', sub: 'koppelsvibrators' },
  'Clitoral Vibrators': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Vibrating Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Chastity Cages': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Bullet Vibrators': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Wand Vibrators': { cat: 'voor-haar', sub: 'wand-massagers' },
  'Massage Oils and Candles': { cat: 'voor-koppels', sub: 'massagekaarsen' },
  'G-Spot Vibrators': { cat: 'voor-haar', sub: 'g-spot-vibrators' },
  'Penis Sleeves': { cat: 'voor-hem', sub: 'cock-sleeves' },
  'Bondage Collars': { cat: 'lingerie-bdsm', sub: 'halsband-en-riem' },
  'Double Ended Dildos': { cat: 'voor-haar', sub: 'dubbele-penetratie' },
  'Clit and Nipple Clamps': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Blindfolds': { cat: 'voor-hem', sub: 'blinddoeken' },
  'Prostate Massagers': { cat: 'voor-hem', sub: 'prostaatstimulatoren' },
  'Love Eggs': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Suction Cup Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Gags': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Strap On Dildos': { cat: 'voor-koppels', sub: 'koppelsvibrators' },
  'Large Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Douches and Enemas': { cat: 'wellness', sub: 'overig' },
  'Suction Vibrators': { cat: 'voor-haar', sub: 'luchtdruk-vibrators' },
  'Sex Toy Kits': { cat: 'voor-koppels', sub: 'verrassingspakketten' },
  'Penis Pumps and Enlargers': { cat: 'voor-hem', sub: 'overig' },
  'Glass Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Male Sex Toys': { cat: 'voor-hem', sub: 'overig' },
  'Inflatable Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Pussy Pumps': { cat: 'voor-haar', sub: 'overig' }
};
function mapCategory(type) {
  return TYPE_TO_CATEGORY[type] || { cat: 'overig', sub: 'overig' };
}

function groupProductRows(rows) {
  const byHandle = new Map();
  for (const row of rows) {
    if (!row.Handle) continue;
    if (!byHandle.has(row.Handle)) byHandle.set(row.Handle, []);
    byHandle.get(row.Handle).push(row);
  }
  return byHandle;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(str) {
  if (!str) return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function buildStockMap(stockRows) {
  const map = new Map();
  for (const row of stockRows) {
    if (row.SKU) map.set(row.SKU.trim(), parseInt(row.Quantity, 10) || 0);
  }
  return map;
}

// ============================================================
// NORMALISEREN — MET VOLLEDIGE VARIANT-ONDERSTEUNING
// Elk product krijgt nu een `variants`-array (alle Option1/2/3-combinaties
// met hun eigen SKU/prijs/voorraad), NAAST de bestaande vlakke velden
// (price/salePrice/stock/sku van de EERSTE variant) — dat laatste blijft
// bestaan zodat de rest van de site (die nog 1 variant per product
// verwacht) niets hoeft te veranderen. Dit is dus een TOEVOEGING, geen
// vervanging — bestaande code blijft werken.
// ============================================================
function normalizeProducts(byHandle, stockMap) {
  const products = [];
  let idCounter = 1;

  for (const [handle, variantRows] of byHandle) {
    const main = variantRows.find(r => r.Title) || variantRows[0];
    if (!main.Title) continue;

    const mapping = mapCategory(main.Type);
    const image = variantRows.map(r => r['Image Src']).find(src => src) || null;
    const description = main['SEO Description'] || stripHtml(main['Body (HTML)'] || '');

    const variants = variantRows
      .filter(r => r['Variant SKU'])
      .map(r => {
        const vPrice = parseFloat(r['Variant Price']) || 0;
        const vCompareAt = parseFloat(r['Variant Compare At Price']) || 0;
        const vSku = r['Variant SKU'];
        return {
          sku: vSku,
          optionName: r['Option1 Name'] || null,
          optionValue: r['Option1 Value'] || null,
          price: vCompareAt && vCompareAt > vPrice ? vCompareAt : vPrice,
          salePrice: vCompareAt && vCompareAt > vPrice ? vPrice : null,
          stock: stockMap.has(vSku) ? stockMap.get(vSku) : (parseInt(r['Variant Inventory Qty'], 10) || 0)
        };
      });

    const firstVariant = variants[0] || { sku: null, price: 0, salePrice: null, stock: 0 };

    products.push({
      id: idCounter++,
      handle: handle,
      sku: firstVariant.sku,
      name: main.Title,
      brand: main.Vendor || 'Onbekend merk',
      price: firstVariant.price,
      salePrice: firstVariant.salePrice,
      cat: mapping.cat,
      sub: mapping.sub,
      tag: null,
      featured: false,
      stock: variants.reduce((sum, v) => sum + v.stock, 0),
      description: description,
      image: image,
      variantId: null,
      sourceType: main.Type || null, // bewaard voor het validatierapport (categorieën zonder mapping opsporen)
      variants: variants
    });
  }
  return products;
}

// ============================================================
// VALIDATIE — controleert op precies de 5 gevraagde probleemtypen
// ============================================================
function validateProducts(products) {
  const issues = { missingImages: [], missingSkus: [], duplicateSkus: [], invalidPrices: [], missingCategoryMapping: [] };

  const skuCounts = new Map();
  products.forEach(p => {
    if (!p.image) issues.missingImages.push(p.handle);
    if (!p.sku) issues.missingSkus.push(p.handle);
    if (!p.price || p.price <= 0 || isNaN(p.price)) issues.invalidPrices.push({ handle: p.handle, price: p.price });
    if (p.sourceType && !TYPE_TO_CATEGORY[p.sourceType] && !RANGE_TO_CATEGORY[p.sourceType]) issues.missingCategoryMapping.push(p.sourceType);

    p.variants.forEach(v => {
      if (v.sku) skuCounts.set(v.sku, (skuCounts.get(v.sku) || 0) + 1);
    });
  });
  for (const [sku, count] of skuCounts) {
    if (count > 1) issues.duplicateSkus.push({ sku, count });
  }
  issues.missingCategoryMapping = [...new Set(issues.missingCategoryMapping)];

  return issues;
}

// ============================================================
// WIJZIGINGSLOGBOEK — vergelijkt met de vorige import (indien aanwezig)
// ============================================================
function diffAgainstPrevious(newProducts, previousModulePath) {
  const diff = { newProducts: [], priceChanges: [], stockChanges: [], removedProducts: [] };
  let previous = [];
  try {
    delete require.cache[require.resolve(previousModulePath)];
    previous = require(previousModulePath).SUPPLIER_IMPORT_PRODUCTS || [];
  } catch (e) {
    return diff; // geen vorige import (eerste keer) -> lege diff, geen fout
  }

  const prevByHandle = new Map(previous.map(p => [p.handle, p]));
  const newByHandle = new Map(newProducts.map(p => [p.handle, p]));

  for (const p of newProducts) {
    const prev = prevByHandle.get(p.handle);
    if (!prev) {
      diff.newProducts.push(p.handle);
    } else {
      if (prev.price !== p.price) diff.priceChanges.push({ handle: p.handle, van: prev.price, naar: p.price });
      if (prev.stock !== p.stock) diff.stockChanges.push({ handle: p.handle, van: prev.stock, naar: p.stock });
    }
  }
  for (const prev of previous) {
    if (!newByHandle.has(prev.handle)) diff.removedProducts.push(prev.handle);
  }
  return diff;
}

// ============================================================
// NATIVE 1on1-FEED (datafeed.csv + datafeed-stock.csv) — RIJKER, VOLLEDIGER
// FORMAAT dan de Shopify-CSV-export hierboven (861 vs 624 producten, incl.
// materiaal/afmetingen/barcode/fabrikant/afzonderlijke groothandels- en
// adviesprijs, en een expliciete Discontinued/In Stock/Out Stock-status).
// Dit is 1on1 Wholesale's EIGEN feed, dus GEEN Shopify-formaat — apart
// afgehandeld, dezelfde eind-productvorm als hierboven.
// ============================================================
const RANGE_TO_CATEGORY = {
  'Lubricants': { cat: 'wellness', sub: 'glijmiddel' },
  'Butt Plugs': { cat: 'voor-haar', sub: 'anaal-speelgoed' },
  'Realistic Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Playtime': { cat: 'voor-koppels', sub: 'verrassingspakketten' },
  'Fetish': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Restraints': { cat: 'lingerie-bdsm', sub: 'handboeien' },
  'Rabbit Vibrators': { cat: 'voor-haar', sub: 'rabbit-vibrators' },
  'Sleeves & Rings': { cat: 'voor-hem', sub: 'cock-sleeves' },
  'Fun Vibrators': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Clit Teasers': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Eggs & Rings': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Gifts': { cat: 'voor-koppels', sub: 'verrassingspakketten' },
  'Delay Products': { cat: 'voor-hem', sub: 'overig' },
  'Whips': { cat: 'lingerie-bdsm', sub: 'zweepjes-en-floggers' },
  'Masturbators': { cat: 'voor-hem', sub: 'masturbators' },
  'Cock Rings and Cages': { cat: 'voor-hem', sub: 'penisringen' },
  'Enhancers for Him': { cat: 'voor-hem', sub: 'overig' },
  'Bodystockings': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Hygiene': { cat: 'wellness', sub: 'overig' },
  'Realistic Vaginas': { cat: 'voor-hem', sub: 'masturbators' },
  'Anal Sundries': { cat: 'voor-haar', sub: 'anaal-speelgoed' },
  'Realistic': { cat: 'voor-haar', sub: 'dildos' },
  'Nipple Play': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Jewelled Butt Plugs': { cat: 'voor-haar', sub: 'anaal-speelgoed' },
  'Bullets and Eggs': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Anal Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'G Spot': { cat: 'voor-haar', sub: 'g-spot-vibrators' },
  'Enhancers for Her': { cat: 'voor-haar', sub: 'overig' },
  'Penis Pumps': { cat: 'voor-hem', sub: 'overig' },
  'Games': { cat: 'voor-koppels', sub: 'verrassingspakketten' },
  'Sleeves and Rings': { cat: 'voor-hem', sub: 'cock-sleeves' },
  'Romance': { cat: 'voor-koppels', sub: 'massagekaarsen' },
  'Fantasy Dildos': { cat: 'voor-haar', sub: 'dildos' },
  'Bondage Hoods': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Anal Vibrators': { cat: 'voor-haar', sub: 'anaal-speelgoed' },
  'Waterproof Vibrators': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Remote Control': { cat: 'voor-koppels', sub: 'koppelsvibrators' },
  'Classic Vibrators': { cat: 'voor-haar', sub: 'bullet-vibrators' },
  'Massage': { cat: 'voor-koppels', sub: 'massagekaarsen' },
  'Nipple Clamps': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Creams and Sprays': { cat: 'voor-hem', sub: 'overig' },
  'Aphrodisiacs': { cat: 'wellness', sub: 'overig' },
  'Plus Size': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Teddies and Bodies': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Hosiery': { cat: 'lingerie-bdsm', sub: 'overig' },
  'Lingerie Sets': { cat: 'lingerie-bdsm', sub: 'overig' }
};
// Catalogue-veld geeft een tweede, vaak doelgroep-achtige laag — wint van
// Range zodra die er een duidelijkere doelgroep-signaal aan geeft.
const CATALOGUE_TO_CAT_OVERRIDE = {
  'Toys For Him': 'voor-hem',
  'Toys For Her': 'voor-haar',
  'Couples': 'voor-koppels',
  'Sexy Lingerie': 'lingerie-bdsm',
  'Bondage': 'lingerie-bdsm'
};
function mapNativeCategory(range, catalogue) {
  const base = RANGE_TO_CATEGORY[range] || { cat: 'overig', sub: 'overig' };
  const override = CATALOGUE_TO_CAT_OVERRIDE[catalogue];
  return override ? { cat: override, sub: base.sub } : base;
}

function buildNativeStockMap(stockRows) {
  const map = new Map();
  for (const row of stockRows) {
    if (row.SKU) map.set(row.SKU.trim(), { stock: parseInt(row.StockLevel, 10) || 0, status: row.Stock, price: parseFloat(row.Price) || null });
  }
  return map;
}

function normalizeNativeFeedProducts(rows, stockMap) {
  const products = [];
  let idCounter = 1;
  for (const row of rows) {
    if (!row['Unique ID'] || !row['Product Name']) continue;
    // Discontinued producten NIET in de levende catalogus tonen (leverancier
    // levert ze niet meer) — wél meegeteld in het validatie-/logboek hieronder.
    if (row.Stock === 'Discontinued') continue;

    const sku = row['Unique ID'];
    const stockInfo = stockMap.get(sku);
    const wholesale = parseFloat(row['Trade Price']) || 0;
    const rrp = parseFloat(row['RRP']) || 0;
    const price = stockInfo && stockInfo.price !== null ? stockInfo.price : (rrp || wholesale);
    const stock = stockInfo ? stockInfo.stock : (parseInt(row['StockLevel'], 10) || 0);
    const range = decodeHtmlEntities(row['Range']);
    const catalogue = decodeHtmlEntities(row['Catalogue']);
    const mapping = mapNativeCategory(range, catalogue);
    const name = decodeHtmlEntities(row['Product Name']);
    // SKU-deel krijgt nu dezelfde opschoning als het naamdeel altijd al kreeg
    // — eerder bleef een spatie in de SKU (bv. "N12946 NS8103") onopgeschoond
    // in de handle staan. Verder structureel exact hetzelfde als voorheen
    // (zelfde plek waar de 60-tekens-limiet wordt toegepast), zodat alleen
    // deze 27 betrokken producten van handle veranderen.
    const skuSlug = sku.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const handle = skuSlug + '-' + name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

    products.push({
      id: idCounter++,
      handle: handle,
      sku: sku,
      name: name,
      brand: decodeHtmlEntities(row['Manufacturer']) || 'Onbekend merk',
      price: price,
      salePrice: null,
      cat: mapping.cat,
      sub: mapping.sub,
      tag: null,
      featured: false,
      stock: stock,
      description: decodeHtmlEntities(row['Description']) || '',
      image: row['Hi-Res URL'] || row['ViewImageURL'] || row['ThumbImageURL'] || null,
      variantId: null,
      sourceType: range || null,
      // Stap 3 (implementatieplan): catalogue/range persistent vastleggen
      // voor de nieuwe filters — stonden voorheen nergens verder dan
      // sourceType (alleen tijdelijk, tijdens de import zelf, gebruikt).
      catalogue: catalogue || null,
      range: range || null,
      variants: [{ sku: sku, optionName: null, optionValue: null, price: price, salePrice: null, stock: stock }],
      // Puur additieve specificatievelden (Stap 1/2 van het goedgekeurde
      // implementatieplan) — bewust null bij lege brondata, NOOIT een lege
      // string of placeholdertekst, zodat de frontend het veld correct kan
      // overslaan i.p.v. iets leegs te tonen.
      barcode: row['Barcode'] ? row['Barcode'].trim() : null,
      materials: row['materials'] ? decodeHtmlEntities(row['materials']).trim() : null,
      sizeImperial: row['Size (imp)'] ? decodeHtmlEntities(row['Size (imp)']).trim() : null,
      sizeMetric: row['Size (met)'] ? decodeHtmlEntities(row['Size (met)']).trim() : null,
      weight: row['wieght'] ? parseFloat(row['wieght']) || null : null,
      power: row['Power'] ? decodeHtmlEntities(row['Power']).trim() : null,
      mpn: row['MPN'] ? row['MPN'].trim() : null
    });
  }
  return products;
}

function importFromNativeFeed(datafeedCsvPath, stockCsvPath) {
  const startTime = Date.now();
  const rows = parseCsv(datafeedCsvPath);
  const stockRows = parseCsv(stockCsvPath);
  const stockMap = buildNativeStockMap(stockRows);
  const discontinuedCount = rows.filter(r => r.Stock === 'Discontinued').length;
  const products = normalizeNativeFeedProducts(rows, stockMap);

  const outputPath = path.join(__dirname, '..', 'lib', 'supplier-import-products.js');
  const validation = validateProducts(products);
  const changeDiff = diffAgainstPrevious(products, outputPath);
  writeProductsModule(products, outputPath, path.basename(datafeedCsvPath), path.basename(stockCsvPath));
  const logPath = writeImportLog(products, validation, changeDiff, Date.now() - startTime, datafeedCsvPath, stockCsvPath, discontinuedCount);

  return { count: products.length, outputPath, logPath, validation, changeDiff, discontinuedCount, durationMs: Date.now() - startTime };
}

function writeProductsModule(products, outputPath, sourceLabel1, sourceLabel2) {
  const productLines = products.map(p => {
    const variantsLiteral = JSON.stringify(p.variants);
    const strOrNull = (v) => (v === undefined || v === null || v === '') ? 'null' : JSON.stringify(v);
    const numOrNull = (v) => (v === undefined || v === null || isNaN(v)) ? 'null' : v;
    return `  { id: ${p.id}, handle: ${JSON.stringify(p.handle)}, sku: ${JSON.stringify(p.sku)}, name: ${JSON.stringify(p.name)}, brand: ${JSON.stringify(p.brand)}, ` +
      `price: ${p.price}, salePrice: ${p.salePrice === null ? 'null' : p.salePrice}, cat: ${JSON.stringify(p.cat)}, sub: ${JSON.stringify(p.sub)}, ` +
      `tag: ${p.tag ? JSON.stringify(p.tag) : 'null'}, featured: ${p.featured}, stock: ${p.stock}, ` +
      `description: ${JSON.stringify(p.description)}, image: ${p.image ? JSON.stringify(p.image) : 'null'}, variantId: null, ` +
      `variants: ${variantsLiteral}, ` +
      `barcode: ${strOrNull(p.barcode)}, materials: ${strOrNull(p.materials)}, sizeImperial: ${strOrNull(p.sizeImperial)}, ` +
      `sizeMetric: ${strOrNull(p.sizeMetric)}, weight: ${numOrNull(p.weight)}, power: ${strOrNull(p.power)}, mpn: ${strOrNull(p.mpn)}, ` +
      `catalogue: ${strOrNull(p.catalogue)}, range: ${strOrNull(p.range)} }`;
  });

  const output = `// lib/supplier-import-products.js
//
// AUTOMATISCH GEGENEREERD door scripts/import-supplier-products.js — NIET
// handmatig bewerken, wijzigingen gaan verloren bij de volgende import.
// Bron: ${sourceLabel1} + ${sourceLabel2}
// Geïmporteerd op: ${new Date().toISOString()}
// Aantal producten: ${products.length}

var SUPPLIER_IMPORT_PRODUCTS = [
${productLines.join(',\n')}
];

module.exports = { SUPPLIER_IMPORT_PRODUCTS };
`;
  fs.writeFileSync(outputPath, output, 'utf-8');
}

function writeImportLog(products, validation, changeDiff, durationMs, sourcePath1, sourcePath2, discontinuedCount) {
  const logDir = path.join(__dirname, '..', 'data', 'import-logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logPath = path.join(logDir, `import-${timestamp}.md`);

  const logContent = `# Import-logboek — ${new Date().toISOString()}

## Samenvatting
- Producten verwerkt (levend, niet-discontinued): ${products.length}
- Duur: ${durationMs}ms
- Bron: ${path.basename(sourcePath1)} + ${path.basename(sourcePath2)}${discontinuedCount ? `\n- Discontinued producten overgeslagen (niet in de catalogus): ${discontinuedCount}` : ''}

## Wijzigingen t.o.v. vorige import
- Nieuwe producten: ${changeDiff.newProducts.length}${changeDiff.newProducts.length ? '\n  - ' + changeDiff.newProducts.slice(0, 30).join('\n  - ') : ''}${changeDiff.newProducts.length > 30 ? `\n  - ...en ${changeDiff.newProducts.length - 30} meer` : ''}
- Prijswijzigingen: ${changeDiff.priceChanges.length}${changeDiff.priceChanges.length ? '\n  - ' + changeDiff.priceChanges.slice(0, 30).map(c => `${c.handle}: €${c.van} -> €${c.naar}`).join('\n  - ') : ''}
- Voorraadwijzigingen: ${changeDiff.stockChanges.length}${changeDiff.stockChanges.length ? '\n  - ' + changeDiff.stockChanges.slice(0, 30).map(c => `${c.handle}: ${c.van} -> ${c.naar}`).join('\n  - ') : ''}
- Verwijderde producten: ${changeDiff.removedProducts.length}${changeDiff.removedProducts.length ? '\n  - ' + changeDiff.removedProducts.join('\n  - ') : ''}

## Validatierapport
- Producten zonder afbeelding: ${validation.missingImages.length}
- Producten zonder SKU: ${validation.missingSkus.length}
- Dubbele SKU's: ${validation.duplicateSkus.length}${validation.duplicateSkus.length ? '\n  - ' + validation.duplicateSkus.map(d => `${d.sku} (${d.count}x)`).join('\n  - ') : ''}
- Ongeldige prijzen (<=0): ${validation.invalidPrices.length}${validation.invalidPrices.length ? '\n  - ' + validation.invalidPrices.map(p => `${p.handle}: €${p.price}`).join('\n  - ') : ''}
- Producttypes zonder categorie-mapping (vielen terug op "overig"): ${validation.missingCategoryMapping.length}${validation.missingCategoryMapping.length ? '\n  - ' + validation.missingCategoryMapping.join('\n  - ') : ''}
`;
  fs.writeFileSync(logPath, logContent, 'utf-8');
  return logPath;
}

function importSupplierProducts(productsCsvPath, stockCsvPath) {
  const startTime = Date.now();

  const productRows = parseCsv(productsCsvPath);
  const stockRows = parseCsv(stockCsvPath);
  const byHandle = groupProductRows(productRows);
  const stockMap = buildStockMap(stockRows);
  const products = normalizeProducts(byHandle, stockMap);

  const outputPath = path.join(__dirname, '..', 'lib', 'supplier-import-products.js');
  const validation = validateProducts(products);
  const changeDiff = diffAgainstPrevious(products, outputPath);
  writeProductsModule(products, outputPath, path.basename(productsCsvPath), path.basename(stockCsvPath));
  const logPath = writeImportLog(products, validation, changeDiff, Date.now() - startTime, productsCsvPath, stockCsvPath);

  return { count: products.length, outputPath, logPath, validation, changeDiff, durationMs: Date.now() - startTime };
}

if (require.main === module) {
  const nativeFeedPath = path.join(__dirname, '..', 'data', 'supplier-feed', 'datafeed.csv');
  const nativeStockPath = path.join(__dirname, '..', 'data', 'supplier-feed', 'datafeed-stock.csv');
  const shopifyDefaultProducts = path.join(__dirname, '..', 'data', 'supplier-csv', 'shopify_products.csv');
  const shopifyDefaultStock = path.join(__dirname, '..', 'data', 'supplier-csv', 'shopify_stock.csv');

  let result;
  if (!process.argv[2] && fs.existsSync(nativeFeedPath) && fs.existsSync(nativeStockPath)) {
    // Geen expliciet pad meegegeven EN de rijkere, native 1on1-feed is aanwezig
    // -> die heeft voorrang (zie IMPORT-GUIDE.md voor de onderbouwing).
    console.log('Native 1on1-feed gevonden, gebruikt als primaire bron:', nativeFeedPath);
    result = importFromNativeFeed(nativeFeedPath, nativeStockPath);
  } else {
    const productsCsvPath = process.argv[2] || shopifyDefaultProducts;
    const stockCsvPath = process.argv[3] || shopifyDefaultStock;
    console.log('Importeren van:', productsCsvPath);
    console.log('Voorraad van:', stockCsvPath);
    result = importSupplierProducts(productsCsvPath, stockCsvPath);
  }

  console.log(`✓ ${result.count} producten geïmporteerd in ${result.durationMs}ms -> ${result.outputPath}`);
  console.log(`✓ Logboek: ${result.logPath}`);
  console.log(`✓ Nieuw: ${result.changeDiff.newProducts.length} | Prijswijzigingen: ${result.changeDiff.priceChanges.length} | Voorraadwijzigingen: ${result.changeDiff.stockChanges.length} | Verwijderd: ${result.changeDiff.removedProducts.length}`);
  console.log(`✓ Validatie: ${result.validation.missingImages.length} zonder afbeelding, ${result.validation.duplicateSkus.length} dubbele SKU's, ${result.validation.invalidPrices.length} ongeldige prijzen`);
  console.log('✓ Draai nu: node scripts/generate-catalog.js  (om de website bij te werken)');
}

module.exports = { importSupplierProducts, importFromNativeFeed, parseCsv, mapCategory, TYPE_TO_CATEGORY, mapNativeCategory, RANGE_TO_CATEGORY, validateProducts, diffAgainstPrevious };
