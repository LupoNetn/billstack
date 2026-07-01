package payments

import (
	"context"

	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

type PaymentsService interface {
	CreateCheckOutOrder(ctx context.Context, arg CreateOrderRequest) (CreateOrderResponse, error)
	ChargeTokenizedCard(ctx context.Context, arg ChargeCardRequest) (ChargeCardResponse, error)
	ProvisionDva(ctx context.Context, arg ProvisionDVARequest) (ProvisionDVAResponse, error)
	// SuspendDva(ctx context.Context) ()
	// ExpireDva(ctx context.Context) ()
}

type PaymentSvc struct {
	db sqlc.Querier
}

func NewPaymentService(db sqlc.Querier) PaymentsService {
	return &PaymentSvc{
		db: db,
	}
}
