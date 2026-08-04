// lib/db/adapters/sqlite-adapter.js
//
// TESTADAPTER — gebruikt Node's ingebouwde (experimentele) node:sqlite-module
// zodat de databaselaag ECHT getest kan worden (query's daadwerkelijk
// uitgevoerd, niet alleen gemockt) in een omgeving zonder netwerktoegang tot
// een echte Postgres-instantie. Wordt gebruikt wanneer DATABASE_URL niet is
// ingesteld (zie lib/db/index.js) — dus ook automatisch actief in TEST_MODE.
//
// Queries worden geschreven in Postgres-stijl ($1, $2, ...) omdat dat de
// productie-waarheid is (zie postgres-adapter.js) — deze adapter vertaalt
// dat automatisch naar SQLite's ?-stijl.
//
// GEEN vervanging voor echt testen tegen Postgres vóór livegang — SQLite en
// Postgres verschillen op detailniveau (bv. type-afdwinging, JSONB-functies).

const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

let db;

function getDb() {
  if (!db) {
    db = new DatabaseSync(':memory:');
    const schemaPath = path.join(__dirname, '..', '..', '..', 'db', 'schema.sqlite.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
  }
  return db;
}

function toSqlitePlaceholders(text) {
  return text.replace(/\$(\d+)/g, '?');
}

async function query(text, params = []) {
  const database = getDb();
  const sqliteText = toSqlitePlaceholders(text);
  const trimmed = sqliteText.trim().toUpperCase();

  const stmt = database.prepare(sqliteText);

  if (trimmed.startsWith('SELECT')) {
    return stmt.all(...params);
  }
  // INSERT/UPDATE/DELETE — RETURNING wordt door node:sqlite's .run() niet
  // ondersteund zoals Postgres dat kent, dus RETURNING-queries hier apart afvangen.
  if (/RETURNING/i.test(sqliteText)) {
    // Simpele aanpak voor onze use-cases: voer de insert uit, haal daarna de
    // net ingevoegde rij op via lastInsertRowid.
    const withoutReturning = sqliteText.replace(/RETURNING.*/i, '');
    const insertStmt = database.prepare(withoutReturning);
    const info = insertStmt.run(...params);
    const tableMatch = sqliteText.match(/INSERT INTO (\w+)/i);
    if (tableMatch) {
      const selectStmt = database.prepare(`SELECT * FROM ${tableMatch[1]} WHERE rowid = ?`);
      return selectStmt.all(info.lastInsertRowid);
    }
    return [];
  }

  const info = stmt.run(...params);
  return [{ changes: info.changes, lastInsertRowid: info.lastInsertRowid }];
}

// Uitsluitend voor tests: geeft een verse, lege database terug.
function resetForTests() {
  db = null;
  return getDb();
}

module.exports = { query, resetForTests };
