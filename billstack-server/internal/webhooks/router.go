package webhooks

import (
	"github.com/gin-gonic/gin"
	"github.com/luponetn/billstack/internal/payments"
)

func NewRouter(router *gin.Engine, h *Handler) {
	webhooks := router.Group("/v1/webhooks")
	webhooks.POST("/", h.HandleWebhooks)
}

func NewHandlerFromPayments(paymentsSvc payments.PaymentsService) *Handler {
	return NewHandler(paymentsSvc)
}
