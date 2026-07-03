package payments

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/nomba"
)

const nombaEventSource = "nomba"

func nombaAmountToKobo(amount float64) int64 {
	return int64(math.Round(amount))
}

func (p *PaymentSvc) HandleNombaWebhook(ctx context.Context, payload []byte, signature, timestamp string) error {
	if !verifyNombaWebhookSignature(payload, signature, timestamp) {
		slog.Warn("invalid nomba webhook signature")
		return nil
	}

	var envelope nomba.NombaWebhookEvent
	if err := json.Unmarshal(payload, &envelope); err != nil {
		return fmt.Errorf("parse webhook envelope: %w", err)
	}

	if envelope.RequestID == "" {
		slog.Warn("webhook missing requestId, ignoring")
		return nil
	}

	tx, err := p.dbPool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin webhook tx: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := p.queries.WithTx(tx)

	_, err = qtx.InsertProcessedWebhookEvent(ctx, sqlc.InsertProcessedWebhookEventParams{
		EventSource: nombaEventSource,
		EventID:     envelope.RequestID,
		EventType:   envelope.EventType,
		Payload:     payload,
	})
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			slog.Info("duplicate webhook ignored", "request_id", envelope.RequestID)
			return nil
		}
		return fmt.Errorf("record processed webhook: %w", err)
	}

	switch envelope.EventType {

	case "payment_success":
		if err := p.routePaymentSuccess(ctx, qtx, envelope); err != nil {
			return err
		}

	case "payment_failed":
		return p.handlePaymentFailed(ctx, qtx, envelope)

	case "payment_reversal":
		return p.handlePaymentReversal(ctx, qtx, envelope)

	case "payout_success":
		return p.handlePayoutSuccess(ctx, qtx, envelope)

	case "payout_failed":
		return p.handlePayoutFailed(ctx, qtx, envelope)

	case "payout_refund":
		return p.handlePayoutRefund(ctx, qtx, envelope)

	default:
		slog.Info("unhandled webhook", "event", envelope.EventType)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit webhook tx: %w", err)
	}
	return nil
}

func (p *PaymentSvc) handlePaymentFailed(
	ctx context.Context,
	qtx *sqlc.Queries,
	event nomba.NombaWebhookEvent,
) error {

	slog.Info(
		"payment failed",
		"request_id", event.RequestID,
	)

	return nil
}

func (p *PaymentSvc) handlePayoutSuccess(
	ctx context.Context,
	qtx *sqlc.Queries,
	event nomba.NombaWebhookEvent,
) error {

	slog.Info(
		"payout success",
		"request_id", event.RequestID,
	)

	return nil
}

func (p *PaymentSvc) handlePayoutFailed(
	ctx context.Context,
	qtx *sqlc.Queries,
	event nomba.NombaWebhookEvent,
) error {

	slog.Warn(
		"payout failed",
		"request_id", event.RequestID,
	)

	return nil
}

func (p *PaymentSvc) handlePayoutRefund(
	ctx context.Context,
	qtx *sqlc.Queries,
	event nomba.NombaWebhookEvent,
) error {

	slog.Info(
		"payout refunded",
		"request_id", event.RequestID,
	)

	return nil
}

func (p *PaymentSvc) handlePaymentReversal(
	ctx context.Context,
	qtx *sqlc.Queries,
	event nomba.NombaWebhookEvent,
) error {

	var data nomba.PaymentSuccessData

	if err := json.Unmarshal(event.Data, &data); err != nil {
		return err
	}

	slog.Warn(
		"payment reversed",
		"transaction",
		data.Transaction.TransactionID,
	)

	// TODO:
	//
	// Reverse invoice
	// Suspend subscription
	// Create timeline event
	// Queue merchant webhook

	return nil
}

func (p *PaymentSvc) routePaymentSuccess(ctx context.Context, qtx *sqlc.Queries, envelope nomba.NombaWebhookEvent) error {
	var data nomba.PaymentSuccessData
	if err := json.Unmarshal(envelope.Data, &data); err != nil {
		return fmt.Errorf("parse payment_success data: %w", err)
	}

	txType := data.Transaction.Type
	if txType == "vact_transfer" {
		return p.handleDVATransferReceived(ctx, qtx, envelope.Data)
	}

	if txType == "online_checkout" || data.Order != nil {
		return p.handleCardPaymentConfirmed(ctx, qtx, data)
	}

	slog.Info("payment_success with unhandled transaction type", "type", txType)
	return nil
}

