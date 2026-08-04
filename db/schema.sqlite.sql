-- db/schema.sqlite.sql
--
-- STRUCTURELE TESTVARIANT van db/schema.sql, uitsluitend voor lokale
-- ontwikkeling/testen via lib/db/adapters/sqlite-adapter.js (node:sqlite).
-- SQLite kent geen BIGSERIAL/JSONB/TIMESTAMPTZ — hier vervangen door
-- INTEGER PRIMARY KEY AUTOINCREMENT/TEXT. De TABELSTRUCTUUR en KOLOMNAMEN
-- zijn verder identiek aan het echte Postgres-schema, zodat de queries in
-- lib/db/adapters/*.js voor beide varianten hetzelfde blijven aanvoelen.
--
-- BELANGRIJK: dit is GEEN vervanging voor testen tegen een echte Postgres-
-- instantie — het is een structurele proxy om de applicatielogica (CRUD,
-- state-transities, queries) te kunnen verifiëren in een omgeving zonder
-- netwerktoegang tot een echte database. Test vóór livegang alsnog tegen
-- een echte (Supabase-)Postgres-instantie.

CREATE TABLE IF NOT EXISTS customers (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  shopify_customer_id TEXT UNIQUE,
  email               TEXT NOT NULL,
  first_name          TEXT,
  last_name           TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  shopify_order_id  TEXT UNIQUE NOT NULL,
  order_number      TEXT,
  customer_id       INTEGER REFERENCES customers(id),
  status            TEXT NOT NULL DEFAULT 'received',
  financial_status  TEXT,
  total_amount      REAL,
  currency          TEXT DEFAULT 'EUR',
  shipping_address  TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id      INTEGER NOT NULL REFERENCES orders(id),
  sku           TEXT NOT NULL,
  title         TEXT NOT NULL,
  quantity      INTEGER NOT NULL,
  price         REAL NOT NULL,
  supplier_name TEXT
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  status      TEXT NOT NULL,
  note        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS supplier_order_links (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id            INTEGER NOT NULL REFERENCES orders(id),
  supplier_name       TEXT NOT NULL,
  supplier_order_id   TEXT,
  status              TEXT NOT NULL DEFAULT 'submitted',
  estimated_ship_date TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tracking_events (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_order_link_id  INTEGER NOT NULL REFERENCES supplier_order_links(id),
  tracking_number         TEXT,
  tracking_url            TEXT,
  carrier                 TEXT,
  status                  TEXT,
  created_at              TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  type        TEXT NOT NULL,
  supplier    TEXT,
  ok          INTEGER NOT NULL,
  count       INTEGER,
  error       TEXT,
  note        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  actor       TEXT NOT NULL DEFAULT 'system',
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   TEXT,
  details     TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
