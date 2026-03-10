package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *ContactHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "working"})
}
