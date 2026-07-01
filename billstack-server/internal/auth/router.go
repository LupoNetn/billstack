package auth

import "github.com/gin-gonic/gin"

func NewRouter(router *gin.Engine, h Handler) {
	auth := router.Group("/v1/auth")

	auth.POST("/register", h.HandleCreateMerchant)
	auth.POST("/login", h.HandleLoginMerchant)
	auth.POST("/refresh", h.HandleRefresh)
	auth.POST("/logout", h.HandleLogout)
}
