-- +goose Up
CREATE TABLE IF NOT EXISTS usage_events(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    customer_id TEXT NOT NULL,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id),
    wallet_id UUID NOT NULL REFERENCES customer_wallets(id),
    event_type VARCHAR(50) NOT NULL,
    units NUMERIC NOT NULL,
    unit_price BIGINT NOT NULL,
    idemotency_key TEXT NOT NULL UNIQUE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_usage_events_customer
    ON usage_events(merchant_id, customer_id);
CREATE INDEX idx_usage_events_subscription
    ON usage_events(subscription_id);

-- +goose Down
DROP TABLE IF EXISTS usage_events;
DROP INDEX IF EXISTS idx_usage_events_customer;
DROP INDEX IF EXISTS idx_usage_events_subscription;
