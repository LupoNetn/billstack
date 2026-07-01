-- +goose Up
ALTER TABLE plans
ADD COLUMN interval_count INT NOT NULL DEFAULT 1;

-- +goose Down
ALTER TABLE plans
DROP COLUMN interval_count;
