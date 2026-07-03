-- name: CreateSubscription :one
INSERT INTO subscriptions (merchant_id,customer_id,customer_email,customer_name,trial_ends_at,plan_id,payment_method_type,status,metadata)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *;

-- name: StoreTokenKey :one
UPDATE subscriptions 
SET nomba_token_key = $1
WHERE merchant_id = $2 AND customer_id = $3
RETURNING *;

-- name: UpdateSubscriptionDvaId :exec
UPDATE subscriptions
SET dva_id = $1
WHERE id = $2;

-- name: StoreDvaDetails :one
UPDATE subscriptions
SET dva_id = $1
WHERE merchant_id = $2 AND customer_id = $3
RETURNING *;

-- name: GetAllSubscriptionsForMerchant :many
SELECT * FROM subscriptions
WHERE merchant_id = $1
LIMIT $2 OFFSET $3;

-- name: SetSubscriptionStatus :exec
UPDATE subscriptions
SET status = $1
WHERE merchant_id = $2 AND customer_id = $3;

-- name: GetSubscriptionForMerchantAndCustomer :one
SELECT * FROM subscriptions
WHERE merchant_id = $1 AND customer_id = $2;

-- name: CancelSubscriptionImmediately :one
UPDATE subscriptions
SET
    cancelled_at = NOW(),
    cancellation_reason = $1
WHERE merchant_id = $2 AND customer_id = $3
RETURNING *;


-- name: CreateSubscriptionEventsTimeline :exec
INSERT INTO subscriptions_events (subscription_id,merchant_id,event_type,from_state,to_state,actor,actor_id,reason)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8);

-- name: GetSubscriptionByID :one
SELECT * FROM subscriptions
WHERE id = $1
LIMIT 1;

-- name: UpdateSubscriptionPeriodAndStatus :one
UPDATE subscriptions
SET
    status = $2,
    current_period_start = $3,
    current_period_end = $4,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: StoreTokenKeyBySubscriptionID :one
UPDATE subscriptions
SET nomba_token_key = $2, updated_at = now()
WHERE id = $1
RETURNING *;

