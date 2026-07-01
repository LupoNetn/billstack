-- +goose Up
CREATE TABLE IF NOT EXISTS portal_sessions(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    customer_id TEXT NOT NULL,
    token_hash  TEXT NOT NULL UNIQUE,
    return_url  TEXT,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN NOT NULL DEFAULT false,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portal_sessions_token
    ON portal_sessions(token_hash)
    WHERE used = false;
    
-- +goose Down
DROP INDEX IF EXISTS idx_portal_sessions_token;
DROP TABLE IF EXISTS portal_sessions;
