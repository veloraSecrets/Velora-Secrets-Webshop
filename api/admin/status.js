// api/admin/status.js
//
// Levert alle data voor het beheerpaneel-dashboard: order-levenscyclus-
// statistieken, synchronisatiestatus, leveranciersstatus, recente logs en
// auditlogs. Beveiligd met een gedeeld wachtwoord (ADMIN_PANEL_SECRET) via
// een header — voor een team van 1-2 personen voldoende; bij meerdere
// beheerders is een echt account-systeem beter.

const { getSuppliers } = require('../../lib/suppliers/registry');
const { isTestMode } = require('../../lib/test-mode');
const db = require('../../lib/db');
const syncLog = require('../../lib/db/sync-logs');
const orders = require('../../lib/db/orders');
const audit = require('../../lib/db/audit');

module.exports = async function handler(req, res) {
  const secret = process.env.ADMIN_PANEL_SECRET;
  if (!secret) {
    res.status(501).json({ error: 'Beheerpaneel nog niet geconfigureerd (ADMIN_PANEL_SECRET ontbreekt).' });
    return;
  }
  if (req.headers['x-admin-secret'] !== secret) {
    res.status(401).json({ error: 'Niet geautoriseerd.' });
    return;
  }

  try {
    const suppliers = getSuppliers().map(s => ({
      name: s.name,
      configured: false // TODO: true zodra de adapter een echte implementatie heeft i.p.v. SupplierNotConfiguredError
    }));

    const [lastProductSync, lastInventorySync, lastTrackingSync, orderStats, recentOrders, logs, auditLogs] = await Promise.all([
      syncLog.getLastByType('product-sync'),
      syncLog.getLastByType('inventory-sync'),
      syncLog.getLastByType('tracking-sync'),
      orders.getDashboardStats(),
      orders.listOrders({ limit: 20 }),
      syncLog.getLogs(50),
      audit.getAuditLogs(30)
    ]);

    res.status(200).json({
      activeStore: process.env.SHOPIFY_STORE_DOMAIN || null,
      testMode: isTestMode(),
      dbSource: db.getDbSourceLabel(),
      status: {
        lastProductSync: lastProductSync ? lastProductSync.created_at : null,
        lastInventorySync: lastInventorySync ? lastInventorySync.created_at : null,
        lastTrackingSync: lastTrackingSync ? lastTrackingSync.created_at : null
      },
      orderStats,
      recentOrders,
      suppliers,
      logs,
      auditLogs
    });
  } catch (err) {
    res.status(500).json({ error: 'Beheerpaneel-data ophalen mislukt: ' + err.message });
  }
};
