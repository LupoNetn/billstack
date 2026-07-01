package merchants

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/luponetn/billstack/internal/response"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// extractMerchantID pulls uuid.UUID set by AuthMiddleware.
func extractMerchantID(c *gin.Context) (uuid.UUID, bool) {
	raw, ok := c.Get("merchant_id")
	if !ok {
		return uuid.UUID{}, false
	}
	id, ok := raw.(uuid.UUID)
	return id, ok
}

func (h *Handler) HandleGetMe(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	merchant, err := h.service.GetMerchant(c.Request.Context(), merchantID)
	if err != nil {
		slog.Error("failed to get merchant", "error", err)
		if errors.Is(err, ErrMerchantNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "merchant not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "failed to fetch merchant")
		return
	}

	// Check onboarding health signals
	webhookOK := false
	settlementOK := false

	if _, err := h.service.GetWebhookConfig(c.Request.Context(), merchantID); err == nil {
		webhookOK = true
	}
	if accounts, err := h.service.GetSettlementAccounts(c.Request.Context(), merchantID); err == nil && len(accounts) > 0 {
		settlementOK = true
	}

	response.SuccessResponse(c, http.StatusOK, "merchant fetched successfully", MerchantMeResponse{
		MerchantResponse:     merchant,
		WebhookConfigured:    webhookOK,
		SettlementConfigured: settlementOK,
	})
}

func (h *Handler) HandleCompleteProfileOnboarding(c *gin.Context) {
	var req CompleteProfileOnboardingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		slog.Error("error binding json", "error", err)
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant not found")
		return
	}

	merchant, err := h.service.CompleteProfileOnboarding(c.Request.Context(), req, merchantID)
	if err != nil {
		slog.Error("error completing profile onboarding", "error", err)
		if errors.Is(err, ErrMerchantAlreadyOnboarded) {
			response.ErrorResponse(c, http.StatusConflict, "merchant already onboarded")
			return
		}
		if errors.Is(err, ErrMerchantNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "merchant not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error completing profile onboarding")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "profile onboarding completed successfully", merchant)
}

