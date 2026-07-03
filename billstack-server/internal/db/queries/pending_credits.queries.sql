-- name: CreatePendingCredit :one
INSERT INTO pending_credits (
    merchant_id,
    subscription_id,
    dva_id,
    amount,
    currency,
    reason,
    nomba_txn_id,
    sender_bank,
    received_at,
    status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
RETURNING *;
