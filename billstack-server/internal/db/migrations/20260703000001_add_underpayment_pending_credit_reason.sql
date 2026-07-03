-- +goose Up
ALTER TYPE pending_credit_reason ADD VALUE IF NOT EXISTS 'underpayment';

-- +goose Down
-- PostgreSQL does not support removing enum values safely.
