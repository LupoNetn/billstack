package subscriptions

import (
	"github.com/gin-gonic/gin"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/middleware"
)

func NewRouter(router *gin.Engine, h *Handler, queries sqlc.Querier) {
	subscriptions := router.Group("/v1/subscriptions")
	subscriptions.Use(middleware.VerifyApiKey(queries))

	subscriptions.POST("/", h.HandleCreateSubscription)
}
