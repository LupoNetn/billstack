package merchants

import (
	"github.com/gin-gonic/gin"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/middleware"
)

func NewRouter(router *gin.Engine, h *Handler, jwtAccessSecret string, queries sqlc.Querier) {
	merchants := router.Group("/v1/merchants")
	merchants.Use(middleware.AuthMiddleware(jwtAccessSecret))

	merchants.GET("/me", h.HandleGetMe)
	merchants.POST("/onboarding", h.HandleCompleteProfileOnboarding)

	merchants.POST("/email-verification/send", h.HandleSendVerificationCode)
	merchants.POST("/email-verification/verify", h.HandleVerifyEmailCode)

	merchants.POST("/api-keys/regenerate", h.HandleCreateApiKeys)

	merchants.POST("/settlement-account", h.HandleCreateSettlementAccount)
	merchants.GET("/settlement-accounts", h.HandleGetSettlementAccounts)

	merchants.GET("/webhook-url", h.HandleGetWebhookConfig)
	merchants.POST("/webhook-url", h.HandleSetWebhookConfig)
	merchants.POST("/webhook-url/test", h.HandleTestWebhookPing)
	merchants.GET("/portal-config", h.HandleGetPortalConfig)
	merchants.POST("/portal-config", h.HandleSavePortalConfig)

	merchants.POST("/split-config", h.HandleCreateSplitConfig)
	merchants.GET("/split-config", h.HandleGetSplitConfigs)
	merchants.GET("/split-config/:id", h.HandleGetSplitConfigByID)
	merchants.PUT("/split-config/:id", h.HandleUpdateSplitConfig)
	merchants.DELETE("/split-config/:id", h.HandleDeleteSplitConfig)

	emailVerifiedMerchant := merchants.Group("")
	emailVerifiedMerchant.Use(middleware.RequiredEmailVerification(queries))
	_ = emailVerifiedMerchant // ready for any future merchant routes that require email verification
	settlementAccountMerchant := merchants.Group("")
	settlementAccountMerchant.Use(middleware.RequiredSettlementAccount(queries))
	_ = settlementAccountMerchant // ready for any future merchant routes that require a bank account
}
