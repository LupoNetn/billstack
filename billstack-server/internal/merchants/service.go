package merchants

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/email"
	generate "github.com/luponetn/billstack/utils"
)

type Service interface {
	CompleteProfileOnboarding(ctx context.Context, arg CompleteProfileOnboardingRequest, merchantID uuid.UUID) (MerchantResponse, error)
	GetMerchant(ctx context.Context, merchantID uuid.UUID) (MerchantResponse, error)
	SendVerificationCode(ctx context.Context, email string) error
	VerifyEmailCode(ctx context.Context, email string, code string) error
	CreateApiKeys(ctx context.Context, merchantID uuid.UUID) (ApiKeysResponse, error)
	CreateSettlementAccount(ctx context.Context, arg CreateSettlementAccountRequest, merchantID uuid.UUID) (SettlementAccountResponse, error)
	GetSettlementAccounts(ctx context.Context, merchantID uuid.UUID) ([]SettlementAccountResponse, error)
	GetWebhookConfig(ctx context.Context, merchantID uuid.UUID) (WebhookConfigResponse, error)
	SetWebhookConfig(ctx context.Context, arg SetWebhookURLRequest, merchantID uuid.UUID) (WebhookConfigResponse, error)
	GetPortalConfig(ctx context.Context, merchantID uuid.UUID) (PortalConfigResponse, error)
	SavePortalConfig(ctx context.Context, arg SavePortalConfigRequest, merchantID uuid.UUID) (PortalConfigResponse, error)
	CreateSplitConfig(ctx context.Context, arg CreateSplitConfigRequest, merchantID uuid.UUID) (SplitConfigResponse, error)
	GetSplitConfigs(ctx context.Context, merchantID uuid.UUID) ([]SplitConfigResponse, error)
	GetSplitConfigByID(ctx context.Context, id uuid.UUID, merchantID uuid.UUID) (SplitConfigResponse, error)
	UpdateSplitConfig(ctx context.Context, id uuid.UUID, arg UpdateSplitConfigRequest, merchantID uuid.UUID) (SplitConfigResponse, error)
	DeleteSplitConfig(ctx context.Context, id uuid.UUID, merchantID uuid.UUID) error
}

type Svc struct {
	db     sqlc.Querier
	mailer *email.Mailer
}

func NewService(db sqlc.Querier, mailer *email.Mailer) Service {
	return &Svc{db: db, mailer: mailer}
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

func mapMerchant(m sqlc.Merchant) MerchantResponse {
	r := MerchantResponse{
		ID:            m.ID.String(),
		PersonalName:  m.PersonalName,
		Email:         m.Email,
		PhoneNumber:   m.PhoneNumber,
		BusinessName:  m.BusinessName,
		WebsiteURL:    m.WebsiteUrl,
		Status:        string(m.Status),
		KybTier:       string(m.KybTier),
		EmailVerified: m.EmailVerified,
		CreatedAt:     m.CreatedAt.Time,
	}
	if m.BuisnessType.Valid {
		s := string(m.BuisnessType.BuisnessType)
		r.BusinessType = &s
	}
	return r
}

func mapWebhookConfig(w sqlc.MerchantsWebhookUrl) WebhookConfigResponse {
	return WebhookConfigResponse{
		ID:         w.ID.String(),
		WebhookURL: w.WebhookUrl,
		CreatedAt:  w.CreatedAt.Time,
		UpdatedAt:  w.UpdatedAt.Time,
	}
}

func mapPortalConfig(p sqlc.MerchantsPortalConfig) PortalConfigResponse {
	return PortalConfigResponse{
		ID:                p.ID.String(),
		MerchantID:        uuid.UUID(p.MerchantID.Bytes).String(),
		LogoURL:           p.LogoUrl,
		PrimaryColor:      p.PrimaryColor,
		SecondaryColor:    p.SecondaryColor,
		SupportEmail:      p.SupportEmail,
		ReturnURL:         p.ReturnUrl,
		SmartRetryEnabled: p.SmartRetryEnabled.Bool,
		CreatedAt:         p.CreatedAt.Time,
		UpdatedAt:         p.UpdatedAt.Time,
	}
}

func mapSplitConfig(sc sqlc.MerchantsSplitConfig) SplitConfigResponse {
	return SplitConfigResponse{
		ID:             sc.ID.String(),
		MerchantID:     uuid.UUID(sc.MerchantID.Bytes).String(),
		Label:          sc.Label,
		RecepientType:  sc.RecepientType,
		NombaAccountID: sc.NombaAccountID,
		SplitType:      sc.SplitType,
		Value:          sc.Value,
		Active:         sc.Active,
		CreatedAt:      sc.CreatedAt.Time,
		UpdatedAt:      sc.UpdatedAt.Time,
	}
}

func mapSettlementAccount(a sqlc.MerchantsSettlementAccount) SettlementAccountResponse {
	return SettlementAccountResponse{
		ID:            a.ID.String(),
		MerchantID:    uuid.UUID(a.MerchantID.Bytes).String(),
		BankName:      a.BankName,
		AccountNumber: a.AccountNumber,
		AccountName:   a.AccountName,
		BankCode:      a.BankCode,
		Verified:      a.Verified,
		IsPrimary:     a.IsPrimary,
		CreatedAt:     a.CreatedAt.Time,
	}
}

// ─────────────────────────────────────────────────────────────────

func (s *Svc) CompleteProfileOnboarding(ctx context.Context, arg CompleteProfileOnboardingRequest, merchantID uuid.UUID) (MerchantResponse, error) {
	existing, err := s.db.GetMerchantById(ctx, merchantID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return MerchantResponse{}, ErrMerchantNotFound
		}
		return MerchantResponse{}, err
	}
	if existing.Status != sqlc.MerchantAccountStatusPending {
		return MerchantResponse{}, ErrMerchantAlreadyOnboarded
	}

	merchant, err := s.db.CompleteMerchantProfileOnboarding(ctx, sqlc.CompleteMerchantProfileOnboardingParams{
		PhoneNumber:  &arg.PhoneNumber,
		BusinessName: &arg.BusinessName,
		BuisnessType: sqlc.NullBuisnessType{
			BuisnessType: sqlc.BuisnessType(arg.BuisnessType),
			Valid:        true,
		},
		WebsiteUrl: &arg.WebsiteUrl,
		Status:     sqlc.MerchantAccountStatusBasicVerified,
		ID:         merchantID,
	})
	if err != nil {
		return MerchantResponse{}, err
	}

	_, err = s.db.UpdateMerchantKybTier(ctx, sqlc.UpdateMerchantKybTierParams{
		ID:      merchantID,
		KybTier: sqlc.KybTierTier1,
	})
	if err != nil {
		return MerchantResponse{}, err
	}

	return mapMerchant(merchant), nil
}