func (h *Handler) HandleSendVerificationCode(c *gin.Context) {
	emailStr := c.GetString("email")
	if emailStr == "" {
		response.ErrorResponse(c, http.StatusUnauthorized, "email not found")
		return
	}

	if err := h.service.SendVerificationCode(c.Request.Context(), emailStr); err != nil {
		slog.Error("error sending verification code", "error", err)
		if errors.Is(err, ErrMerchantNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "merchant not found")
			return
		}
		if errors.Is(err, ErrEmailAlreadyVerified) {
			response.ErrorResponse(c, http.StatusConflict, "email already verified")
			return
		}
		if errors.Is(err, ErrWrongEmail) {
			response.ErrorResponse(c, http.StatusBadRequest, "wrong email")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error sending verification code")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "email verification code sent", gin.H{"email": emailStr})
}

func (h *Handler) HandleVerifyEmailCode(c *gin.Context) {
	emailStr := c.GetString("email")
	if emailStr == "" {
		response.ErrorResponse(c, http.StatusUnauthorized, "email not found")
		return
	}

	var req VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := h.service.VerifyEmailCode(c.Request.Context(), emailStr, req.Code); err != nil {
		slog.Error("error verifying email code", "error", err)
		if errors.Is(err, ErrEmailVerificationCodeNotFound) {
			response.ErrorResponse(c, http.StatusBadRequest, "invalid or expired verification code")
			return
		}
		if errors.Is(err, ErrEmailVerificationCodeAlreadyVerified) {
			response.ErrorResponse(c, http.StatusConflict, "email already verified")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error verifying email")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "email successfully verified", gin.H{"email": emailStr})
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

func (h *Handler) HandleCreateApiKeys(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	keys, err := h.service.CreateApiKeys(c.Request.Context(), merchantID)
	if err != nil {
		slog.Error("error creating api keys", "error", err)
		response.ErrorResponse(c, http.StatusInternalServerError, "error creating api keys")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "api keys regenerated successfully", keys)
}

func (h *Handler) HandleCreateSettlementAccount(c *gin.Context) {
	var req CreateSettlementAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	account, err := h.service.CreateSettlementAccount(c.Request.Context(), req, merchantID)
	if err != nil {
		slog.Error("error creating settlement account", "error", err)
		if errors.Is(err, ErrMerchantNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "merchant not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error creating settlement account")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "settlement account created successfully", account)
}

func (h *Handler) HandleGetSettlementAccounts(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	accounts, err := h.service.GetSettlementAccounts(c.Request.Context(), merchantID)
	if err != nil {
		slog.Error("error getting settlement accounts", "error", err)
		response.ErrorResponse(c, http.StatusInternalServerError, "error getting settlement accounts")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "settlement accounts fetched successfully", accounts)
}

func (h *Handler) HandleGetWebhookConfig(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	config, err := h.service.GetWebhookConfig(c.Request.Context(), merchantID)
	if err != nil {
		if errors.Is(err, ErrWebhookConfigNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "webhook configuration not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error getting webhook config")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "webhook configuration fetched successfully", config)
}

func (h *Handler) HandleSetWebhookConfig(c *gin.Context) {
	var req SetWebhookURLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body: "+err.Error())
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	config, err := h.service.SetWebhookConfig(c.Request.Context(), req, merchantID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "error setting webhook config")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "webhook configuration set successfully", config)
}

func (h *Handler) HandleTestWebhookPing(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	config, err := h.service.GetWebhookConfig(c.Request.Context(), merchantID)
	if err != nil {
		if errors.Is(err, ErrWebhookConfigNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "webhook URL not configured yet")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error fetching webhook config")
		return
	}

	start := time.Now()
	payload := fmt.Sprintf(`{"event":"ping","merchant_id":"%s","timestamp":"%s"}`, merchantID, start.UTC().Format(time.RFC3339))

	client := &http.Client{Timeout: 10 * time.Second}
	req, reqErr := http.NewRequestWithContext(c.Request.Context(), http.MethodPost, config.WebhookURL,
		nil)
	if reqErr != nil {
		response.SuccessResponse(c, http.StatusOK, "ping attempted", WebhookPingResult{
			URL:     config.WebhookURL,
			Success: false,
			Error:   reqErr.Error(),
		})
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Noitrex-Event", "ping")
	req.Header.Set("X-Noitrex-Payload", payload)

	resp, doErr := client.Do(req)
	latency := time.Since(start).Milliseconds()

	result := WebhookPingResult{
		URL:       config.WebhookURL,
		LatencyMs: latency,
	}
	if doErr != nil {
		result.Success = false
		result.Error = doErr.Error()
	} else {
		defer resp.Body.Close()
		result.StatusCode = resp.StatusCode
		result.Success = resp.StatusCode >= 200 && resp.StatusCode < 300
		if !result.Success {
			result.Error = fmt.Sprintf("non-2xx response: %d", resp.StatusCode)
		}
	}

	response.SuccessResponse(c, http.StatusOK, "webhook ping completed", result)
}

func (h *Handler) HandleGetPortalConfig(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	config, err := h.service.GetPortalConfig(c.Request.Context(), merchantID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "error getting portal config")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "portal configuration fetched successfully", config)
}

func (h *Handler) HandleSavePortalConfig(c *gin.Context) {
	var req SavePortalConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body: "+err.Error())
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	config, err := h.service.SavePortalConfig(c.Request.Context(), req, merchantID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "error saving portal config")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "portal configuration saved successfully", config)
}

func (h *Handler) HandleCreateSplitConfig(c *gin.Context) {
	var req CreateSplitConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	sc, err := h.service.CreateSplitConfig(c.Request.Context(), req, merchantID)
	if err != nil {
		if errors.Is(err, ErrInvalidRecepientType) || errors.Is(err, ErrInvalidSplitType) || errors.Is(err, ErrInvalidSplitValue) {
			response.ErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}
		if errors.Is(err, ErrSplitTotalExceeded) {
			response.ErrorResponse(c, http.StatusConflict, err.Error())
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error creating split config")
		return
	}

	response.SuccessResponse(c, http.StatusCreated, "split configuration created successfully", sc)
}

func (h *Handler) HandleGetSplitConfigs(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	configs, err := h.service.GetSplitConfigs(c.Request.Context(), merchantID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "error getting split configs")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "split configurations fetched successfully", configs)
}

func (h *Handler) HandleGetSplitConfigByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid split config id")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	sc, err := h.service.GetSplitConfigByID(c.Request.Context(), id, merchantID)
	if err != nil {
		if errors.Is(err, ErrSplitConfigNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "split config not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error getting split config")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "split configuration fetched successfully", sc)
}

func (h *Handler) HandleUpdateSplitConfig(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid split config id")
		return
	}

	var req UpdateSplitConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	sc, err := h.service.UpdateSplitConfig(c.Request.Context(), id, req, merchantID)
	if err != nil {
		if errors.Is(err, ErrSplitConfigNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "split config not found")
			return
		}
		if errors.Is(err, ErrInvalidRecepientType) || errors.Is(err, ErrInvalidSplitType) || errors.Is(err, ErrInvalidSplitValue) {
			response.ErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}
		if errors.Is(err, ErrSplitTotalExceeded) {
			response.ErrorResponse(c, http.StatusConflict, err.Error())
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error updating split config")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "split configuration updated successfully", sc)
}

func (h *Handler) HandleDeleteSplitConfig(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid split config id")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "merchant id not found")
		return
	}

	if err := h.service.DeleteSplitConfig(c.Request.Context(), id, merchantID); err != nil {
		if errors.Is(err, ErrSplitConfigNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "split config not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "error deleting split config")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "split configuration deleted successfully", nil)
}
