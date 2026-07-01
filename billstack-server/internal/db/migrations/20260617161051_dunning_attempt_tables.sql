-- +goose Up
CREATE TYPE attempt_type AS ENUM (
    'charge_retry',
    'reminder_sent',
    'payment_method_request',
    'cancellation_warning',
    'smart_retry_scheduled'
);
CREATE TYPE attempt_status AS ENUM (
    'success', 'failed', 'pending'
);
    
CREATE TABLE dunning_attempts(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    attempt_type attempt_type NOT NULL,
    status attempt_status NOT NULL,
    failure_code TEXT,
    decline_type TEXT CHECK (decline_type IN ('soft', 'hard', 'network')),
    attempted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    next_attempt_at   TIMESTAMPTZ,
    smart_retry       BOOLEAN NOT NULL DEFAULT false,
    notification_sent BOOLEAN DEFAULT false,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE INDEX idx_dunning_subscription
    ON dunning_attempts(subscription_id);
CREATE INDEX idx_dunning_next
    ON dunning_attempts(next_attempt_at)
    WHERE status = 'pending';
-- +goose Down
DROP TYPE IF EXISTS attempt_status,attempt_type;
DROP TABLE IF EXISTS dunning_attempts;