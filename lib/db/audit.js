// lib/db/audit.js
//
// Apart van sync_logs (operationele status) — audit_logs is bedoeld voor
// verantwoording: wie/wat deed een handmatige actie (bv. een beheerder die
// op "handmatig synchroniseren" klikt, of een orderstatus handmatig aanpast).

const db = require('./index');

async function logAudit({ actor = 'system', action, entityType, entityId, details }) {
  await db.query(
    'INSERT INTO audit_logs (actor, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
    [actor, action, entityType || null, entityId || null, details ? JSON.stringify(details) : null]
  );
}

async function getAuditLogs(limit = 50) {
  return db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1', [limit]);
}

module.exports = { logAudit, getAuditLogs };
