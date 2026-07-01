package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

// RequiredEmailVerification blocks requests where the merchant has not verified their email.
func RequiredEmailVerification(queries sqlc.Querier) gin.HandlerFunc {
	return func(c *gin.Context) {
		raw, ok := c.Get("merchant_id")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		merchantID, ok := raw.(uuid.UUID)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		emailVerified, err := queries.GetEmailVerificationStatus(c.Request.Context(), merchantID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			return
		}
		if !emailVerified {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Please verify your email before performing this action"})
			return
		}
		c.Next()
	}
}

// RequiredSettlementAccount blocks requests where the merchant has not added a settlement bank account.
func RequiredSettlementAccount(queries sqlc.Querier) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Fix: merchant_id is stored as uuid.UUID, not string
		raw, ok := c.Get("merchant_id")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		merchantID, ok := raw.(uuid.UUID)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		settlementAccounts, err := queries.GetMerchantSettlementAccounts(c.Request.Context(), pgtype.UUID{
			Bytes: merchantID,
			Valid: true,
		})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			return
		}
		if len(settlementAccounts) == 0 {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "A settlement bank account is required to perform this action"})
			return
		}
		c.Next()
	}
}