func (p *PaymentSvc) handleCardPaymentConfirmed(ctx context.Context, qtx *sqlc.Queries, data nomba.PaymentSuccessData) error {
	cardData := parseCardPaymentData(data)

	orderRef := cardData.OrderRef
	if orderRef == "" {
		orderRef = cardData.MerchantTxRef
	}
	if orderRef == "" {
		slog.Warn("card payment webhook missing order reference")
		return nil
	}

	invoice, err := qtx.GetInvoiceByNombaOrderRef(ctx, &orderRef)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Warn("invoice not found for order ref", "order_ref", orderRef)
			return nil
		}
		return fmt.Errorf("lookup invoice: %w", err)
	}

	if invoice.Status == sqlc.InvoiceStatusPaid {
		slog.Info("invoice already paid, skipping", "invoice_id", invoice.ID)
		return nil
	}

	sub, err := qtx.GetSubscriptionByID(ctx, invoice.SubscriptionID)
	if err != nil {
		return fmt.Errorf("lookup subscription: %w", err)
	}

	plan, err := qtx.GetPlanByIDAndMerchant(ctx, sqlc.GetPlanByIDAndMerchantParams{
		MerchantID: sub.MerchantID,
		ID:         sub.PlanID,
	})
	if err != nil {
		return fmt.Errorf("lookup plan: %w", err)
	}

	if cardData.TokenKey != "" && cardData.TokenKey != "N/A" {
		if _, err := qtx.StoreTokenKeyBySubscriptionID(ctx, sqlc.StoreTokenKeyBySubscriptionIDParams{
			ID:            sub.ID,
			NombaTokenKey: &cardData.TokenKey,
		}); err != nil {
			return fmt.Errorf("store token key: %w", err)
		}
	}

	now := time.Now()
	paidAt := parsePaidAt(cardData.PaidAt, now)

	if sub.TrialEndsAt.Valid && sub.TrialEndsAt.Time.After(now) {
		_, err = qtx.UpdateSubscriptionPeriodAndStatus(ctx, sqlc.UpdateSubscriptionPeriodAndStatusParams{
			ID:     sub.ID,
			Status: sqlc.SubscriptionStatusTrialing,
			CurrentPeriodStart: pgtype.Timestamptz{
				Time:  now,
				Valid: true,
			},
			CurrentPeriodEnd: pgtype.Timestamptz{
				Time:  sub.TrialEndsAt.Time,
				Valid: true,
			},
		})
		if err != nil {
			return fmt.Errorf("set trialing status: %w", err)
		}

		if err := writeTimelineEvent(ctx, qtx, sub, "subscription_trial_started", "Card validated, trial started"); err != nil {
			return err
		}

		return queueMerchantWebhook(ctx, qtx, sub.MerchantID, sub.ID, "subscription.trial_started", map[string]any{
			"subscription_id": sub.ID,
			"customer_id":     sub.CustomerID,
			"trial_ends_at":   sub.TrialEndsAt.Time,
		})
	}

	amountPaid := cardData.AmountKobo
	if amountPaid == 0 {
		amountPaid = invoice.Total
	}

	_, err = qtx.MarkInvoicePaid(ctx, sqlc.MarkInvoicePaidParams{
		ID:          invoice.ID,
		AmountPaid:  amountPaid,
		PaidAt:      pgtype.Timestamptz{Time: paidAt, Valid: true},
		NombaTxnRef: strPtr(cardData.TransactionID),
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Info("invoice already paid during mark", "invoice_id", invoice.ID)
			return nil
		}
		return fmt.Errorf("mark invoice paid: %w", err)
	}

	periodEnd := CalculatePeriodEnd(now, plan)
	_, err = qtx.UpdateSubscriptionPeriodAndStatus(ctx, sqlc.UpdateSubscriptionPeriodAndStatusParams{
		ID:     sub.ID,
		Status: sqlc.SubscriptionStatusActive,
		CurrentPeriodStart: pgtype.Timestamptz{
			Time:  now,
			Valid: true,
		},
		CurrentPeriodEnd: pgtype.Timestamptz{
			Time:  periodEnd,
			Valid: true,
		},
	})
	if err != nil {
		return fmt.Errorf("activate subscription: %w", err)
	}

	if err := writeTimelineEvent(ctx, qtx, sub, "subscription_activated", "Card payment confirmed"); err != nil {
		return err
	}

	return queueMerchantWebhook(ctx, qtx, sub.MerchantID, sub.ID, "subscription.activated", map[string]any{
		"subscription_id": sub.ID,
		"customer_id":     sub.CustomerID,
		"invoice_id":      invoice.ID,
		"amount_paid":     amountPaid,
		"currency":        invoice.Currency,
	})
}

