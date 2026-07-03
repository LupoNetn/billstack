package subscriptions

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/payments"
)

type Service interface {
	CreateSubscription(ctx context.Context, arg CreateSubscriptionRequest, merchantID uuid.UUID) (CreateSubscriptionResponse, error)
}

type Svc struct {
	db              sqlc.Querier
	queries         *sqlc.Queries
	dbPool          *pgxpool.Pool
	payments        payments.PaymentsService
	cardCallbackURL string
}

func NewService(db sqlc.Querier, dbPool *pgxpool.Pool, queries *sqlc.Queries, payments payments.PaymentsService, cardCallbackURL string) Service {
	return &Svc{
		db:              db,
		dbPool:          dbPool,
		queries:         queries,
		payments:        payments,
		cardCallbackURL: cardCallbackURL,
	}
}

func (s *Svc) CreateSubscription(ctx context.Context, arg CreateSubscriptionRequest, merchantID uuid.UUID) (CreateSubscriptionResponse, error) {
	plan, err := s.db.GetPlanByIDAndMerchant(ctx, sqlc.GetPlanByIDAndMerchantParams{
		MerchantID: merchantID,
		ID:         arg.PlanID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Error("no plan for this subscription was found", "error", err)
			return CreateSubscriptionResponse{}, ErrNoPlansFoundForSubscription
		}
		slog.Error("something went wrong, please try again later", "error", err)
		return CreateSubscriptionResponse{}, err
	}

	if plan.Status == sqlc.PlanStatusArchived {
		slog.Warn("this plan cannot be subscribed too at this moment as it has been archived")
		return CreateSubscriptionResponse{}, ErrPlanArchived
	}

	var trialDays int
	if plan.TrialDays > 0 {
		trialDays = int(plan.TrialDays)
	}

	tx, err := s.dbPool.Begin(ctx)
	if err != nil {
		return CreateSubscriptionResponse{}, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)

	var trialEndsAt pgtype.Timestamptz
	if trialDays > 0 {
		trialEndsAt.Time = time.Now().AddDate(0, 0, trialDays)
		trialEndsAt.Valid = true
	}

	var metadata []byte
	if arg.Metadata != nil {
		metadata = *arg.Metadata
	}

	sub, err := qtx.CreateSubscription(ctx, sqlc.CreateSubscriptionParams{
		MerchantID:        merchantID,
		CustomerID:        arg.CustomerID,
		CustomerEmail:     arg.CustomerEmail,
		CustomerName:      arg.CustomerName,
		TrialEndsAt:       trialEndsAt,
		PlanID:            arg.PlanID,
		PaymentMethodType: arg.PaymentMethodType,
		Status:            sqlc.SubscriptionStatusPending,
		Metadata:          metadata,
	})
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			if pgErr.Code == "23505" {
				slog.Error("a subscription already exists for this particular customer", "customer_id", sub.CustomerID)
				return CreateSubscriptionResponse{}, ErrSubscriptionForCustomerAlreadyExists
			}
		}

		slog.Error("Something went wrong, try again later", "error", err)
		return CreateSubscriptionResponse{}, err
	}

	paymentMethod := string(sub.PaymentMethodType)
	var invoiceDueDate pgtype.Timestamptz
	if trialDays > 0 {
		invoiceDueDate.Time = time.Now().AddDate(0, 0, trialDays)
		invoiceDueDate.Valid = true
	} else {
		invoiceDueDate.Time = time.Now()
		invoiceDueDate.Valid = true
	}

	var InvoicePlanAmount int64
	if plan.PlanType == sqlc.PlanTypeFlat {
		InvoicePlanAmount = plan.Amount
	} else {
		InvoicePlanAmount = 0
	}
	now := time.Now()
	periodEnd := payments.CalculatePeriodEnd(now, plan)
	periodStart := pgtype.Timestamptz{Time: now, Valid: true}
	periodEndTs := pgtype.Timestamptz{Time: periodEnd, Valid: true}
	if trialDays > 0 {
		periodEndTs = trialEndsAt
	}

	invoice, invoiceErr := qtx.CreateInvoice(ctx, sqlc.CreateInvoiceParams{
		MerchantID:        merchantID,
		SubscriptionID:    sub.ID,
		CustomerID:        sub.CustomerID,
		InvoiceType:       sqlc.InvoiceTypeSubscription,
		Total:             InvoicePlanAmount,
		Currency:          plan.Currency,
		PeriodStart:       periodStart,
		PeriodEnd:         periodEndTs,
		Status:            sqlc.InvoiceStatusOpen,
		PaymentMethodType: &paymentMethod,
		DueDate:           invoiceDueDate,
	})
	if invoiceErr != nil {
		slog.Error("Something went wrong, try again later", "error", invoiceErr)
		return CreateSubscriptionResponse{}, invoiceErr
	}

	orderRef := fmt.Sprintf("inv_%s", invoice.ID.String())
	var response CreateSubscriptionResponse

	switch sub.PaymentMethodType {
	case sqlc.PaymentMethodTypeCard:
		chargeAmount := invoice.Total
		if trialDays > 0 {
			chargeAmount = 0 // zero for trial card capture
		}
		if plan.PlanType == sqlc.PlanTypeMetered || plan.PlanType == sqlc.PlanTypePerUnit {
			chargeAmount = 0 // zero for metered and per-unit plans
		}
		result, err := s.payments.CreateCheckOutOrder(ctx, payments.CreateOrderRequest{
			OrderReference: orderRef,
			CustomerEmail:  sub.CustomerEmail,
			CustomerID:     sub.CustomerID,
			Amount:         chargeAmount,
			Currency:       invoice.Currency,
			CallbackURL:    s.cardCallbackURL,
			TokenizeCard:   true,
		})
		if err != nil {
			return CreateSubscriptionResponse{}, err
		}

		UpdateInvoiceOrderRefErr := qtx.UpdateInvoiceOrderRef(ctx, sqlc.UpdateInvoiceOrderRefParams{
			NombaOrderRef: &orderRef,
			ID:            invoice.ID,
		})
		if UpdateInvoiceOrderRefErr != nil {
			return CreateSubscriptionResponse{}, UpdateInvoiceOrderRefErr
		}

		//event timeline
		state, err := json.Marshal(sub)
		if err != nil {
			return CreateSubscriptionResponse{}, err
		}

		reason := "Subscription created"
		actorID := merchantID.String()
		err = qtx.CreateSubscriptionEventsTimeline(ctx, sqlc.CreateSubscriptionEventsTimelineParams{
			SubscriptionID: sub.ID,
			MerchantID:     merchantID,
			EventType:      "subscription_created",
			FromState:      nil,
			ToState:        state,
			Actor:          "merchant",
			ActorID:        &actorID,
			Reason:         &reason,
		})
		if err != nil {
			return CreateSubscriptionResponse{}, err
		}
		checkoutURL := result.CheckoutLink
		response = CreateSubscriptionResponse{
			Subscription: sub,
			Invoice:      invoice,
			PaymentPath:  "card",
			CheckoutURL:  &checkoutURL,
		}

	case sqlc.PaymentMethodTypeDva:
		var expectedAmount int
		if plan.PlanType == sqlc.PlanTypeFlat {
			expectedAmount = int(plan.Amount)
		} else {
			expectedAmount = 0
		}

		accountRef := fmt.Sprintf("dva_%s_%s", merchantID.String()[:8], sub.CustomerID[:8])

		result, err := s.payments.ProvisionDva(ctx, payments.ProvisionDVARequest{
			AccountRef:     accountRef,
			AccountName:    sub.CustomerName,
			Currency:       plan.Currency,
			Bvn:            arg.Bvn,
			ExpectedAmount: int64(expectedAmount),
		})
		if err != nil {
			slog.Error("could not provision dva account succesfully", "error", err)
			return CreateSubscriptionResponse{}, err
		}

		if result.AccountRef == "" || result.BankAccountName == "" {
			return CreateSubscriptionResponse{}, ErrCouldNotProvisionDVA
		}

		
		dva, err := qtx.CreateDVA(ctx, sqlc.CreateDVAParams{
			MerchantID:        merchantID,
			SubscriptionID:    sub.ID,
			CustomerID:        sub.CustomerID,
			CustomerName:      sub.CustomerName,
			AccountRef:        result.AccountRef,
			NombaAccountID:    &result.AccountHolderID,
			BankAccountNumber: result.BankAccountNumber,
			BankAccountName:   result.BankAccountName,
			BankName:          result.BankName,
			BvnHash:           nil,
			Status:            sqlc.DvaStatusActive,
		})
		if err != nil {
			return CreateSubscriptionResponse{}, err
		}

		
		err = qtx.UpdateSubscriptionDvaId(ctx, sqlc.UpdateSubscriptionDvaIdParams{
			DvaID: pgtype.UUID{
				Bytes: dva.ID,
				Valid: true,
			},
			ID: sub.ID,
		})
		if err != nil {
			return CreateSubscriptionResponse{}, err
		}

		state, err := json.Marshal(sub)
		if err != nil {
			return CreateSubscriptionResponse{}, err
		}
		reason := "Subscription created with DVA"
		actorID := merchantID.String()
		err = qtx.CreateSubscriptionEventsTimeline(ctx, sqlc.CreateSubscriptionEventsTimelineParams{
			SubscriptionID: sub.ID,
			MerchantID:     merchantID,
			EventType:      "subscription_created",
			FromState:      nil,
			ToState:        state,
			Actor:          "merchant",
			ActorID:        &actorID,
			Reason:         &reason,
		})
		if err != nil {
			return CreateSubscriptionResponse{}, err
		}

		response = CreateSubscriptionResponse{
			Subscription: sub,
			Invoice:      invoice,
			DVA: &DVAProvisionResult{
				BankAccountNumber: result.BankAccountNumber,
				BankAccountName:   result.BankAccountName,
				BankName:          result.BankName,
				AccountRef:        result.AccountRef,
				AmountKobo:        int64(expectedAmount),
			},
		}
	default:
		slog.Error("no payment method was selected", "error", err)
		return CreateSubscriptionResponse{}, nil
	}

	if err := tx.Commit(ctx); err != nil {
		return CreateSubscriptionResponse{}, err
	}
	return response, nil
}
