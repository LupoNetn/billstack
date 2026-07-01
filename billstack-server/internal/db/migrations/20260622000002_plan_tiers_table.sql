-- +goose Up
CREATE TABLE plan_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    up_to INT, -- null = unlimited (last tier)
    unit_price BIGINT NOT NULL CHECK (unit_price >= 0),
    flat_fee BIGINT NOT NULL DEFAULT 0,
    tier_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- +goose Down
DROP TABLE plan_tiers;
