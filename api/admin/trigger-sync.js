// api/admin/trigger-sync.js
//
// Laat de beheerder vanuit het paneel handmatig een sync starten, los van het
// vaste cron-schema (bv. na het toevoegen van een nieuwe leverancier, of om
// een mislukte sync direct opnieuw te proberen).

const syncLog = require('../../lib/db/sync-logs');
const audit = require('../../lib/db/audit');

module.exports = async function handler(req, res) {
  const secret = process.env.ADMIN_PANEL_SECRET;
  if (!secret || req.headers['x-admin-secret'] !== secret) {
    res.status(401).json({ error: 'Niet geautoriseerd.' });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { job } = req.body || {};
  try {
    let result;
    if (job === 'products') {
      result = await require('../sync/products').runProductSync();
    } else if (job === 'inventory') {
      result = await require('../sync/inventory').runInventorySync();
    } else if (job === 'tracking') {
      result = await require('../sync/tracking').runTrackingSync();
    } else {
      res.status(400).json({ error: 'Onbekende job. Gebruik "products", "inventory" of "tracking".' });
      return;
    }
    await audit.logAudit({ actor: 'admin', action: 'manual-sync-trigger', entityType: 'sync-job', entityId: job, details: { result } });
    res.status(200).json({ ok: true, result });
  } catch (err) {
    await syncLog.log({ type: 'manual-trigger', ok: false, job, error: err.message });
    await audit.logAudit({ actor: 'admin', action: 'manual-sync-trigger-failed', entityType: 'sync-job', entityId: job, details: { error: err.message } });
    res.status(500).json({ ok: false, error: err.message });
  }
};
