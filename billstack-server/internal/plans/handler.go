package plans

import (
	"errors"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/response"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) Handler {
	return Handler{service: s}
}

// extractMerchantID safely pulls the uuid.UUID set by AuthMiddleware.
func extractMerchantID(c *gin.Context) (uuid.UUID, bool) {
	raw, ok := c.Get("merchant_id")
	if !ok {
		return uuid.UUID{}, false
	}
	id, ok := raw.(uuid.UUID)
	return id, ok
}

func (h *Handler) HandleCreatePlan(c *gin.Context) {
	var req CreatePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		slog.Error("invalid request body", "error", err)
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body: "+err.Error())
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	plan, err := h.service.CreatePlan(c.Request.Context(), merchantID, req)
	if err != nil {
		slog.Error("failed to create plan", "merchant_id", merchantID, "error", err)
		if errors.Is(err, ErrTiersRequiredForTieredPlan) || errors.Is(err, ErrLastTierMustBeUnlimited) {
			response.ErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "failed to create plan")
		return
	}

	response.SuccessResponse(c, http.StatusCreated, "plan created successfully", plan)
}

func (h *Handler) HandleGetPlanByID(c *gin.Context) {
	planID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid plan id")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	plan, err := h.service.GetPlanByID(c.Request.Context(), planID, merchantID)
	if err != nil {
		slog.Error("failed to get plan", "plan_id", planID, "error", err)
		if errors.Is(err, ErrPlanNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "plan not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "failed to get plan")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "plan retrieved successfully", plan)
}

func (h *Handler) HandleListMerchantPlans(c *gin.Context) {
	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	// Parse optional query params
	q := ListPlansQuery{Limit: 20}
	if lim := c.Query("limit"); lim != "" {
		if v, err := strconv.Atoi(lim); err == nil && v > 0 {
			q.Limit = int32(v)
		}
	}
	if off := c.Query("offset"); off != "" {
		if v, err := strconv.Atoi(off); err == nil && v >= 0 {
			q.Offset = int32(v)
		}
	}
	if s := c.Query("status"); s != "" {
		st := sqlc.PlanStatus(s)
		q.Status = &st
	}

	plans, err := h.service.ListMerchantPlans(c.Request.Context(), merchantID, q)
	if err != nil {
		slog.Error("failed to list plans", "merchant_id", merchantID, "error", err)
		response.ErrorResponse(c, http.StatusInternalServerError, "failed to list plans")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "plans retrieved successfully", plans)
}

func (h *Handler) HandleListPublicPlans(c *gin.Context) {
	merchantID, err := uuid.Parse(c.Param("merchant_id"))
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid merchant_id")
		return
	}

	plans, err := h.service.ListPublicPlans(c.Request.Context(), merchantID)
	if err != nil {
		slog.Error("failed to list public plans", "merchant_id", merchantID, "error", err)
		response.ErrorResponse(c, http.StatusInternalServerError, "failed to list plans")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "plans retrieved successfully", plans)
}

func (h *Handler) HandleUpdatePlan(c *gin.Context) {
	planID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid plan id")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req UpdatePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body: "+err.Error())
		return
	}
	req.ID = planID

	plan, err := h.service.UpdatePlan(c.Request.Context(), req, merchantID)
	if err != nil {
		slog.Error("failed to update plan", "plan_id", planID, "error", err)
		if errors.Is(err, ErrPlanNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "plan not found")
			return
		}
		if errors.Is(err, ErrPlanAlreadyArchived) {
			response.ErrorResponse(c, http.StatusConflict, "cannot update an archived plan")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "failed to update plan")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "plan updated successfully", plan)
}

func (h *Handler) HandleArchivePlan(c *gin.Context) {
	planID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "invalid plan id")
		return
	}

	merchantID, ok := extractMerchantID(c)
	if !ok {
		response.ErrorResponse(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	plan, err := h.service.ArchivePlan(c.Request.Context(), planID, merchantID)
	if err != nil {
		slog.Error("failed to archive plan", "plan_id", planID, "error", err)
		if errors.Is(err, ErrPlanAlreadyArchived) {
			response.ErrorResponse(c, http.StatusConflict, "plan is already archived")
			return
		}
		if errors.Is(err, ErrPlanNotFound) {
			response.ErrorResponse(c, http.StatusNotFound, "plan not found")
			return
		}
		response.ErrorResponse(c, http.StatusInternalServerError, "failed to archive plan")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "plan archived successfully", plan)
}
