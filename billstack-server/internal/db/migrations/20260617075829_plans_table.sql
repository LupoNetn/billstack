-- +goose Up
CREATE TYPE plan_type AS ENUM ('flat', 'per_unit', 'metered');
CREATE TYPE plan_interval_unit AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
CREATE TYPE plan_status AS ENUM ('active', 'archived');

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    plan_type plan_type NOT NULL,
    amount BIGINT NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    unit_name TEXT,
    max_units INTEGER,
    interval_unit plan_interval_unit NOT NULL,
    trial_days INTEGER NOT NULL DEFAULT 0,
    status plan_status NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose Down
DROP TYPE IF EXISTS plan_type;
DROP TYPE IF EXISTS plan_interval_unit;
DROP TYPE IF EXISTS plan_status;

DROP TABLE IF EXISTS plans;
