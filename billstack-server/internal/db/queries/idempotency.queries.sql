-- name: GetIdempotencyKey :one
SELECT *
FROM idempotency_keys
WHERE idempotency_key = $1
LIMIT 1;


-- name: IdempotencyKeyExists :one
SELECT EXISTS (
    SELECT 1
    FROM idempotency_keys
    WHERE idempotency_key = $1
);


-- name: StoreIdempotencyResponse :one
INSERT INTO idempotency_keys (
    idempotency_key,
    request_method,
    request_path,
    request_hash,
    status_code,
    response_body
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
)
RETURNING *;


-- name: DeleteExpiredIdempotencyKeys :exec
DELETE
FROM idempotency_keys
WHERE expires_at < NOW();


-- name: DeleteIdempotencyKey :exec
DELETE
FROM idempotency_keys
WHERE idempotency_key = $1;