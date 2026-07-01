-- name: CreateInvoice :one
INSERT INTO invoices (merchant_id,subscription_id,customer_id,invoice_type,total,currency,period_start,period_end,status,payment_method_type,due_date)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
RETURNING *;

-- name: UpdateInvoicePaymentStatus :one
UPDATE invoices 
SET 
   amount_paid = $1,
   paid_at = $2,
   nomba_order_ref = $3,
   nomba_txn_ref = $4
WHERE merchant_id = $5 AND customer_id = $6
RETURNING *;


-- name: UpdateInvoiceStatus :one
UPDATE invoices
SET 
   status = $1,
   updated_at = now()
WHERE merchant_id = $2 AND customer_id = $3
RETURNING *;


-- name: UpdateInvoiceOrderRef :exec
UPDATE invoices
SET nomba_order_ref = $1
WHERE id = $2;

