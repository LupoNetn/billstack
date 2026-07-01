package middleware

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/luponetn/billstack/internal/response"
	"github.com/luponetn/billstack/pkg/jwt"
)

func AuthMiddleware(JWTAccessSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("accessToken")
		if err != nil {
			slog.Error("error getting access token", "error", err)
			response.ErrorResponse(c, http.StatusUnauthorized, "access token not found")
			return
		}

		payload, err := jwt.VerifyJwtToken(accessToken, JWTAccessSecret)
		if err != nil {
			slog.Error("error verifying token", "error", err)
			response.ErrorResponse(c, http.StatusUnauthorized, "invalid access token")
			return
		}

		c.Set("merchant_id", payload.MerchantID)
		c.Set("email", payload.Email)
		c.Next()
	}
}
