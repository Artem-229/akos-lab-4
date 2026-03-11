package controller

import (
	"akos_lab_4/internal/app/handlers"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	g           *gin.Engine
	health_repo handlers.HealthHandler
	repo        handlers.ContactHandler
}

func SetupRoutes(r *gin.Engine, health_repo *handlers.HealthHandler, repo *handlers.ContactHandler) *Controller {
	controller := Controller{
		g:           r,
		health_repo: *health_repo,
		repo:        *repo,
	}
	controller.g.GET("/health", health_repo.HealthCheck)
	controller.g.POST("/addcontact", repo.NewUser)
	controller.g.DELETE("/contacts/:id", repo.DeleteUser)
	controller.g.PUT("/contacts/:id", repo.UpdateUser)
	controller.g.GET("/contacts/:id", repo.GetPhone)
	controller.g.GET("/contacts", repo.GetPhones)

	return &controller
}

func (controller Controller) Listen(s string) {
	controller.g.Run(s)
}
