-- +goose Up
CREATE TYPE dva_status AS ENUM (
    'active',
    'suspended',
    'closed'
);
CREATE TABLE IF NOT EXISTS dedicated_virtual_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    account_ref TEXT NOT NULL UNIQUE,
    nomba_account_id TEXT,
    bank_account_number TEXT NOT NULL,
    bank_account_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    bvn_hash TEXT,
    status dva_status NOT NULL DEFAULT 'active',
    suspended_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dva_account_ref
    ON dedicated_virtual_accounts(account_ref);
CREATE INDEX idx_dva_merchant
    ON dedicated_virtual_accounts(merchant_id);

-- +goose Down
DROP TYPE IF EXISTS dva_status;
DROP TABLE IF EXISTS dedicated_virtual_accounts;
DROP INDEX IF EXISTS idx_dva_account_ref;
DROP INDEX IF EXISTS idx_dva_merchant;
