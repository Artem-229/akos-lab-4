package postgres

import (
	"database/sql"
	"fmt"
)

type Config struct {
	Host     string
	Port     string
	Username string
	DBname   string
	Password string
}

/* type UserRepo struct {
	DB *sql.DB
} */

func MustConnectToDB(cfg Config) *sql.DB {
	connstr := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s",
		cfg.Host, cfg.Port, cfg.Username, cfg.DBname, cfg.Password)
	db, err := sql.Open("postgres", connstr)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	return db
}
