-- +goose Up
CREATE TABLE IF NOT EXISTS merchant_email_verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    code CHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(merchant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_merchant_email_verification_codes_expires_at ON merchant_email_verification_codes(expires_at);

-- +goose Down
DROP TABLE IF EXISTS merchant_email_verification_codes;
