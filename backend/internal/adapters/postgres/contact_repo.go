package postgres

import (
	"akos_lab_4/internal/models"

	"database/sql"

	"github.com/google/uuid"
)

type ContactRepo struct {
	DB *sql.DB
}

func (r *ContactRepo) AddUser(phone models.Phone_info) error {
	query := `INSERT INTO phones (id, fullname, phone_number, note) 
			VALUES ($1, $2, $3, $4)`
	_, err := r.DB.Exec(query, phone.ID, phone.Name, phone.Number, phone.Note)
	if err != nil {
		return err
	}

	return nil
}

func (r *ContactRepo) DeleteUser(id uuid.UUID) error {
	query := `DELETE FROM phones WHERE id=$1`

	_, err := r.DB.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}

func (r *ContactRepo) UpdateUser(phone models.Phone_info) error {
	query := `UPDATE phones SET fullname=$1, phone_number=$2, note=$3 WHERE id=$4`

	_, err := r.DB.Exec(query, phone.Name, phone.Number, phone.Note, phone.ID)
	if err != nil {
		return err
	}

	return nil
}

func (r *ContactRepo) GetPhone(id uuid.UUID) models.Phone_info {
	query := `SELECT id, fullname, phone_number, note FROM phones WHERE id=$1`

	var ans models.Phone_info
	_ = r.DB.QueryRow(query, id).Scan(&ans.ID, &ans.Name, &ans.Number, &ans.Note)

	return ans
}

func (r *ContactRepo) GetPhones() []models.Phone_info {
	query := `SELECT id, fullname AS name, phone_number AS number, note FROM phones`
	var req []models.Phone_info

	rows, _ := r.DB.Query(query)

	for rows.Next() {
		var ans models.Phone_info
		rows.Scan(&ans.ID, &ans.Name, &ans.Number, &ans.Note)
		req = append(req, ans)
	}

	return req
}