func (s *Svc) GetMerchant(ctx context.Context, merchantID uuid.UUID) (MerchantResponse, error) {
	m, err := s.db.GetMerchantById(ctx, merchantID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return MerchantResponse{}, ErrMerchantNotFound
		}
		return MerchantResponse{}, err
	}
	return mapMerchant(m), nil
}

//Email Verification

func (s *Svc) SendVerificationCode(ctx context.Context, emailAddr string) error {
	merchant, err := s.db.GetMerchantByEmail(ctx, emailAddr)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrMerchantNotFound
		}
		return err
	}
	if merchant.Email != emailAddr {
		return ErrWrongEmail
	}
	if merchant.EmailVerified {
		return ErrEmailAlreadyVerified
	}

	verificationCode := generate.EmailVerificationCode()

	_, err = s.db.CreateEmailVerificationCode(ctx, sqlc.CreateEmailVerificationCodeParams{
		MerchantID: merchant.ID,
		Email:      emailAddr,
		Code:       verificationCode,
		ExpiresAt: pgtype.Timestamp{
			Time:  time.Now().UTC().Add(15 * time.Minute),
			Valid: true,
		},
	})
	if err != nil {
		return err // ← was: returning wrong variable
	}

	if emailErr := s.mailer.Send(
		emailAddr,
		"Verify your email",
		"Your email verification code is "+verificationCode,
	); emailErr != nil {
		slog.Error("error sending verification email", "error", emailErr)
		return emailErr
	}

	return nil
}

func (s *Svc) VerifyEmailCode(ctx context.Context, emailAddr, code string) error {
	record, err := s.db.VerifyEmailCodeAtomic(ctx, sqlc.VerifyEmailCodeAtomicParams{
		Email: emailAddr,
		Code:  code,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrEmailVerificationCodeNotFound
		}
		return err
	}

	_, err = s.db.SetEmailVerificationStatus(ctx, sqlc.SetEmailVerificationStatusParams{
		ID:            record.MerchantID,
		EmailVerified: true,
	})
	return err
}

//API Keys

