// lib/suppliers/adapter-interface.js
//
// Elke leverancier (Dreamlove, 1on1 Wholesale, en toekomstige leveranciers)
// implementeert dit contract. De sync-jobs en de order-router (zie
// api/sync/*.js en api/shopify/webhook-order-create.js) praten UITSLUITEND
// tegen deze interface — nooit rechtstreeks tegen een specifieke leverancier.
// Zo kan een nieuwe leverancier worden toegevoegd door alleen een nieuw
// bestand in lib/suppliers/ te schrijven en te registreren in registry.js,
// zonder iets aan de bestaande sync/order-logica te veranderen.
//
// Elke adapter MOET de volgende async-functies implementeren:
//
//   fetchCatalog()
//     -> Array<{ sku, title, description, images: [url], price, compareAtPrice,
//                stock, category, brand }>
//     Haalt de volledige of gewijzigde productcatalogus op.
//
//   fetchStockLevels(skus)
//     -> Map<sku, quantity>
//     Snellere, lichte aanroep voor alleen voorraadniveaus (vaker te draaien
//     dan de volledige catalogus-sync).
//
//   canFulfill(order)
//     -> boolean
//     Bepaalt of DEZE leverancier de gegeven Shopify-order kan/moet uitvoeren
//     (bijv. op basis van SKU-prefix of een eigen mapping-tabel).
//
//   submitOrder(order)
//     -> { supplierOrderId, estimatedShipDate }
//     Dient de bestelling in bij de leverancier.
//
//   fetchTracking(supplierOrderId)
//     -> { trackingNumber, trackingUrl, carrier, status } | null
//     Vraagt de Track & Trace-status op (polling) — als de leverancier zelf
//     webhooks/e-mail stuurt, kan dit een no-op zijn en verloopt het via een
//     apart binnenkomend kanaal (zie TODO in api/sync/tracking.js).
//
// Een adapter die (nog) geen echte API-koppeling heeft, moet duidelijk een
// "not-implemented"-fout gooien in plaats van stilzwijgend nep-data terug te
// geven — zie lib/suppliers/dreamlove.js en 1on1-wholesale.js als voorbeeld.

class SupplierNotConfiguredError extends Error {
  constructor(supplierName) {
    super(`Leverancier "${supplierName}" is nog niet gekoppeld — ontbrekende API-specificatie of credentials.`);
    this.name = 'SupplierNotConfiguredError';
  }
}

module.exports = { SupplierNotConfiguredError };
