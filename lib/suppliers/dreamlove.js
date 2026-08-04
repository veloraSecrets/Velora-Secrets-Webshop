// lib/suppliers/dreamlove.js
//
// TEMPLATE — nog GEEN echte koppeling. Ik ken Dreamlove's daadwerkelijke API-
// of feed-specificatie niet (die heb ik nooit gekregen/gezien), dus deze
// adapter gooit bewust een duidelijke fout in plaats van te doen alsof hij
// werkt. Vul de TODO's in zodra je hun documentatie hebt — de vorm (welke
// functies, welke return-waarden) hoeft dan niet te veranderen, alleen de
// inhoud van elke functie.

const { SupplierNotConfiguredError } = require('./adapter-interface');
const { isTestMode, getMockCatalogForSupplier } = require('../test-mode');

const SUPPLIER_NAME = 'Dreamlove';

async function fetchCatalog() {
  if (isTestMode()) return getMockCatalogForSupplier(SUPPLIER_NAME);
  // TODO zodra bekend: REST/GraphQL-aanroep of CSV/FTP-feed uitlezen.
  // Verwacht formaat per product (zie adapter-interface.js):
  //   { sku, title, description, images, price, compareAtPrice, stock, category, brand }
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

async function fetchStockLevels(skus) {
  if (isTestMode()) return new Map(skus.map(sku => [sku, 40]));
  // TODO: lichte aanroep voor alleen voorraad, vaker te draaien dan fetchCatalog().
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

function canFulfill(order) {
  if (isTestMode()) {
    return (order.line_items || []).some(li => String(li.sku || '').startsWith('TEST-DREAMLOVE-'));
  }
  // TODO: bepaal op basis van SKU-prefix of een mapping-tabel of Dreamlove
  // deze order moet uitvoeren. Placeholder retourneert altijd false zodat
  // er nooit per ongeluk een order naar een niet-geconfigureerde leverancier gaat.
  return false;
}

async function submitOrder(order) {
  if (isTestMode()) {
    return { supplierOrderId: 'DREAMLOVE-TEST-' + Date.now(), estimatedShipDate: new Date(Date.now() + 86400000).toISOString() };
  }
  // TODO: bestelling indienen bij Dreamlove zodra hun order-API/formaat bekend is.
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

async function fetchTracking(supplierOrderId) {
  if (isTestMode()) {
    return { trackingNumber: 'TEST123456789NL', trackingUrl: 'https://example.com/track/TEST123456789NL', carrier: 'PostNL (test)', status: 'in_transit' };
  }
  // TODO: Track & Trace ophalen (polling), of no-op laten als Dreamlove dit
  // zelf via e-mail/webhook aanlevert — in dat geval hoort de verwerking
  // thuis in een apart binnenkomend endpoint, niet hier.
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

module.exports = { name: SUPPLIER_NAME, fetchCatalog, fetchStockLevels, canFulfill, submitOrder, fetchTracking };
