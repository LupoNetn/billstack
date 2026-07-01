package payments

import (
	"context"
	"net/http"

	"github.com/luponetn/billstack/internal/nomba"
)

func (p *PaymentSvc) CreateCheckOutOrder(ctx context.Context, arg CreateOrderRequest) (CreateOrderResponse, error) {
	body := nomba.CreateCheckoutOrderRequest{
		Order: nomba.CheckoutOrder{
			OrderReference: arg.OrderReference,
			Amount:         arg.Amount,
			Currency:       arg.Currency,
			CustomerEmail:  arg.CustomerEmail,
			CallbackURL:    arg.CallbackURL,
		},
		TokenizeCard: arg.TokenizeCard,
	}

	var result nomba.CreateCheckoutOrderResponse
	err := nomba.Cache.Do(ctx, http.MethodPost, "/checkout/order", body, &result)
	if err != nil {
		return CreateOrderResponse{}, err
	}

	return CreateOrderResponse{
		CheckoutLink:   result.Data.CheckoutLink,
		OrderReference: result.Data.OrderReference,
	}, nil
}

func (p *PaymentSvc) ChargeTokenizedCard(ctx context.Context, arg ChargeCardRequest) (ChargeCardResponse, error) {
	return ChargeCardResponse{}, nil
}
