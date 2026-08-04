// lib/order-lifecycle.js
//
// De volledige levenscyclus van een bestelling, als expliciete state machine.
// Dit is de ENIGE plek waar bepaald wordt welke statusovergangen geldig zijn —
// alle andere code (webhooks, sync-jobs, beheerpaneel) roept isValidTransition()
// aan in plaats van zelf aannames te doen. Zo kan een order nooit per ongeluk
// in een onlogische status belanden (bv. "delivered" vóór "shipped").

const STATUSES = [
  'received',          // Shopify-order binnengekomen (orders/create-webhook)
  'paid',               // Betaling bevestigd (Mollie-webhook)
  'sent_to_supplier',   // Doorgestuurd naar Dreamlove/1on1 Wholesale
  'processing',         // Leverancier heeft de order geaccepteerd/is aan het verwerken
  'shipped',            // Track & Trace ontvangen, fulfillment aangemaakt in Shopify
  'delivered',          // Bezorgd (optioneel, afhankelijk van vervoerder-statusupdates)
  'returned',           // Retour ontvangen/verwerkt
  'cancelled'           // Geannuleerd (kan vanuit vrijwel elke status, zie hieronder)
];

// Toegestane overgangen: key = huidige status, value = array van statussen
// waar direct naartoe overgegaan mag worden.
const TRANSITIONS = {
  received:         ['paid', 'cancelled'],
  paid:             ['sent_to_supplier', 'cancelled'],
  sent_to_supplier: ['processing', 'cancelled'],
  processing:       ['shipped', 'cancelled'],
  shipped:          ['delivered', 'returned'],
  delivered:        ['returned'],
  returned:         [],   // eindstatus
  cancelled:        []    // eindstatus
};

function isValidStatus(status) {
  return STATUSES.includes(status);
}

function isValidTransition(fromStatus, toStatus) {
  if (!isValidStatus(fromStatus) || !isValidStatus(toStatus)) return false;
  const allowed = TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
}

function getNextPossibleStatuses(fromStatus) {
  return TRANSITIONS[fromStatus] || [];
}

function isTerminalStatus(status) {
  return getNextPossibleStatuses(status).length === 0;
}

module.exports = { STATUSES, TRANSITIONS, isValidStatus, isValidTransition, getNextPossibleStatuses, isTerminalStatus };
