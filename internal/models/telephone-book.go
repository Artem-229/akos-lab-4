package models

import "github.com/google/uuid"

type Phone_info struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name" binding:"required,max=255"`
	Number string    `json:"number" binding:"required,min=7,max=10"`
	Note   string    `json:"note" binding:"max=255"`
}
