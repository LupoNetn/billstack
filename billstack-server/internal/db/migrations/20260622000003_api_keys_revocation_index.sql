-- +goose Up
CREATE INDEX idx_merchants_api_keys_active ON merchants_api_keys (merchant_id) WHERE revoked = false;

-- +goose Down
DROP INDEX idx_merchants_api_keys_active;
