-- +goose Up
CREATE TYPE webhook_status AS ENUM (
    'pending', 'delivered', 'failed','exhausted'
);

CREATE TABLE IF NOT EXISTS webhook_deliveries(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    webhook_url TEXT NOT NULL,
    status webhook_status NOT NULL DEFAULT 'pending',
    attempt_count INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 8,
    next_retry_at TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ,
    last_http_status INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    delivered_at TIMESTAMPTZ
);

CREATE TABLE processed_webhook_events (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_source   TEXT NOT NULL DEFAULT 'nomba',
    event_id       TEXT NOT NULL,
    event_type     TEXT NOT NULL,
    payload        JSONB NOT NULL,
    processed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    processing_ms  INTEGER,

    UNIQUE(event_source, event_id)
);

CREATE INDEX idx_webhook_pending
    ON webhook_deliveries(next_retry_at)
    WHERE status = 'pending';

CREATE INDEX idx_webhook_merchant_event
    ON webhook_deliveries(merchant_id, event_type);

-- +goose Down
DROP TYPE IF EXISTS webhook_status;
DROP TABLE IF EXISTS webhook_deliveries;
DROP TABLE IF EXISTS processed_webhook_events;
DROP INDEX IF EXISTS idx_webhook_pending, idx_webhook_merchant_event;
