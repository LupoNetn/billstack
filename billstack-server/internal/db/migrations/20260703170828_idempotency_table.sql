-- +goose Up

CREATE TABLE idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key TEXT NOT NULL UNIQUE,
    request_method TEXT NOT NULL,
    request_path TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_body BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX idx_idempotency_expires_at
ON idempotency_keys(expires_at);


-- +goose Down

DROP TABLE IF EXISTS idempotency_keys;