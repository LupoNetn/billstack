package auth

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/luponetn/billstack/internal/response"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) Handler {
	return Handler{service: service}
}

func (h *Handler) HandleCreateMerchant(c *gin.Context) {
	var req CreateMerchantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		slog.Error("invalid request body", slog.Any("err", err))
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	merchant, err := h.service.CreateMerchant(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, ErrUserAlreadyExists) {
			slog.Error("user already exists", slog.Any("err", err))
			response.ErrorResponse(c, http.StatusConflict, "user already exists")
			return
		}
		slog.Error("failed to create user", slog.Any("err", err))
		response.ErrorResponse(c, http.StatusInternalServerError, "internal server error")
		return
	}

	response.SuccessResponse(c, http.StatusCreated, "user created successfully", ToResponse(merchant))
}

func (h *Handler) HandleLoginMerchant(c *gin.Context) {
	var req LoginMerchantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		slog.Error("invalid request body", slog.Any("err", err))
		response.ErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	merchant, accessToken, refreshToken, err := h.service.LoginMerchant(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			slog.Error("invalid credentials", slog.Any("err", err))
			response.ErrorResponse(c, http.StatusUnauthorized, "invalid credentials")
			return
		}
		slog.Error("failed to login user", slog.Any("err", err))
		response.ErrorResponse(c, http.StatusInternalServerError, "internal server error")
		return
	}

	c.SetCookie("accessToken", accessToken, 1800, "/", "", false, true)
	c.SetCookie("refreshToken", refreshToken, 1209600, "/v1/auth/refresh", "", false, true)

	response.SuccessResponse(c, http.StatusOK, "user logged in successfully", ToResponse(merchant))
}

func (h *Handler) HandleRefresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil {
		slog.Error("cookie not found", slog.Any("err", err))
		response.ErrorResponse(c, http.StatusBadRequest, "cookie not found")
		return
	}

	accessToken, refreshToken, err := h.service.Refresh(c.Request.Context(), refreshToken)
	if err != nil {
		slog.Error("failed to refresh token", slog.Any("err", err))
		response.ErrorResponse(c, http.StatusInternalServerError, "internal server error")
		return
	}

	c.SetCookie("accessToken", accessToken, 1800, "/", "", false, true)
	c.SetCookie("refreshToken", refreshToken, 1209600, "/v1/auth/refresh", "", false, true)

	response.SuccessResponse(c, http.StatusOK, "token refreshed successfully", nil)
}

func (h *Handler) HandleLogout(c *gin.Context) {
	c.SetCookie("accessToken", "", -1, "/", "", false, true)
	c.SetCookie("refreshToken", "", -1, "/refresh", "", false, true)

	response.SuccessResponse(c, http.StatusOK, "user logged out successfully", nil)
}