func (p *PaymentSvc) handleDVATransferReceived(ctx context.Context, qtx *sqlc.Queries, rawData json.RawMessage) error {
	var data nomba.PaymentSuccessData
	if err := json.Unmarshal(rawData, &data); err != nil {
		var legacy struct {
			AccountRef    string `json:"accountRef"`
			Amount        int64  `json:"amount"`
			TransactionID string `json:"transactionId"`
			SenderBank    string `json:"senderBank"`
			PaidAt        string `json:"paidAt"`
		}
		if err2 := json.Unmarshal(rawData, &legacy); err2 != nil {
			return fmt.Errorf("parse dva transfer data: %w", err)
		}
		return p.processDVATransfer(ctx, qtx, nomba.DVATransferData{
			AccountRef:    legacy.AccountRef,
			AmountKobo:    legacy.Amount,
			TransactionID: legacy.TransactionID,
			SenderBank:    legacy.SenderBank,
			PaidAt:        legacy.PaidAt,
		})
	}

	return p.processDVATransfer(ctx, qtx, parseDVATransferData(data))
}

func parseCardPaymentData(data nomba.PaymentSuccessData) nomba.CardPaymentData {
	result := nomba.CardPaymentData{
		MerchantTxRef: data.Transaction.MerchantTxRef,
		AmountKobo:    nombaAmountToKobo(data.Transaction.TransactionAmount),
		TransactionID: data.Transaction.TransactionID,
		PaidAt:        data.Transaction.Time,
	}
	if data.Order != nil {
		result.OrderRef = data.Order.OrderReference
		result.Currency = data.Order.Currency
		if result.AmountKobo == 0 {
			result.AmountKobo = nombaAmountToKobo(data.Order.Amount)
		}
	}
	if data.TokenizedCardData != nil {
		result.TokenKey = data.TokenizedCardData.TokenKey
	}
	if result.OrderRef == "" {
		result.OrderRef = result.MerchantTxRef
	}
	return result
}

func parseDVATransferData(data nomba.PaymentSuccessData) nomba.DVATransferData {
	return nomba.DVATransferData{
		AccountRef:    data.Transaction.AliasAccountReference,
		AmountKobo:    nombaAmountToKobo(data.Transaction.TransactionAmount),
		TransactionID: data.Transaction.TransactionID,
		SenderBank:    data.Customer.BankName,
		SenderName:    data.Customer.SenderName,
		PaidAt:        data.Transaction.Time,
	}
}

