package webhooks

import "github.com/gin-gonic/gin"

func NewRouter(router *gin.Engine, h Handler) {
	webhooks := router.Group("/v1/webhooks")

	webhooks.POST("/", h.HandleWebhooks)
}