func (s *Svc) CreateApiKeys(ctx context.Context, merchantID uuid.UUID) (ApiKeysResponse, error) {
	// Revoke all existing active keys before generating new ones
	if err := s.db.RevokeAllMerchantApiKeys(ctx, pgtype.UUID{Bytes: merchantID, Valid: true}); err != nil {
		slog.Error("failed to revoke existing api keys", "merchant_id", merchantID, "error", err)
		return ApiKeysResponse{}, err
	}

	liveApiKey, hashedLiveApiKey, err := generate.ApiKey("bsk_live")
	if err != nil {
		return ApiKeysResponse{}, err
	}
	testApiKey, hashedTestApiKey, err := generate.ApiKey("bsk_test")
	if err != nil {
		return ApiKeysResponse{}, err
	}

	_, err = s.db.CreateMerchantApiKeys(ctx, sqlc.CreateMerchantApiKeysParams{
		MerchantID:  pgtype.UUID{Bytes: merchantID, Valid: true},
		KeyHash:     hashedLiveApiKey,
		KeyPrefix:   "bsk_live",
		Environment: "live",
	})
	if err != nil {
		return ApiKeysResponse{}, err
	}

	_, err = s.db.CreateMerchantApiKeys(ctx, sqlc.CreateMerchantApiKeysParams{
		MerchantID:  pgtype.UUID{Bytes: merchantID, Valid: true},
		KeyHash:     hashedTestApiKey,
		KeyPrefix:   "bsk_test",
		Environment: "test",
	})
	if err != nil {
		return ApiKeysResponse{}, err
	}

	return ApiKeysResponse{
		LiveApiKey: liveApiKey,
		TestApiKey: testApiKey,
		Note:       "Store these keys securely. They will not be shown again.",
	}, nil
}

//Settlement Accounts

func (s *Svc) CreateSettlementAccount(ctx context.Context, arg CreateSettlementAccountRequest, merchantID uuid.UUID) (SettlementAccountResponse, error) {
	_, err := s.db.GetMerchantById(ctx, merchantID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return SettlementAccountResponse{}, ErrMerchantNotFound
		}
		return SettlementAccountResponse{}, err
	}

	// TODO: name-enquiry via Nomba bank verification API
	account, err := s.db.CreateSettlementAccount(ctx, sqlc.CreateSettlementAccountParams{
		MerchantID:    pgtype.UUID{Bytes: merchantID, Valid: true},
		BankName:      arg.BankName,
		AccountNumber: arg.AccountNumber,
		AccountName:   arg.AccountName,
		BankCode:      arg.BankCode,
		IsPrimary:     arg.IsPrimary,
	})
	if err != nil {
		return SettlementAccountResponse{}, err
	}

	return mapSettlementAccount(account), nil
}

func (s *Svc) GetSettlementAccounts(ctx context.Context, merchantID uuid.UUID) ([]SettlementAccountResponse, error) {
	accounts, err := s.db.GetMerchantSettlementAccounts(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		return nil, err
	}
	result := make([]SettlementAccountResponse, 0, len(accounts))
	for _, a := range accounts {
		result = append(result, mapSettlementAccount(a))
	}
	return result, nil
}

// Webhook Config

func (s *Svc) GetWebhookConfig(ctx context.Context, merchantID uuid.UUID) (WebhookConfigResponse, error) {
	config, err := s.db.GetMerchantWebhookConfig(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return WebhookConfigResponse{}, ErrWebhookConfigNotFound
		}
		return WebhookConfigResponse{}, err
	}
	return mapWebhookConfig(config), nil
}

func (s *Svc) SetWebhookConfig(ctx context.Context, arg SetWebhookURLRequest, merchantID uuid.UUID) (WebhookConfigResponse, error) {
	_, err := s.db.GetMerchantWebhookConfig(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			secret, genErr := generate.WebhookSecret()
			if genErr != nil {
				return WebhookConfigResponse{}, genErr
			}
			cfg, dbErr := s.db.CreateMerchantWebhookConfig(ctx, sqlc.CreateMerchantWebhookConfigParams{
				MerchantID:    pgtype.UUID{Bytes: merchantID, Valid: true},
				WebhookUrl:    arg.WebhookURL,
				WebhookSecret: secret,
			})
			if dbErr != nil {
				return WebhookConfigResponse{}, dbErr
			}
			return mapWebhookConfig(cfg), nil
		}
		return WebhookConfigResponse{}, err
	}

	cfg, err := s.db.UpdateMerchantWebhookConfig(ctx, sqlc.UpdateMerchantWebhookConfigParams{
		WebhookUrl:    &arg.WebhookURL,
		WebhookSecret: nil, // preserve existing secret via COALESCE
		MerchantID:    pgtype.UUID{Bytes: merchantID, Valid: true},
	})
	if err != nil {
		return WebhookConfigResponse{}, err
	}
	return mapWebhookConfig(cfg), nil
}

// Portal Config

