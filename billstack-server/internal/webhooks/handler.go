package webhooks

import (
	"io"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/luponetn/billstack/internal/payments"
)

type Handler struct {
	payments payments.PaymentsService
}

func NewHandler(paymentsSvc payments.PaymentsService) *Handler {
	return &Handler{
		payments: paymentsSvc,
	}
}

func (h *Handler) HandleWebhooks(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		slog.Error("failed to read webhook body", "error", err)
		c.Status(http.StatusBadRequest)
		return
	}

	signature := c.GetHeader("nomba-signature")
	if signature == "" {
		signature = c.GetHeader("nomba-sig-value")
	}
	if signature == "" {
		signature = c.GetHeader("X-Nomba-Signature")
	}
	timestamp := c.GetHeader("nomba-timestamp")

	if err := h.payments.HandleNombaWebhook(c.Request.Context(), body, signature, timestamp); err != nil {
		slog.Error("webhook processing failed", "error", err)
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusOK)
}
