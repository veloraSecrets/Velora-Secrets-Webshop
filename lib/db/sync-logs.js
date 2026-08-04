// lib/db/sync-logs.js
//
// Vervangt de oude lib/sync-log.js (in-memory, verloor data tussen serverless-
// aanroepen). Zelfde functienamen/gebruik als voorheen, zodat api/sync/*.js
// en api/admin/status.js maar op één plek hoeven te veranderen (de import).

const db = require('./index');

async function log(entry) {
  await db.query(
    'INSERT INTO sync_logs (type, supplier, ok, count, error, note) VALUES ($1, $2, $3, $4, $5, $6)',
    [entry.type, entry.supplier || null, entry.ok ? 1 : 0, entry.count ?? null, entry.error || null, entry.note || null]
  );
}

async function getLogs(limit = 50) {
  const rows = await db.query('SELECT * FROM sync_logs ORDER BY created_at DESC LIMIT $1', [limit]);
  return rows.map(r => ({ ...r, ok: !!r.ok, timestamp: r.created_at }));
}

async function getLastByType(type) {
  const rows = await db.query('SELECT * FROM sync_logs WHERE type = $1 ORDER BY created_at DESC LIMIT 1', [type]);
  return rows[0] || null;
}

module.exports = { log, getLogs, getLastByType };
