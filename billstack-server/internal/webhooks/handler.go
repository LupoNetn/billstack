package webhooks

import "github.com/gin-gonic/gin"

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) HandleWebhooks(c *gin.Context) {
	
}
