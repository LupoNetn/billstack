-- +goose Up
ALTER TABLE merchants_api_keys
ADD CONSTRAINT unique_merchant_environment
UNIQUE (merchant_id,environment);

-- +goose Down
DROP unique_merchant_environment;
