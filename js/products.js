/* ============================================
   VELORA SECRETS — PRODUCTCATALOGUS
   ============================================
   AUTOMATISCH GEGENEREERD door scripts/generate-catalog.js — NIET handmatig
   bewerken, wijzigingen gaan verloren bij de volgende generatie.
   Actieve bron op moment van genereren: Geen Shopify geconfigureerd — catalogus is leeg totdat SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN zijn ingesteld.
   Gegenereerd op: 2026-08-08T08:58:31.847Z
*/

var VELORA_PRODUCTS = [

];

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

// Power-tekst uit de leveranciersfeed is rommelig (42+ net-verschillende
// schrijfwijzen, bv. "None Required" vs "None required" vs "USB Rechargeable
// Battery"). Voor een bruikbaar filter groeperen we naar 3 nette categorieën
// i.p.v. elke rauwe variant apart te tonen.
function veloraPowerBucket(power) {
  if (!power) return null;
  var p = power.toLowerCase();
  if (p.indexOf('none') !== -1) return 'geen';
  if (p.indexOf('usb') !== -1 || p.indexOf('rechargeab') !== -1 || p.indexOf('magnetic') !== -1) return 'oplaadbaar';
  if (p.indexOf('batter') !== -1 || /ds*xs*(aa|aaa|lr44)/i.test(power)) return 'batterijen';
  return null; // te onduidelijk om betrouwbaar in te delen -> geen filterwaarde
}

// Gewicht is wél een schoon getal (kg) — bucketten in 3 zinvolle bereiken.
function veloraWeightBucket(weight) {
  if (!weight) return null;
  if (weight < 0.1) return 'licht';
  if (weight < 0.3) return 'middel';
  return 'zwaar';
}

function veloraFilterProducts(opts) {
  opts = opts || {};
  return VELORA_PRODUCTS.filter(function (p) {
    if (opts.cat && p.cat !== opts.cat) return false;
    if (opts.sub && p.sub !== opts.sub) return false;
    if (opts.sale && !p.salePrice) return false;
    if (opts.featured && !p.featured) return false;
    if (opts.brand && p.brand !== opts.brand) return false;
    if (opts.catalogue && p.catalogue !== opts.catalogue) return false;
    if (opts.range && p.range !== opts.range) return false;
    if (opts.materials && (!p.materials || p.materials.toLowerCase() !== opts.materials.toLowerCase())) return false;
    if (opts.powerBucket && veloraPowerBucket(p.power) !== opts.powerBucket) return false;
    if (opts.weightBucket && veloraWeightBucket(p.weight) !== opts.weightBucket) return false;
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

  var mediaHTML = p.image
    ? '<img src="' + p.image + '" alt="' + p.name.replace(/"/g, '&quot;') + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;">'
    : '';

  return (
    '<div class="product-card" style="position:relative;">' +
      '<a href="product.html?id=' + p.id + '" style="display:block;">' +
        '<div class="product-media">' + mediaHTML + tagHTML + '</div>' +
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
