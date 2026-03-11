package app

import "github.com/caarlos0/env"

type Config struct {
	DB_HOST     string `env:"DB_HOST"`
	DB_PORT     string `env:"DB_PORT"`
	DB_USERNAME string `env:"DB_USERNAME"`
	DB_NAME     string `env:"DB_NAME"`
	DB_PASSWORD string `env:"DB_PASSWORD"`
}

func MustGetFromEnv() Config {
	var cfg Config
	if err := env.Parse(&cfg); err != nil {
		panic(err)
	}

	return cfg
}
