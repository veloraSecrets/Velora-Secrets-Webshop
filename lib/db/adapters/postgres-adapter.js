// lib/db/adapters/postgres-adapter.js
//
// PRODUCTIE-ADAPTER. Praat met een echte Postgres-database (Supabase of
// elke andere Postgres-provider) via de `pg`-package en een DATABASE_URL
// connection string. Dit bestand wordt uitsluitend geladen als DATABASE_URL
// is ingesteld (zie lib/db/index.js) — anders wordt de sqlite-adapter gebruikt.
//
// Vereist: `npm install pg` (staat al in package.json) en env var DATABASE_URL,
// bv. van Supabase: postgresql://postgres:[wachtwoord]@db.xxxxx.supabase.co:5432/postgres

let pool;

function getPool() {
  if (!pool) {
    const { Pool } = require('pg'); // pas hier geladen, zodat de sqlite-adapter niet ineens `pg` nodig heeft
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Supabase vereist SSL; in productie idealiter met een echt certificaat
    });
  }
  return pool;
}

async function query(text, params) {
  const client = getPool();
  const result = await client.query(text, params);
  return result.rows;
}

module.exports = { query };
