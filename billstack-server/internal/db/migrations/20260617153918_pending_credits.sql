-- +goose Up
CREATE TYPE pending_credit_status AS ENUM (
    'pending',
    'applied',
    'refunded',
    'written_off'
);

CREATE TYPE pending_credit_reason AS ENUM (
    'received_during_pause',
    'received_after_cancellation',
    'overpayment',
    'advance_payment',
    'misdirected'
);

CREATE TABLE pending_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    dva_id UUID NOT NULL REFERENCES dedicated_virtual_accounts(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    reason pending_credit_reason NOT NULL,
    nomba_txn_id TEXT NOT NULL UNIQUE,
    sender_bank TEXT,
    received_at TIMESTAMPTZ NOT NULL,
    status pending_credit_status NOT NULL DEFAULT 'pending',
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    applied_to_invoice UUID REFERENCES invoices(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose Down
DROP TABLE IF EXISTS pending_credits;
