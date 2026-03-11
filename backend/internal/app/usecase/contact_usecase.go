package usecase

import (
	"akos_lab_4/internal/models"

	"github.com/google/uuid"
)

type Handlerrepo interface {
	AddUser(models.Phone_info) error
	DeleteUser(uuid.UUID) error
	UpdateUser(models.Phone_info) error
	GetPhone(uuid.UUID) models.Phone_info
	GetPhones() []models.Phone_info
}

type ContactUsecase struct {
	repo Handlerrepo
}

func NewContactUsecase(repo Handlerrepo) *ContactUsecase {
	return &ContactUsecase{repo: repo}
}

func (u *ContactUsecase) CreateUser(req models.Phone_info) error {
	err := u.repo.AddUser(req)
	if err != nil {
		return err
	}
	return nil
}

func (u *ContactUsecase) DeleteUser(id uuid.UUID) error {
	return u.repo.DeleteUser(id)
}

func (u *ContactUsecase) UpdateUser(phone models.Phone_info) error {
	return u.repo.UpdateUser(phone)
}

func (u *ContactUsecase) GetPhone(id uuid.UUID) models.Phone_info {
	return u.repo.GetPhone(id)
}

func (u *ContactUsecase) GetPhones() []models.Phone_info {
	return u.repo.GetPhones()
}