func (p *PaymentSvc) processDVATransfer(ctx context.Context, qtx *sqlc.Queries, data nomba.DVATransferData) error {
	if data.AccountRef == "" {
		slog.Warn("dva transfer missing account ref")
		return nil
	}

	dva, err := qtx.GetDVAByAccountRef(ctx, data.AccountRef)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Warn("dva not found", "account_ref", data.AccountRef)
			return nil
		}
		return fmt.Errorf("lookup dva: %w", err)
	}

	sub, err := qtx.GetSubscriptionByID(ctx, dva.SubscriptionID)
	if err != nil {
		return fmt.Errorf("lookup subscription: %w", err)
	}

	plan, err := qtx.GetPlanByIDAndMerchant(ctx, sqlc.GetPlanByIDAndMerchantParams{
		MerchantID: sub.MerchantID,
		ID:         sub.PlanID,
	})
	if err != nil {
		return fmt.Errorf("lookup plan: %w", err)
	}

	receivedAt := parsePaidAt(data.PaidAt, time.Now())

	txnID := data.TransactionID
	if txnID == "" {
		txnID = fmt.Sprintf("dva_%s_%d_%d", data.AccountRef, data.AmountKobo, receivedAt.Unix())
	}
	data.TransactionID = txnID

	if sub.Status == sqlc.SubscriptionStatusPaused {
		return p.storePendingCredit(ctx, qtx, dva, sub, data, sqlc.PendingCreditReasonReceivedDuringPause, receivedAt, nil)
	}

	if sub.Status == sqlc.SubscriptionStatusCancelled || sub.Status == sqlc.SubscriptionStatusExpired {
		if err := p.storePendingCredit(ctx, qtx, dva, sub, data, sqlc.PendingCreditReasonReceivedAfterCancellation, receivedAt, nil); err != nil {
			return err
		}
		return queueMerchantWebhook(ctx, qtx, sub.MerchantID, sub.ID, "dva_payment_after_cancellation", map[string]any{
			"subscription_id": sub.ID,
			"amount":          data.AmountKobo,
			"account_ref":     data.AccountRef,
		})
	}

	expectedAmount := plan.Amount
	if plan.PlanType != sqlc.PlanTypeFlat {
		expectedAmount = 0
	}

	if expectedAmount > 0 && data.AmountKobo < expectedAmount {
		if err := p.storePendingCredit(ctx, qtx, dva, sub, data, sqlc.PendingCreditReasonUnderpayment, receivedAt, nil); err != nil {
			return err
		}
		return queueMerchantWebhook(ctx, qtx, sub.MerchantID, sub.ID, "dva_underpayment", map[string]any{
			"subscription_id":    sub.ID,
			"received_amount":    data.AmountKobo,
			"expected_amount":    expectedAmount,
			"outstanding_amount": expectedAmount - data.AmountKobo,
		})
	}

	var excess int64
	if expectedAmount > 0 && data.AmountKobo > expectedAmount {
		excess = data.AmountKobo - expectedAmount
	}

	invoice, err := qtx.GetOpenInvoiceForSubscription(ctx, sub.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Warn("no open invoice for dva payment", "subscription_id", sub.ID)
			return nil
		}
		return fmt.Errorf("lookup open invoice: %w", err)
	}

	if invoice.Status == sqlc.InvoiceStatusPaid {
		slog.Info("invoice already paid for dva transfer", "invoice_id", invoice.ID)
		return nil
	}

	payAmount := data.AmountKobo
	if expectedAmount > 0 && payAmount > expectedAmount {
		payAmount = expectedAmount
	}

	_, err = qtx.MarkInvoicePaid(ctx, sqlc.MarkInvoicePaidParams{
		ID:          invoice.ID,
		AmountPaid:  payAmount,
		PaidAt:      pgtype.Timestamptz{Time: receivedAt, Valid: true},
		NombaTxnRef: strPtr(data.TransactionID),
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil
		}
		return fmt.Errorf("mark invoice paid: %w", err)
	}

	now := time.Now()
	periodEnd := CalculatePeriodEnd(now, plan)
	eventType := "subscription_activated"
	merchantEvent := "subscription.activated"
	newStatus := sqlc.SubscriptionStatusActive

	switch sub.Status {
	case sqlc.SubscriptionStatusActive:
		eventType = "subscription_renewed"
		merchantEvent = "subscription.renewed"
	case sqlc.SubscriptionStatusTrialing, sqlc.SubscriptionStatusPending:
		eventType = "subscription_activated"
		merchantEvent = "subscription.activated"
	}

	_, err = qtx.UpdateSubscriptionPeriodAndStatus(ctx, sqlc.UpdateSubscriptionPeriodAndStatusParams{
		ID:                 sub.ID,
		Status:             newStatus,
		CurrentPeriodStart: pgtype.Timestamptz{Time: now, Valid: true},
		CurrentPeriodEnd:   pgtype.Timestamptz{Time: periodEnd, Valid: true},
	})
	if err != nil {
		return fmt.Errorf("update subscription period: %w", err)
	}

	if err := writeTimelineEvent(ctx, qtx, sub, eventType, "DVA transfer received"); err != nil {
		return err
	}

	if excess > 0 {
		overData := data
		overData.AmountKobo = excess
		if err := p.storePendingCredit(ctx, qtx, dva, sub, overData, sqlc.PendingCreditReasonOverpayment, receivedAt, nil); err != nil {
			return err
		}
	}

	return queueMerchantWebhook(ctx, qtx, sub.MerchantID, sub.ID, merchantEvent, map[string]any{
		"subscription_id": sub.ID,
		"customer_id":     sub.CustomerID,
		"invoice_id":      invoice.ID,
		"amount_paid":     payAmount,
		"currency":        invoice.Currency,
	})
}

