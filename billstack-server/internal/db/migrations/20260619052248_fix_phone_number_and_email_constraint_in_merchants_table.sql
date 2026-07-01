-- +goose Up

ALTER TABLE merchants
ALTER COLUMN phone_number DROP NOT NULL;

ALTER TABLE merchants
ADD CONSTRAINT unique_email UNIQUE (email);

-- +goose Down

ALTER TABLE merchants
DROP CONSTRAINT IF EXISTS unique_email;

ALTER TABLE merchants
ALTER COLUMN phone_number SET NOT NULL;