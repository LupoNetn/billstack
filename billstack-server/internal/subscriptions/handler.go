package subscriptions

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/luponetn/billstack/internal/response"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{
		service: s,
	}
}

func (h *Handler) HandleCreateSubscription(c *gin.Context) {
	merchantID, ok := c.Get("merchant_id")
	if !ok {
		slog.Error("Could not get merchant id")
		response.ErrorResponse(c, http.StatusUnauthorized, "Authentication failed, please log in again")
		return
	}

	var req CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		slog.Error("Could not parse request body")
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	res, err := h.service.CreateSubscription(c.Request.Context(), req, merchantID.(uuid.UUID))
	if err != nil {
		if errors.Is(err, ErrNoPlansFoundForSubscription) {
			response.ErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}
		if errors.Is(err, ErrPlanArchived) {
			response.ErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}
		if errors.Is(err, ErrSubscriptionForCustomerAlreadyExists) {
			response.ErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}
		slog.Error("Something went wrong, please try again later", "error", err)
		response.ErrorResponse(c, http.StatusInternalServerError, "Something went wrong, please try again later")
		return
	}

	response.SuccessResponse(c, http.StatusCreated, "Subscription created successfully", res)

}
