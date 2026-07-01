-- +goose Up
CREATE TYPE subscription_status AS ENUM ('pending', 'trialing', 'active', 'past_due', 'cancelled', 'paused', 'expired');
CREATE TYPE payment_method_type AS ENUM ('card', 'dva');

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status subscription_status NOT NULL DEFAULT 'pending',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancellation_reason TEXT CHECK (cancellation_reason IN ('customer_request', 'non_payment', 'merchant_request')),
    paused_at TIMESTAMPTZ,
    pause_resumes_at TIMESTAMPTZ,
    pause_reason  TEXT CHECK (
        pause_reason IN (
            'customer_request',
            'merchant_request'
        )
    ),
    payment_method_type payment_method_type NOT NULL DEFAULT 'card',
    nomba_token_key TEXT,
    dva_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_merchant ON subscriptions(merchant_id);
CREATE INDEX idx_subscriptions_renewal
    ON subscriptions(current_period_end)
    WHERE status IN ('active', 'past_due');
CREATE INDEX idx_subscriptions_trial
    ON subscriptions(trial_ends_at)
    WHERE status = 'trialing';
CREATE INDEX idx_subscriptions_resume
    ON subscriptions(pause_resumes_at)
    WHERE status = 'paused';

CREATE TABLE subscriptions_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    from_state JSONB,
    to_state JSONB,
    actor TEXT NOT NULL CHECK (actor IN ('customer','merchant','system','nomba_webhook')),
    actor_id TEXT,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions_health (
    subscription_id UUID PRIMARY KEY REFERENCES subscriptions(id) ON DELETE CASCADE,
    health_score INTEGER NOT NULL CHECK (health_score BETWEEN 0 AND 100),
    signals JSONB NOT NULL,
    last_computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sub_events_subscription
    ON subscriptions_events(subscription_id);



-- +goose Down
DROP TYPE IF EXISTS subscription_status;
DROP TYPE IF EXISTS payment_method_type;

DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS subscriptions_events;
DROP TABLE IF EXISTS subscriptions_health;
