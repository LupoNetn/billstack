-- name: InsertProcessedWebhookEvent :one
INSERT INTO processed_webhook_events (event_source, event_id, event_type, payload)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: InsertWebhookDelivery :one
INSERT INTO webhook_deliveries (
    merchant_id,
    subscription_id,
    event_type,
    payload,
    idempotency_key,
    webhook_url,
    status
) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
RETURNING *;
