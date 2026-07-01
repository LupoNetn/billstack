-- +goose Up
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- +goose Down
ALTER TABLE merchants DROP COLUMN IF EXISTS email_verified;
