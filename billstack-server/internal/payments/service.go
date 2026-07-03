package payments

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

type PaymentsService interface {
	CreateCheckOutOrder(ctx context.Context, arg CreateOrderRequest) (CreateOrderResponse, error)
	ChargeTokenizedCard(ctx context.Context, arg ChargeCardRequest) (ChargeCardResponse, error)
	ProvisionDva(ctx context.Context, arg ProvisionDVARequest) (ProvisionDVAResponse, error)
	SuspendDva(ctx context.Context, arg SuspendDVARequest) (SuspendDVAResponse, error)
	ExpireDva(ctx context.Context, arg ExpireDVARequest) (ExpireDVAResponse, error)
	LookupDva(ctx context.Context, arg LookupDVARequest) (LookupDVAResponse, error)
	VerifyTransaction(ctx context.Context, arg VerifyTransactionRequest) (VerifyTransactionResponse, error)
	HandleNombaWebhook(ctx context.Context, payload []byte, signature, timestamp string) error
}

type PaymentSvc struct {
	db      sqlc.Querier
	queries *sqlc.Queries
	dbPool  *pgxpool.Pool
}

func NewPaymentService(dbPool *pgxpool.Pool, queries *sqlc.Queries) PaymentsService {
	return &PaymentSvc{
		db:      queries,
		queries: queries,
		dbPool:  dbPool,
	}
}
