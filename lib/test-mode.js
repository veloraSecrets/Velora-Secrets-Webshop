// lib/test-mode.js
//
// TESTMODUS: zet TEST_MODE=true in de environment variables om het VOLLEDIGE
// end-to-end-proces te kunnen doorlopen (product-import -> sync -> test-order
// -> leverancier-routering -> Track & Trace -> orderstatus) ZONDER dat er al
// een echte Shopify-winkel, leverancier-koppeling of betaalprovider hoeft te
// bestaan. Dit is bedoeld om vóór livegang het complete proces te verifiëren.
//
// BELANGRIJK: TEST_MODE=true mag NOOIT aanstaan op de productieomgeving in
// Vercel — dat zou betekenen dat echte klantbestellingen met nep-data worden
// beantwoord. Zet dit uitsluitend aan onder de Preview/Development-omgeving
// (zie MIGRATION.md voor hoe Vercel-omgevingen werken). api/admin/status.js
// toont een duidelijke waarschuwingsbanner zolang dit aanstaat, juist om deze
// fout te voorkomen.

function isTestMode() {
  return process.env.TEST_MODE === 'true';
}

// ---------- Mock Shopify-productdata (Storefront API-vorm) ----------
const MOCK_PRODUCTS = [
  {
    id: 'gid://shopify/Product/test-1',
    handle: 'test-product-massageolie',
    title: '[TESTMODUS] Massageolie Lavender',
    descriptionHtml: '<p>Testproduct — niet echt, uitsluitend voor het doorlopen van de testflow.</p>',
    vendor: 'Velora (test)',
    tags: ['testmodus', 'cat:wellness', 'sub:massageolie', 'featured', 'nieuw'],
    featuredImage: { url: null, altText: 'Testproduct' },
    priceRange: { minVariantPrice: { amount: '15.95', currencyCode: 'EUR' } },
    variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/test-1-a', title: 'Default', availableForSale: true, quantityAvailable: 25, price: { amount: '15.95' } } }] }
  },
  {
    id: 'gid://shopify/Product/test-2',
    handle: 'test-product-koppelsvibrator',
    title: '[TESTMODUS] Koppelsvibrator We-Style',
    descriptionHtml: '<p>Testproduct — niet echt, uitsluitend voor het doorlopen van de testflow.</p>',
    vendor: 'Sremony (test)',
    tags: ['testmodus', 'cat:voor-koppels', 'sub:koppelsvibrators', 'featured', 'bestseller'],
    featuredImage: { url: null, altText: 'Testproduct' },
    priceRange: { minVariantPrice: { amount: '89.95', currencyCode: 'EUR' } },
    variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/test-2-a', title: 'Zwart', availableForSale: true, quantityAvailable: 12, price: { amount: '89.95' } } }] }
  }
];

function getMockCatalogForSupplier(supplierName) {
  // Beide testleveranciers krijgen dezelfde soort testdata terug — genoeg om
  // de volledige sync-stap (fetchCatalog -> upsertProduct) te doorlopen.
  return [
    {
      sku: `TEST-${supplierName.replace(/\s+/g, '').toUpperCase()}-001`,
      title: `[TESTMODUS] Testproduct van ${supplierName}`,
      description: 'Automatisch gegenereerd testproduct voor de end-to-end testflow.',
      images: [],
      price: 24.95,
      compareAtPrice: null,
      stock: 40,
      category: 'Test',
      brand: supplierName
    }
  ];
}

function getMockTestOrder() {
  return {
    id: 'test-order-' + Date.now(),
    name: '#TEST-0001',
    line_items: [
      { sku: 'TEST-DREAMLOVE-001', quantity: 1, title: '[TESTMODUS] Testproduct van Dreamlove' }
    ],
    shipping_address: {
      first_name: 'Test', last_name: 'Klant', address1: 'Teststraat 1',
      zip: '1234AB', city: 'Amsterdam', country_code: 'NL'
    },
    total_price: '24.95',
    financial_status: 'paid'
  };
}

module.exports = { isTestMode, MOCK_PRODUCTS, getMockCatalogForSupplier, getMockTestOrder };
