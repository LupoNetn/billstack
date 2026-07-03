package payments

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/luponetn/billstack/internal/nomba"
)

func (p *PaymentSvc) ProvisionDva(ctx context.Context, arg ProvisionDVARequest) (ProvisionDVAResponse, error) {
	currency := arg.Currency
	if currency == "" {
		currency = "NGN"
	}

	body := nomba.CreateDVARequest{
		AccountRef:     arg.AccountRef,
		AccountName:    arg.AccountName,
		Currency:       currency,
		Bvn:            arg.Bvn,
		CallbackURL:    arg.CallbackURL,
		ExpiryDate:     arg.ExpiryDate,
	}
	if arg.ExpectedAmount > 0 {
		body.ExpectedAmount = float64(arg.ExpectedAmount)
	}

	var response nomba.CreateDVAResponse
	if err := nomba.Cache.Do(ctx, http.MethodPost, "/accounts/virtual", body, &response); err != nil {
		slog.Error("dva provision failed", "account_ref", arg.AccountRef, "error", err)
		return ProvisionDVAResponse{}, err
	}

	slog.Info("dva provisioned", "account_ref", response.Data.AccountRef)

	return ProvisionDVAResponse{
		AccountRef:        response.Data.AccountRef,
		AccountHolderID:   response.Data.AccountHolderID,
		BankAccountNumber: response.Data.BankAccountNumber,
		BankAccountName:   response.Data.BankAccountName,
		BankName:          response.Data.BankName,
		Currency:          response.Data.Currency,
		Expired:           response.Data.Expired,
	}, nil
}

func (p *PaymentSvc) SuspendDva(ctx context.Context, arg SuspendDVARequest) (SuspendDVAResponse, error) {
	path := fmt.Sprintf("/accounts/suspend/%s", arg.AccountID)
	var response nomba.SuspendVirtualAccountResponse
	if err := nomba.Cache.Do(ctx, http.MethodPut, path, nil, &response); err != nil {
		slog.Error("dva suspend failed", "account_id", arg.AccountID, "error", err)
		return SuspendDVAResponse{}, err
	}

	slog.Info("dva suspended", "account_id", arg.AccountID)

	return SuspendDVAResponse{Suspended: response.Data.Suspended}, nil
}

func (p *PaymentSvc) ExpireDva(ctx context.Context, arg ExpireDVARequest) (ExpireDVAResponse, error) {
	path := fmt.Sprintf("/accounts/virtual/%s", arg.AccountRef)
	var response nomba.ExpireVirtualAccountResponse
	if err := nomba.Cache.Do(ctx, http.MethodDelete, path, nil, &response); err != nil {
		slog.Error("dva expire failed", "account_ref", arg.AccountRef, "error", err)
		return ExpireDVAResponse{}, err
	}

	slog.Info("dva expired", "account_ref", arg.AccountRef)

	return ExpireDVAResponse{Expired: response.Data.Expired}, nil
}

func (p *PaymentSvc) LookupDva(ctx context.Context, arg LookupDVARequest) (LookupDVAResponse, error) {
	path := fmt.Sprintf("/accounts/virtual/%s", arg.Identifier)
	var response nomba.LookupVirtualAccountResponse
	if err := nomba.Cache.Do(ctx, http.MethodGet, path, nil, &response); err != nil {
		slog.Error("dva lookup failed", "identifier", arg.Identifier, "error", err)
		return LookupDVAResponse{}, err
	}

	return LookupDVAResponse{
		AccountRef:        response.Data.AccountRef,
		AccountHolderID:   response.Data.AccountHolderID,
		BankAccountNumber: response.Data.BankAccountNumber,
		BankAccountName:   response.Data.BankAccountName,
		BankName:          response.Data.BankName,
		Currency:          response.Data.Currency,
		Expired:           response.Data.Expired,
	}, nil
}