func (p *PaymentSvc) storePendingCredit(
	ctx context.Context,
	qtx *sqlc.Queries,
	dva sqlc.DedicatedVirtualAccount,
	sub sqlc.Subscription,
	data nomba.DVATransferData,
	reason sqlc.PendingCreditReason,
	receivedAt time.Time,
) error {
	_, err := qtx.CreatePendingCredit(ctx, sqlc.CreatePendingCreditParams{
		MerchantID:     sub.MerchantID,
		SubscriptionID: sub.ID,
		DvaID:          dva.ID,
		Amount:         data.AmountKobo,
		Currency:       "NGN",
		Reason:         reason,
		NombaTxnID:     data.TransactionID,
		SenderBank:     strPtr(data.SenderBank),
		ReceivedAt:     pgtype.Timestamptz{Time: receivedAt, Valid: true},
	})
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			slog.Info("duplicate pending credit ignored", "txn_id", data.TransactionID)
			return nil
		}
		return fmt.Errorf("create pending credit: %w", err)
	}
	slog.Info("pending credit stored", "reason", reason, "amount", data.AmountKobo, "subscription_id", sub.ID)
	return nil
}

func writeTimelineEvent(ctx context.Context, qtx *sqlc.Queries, sub sqlc.Subscription, eventType, reason string) error {
	toState, err := json.Marshal(sub)
	if err != nil {
		return fmt.Errorf("marshal subscription state: %w", err)
	}
	return qtx.CreateSubscriptionEventsTimeline(ctx, sqlc.CreateSubscriptionEventsTimelineParams{
		SubscriptionID: sub.ID,
		MerchantID:     sub.MerchantID,
		EventType:      eventType,
		FromState:      nil,
		ToState:        toState,
		Actor:          "nomba_webhook",
		ActorID:        nil,
		Reason:         &reason,
	})
}

func queueMerchantWebhook(ctx context.Context, qtx *sqlc.Queries, merchantID, subscriptionID uuid.UUID, eventType string, payload any) error {
	webhookConfig, err := qtx.GetMerchantWebhookConfig(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Info("merchant has no webhook URL configured", "merchant_id", merchantID)
			return nil
		}
		return fmt.Errorf("get merchant webhook config: %w", err)
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal webhook payload: %w", err)
	}

	idempotencyKey := fmt.Sprintf("%s_%s", eventType, uuid.New().String())

	_, err = qtx.InsertWebhookDelivery(ctx, sqlc.InsertWebhookDeliveryParams{
		MerchantID:     merchantID,
		SubscriptionID: subscriptionID,
		EventType:      eventType,
		Payload:        payloadBytes,
		IdempotencyKey: idempotencyKey,
		WebhookUrl:     webhookConfig.WebhookUrl,
	})
	if err != nil {
		return fmt.Errorf("queue webhook delivery: %w", err)
	}

	slog.Info("merchant webhook queued", "event_type", eventType, "merchant_id", merchantID)
	return nil
}

func parsePaidAt(raw string, fallback time.Time) time.Time {
	if raw == "" {
		return fallback
	}
	if t, err := time.Parse(time.RFC3339, raw); err == nil {
		return t
	}
	return fallback
}

func strPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
