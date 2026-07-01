-- name: CreateNewMerchant :one
INSERT INTO merchants (personal_name,password,email)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetMerchantByEmail :one
SELECT * FROM merchants WHERE email = $1;

-- name: GetMerchantById :one
SELECT * FROM merchants WHERE id = $1;

-- name: CompleteMerchantProfileOnboarding :one
UPDATE merchants
SET
    phone_number = $1,
    business_name = $2,
    buisness_type = $3,
    website_url = $4,
    status = $5
WHERE id = $6
RETURNING *;

-- name: UpdateMerchantKybTier :one
UPDATE merchants
SET kyb_tier = $1
WHERE id = $2
RETURNING *;

-- name: GetMerchantKybTier :one
SELECT kyb_tier FROM merchants WHERE id = $1;

-- name: CreateEmailVerificationCode :one
INSERT INTO merchant_email_verification_codes (merchant_id, email, code, expires_at) 
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetEmailVerificationCode :one
SELECT *
FROM merchant_email_verification_codes
WHERE email = $1
  AND code = $2
  AND expires_at > NOW()
LIMIT 1;

-- name: VerifyEmailCodeAtomic :one
UPDATE merchant_email_verification_codes
SET verified = true
WHERE email = $1
  AND code = $2
  AND expires_at > NOW()
  AND verified = false
RETURNING id, merchant_id, email, code, expires_at, verified;

-- name: UpdateEmailVerificationCode :one
UPDATE merchant_email_verification_codes
SET verified = $1
WHERE id = $2
RETURNING *;

-- name: GetEmailVerificationStatus :one
SELECT email_verified FROM merchants WHERE id = $1;

-- name: SetEmailVerificationStatus :one
UPDATE merchants
SET email_verified = $1
WHERE id = $2
RETURNING *;

-- name: CreateMerchantApiKeys :one 
INSERT INTO merchants_api_keys (merchant_id,key_hash,key_prefix,environment,label)
VALUES ($1,$2,$3,$4,$5)
RETURNING *;

-- name: GetActiveMerchantKeys :one
SELECT * FROM merchants_api_keys WHERE merchant_id = $1 AND revoked_at IS NULL;


-- name: CreateSettlementAccount :one
INSERT INTO merchants_settlement_accounts (merchant_id,bank_name,account_number,account_name,bank_code,verified,verified_at,is_primary)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *;

-- name: GetMerchantSettlementAccounts :many
SELECT * FROM merchants_settlement_accounts WHERE merchant_id = $1;

-- name: GetMerchantWebhookConfig :one
SELECT * FROM merchants_webhook_urls WHERE merchant_id = $1 LIMIT 1;

-- name: CreateMerchantWebhookConfig :one
INSERT INTO merchants_webhook_urls (merchant_id, webhook_url, webhook_secret)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateMerchantWebhookConfig :one
UPDATE merchants_webhook_urls
SET 
    webhook_url = COALESCE(sqlc.narg('webhook_url'), webhook_url),
    webhook_secret = COALESCE(sqlc.narg('webhook_secret'), webhook_secret),
    updated_at = now()
WHERE merchant_id = sqlc.arg('merchant_id')
RETURNING *;

-- name: GetMerchantPortalConfig :one
SELECT * FROM merchants_portal_config WHERE merchant_id = $1 LIMIT 1;

-- name: CreateMerchantPortalConfig :one
INSERT INTO merchants_portal_config (merchant_id, logo_url, primary_color, secondary_color, support_email, return_url, smart_retry_enabled)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateMerchantPortalConfig :one
UPDATE merchants_portal_config
SET 
    logo_url = COALESCE(sqlc.narg('logo_url'), logo_url),
    primary_color = COALESCE(sqlc.narg('primary_color'), primary_color),
    secondary_color = COALESCE(sqlc.narg('secondary_color'), secondary_color),
    support_email = COALESCE(sqlc.narg('support_email'), support_email),
    return_url = COALESCE(sqlc.narg('return_url'), return_url),
    smart_retry_enabled = COALESCE(sqlc.narg('smart_retry_enabled'), smart_retry_enabled),
    updated_at = now()
WHERE merchant_id = sqlc.arg('merchant_id')
RETURNING *;

-- name: CreateMerchantSplitConfig :one
INSERT INTO merchants_split_config (merchant_id, label, recepient_type, nomba_account_id, split_type, value, active)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetMerchantSplitConfigs :many
SELECT * FROM merchants_split_config WHERE merchant_id = $1;

-- name: GetMerchantSplitConfigById :one
SELECT * FROM merchants_split_config WHERE id = $1 AND merchant_id = $2;

-- name: UpdateMerchantSplitConfig :one
UPDATE merchants_split_config
SET 
    label = COALESCE(sqlc.narg('label'), label),
    recepient_type = COALESCE(sqlc.narg('recepient_type'), recepient_type),
    nomba_account_id = COALESCE(sqlc.narg('nomba_account_id'), nomba_account_id),
    split_type = COALESCE(sqlc.narg('split_type'), split_type),
    value = COALESCE(sqlc.narg('value'), value),
    active = COALESCE(sqlc.narg('active'), active),
    updated_at = now()
WHERE id = sqlc.arg('id') AND merchant_id = sqlc.arg('merchant_id')
RETURNING *;

-- name: DeleteMerchantSplitConfig :one
DELETE FROM merchants_split_config WHERE id = $1 AND merchant_id = $2
RETURNING *;

-- name: RevokeAllMerchantApiKeys :exec
UPDATE merchants_api_keys
SET revoked = true, revoked_at = now()
WHERE merchant_id = $1 AND revoked = false;

-- name: GetMerchantApiKey :one
SELECT * FROM merchants_api_keys
WHERE key_hash = $1 AND revoked = false;

-- name: UpdateApiKeyLastUsage :exec
UPDATE merchants_api_keys
SET last_used_at = NOW()
WHERE merchant_id = $1;

