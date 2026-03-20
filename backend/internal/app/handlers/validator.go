package handlers

import (
	"akos_lab_4/internal/models"
	"errors"
	"strings"
)

func PhoneValidator(phone models.Phone_info) error {
	if len(strings.TrimSpace(phone.Name)) == 0 {
		return errors.New("name is required")
	}
	if len(phone.Number) != 10 {
		return errors.New("phone number must have 10 digits length")
	}
	for _, k := range phone.Number {
		if k < '0' || k > '9' {
			return errors.New("phone number must contain digits only")
		}
	}
	if len(phone.Name) == 0 {
		return errors.New("name is required")
	}
	if len(phone.Name) > 255 {
		return errors.New("name length should be smaller than 255")
	}
	if len(phone.Note) > 255 {
		return errors.New("note length should be smaller than 255")
	}
	return nil
}
