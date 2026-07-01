-- +goose Up
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'reversed');

CREATE TABLE IF NOT EXISTS payouts(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    settlement_account_id UUID NOT NULL REFERENCES merchants_settlement_accounts(id),
    amount BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    fee BIGINT NOT NULL DEFAULT 0,
    net_amount BIGINT NOT NULL,
    status payout_status NOT NULL,
    nomba_transfer_reference TEXT NOT NULL UNIQUE,
    initiated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    failure_reason TEXT
    
);

-- +goose Down
DROP TYPE IF EXISTS payout_status;
DROP TABLE IF EXISTS payouts;