func (s *Svc) GetPortalConfig(ctx context.Context, merchantID uuid.UUID) (PortalConfigResponse, error) {
	config, err := s.db.GetMerchantPortalConfig(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			defaultPrimary := "#004CFF"
			defaultSecondary := "#FFFFFF"
			return PortalConfigResponse{
				MerchantID:        merchantID.String(),
				PrimaryColor:      &defaultPrimary,
				SecondaryColor:    &defaultSecondary,
				SmartRetryEnabled: true,
			}, nil
		}
		return PortalConfigResponse{}, err
	}
	return mapPortalConfig(config), nil
}

func (s *Svc) SavePortalConfig(ctx context.Context, arg SavePortalConfigRequest, merchantID uuid.UUID) (PortalConfigResponse, error) {
	var smartRetryEnabled pgtype.Bool
	if arg.SmartRetryEnabled != nil {
		smartRetryEnabled = pgtype.Bool{Bool: *arg.SmartRetryEnabled, Valid: true}
	}

	_, err := s.db.GetMerchantPortalConfig(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			primary := arg.LogoURL
			if primary == nil {
				def := "#004CFF"
				_ = def
			}
			primaryColor := arg.PrimaryColor
			if primaryColor == nil {
				def := "#004CFF"
				primaryColor = &def
			}
			secondaryColor := arg.SecondaryColor
			if secondaryColor == nil {
				def := "#FFFFFF"
				secondaryColor = &def
			}
			if !smartRetryEnabled.Valid {
				smartRetryEnabled = pgtype.Bool{Bool: true, Valid: true}
			}
			cfg, dbErr := s.db.CreateMerchantPortalConfig(ctx, sqlc.CreateMerchantPortalConfigParams{
				MerchantID:        pgtype.UUID{Bytes: merchantID, Valid: true},
				LogoUrl:           arg.LogoURL,
				PrimaryColor:      primaryColor,
				SecondaryColor:    secondaryColor,
				SupportEmail:      arg.SupportEmail,
				ReturnUrl:         arg.ReturnURL,
				SmartRetryEnabled: smartRetryEnabled,
			})
			if dbErr != nil {
				return PortalConfigResponse{}, dbErr
			}
			return mapPortalConfig(cfg), nil
		}
		return PortalConfigResponse{}, err
	}

	cfg, err := s.db.UpdateMerchantPortalConfig(ctx, sqlc.UpdateMerchantPortalConfigParams{
		LogoUrl:           arg.LogoURL,
		PrimaryColor:      arg.PrimaryColor,
		SecondaryColor:    arg.SecondaryColor,
		SupportEmail:      arg.SupportEmail,
		ReturnUrl:         arg.ReturnURL,
		SmartRetryEnabled: smartRetryEnabled,
		MerchantID:        pgtype.UUID{Bytes: merchantID, Valid: true},
	})
	if err != nil {
		return PortalConfigResponse{}, err
	}
	return mapPortalConfig(cfg), nil
}

//Split Config

func (s *Svc) CreateSplitConfig(ctx context.Context, arg CreateSplitConfigRequest, merchantID uuid.UUID) (SplitConfigResponse, error) {
	if arg.RecepientType != "platform" && arg.RecepientType != "merchant" && arg.RecepientType != "third_party" {
		return SplitConfigResponse{}, ErrInvalidRecepientType
	}
	if arg.SplitType != "percentage" && arg.SplitType != "fixed" {
		return SplitConfigResponse{}, ErrInvalidSplitType
	}
	if arg.SplitType == "percentage" && (arg.Value < 0 || arg.Value > 100) {
		return SplitConfigResponse{}, ErrInvalidSplitValue
	}

	existingConfigs, err := s.db.GetMerchantSplitConfigs(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		return SplitConfigResponse{}, err
	}

	isActive := true
	if arg.Active != nil {
		isActive = *arg.Active
	}

	if isActive && arg.SplitType == "percentage" {
		var totalPercentage int64 = arg.Value
		for _, c := range existingConfigs {
			if c.Active && c.SplitType == "percentage" {
				totalPercentage += c.Value
			}
		}
		if totalPercentage > 100 {
			return SplitConfigResponse{}, ErrSplitTotalExceeded
		}
	}

	sc, err := s.db.CreateMerchantSplitConfig(ctx, sqlc.CreateMerchantSplitConfigParams{
		MerchantID:     pgtype.UUID{Bytes: merchantID, Valid: true},
		Label:          arg.Label,
		RecepientType:  arg.RecepientType,
		NombaAccountID: arg.NombaAccountID,
		SplitType:      arg.SplitType,
		Value:          arg.Value,
		Active:         isActive,
	})
	if err != nil {
		return SplitConfigResponse{}, err
	}
	return mapSplitConfig(sc), nil
}

