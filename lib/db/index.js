// lib/db/index.js
//
// Kiest automatisch de juiste adapter: DATABASE_URL ingesteld -> echte
// Postgres (productie); niet ingesteld -> SQLite-testadapter (development/
// testmodus). Alle lib/db/*.js-repository-bestanden (orders.js, sync-logs.js,
// audit.js) praten UITSLUITEND tegen deze `query()`-functie, nooit
// rechtstreeks tegen een specifieke adapter — zelfde ontkoppelingsprincipe
// als het leveranciers-adapterpatroon.

function isPostgresConfigured() {
  return !!process.env.DATABASE_URL;
}

async function query(text, params) {
  if (isPostgresConfigured()) {
    return require('./adapters/postgres-adapter').query(text, params);
  }
  return require('./adapters/sqlite-adapter').query(text, params);
}

function getDbSourceLabel() {
  return isPostgresConfigured() ? 'Postgres (productiedatabase)' : 'SQLite (lokale testadapter — NIET voor productie)';
}

module.exports = { query, isPostgresConfigured, getDbSourceLabel };
