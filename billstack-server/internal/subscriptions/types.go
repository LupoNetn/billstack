package subscriptions

import (
	"errors"

	"github.com/google/uuid"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

// Errors
var (
	ErrSubscriptionForCustomerAlreadyExists = errors.New("a customer can only have one subscription at a time per merchant")
	ErrNoPlansFoundForSubscription          = errors.New("no plan for this subscription was found")
	ErrPlanArchived                         = errors.New("this plan has been archived already, no new subscription is allowed")
	ErrCouldNotProvisionDVA                 = errors.New("could not provision dva account succesfully")
)

type CreateSubscriptionRequest struct {
	CustomerID        string                 `json:"customer_id" binding:"required"`
	CustomerEmail     string                 `json:"customer_email" binding:"required"`
	CustomerName      string                 `json:"customer_name" binding:"required"`
	PlanID            uuid.UUID              `json:"plan_id" binding:"required"`
	Metadata          *[]byte                `json:"metadata"`
	PaymentMethodType sqlc.PaymentMethodType `json:"payment_method_type" binding:"required"`
	Bvn               string                 `json:"bvn,omitempty"`
}

type CreateSubscriptionResponse struct {
	Subscription sqlc.Subscription   `json:"subscription"`
	Invoice      sqlc.Invoice        `json:"invoice"`
	PaymentPath  string              `json:"payment_path"`
	CheckoutURL  *string             `json:"checkout_url,omitempty"`
	DVA          *DVAProvisionResult `json:"dva,omitempty"`
}

type DVAProvisionResult struct {
	BankAccountNumber string `json:"bank_account_number"`
	BankAccountName   string `json:"bank_account_name"`
	BankName          string `json:"bank_name"`
	AccountRef        string `json:"account_ref"`
	AmountKobo        int64  `json:"amount_kobo"`
}
