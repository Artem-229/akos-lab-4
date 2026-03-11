package handlers

import (
	"akos_lab_4/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ContactUseCase interface {
	CreateUser(models.Phone_info) error
	DeleteUser(uuid.UUID) error
	UpdateUser(models.Phone_info) error
	GetPhone(uuid.UUID) models.Phone_info
	GetPhones() []models.Phone_info
}

type ContactHandler struct {
	Usecase ContactUseCase
}

func (r *ContactHandler) NewUser(c *gin.Context) {
	var contact models.Phone_info
	if err := c.BindJSON(&contact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "data problems",
		})
		return
	}

	err := r.Usecase.CreateUser(contact)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "problems with adding a contact",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "accepted",
	})
}

func (r *ContactHandler) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	if err := r.Usecase.DeleteUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error deleting"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

func (r *ContactHandler) UpdateUser(c *gin.Context) {
	var contact models.Phone_info
	if err := c.BindJSON(&contact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "data problems"})
		return
	}
	if err := r.Usecase.UpdateUser(contact); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error updating"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "updated"})
}

func (r *ContactHandler) GetPhone(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	contact := r.Usecase.GetPhone(id)
	c.JSON(http.StatusOK, contact)
}

func (r *ContactHandler) GetPhones(c *gin.Context) {
	contacts := r.Usecase.GetPhones()
	c.JSON(http.StatusOK, contacts)
}
