// lib/suppliers/registry.js
//
// Eén centrale plek die alle leveranciers-adapters registreert. Een nieuwe
// leverancier toevoegen (jouw expliciete toekomstvereiste) betekent: schrijf
// lib/suppliers/nieuwe-leverancier.js volgens hetzelfde patroon als
// dreamlove.js, en voeg 'm hieronder toe aan de lijst. Niets in de sync-jobs
// of de order-router hoeft dan te veranderen.

const dreamlove = require('./dreamlove');
const onon1Wholesale = require('./onon1-wholesale');

const SUPPLIERS = [dreamlove, onon1Wholesale];

function getSuppliers() {
  return SUPPLIERS;
}

// Doorloopt alle leveranciers en geeft de eerste terug die aangeeft de order
// te kunnen uitvoeren. Bij twijfel/conflict (twee leveranciers claimen
// dezelfde order) moet dit worden verscherpt zodra de echte SKU-mapping
// bekend is — nu bewust simpel gehouden (first-match).
function findSupplierForOrder(order) {
  return SUPPLIERS.find(s => s.canFulfill(order)) || null;
}

module.exports = { getSuppliers, findSupplierForOrder };
