package plans

import (
	"github.com/gin-gonic/gin"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/middleware"
)

func NewRouter(router *gin.Engine, h Handler, JWTAccessSecret string, queries sqlc.Querier) {
	plans := router.Group("/v1/plans")
	plans.Use(middleware.AuthMiddleware(JWTAccessSecret))
	plans.Use(middleware.RequiredEmailVerification(queries))

	plans.POST("/", h.HandleCreatePlan)
	plans.GET("/", h.HandleListMerchantPlans)
	plans.GET("/:id", h.HandleGetPlanByID)
	plans.PATCH("/:id", h.HandleUpdatePlan)
	plans.POST("/:id/archive", h.HandleArchivePlan)

	router.GET("/v1/plans/public/:merchant_id", h.HandleListPublicPlans)
}
