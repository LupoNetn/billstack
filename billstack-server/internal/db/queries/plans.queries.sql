-- name: CreatePlan :one
INSERT INTO plans (merchant_id,name,description,plan_type,amount,currency,unit_name,max_units,interval_unit,interval_count,trial_days,status,metadata)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
RETURNING *;

-- name: GetPlanByIDAndMerchant :one
SELECT * FROM plans WHERE id = $1 AND merchant_id = $2 LIMIT 1;

-- name: ListPlans :many
SELECT * FROM plans 
WHERE merchant_id = $1
AND ($2::text IS NULL OR status = $2::text)
ORDER BY created_at DESC
LIMIT $3 OFFSET $4;

-- name: ListPublicPlans :many
SELECT * FROM plans 
WHERE merchant_id = $1 
AND status = 'active'
ORDER BY amount ASC;

-- name: UpdatePlan :one
UPDATE plans
SET
    name = COALESCE(sqlc.narg('name'), name),
    description = COALESCE(sqlc.narg('description'), description),
    amount = COALESCE(sqlc.narg('amount'), amount),
    currency = COALESCE(sqlc.narg('currency'), currency),
    unit_name = COALESCE(sqlc.narg('unit_name'), unit_name),
    max_units = COALESCE(sqlc.narg('max_units'), max_units),
    interval_unit = COALESCE(sqlc.narg('interval_unit'), interval_unit),
    interval_count = COALESCE(sqlc.narg('interval_count'), interval_count),
    trial_days = COALESCE(sqlc.narg('trial_days'), trial_days),
    status = COALESCE(sqlc.narg('status'), status),
    metadata = COALESCE(sqlc.narg('metadata'), metadata),
    updated_at = NOW()
WHERE id = sqlc.arg('id') AND merchant_id = sqlc.arg('merchant_id')
RETURNING *;

-- name: ArchivePlan :one
UPDATE plans
SET status = 'archived', updated_at = NOW()
WHERE id = $1 AND merchant_id = $2
RETURNING *;

-- name: CreatePlanTier :one
INSERT INTO plan_tiers (plan_id, up_to, unit_price, flat_fee, tier_order)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetPlanTiers :many
SELECT * FROM plan_tiers WHERE plan_id = $1 ORDER BY tier_order ASC;