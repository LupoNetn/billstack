-- +goose Up
CREATE TYPE buisness_type AS ENUM ('sole_proprietorship', 'individual', 'registered business');
CREATE TYPE merchant_account_status AS ENUM ('pending',
                            'basic_verified',
                            'fully_verified',
                            'suspended',
                            'rejected');
CREATE TYPE kyb_tier AS ENUM ('tier_0','tier_1','tier_2','tier_3');
CREATE TYPE kyb_document_type AS ENUM ('cac_certificate', 'government_id', 'selfie', 'proof_of_address', 'buisness_reg_certificate');
CREATE TYPE kyb_document_verification_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    
    business_name TEXT,
    buisness_type buisness_type,
    website_url TEXT,
    status merchant_account_status NOT NULL DEFAULT 'pending',
    kyb_tier kyb_tier NOT NULL DEFAULT 'tier_0',
    
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_kyb_details(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    bvn_hash TEXT,
    nin_hash TEXT,
    cac_reg_number TEXT,
    buisness_reg_name TEXT,
    kyb_submitted_at TIMESTAMPTZ,
    kyb_verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_kyc_documents(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    document_type kyb_document_type NOT NULL,
    document_url TEXT NOT NULL,
    document_hash TEXT NOT NULL,
    status kyb_document_verification_status NOT NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_api_keys(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    environment TEXT NOT NULL CHECK (environment IN ('live', 'test')),
    label TEXT,
    last_used_at TIMESTAMPTZ,
    revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_webhook_urls(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    webhook_url TEXT NOT NULL,
    webhook_secret TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_portal_config(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#004CFF',
    secondary_color TEXT DEFAULT '#FFFFFF',
    support_email TEXT,
    return_url TEXT,
    smart_retry_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_settlement_accounts(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    bank_code TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_balances(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    available_balance BIGINT NOT NULL DEFAULT 0,
    pending_balance BIGINT NOT NULL DEFAULT 0,
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS merchants_split_config(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    recepient_type TEXT NOT NULL CHECK (recepient_type IN ('platform','merchant','third_party')),
    nomba_account_id TEXT,
    split_type TEXT NOT NULL CHECK (split_type IN ('percentage', 'fixed')),
    value BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- +goose Down
DROP TYPE IF EXISTS buisness_type;
DROP TYPE IF EXISTS merchant_account_status;
DROP TYPE IF EXISTS kyb_tier;
DROP TYPE IF EXISTS kyb_document_type;
DROP TYPE IF EXISTS kyb_document_verification_status;


DROP TABLE IF EXISTS merchants;
DROP TABLE IF EXISTS merchants_settlement_accounts;
DROP TABLE IF EXISTS merchants_balances;
DROP TABLE IF EXISTS merchants_portal_config;
DROP TABLE IF EXISTS merchants_webhook_urls;
DROP TABLE IF EXISTS merchants_api_keys;
DROP TABLE IF EXISTS merchants_kyc_documents;
DROP TABLE IF EXISTS merchants_kyb_details;
DROP TABLE IF EXISTS merchants_split_config;

