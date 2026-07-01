package payments

import (
	"context"
	"net/http"

	"github.com/luponetn/billstack/internal/nomba"
)

func (p *PaymentSvc) ProvisionDva(ctx context.Context, arg ProvisionDVARequest) (ProvisionDVAResponse, error) {
	body := nomba.CreateDVARequest{
		AccountRef:     arg.AccountRef,
		AccountName:    arg.AccountName,
		Bvn:            arg.Bvn,
		ExpectedAmount: arg.ExpectedAmount,
	}

	var response nomba.CreateDVAResponse
	err := nomba.Cache.Do(ctx, http.MethodPost, "/accounts/virtual", body, &response)
	if err != nil {
		return ProvisionDVAResponse{}, err
	}

	return ProvisionDVAResponse{
		AccountRef:        response.Data.AccountRef,
		AccountHolderID:   response.Data.AccountHolderId,
		BankAccountNumber: response.Data.BankAccountNumber,
		BankAccountName:   response.Data.BankAccountName,
		BankName:          response.Data.BankName,
	}, nil
}

// func (p *PaymentSvc) SuspendDva() {}

// func (p *PaymentSvc) ExpireDva() {}
