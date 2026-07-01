package merchants

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

// Errors
var (
	ErrMerchantAlreadyOnboarded             = errors.New("merchant already onboarded")
	ErrMerchantNotFound                     = errors.New("merchant not found")
	ErrEmailAlreadyVerified                 = errors.New("email already verified")
	ErrWrongEmail                           = errors.New("wrong email")
	ErrMismatchInMerchantID                 = errors.New("merchants id's gotten are different")
	ErrInvalidSplitValue                    = errors.New("split percentage must be between 1 and 100")
	ErrSplitTotalExceeded                   = errors.New("total active split percentage exceeds 100%")
	ErrInvalidRecepientType                 = errors.New("invalid split recipient type")
	ErrInvalidSplitType                     = errors.New("invalid split type")
	ErrSplitConfigNotFound                  = errors.New("split config not found")
	ErrWebhookConfigNotFound                = errors.New("webhook config not found")
	ErrPortalConfigNotFound                 = errors.New("portal config not found")
	ErrEmailVerificationCodeNotFound        = errors.New("no verification code was found")
	ErrEmailVerificationCodeExpired         = errors.New("email verification code expired")
	ErrEmailVerificationCodeAlreadyVerified = errors.New("email verification code already verified")
	ErrWrongEmailVerificationCode           = errors.New("wrong email verification code")
)

//Request Types

type CompleteProfileOnboardingRequest struct {
	PhoneNumber  string `json:"phone_number"  binding:"required"`
	BusinessName string `json:"business_name"`
	BuisnessType string `json:"buisness_type" binding:"required"`
	WebsiteUrl   string `json:"website_url"`
}

type CreateSettlementAccountRequest struct {
	BankName      string `json:"bank_name"      binding:"required"`
	AccountNumber string `json:"account_number" binding:"required"`
	AccountName   string `json:"account_name"   binding:"required"`
	BankCode      string `json:"bank_code"      binding:"required"`
	IsPrimary     bool   `json:"is_primary"`
}

type VerifyEmailRequest struct {
	Code string `json:"code" binding:"required"`
}

// SetWebhookURLRequest — only the url is needed; secret is generated server-side.
type SetWebhookURLRequest struct {
	WebhookURL string `json:"webhook_url" binding:"required,url"`
}

// SavePortalConfigRequest — all fields optional, only supplied ones are updated.
type SavePortalConfigRequest struct {
	LogoURL           *string `json:"logo_url"           binding:"omitempty,url"`
	PrimaryColor      *string `json:"primary_color"`
	SecondaryColor    *string `json:"secondary_color"`
	SupportEmail      *string `json:"support_email"      binding:"omitempty,email"`
	ReturnURL         *string `json:"return_url"         binding:"omitempty,url"`
	SmartRetryEnabled *bool   `json:"smart_retry_enabled"`
}

type CreateSplitConfigRequest struct {
	Label          string  `json:"label"           binding:"required"`
	RecepientType  string  `json:"recepient_type"  binding:"required"` // platform, merchant, third_party
	NombaAccountID *string `json:"nomba_account_id"`
	SplitType      string  `json:"split_type"      binding:"required"` // percentage, fixed
	Value          int64   `json:"value"           binding:"required,gt=0"`
	Active         *bool   `json:"active"`
}

// UpdateSplitConfigRequest — all fields optional, only supplied ones are updated.
type UpdateSplitConfigRequest struct {
	Label          *string `json:"label"`
	RecepientType  *string `json:"recepient_type"`
	NombaAccountID *string `json:"nomba_account_id"`
	SplitType      *string `json:"split_type"`
	Value          *int64  `json:"value" binding:"omitempty,gt=0"`
	Active         *bool   `json:"active"`
}

// Response DTOs

type MerchantResponse struct {
	ID            string    `json:"id"`
	PersonalName  string    `json:"personal_name"`
	Email         string    `json:"email"`
	PhoneNumber   *string   `json:"phone_number,omitempty"`
	BusinessName  *string   `json:"business_name,omitempty"`
	BusinessType  *string   `json:"business_type,omitempty"`
	WebsiteURL    *string   `json:"website_url,omitempty"`
	Status        string    `json:"status"`
	KybTier       string    `json:"kyb_tier"`
	EmailVerified bool      `json:"email_verified"`
	CreatedAt     time.Time `json:"created_at"`
}

// MerchantMeResponse extends MerchantResponse with onboarding health signals.
type MerchantMeResponse struct {
	MerchantResponse
	WebhookConfigured    bool `json:"webhook_configured"`
	SettlementConfigured bool `json:"settlement_configured"`
}

// WebhookConfigResponse is a clean representation (secret masked).
type WebhookConfigResponse struct {
	ID         string    `json:"id"`
	WebhookURL string    `json:"webhook_url"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// PortalConfigResponse strips pgtype wrappers.
type PortalConfigResponse struct {
	ID                string    `json:"id"`
	MerchantID        string    `json:"merchant_id"`
	LogoURL           *string   `json:"logo_url,omitempty"`
	PrimaryColor      *string   `json:"primary_color,omitempty"`
	SecondaryColor    *string   `json:"secondary_color,omitempty"`
	SupportEmail      *string   `json:"support_email,omitempty"`
	ReturnURL         *string   `json:"return_url,omitempty"`
	SmartRetryEnabled bool      `json:"smart_retry_enabled"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// SplitConfigResponse strips pgtype.UUID and pgtype.Timestamptz.
type SplitConfigResponse struct {
	ID             string    `json:"id"`
	MerchantID     string    `json:"merchant_id"`
	Label          string    `json:"label"`
	RecepientType  string    `json:"recepient_type"`
	NombaAccountID *string   `json:"nomba_account_id,omitempty"`
	SplitType      string    `json:"split_type"`
	Value          int64     `json:"value"`
	Active         bool      `json:"active"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// SettlementAccountResponse strips pgtype.UUID.
type SettlementAccountResponse struct {
	ID            string    `json:"id"`
	MerchantID    string    `json:"merchant_id"`
	BankName      string    `json:"bank_name"`
	AccountNumber string    `json:"account_number"`
	AccountName   string    `json:"account_name"`
	BankCode      string    `json:"bank_code"`
	Verified      bool      `json:"verified"`
	IsPrimary     bool      `json:"is_primary"`
	CreatedAt     time.Time `json:"created_at"`
}

// WebhookPingResult is returned by the test-ping endpoint.
type WebhookPingResult struct {
	URL        string `json:"url"`
	StatusCode int    `json:"status_code"`
	LatencyMs  int64  `json:"latency_ms"`
	Success    bool   `json:"success"`
	Error      string `json:"error,omitempty"`
}

// ApiKeysResponse holds the one-time display of raw API keys.
type ApiKeysResponse struct {
	LiveApiKey string `json:"live_api_key"`
	TestApiKey string `json:"test_api_key"`
	Note       string `json:"note"`
}

// Mappers

func toMerchantResponse(m interface{ GetID() uuid.UUID }) MerchantResponse {
	// Used inline in handlers — kept simple so types stay in one place.
	return MerchantResponse{}
}
