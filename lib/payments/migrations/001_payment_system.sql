-- AfriMatch Payment System Migration
-- Adds payment provider routing, promo codes, and retry tracking

-- ─── Extend subscriptions table ─────────────────────────────────────────────
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(20) DEFAULT 'stripe',
  ADD COLUMN IF NOT EXISTS manual_provider_override BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promo_code_id UUID,
  ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS failed_payment_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_failed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS flutterwave_customer_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS flutterwave_plan_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_payment_method_id VARCHAR(255);

-- ─── Promo Codes table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_percent DECIMAL(5,2) NOT NULL,
  applicable_plan_ids TEXT,   -- JSON array, NULL = all plans
  max_uses INTEGER,           -- NULL = unlimited
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP,       -- NULL = never expires
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS promo_codes_code_idx ON promo_codes(code);
CREATE INDEX IF NOT EXISTS promo_codes_active_idx ON promo_codes(active);

-- ─── Payment Retries table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_retries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL,
  attempt_number INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,   -- pending | succeeded | failed
  error_message TEXT,
  provider_error_code VARCHAR(100),
  scheduled_at TIMESTAMP NOT NULL,
  executed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payment_retries_subscription_id_idx ON payment_retries(subscription_id);
CREATE INDEX IF NOT EXISTS payment_retries_status_idx ON payment_retries(status);
CREATE INDEX IF NOT EXISTS payment_retries_scheduled_at_idx ON payment_retries(scheduled_at);

-- ─── Seed default promo codes ────────────────────────────────────────────────
INSERT INTO promo_codes (code, description, discount_percent, max_uses, expires_at, active)
VALUES
  ('AFRICA50', 'Africa launch — 50% off first month', 50.00, 1000, NOW() + INTERVAL '6 months', TRUE),
  ('WELCOME20', 'Welcome discount — 20% off', 20.00, NULL, NULL, TRUE),
  ('ANNUAL30', 'Annual plan — extra 30% off', 30.00, NULL, NULL, TRUE)
ON CONFLICT (code) DO NOTHING;
