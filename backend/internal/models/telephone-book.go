package models

import "github.com/google/uuid"

type Phone_info struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	Number string    `json:"number"`
	Note   string    `json:"note"`
}
