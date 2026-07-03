package payments

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/luponetn/billstack/internal/nomba"
)

func (p *PaymentSvc) CreateCheckOutOrder(ctx context.Context, arg CreateOrderRequest) (CreateOrderResponse, error) {
	order := nomba.CheckoutOrder{
		OrderReference: arg.OrderReference,
		Amount:         nomba.KoboAmount(arg.Amount),
		Currency:       arg.Currency,
		CustomerEmail:  arg.CustomerEmail,
		CustomerID:     arg.CustomerID,
		CallbackURL:    arg.CallbackURL,
		AccountID:      arg.AccountID,
		OrderMetaData:  arg.OrderMetaData,
	}
	if len(arg.AllowedPaymentMethods) > 0 {
		order.AllowedPaymentMethods = arg.AllowedPaymentMethods
	}
	if arg.SplitRequest != nil {
		order.SplitRequest = mapSplitRequest(arg.SplitRequest)
	}

	body := nomba.CreateCheckoutOrderRequest{
		Order:        order,
		TokenizeCard: arg.TokenizeCard,
	}

	var result nomba.CreateCheckoutOrderResponse
	if err := nomba.Cache.Do(ctx, http.MethodPost, "/checkout/order", body, &result); err != nil {
		slog.Error("nomba checkout order failed", "order_ref", arg.OrderReference, "error", err)
		return CreateOrderResponse{}, err
	}

	if result.Code != "" && result.Code != "00" {
		return CreateOrderResponse{}, fmt.Errorf("nomba checkout error: code %s", result.Code)
	}

	slog.Info("checkout order created", "order_ref", result.Data.OrderReference)

	return CreateOrderResponse{
		CheckoutLink:   result.Data.CheckoutLink,
		OrderReference: result.Data.OrderReference,
	}, nil
}

func (p *PaymentSvc) ChargeTokenizedCard(ctx context.Context, arg ChargeCardRequest) (ChargeCardResponse, error) {
	order := nomba.CheckoutOrder{
		OrderReference: arg.OrderReference,
		Amount:         nomba.KoboAmount(arg.Amount),
		Currency:       arg.Currency,
		CustomerEmail:  arg.CustomerEmail,
		CustomerID:     arg.CustomerID,
		CallbackURL:    arg.CallbackURL,
		AccountID:      arg.AccountID,
	}
	if arg.SplitRequest != nil {
		order.SplitRequest = mapSplitRequest(arg.SplitRequest)
	}

	body := nomba.ChargeTokenizedCardRequest{
		Order:    order,
		TokenKey: arg.TokenKey,
	}

	var result nomba.ChargeTokenizedCardResponse
	if err := nomba.Cache.Do(ctx, http.MethodPost, "/checkout/tokenized-card-payment", body, &result); err != nil {
		declineCode := extractDeclineCode(err.Error())
		declineType := CategorizeDecline(declineCode)
		slog.Warn("tokenized card charge failed",
			"order_ref", arg.OrderReference,
			"decline_code", declineCode,
			"decline_type", declineType,
			"error", err,
		)
		return ChargeCardResponse{
			Success:     false,
			DeclineCode: declineCode,
			DeclineType: declineType,
			Message:     err.Error(),
		}, nil
	}

	if result.Code != "00" {
		declineCode := result.Data.ResponseCode
		if declineCode == "" {
			declineCode = result.Code
		}
		declineType := CategorizeDecline(declineCode)
		slog.Warn("tokenized card charge declined",
			"order_ref", arg.OrderReference,
			"code", result.Code,
			"decline_code", declineCode,
			"decline_type", declineType,
		)
		return ChargeCardResponse{
			Success:     false,
			DeclineCode: declineCode,
			DeclineType: declineType,
			Message:     result.Description,
		}, nil
	}

	slog.Info("tokenized card charge succeeded", "order_ref", arg.OrderReference)

	return ChargeCardResponse{
		Success:     result.Data.Status,
		DeclineCode: result.Data.ResponseCode,
		DeclineType: "",
		Message:     result.Data.Message,
	}, nil
}

func extractDeclineCode(errMsg string) string {
	// Nomba errors look like "nomba error 51: Insufficient funds"
	parts := strings.SplitN(errMsg, " ", 4)
	if len(parts) >= 3 && parts[0] == "nomba" && parts[1] == "error" {
		return strings.TrimSuffix(parts[2], ":")
	}
	return ""
}

func mapSplitRequest(sr *SplitRequest) *nomba.SplitRequest {
	if sr == nil {
		return nil
	}
	items := make([]nomba.SplitListItem, len(sr.SplitList))
	for i, item := range sr.SplitList {
		items[i] = nomba.SplitListItem{
			AccountID: item.AccountID,
			Value:     item.Value,
		}
	}
	return &nomba.SplitRequest{
		SplitType: sr.SplitType,
		SplitList: items,
	}
}

func (p *PaymentSvc) VerifyTransaction(ctx context.Context, arg VerifyTransactionRequest) (VerifyTransactionResponse, error) {
	path := fmt.Sprintf("/transactions/%s", arg.TransactionID)
	var result nomba.VerifyTransactionResponse
	if err := nomba.Cache.Do(ctx, http.MethodGet, path, nil, &result); err != nil {
		return VerifyTransactionResponse{}, err
	}
	return VerifyTransactionResponse{
		TransactionID: result.Data.TransactionID,
		MerchantTxRef: result.Data.MerchantTxRef,
		AmountKobo:    int64(result.Data.TransactionAmount),
		Status:        result.Data.Status,
		Type:          result.Data.Type,
		Time:          result.Data.Time,
	}, nil
}
