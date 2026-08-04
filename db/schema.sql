-- db/schema.sql
--
-- Productie-databaseschema voor Velora Secrets headless backend.
-- Compatibel met Supabase (Postgres) of elke andere Postgres-provider —
-- gebruik de connection string als DATABASE_URL environment variable.
--
-- Uitvoeren: plak dit in Supabase → SQL Editor → Run, of via
--   psql "$DATABASE_URL" -f db/schema.sql

-- ============================================================
-- KLANTEN
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id                  BIGSERIAL PRIMARY KEY,
  shopify_customer_id TEXT UNIQUE,
  email               TEXT NOT NULL,
  first_name          TEXT,
  last_name           TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers (email);

-- ============================================================
-- BESTELLINGEN — de kern van de order-/fulfillmentmodule
-- ============================================================
-- Toegestane statussen vormen een levenscyclus (zie lib/order-lifecycle.js
-- voor de precieze, in code gehandhaafde overgangsregels — deze CHECK-
-- constraint is de laatste verdedigingslinie op databaseniveau):
--   received -> paid -> sent_to_supplier -> processing -> shipped -> delivered
--   (elke status vanaf 'shipped' kan ook naar 'returned' overgaan)
CREATE TABLE IF NOT EXISTS orders (
  id                BIGSERIAL PRIMARY KEY,
  shopify_order_id  TEXT UNIQUE NOT NULL,
  order_number      TEXT,
  customer_id       BIGINT REFERENCES customers(id),
  status            TEXT NOT NULL DEFAULT 'received'
                      CHECK (status IN ('received','paid','sent_to_supplier','processing','shipped','delivered','returned','cancelled')),
  financial_status  TEXT,
  total_amount      NUMERIC(10,2),
  currency          TEXT DEFAULT 'EUR',
  shipping_address  JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_shopify_id ON orders (shopify_order_id);

CREATE TABLE IF NOT EXISTS order_items (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku         TEXT NOT NULL,
  title       TEXT NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  price       NUMERIC(10,2) NOT NULL,
  supplier_name TEXT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);

-- Elke statusverandering van een order wordt hier gelogd — dit IS de
-- zichtbare levenscyclus die het beheerpaneel per order toont.
CREATE TABLE IF NOT EXISTS order_status_history (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history (order_id);

-- ============================================================
-- LEVERANCIERSKOPPELINGEN — welke leverancier voert welke order uit
-- ============================================================
CREATE TABLE IF NOT EXISTS supplier_order_links (
  id                  BIGSERIAL PRIMARY KEY,
  order_id            BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  supplier_name       TEXT NOT NULL,
  supplier_order_id   TEXT,
  status              TEXT NOT NULL DEFAULT 'submitted'
                        CHECK (status IN ('submitted','accepted','shipped','failed')),
  estimated_ship_date TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_supplier_links_order ON supplier_order_links (order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_links_status ON supplier_order_links (status);

-- ============================================================
-- TRACK & TRACE
-- ============================================================
CREATE TABLE IF NOT EXISTS tracking_events (
  id                      BIGSERIAL PRIMARY KEY,
  supplier_order_link_id  BIGINT NOT NULL REFERENCES supplier_order_links(id) ON DELETE CASCADE,
  tracking_number         TEXT,
  tracking_url            TEXT,
  carrier                 TEXT,
  status                  TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tracking_link ON tracking_events (supplier_order_link_id);

-- ============================================================
-- SYNCHRONISATIELOGS (vervangt de eerdere in-memory lib/sync-log.js)
-- ============================================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id          BIGSERIAL PRIMARY KEY,
  type        TEXT NOT NULL,       -- bv. 'product-sync', 'inventory-sync', 'order-webhook', 'tracking-sync'
  supplier    TEXT,
  ok          BOOLEAN NOT NULL,
  count       INTEGER,
  error       TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created ON sync_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_type ON sync_logs (type);

-- ============================================================
-- AUDITLOGS — wie/wat deed iets (handmatige acties in het beheerpaneel,
-- gevoelige wijzigingen) — apart van sync_logs omdat dit een ander doel
-- dient (verantwoording/compliance i.p.v. operationele status)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  actor       TEXT NOT NULL DEFAULT 'system',
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs (created_at DESC);
