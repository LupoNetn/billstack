package config

import (
	"errors"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUrl            string
	Port             string
	JWTAccessSecret  string
	JWTRefreshSecret string
}

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		slog.Info("No .env file found, using system environment variables")
	}

	config := &Config{
		DBUrl:            ExtractEnvVar("DATABASE_URL", ""),
		Port:             ExtractEnvVar("PORT", "6060"),
		JWTAccessSecret:  ExtractEnvVar("JWT_ACCESS_SECRET", ""),
		JWTRefreshSecret: ExtractEnvVar("JWT_REFRESH_SECRET", ""),
	}

	if config.DBUrl == "" {
		return nil, errors.New("DATABASE_URL is not set")
	}

	if config.JWTAccessSecret == "" {
		return nil, errors.New("JWT_ACCESS_SECRET is not set")
	}

	if config.JWTRefreshSecret == "" {
		return nil, errors.New("JWT_REFRESH_SECRET is not set")
	}

	return config, nil
}

func ExtractEnvVar(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
