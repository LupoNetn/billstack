-- +goose Up
CREATE TYPE invoice_type AS ENUM('subscription', 'proration', 'trial_conversion', 'topup', 'one_off');
CREATE TYPE invoice_status AS ENUM('draft', 'open', 'paid', 'void', 'uncollectible');

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id),
    customer_id TEXT NOT NULL,
    invoice_type invoice_type NOT NULL,
    total BIGINT NOT NULL,
    amount_paid BIGINT NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'NGN',
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    payment_method_type TEXT CHECK (payment_method_type IN ('card','dva', 'wallet')),
    paid_at TIMESTAMPTZ,
    due_date TIMESTAMPTZ NOT NULL,
    nomba_order_ref TEXT UNIQUE,
    nomba_txn_ref TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_amount BIGINT NOT NULL,
    total BIGINT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN (
            'subscription',
            'proration_credit',
            'proration_charge',
            'usage',
            'discount',
            'tax'
        )
    ),
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_merchant_status ON invoices(merchant_id, status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date) WHERE status = 'open';


-- +goose Down
DROP INDEX IF EXISTS idx_invoices_subscription;
DROP INDEX IF EXISTS idx_invoices_merchant_status;
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP TABLE IF EXISTS invoice_line_items;
DROP TYPE IF EXISTS invoice_status;
DROP TYPE IF EXISTS invoice_type;
DROP TABLE IF EXISTS invoices;
