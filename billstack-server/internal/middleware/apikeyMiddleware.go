package middleware

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

func VerifyApiKey(queries sqlc.Querier) gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := c.GetHeader("x-Api-Key")
		if apiKey == "" {
			slog.Error("api key header is required for this request")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": "false",
				"message": "unauthorized access",
			})
		}

		hash := sha256.Sum256([]byte(apiKey))
		apiKeyHeaderHash := hex.EncodeToString(hash[:])

		merchantApiKey, err := queries.GetMerchantApiKey(c.Request.Context(), apiKeyHeaderHash)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				slog.Error("could not retrieve any api keys for this api key", "apiKey", apiKey)
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
					"success": "false",
				})
			}
			slog.Error("Could not retrieve api key for merchant at this period", "error", err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"success": "false",
				"message": "something went wrong",
			})
		}

		queries.UpdateApiKeyLastUsage(c.Request.Context(), merchantApiKey.MerchantID)

		c.Set("merchant_id", merchantApiKey.MerchantID)
		c.Next()
	}
}
