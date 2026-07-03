-- name: CreateDVA :one
INSERT INTO dedicated_virtual_accounts (merchant_id,subscription_id,customer_id,customer_name,account_ref,nomba_account_id,bank_account_number,bank_account_name,bank_name, bvn_hash,status)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10, $11)
RETURNING *;

-- name: UpdateDVAStatus :exec
UPDATE dedicated_virtual_accounts
SET status = $1,
    updated_at = now()
WHERE merchant_id = $2 AND subscription_id = $3
RETURNING *;

-- name: CloseDVA :exec
UPDATE dedicated_virtual_accounts
SET 
    status = $1,
    closed_at = now(),
    updated_at = now()
WHERE merchant_id = $2 AND subscription_id = $3
RETURNING *;

-- name: GetDVAByAccountRef :one
SELECT * FROM dedicated_virtual_accounts
WHERE account_ref = $1
LIMIT 1;

-- name: GetDVAByID :one
SELECT * FROM dedicated_virtual_accounts
WHERE id = $1
LIMIT 1;
