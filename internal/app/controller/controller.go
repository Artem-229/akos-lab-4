package controller

import (
	"github.com/gin-gonic/gin"
)

type Controller struct {
	g *gin.Engine
}

func SetupRoutes(r *gin.Engine) *Controller {
	controller := Controller{
		g: r,
	}
	controller.g.GET("health", ContactHandler.HealthCheck())

	return &controller
}

func (controller Controller) Listen(s string) {
	controller.g.Run(s)
}