func (s *Svc) GetSplitConfigs(ctx context.Context, merchantID uuid.UUID) ([]SplitConfigResponse, error) {
	configs, err := s.db.GetMerchantSplitConfigs(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
	if err != nil {
		return nil, err
	}
	result := make([]SplitConfigResponse, 0, len(configs))
	for _, c := range configs {
		result = append(result, mapSplitConfig(c))
	}
	return result, nil
}

func (s *Svc) GetSplitConfigByID(ctx context.Context, id uuid.UUID, merchantID uuid.UUID) (SplitConfigResponse, error) {
	config, err := s.db.GetMerchantSplitConfigById(ctx, sqlc.GetMerchantSplitConfigByIdParams{
		ID:         id,
		MerchantID: pgtype.UUID{Bytes: merchantID, Valid: true},
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return SplitConfigResponse{}, ErrSplitConfigNotFound
		}
		return SplitConfigResponse{}, err
	}
	return mapSplitConfig(config), nil
}

func (s *Svc) UpdateSplitConfig(ctx context.Context, id uuid.UUID, arg UpdateSplitConfigRequest, merchantID uuid.UUID) (SplitConfigResponse, error) {
	existing, err := s.db.GetMerchantSplitConfigById(ctx, sqlc.GetMerchantSplitConfigByIdParams{
		ID:         id,
		MerchantID: pgtype.UUID{Bytes: merchantID, Valid: true},
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return SplitConfigResponse{}, ErrSplitConfigNotFound
		}
		return SplitConfigResponse{}, err
	}

	effectiveSplitType := existing.SplitType
	if arg.SplitType != nil {
		if *arg.SplitType != "percentage" && *arg.SplitType != "fixed" {
			return SplitConfigResponse{}, ErrInvalidSplitType
		}
		effectiveSplitType = *arg.SplitType
	}
	if arg.RecepientType != nil {
		if *arg.RecepientType != "platform" && *arg.RecepientType != "merchant" && *arg.RecepientType != "third_party" {
			return SplitConfigResponse{}, ErrInvalidRecepientType
		}
	}

	effectiveValue := existing.Value
	if arg.Value != nil {
		effectiveValue = *arg.Value
		if effectiveSplitType == "percentage" && (effectiveValue < 0 || effectiveValue > 100) {
			return SplitConfigResponse{}, ErrInvalidSplitValue
		}
	}

	effectiveActive := existing.Active
	if arg.Active != nil {
		effectiveActive = *arg.Active
	}

	if effectiveActive && effectiveSplitType == "percentage" {
		existingConfigs, err := s.db.GetMerchantSplitConfigs(ctx, pgtype.UUID{Bytes: merchantID, Valid: true})
		if err != nil {
			return SplitConfigResponse{}, err
		}
		var total int64 = effectiveValue
		for _, c := range existingConfigs {
			if c.ID != id && c.Active && c.SplitType == "percentage" {
				total += c.Value
			}
		}
		if total > 100 {
			return SplitConfigResponse{}, ErrSplitTotalExceeded
		}
	}

	var valueParam pgtype.Int8
	if arg.Value != nil {
		valueParam = pgtype.Int8{Int64: *arg.Value, Valid: true}
	}
	var activeParam pgtype.Bool
	if arg.Active != nil {
		activeParam = pgtype.Bool{Bool: *arg.Active, Valid: true}
	}

	sc, err := s.db.UpdateMerchantSplitConfig(ctx, sqlc.UpdateMerchantSplitConfigParams{
		Label:          arg.Label,
		RecepientType:  arg.RecepientType,
		NombaAccountID: arg.NombaAccountID,
		SplitType:      arg.SplitType,
		Value:          valueParam,
		Active:         activeParam,
		ID:             id,
		MerchantID:     pgtype.UUID{Bytes: merchantID, Valid: true},
	})
	if err != nil {
		return SplitConfigResponse{}, err
	}
	return mapSplitConfig(sc), nil
}

func (s *Svc) DeleteSplitConfig(ctx context.Context, id uuid.UUID, merchantID uuid.UUID) error {
	_, err := s.db.DeleteMerchantSplitConfig(ctx, sqlc.DeleteMerchantSplitConfigParams{
		ID:         id,
		MerchantID: pgtype.UUID{Bytes: merchantID, Valid: true},
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrSplitConfigNotFound
		}
		return err
	}
	return nil
}

// Ensure net/http is used for the ping in the handler layer (not here).
var _ = http.StatusOK
