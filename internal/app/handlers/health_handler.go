package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	g *gin.Engine
}

func SetupRoutes(r *gin.Engine) *Controller {
	controller := Controller{
		g: r,
	}
	controller.g.GET("health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "working",
		})
	})

	return &controller
}

func (controller Controller) Listen(s string) {
	controller.g.Run(s)
}
