package main

import (
	"akos_lab_4/internal/adapters/postgres"
	"akos_lab_4/internal/app"
	"akos_lab_4/internal/app/controller"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/github"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		panic(err)
	}

	envinf := app.MustGetFromEnv()

	cfg := postgres.Config{
		Host:     envinf.DB_HOST,
		Port:     envinf.DB_PORT,
		Username: envinf.DB_USERNAME,
		DBname:   envinf.DB_NAME,
		Password: envinf.DB_PASSWORD,
	}

	db := postgres.MustConnectToDB(cfg)

	_ = db

	connstr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		envinf.DB_USERNAME, envinf.DB_PASSWORD, envinf.DB_HOST, envinf.DB_PORT, envinf.DB_NAME)

	m, err := migrate.New("file:///app/migrations", connstr)

	err = m.Up()
	if err != nil {
		fmt.Println("MIGRATION ERROR", err)
	}

	r := gin.Default()

	contr := controller.SetupRoutes(r)

	contr.Listen(":8080")

}
