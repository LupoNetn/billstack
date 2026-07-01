package response

import "github.com/gin-gonic/gin"

func ErrorResponse(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{
		"status":  status,
		"message": message,
	})
}

func SuccessResponse(c *gin.Context, status int, message string, data any) {
	c.JSON(status, gin.H{
		"status":  status,
		"message": message,
		"data":    data,
	})
}
