-- +goose Up
CREATE TYPE transaction_type AS ENUM (
    'card_charge',
    'dva_transfer',
    'wallet_debit',
    'wallet_topup',
    'refund',
    'payout',
    'platform_fee'
);

CREATE TYPE transaction_status AS ENUM (
    'success',
    'failed',
    'pending',
    'reversed'
);

CREATE TYPE decline_type AS ENUM (
    'soft',
    'hard',
    'network'
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    invoice_id UUID REFERENCES invoices(id),
    customer_id TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (
        direction IN ('inbound', 'outbound')
    ),
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL,
    nomba_txn_id TEXT UNIQUE,
    nomba_order_ref TEXT,
    failure_code TEXT,
    failure_message TEXT,
    decline_type decline_type,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_subscription
    ON transactions(subscription_id);
CREATE INDEX idx_transactions_merchant
    ON transactions(merchant_id);
CREATE INDEX idx_transactions_nomba
    ON transactions(nomba_txn_id);

-- +goose Down
DROP TYPE transaction_type;
DROP TYPE transaction_status;
DROP TYPE decline_type;
DROP TABLE IF EXISTS transactions;

