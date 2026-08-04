// lib/suppliers/onon1-wholesale.js
//
// TEMPLATE — nog GEEN echte koppeling, zelfde reden als dreamlove.js: ik ken
// 1on1 Wholesale's daadwerkelijke API/feed-specificatie niet. Structuur is
// identiek aan de Dreamlove-adapter (zelfde interface), zodat de sync-jobs
// en order-router niet hoeven te weten welke leverancier ze aanspreken.

const { SupplierNotConfiguredError } = require('./adapter-interface');
const { isTestMode, getMockCatalogForSupplier } = require('../test-mode');

const SUPPLIER_NAME = '1on1 Wholesale';

async function fetchCatalog() {
  if (isTestMode()) return getMockCatalogForSupplier(SUPPLIER_NAME);
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

async function fetchStockLevels(skus) {
  if (isTestMode()) return new Map(skus.map(sku => [sku, 40]));
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

function canFulfill(order) {
  if (isTestMode()) {
    return (order.line_items || []).some(li => String(li.sku || '').startsWith('TEST-1ON1WHOLESALE-'));
  }
  return false;
}

async function submitOrder(order) {
  if (isTestMode()) {
    return { supplierOrderId: '1ON1-TEST-' + Date.now(), estimatedShipDate: new Date(Date.now() + 86400000).toISOString() };
  }
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

async function fetchTracking(supplierOrderId) {
  if (isTestMode()) {
    return { trackingNumber: 'TEST987654321NL', trackingUrl: 'https://example.com/track/TEST987654321NL', carrier: 'DHL (test)', status: 'in_transit' };
  }
  throw new SupplierNotConfiguredError(SUPPLIER_NAME);
}

module.exports = { name: SUPPLIER_NAME, fetchCatalog, fetchStockLevels, canFulfill, submitOrder, fetchTracking };
