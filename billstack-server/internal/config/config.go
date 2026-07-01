package config

import (
	"errors"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUrl         string
	Port          string
	JWTAccessSecret  string
	JWTRefreshSecret string
}


func LoadConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		slog.Error("could not load environment variables", "error", err.Error())
		return nil, err
	}

	config := &Config{
		DBUrl:         ExtractEnvVar("DATABASE_URL", ""),
		Port:          ExtractEnvVar("PORT", "6060"),
		JWTAccessSecret:  ExtractEnvVar("JWT_ACCESS_SECRET", ""),
		JWTRefreshSecret: ExtractEnvVar("JWT_REFRESH_SECRET", ""),
	}

	if config.DBUrl == "" {
		slog.Error("DATABASE_URL is not set", "error", "DATABASE_URL is not set")
		return nil, errors.New("DATABASE_URL is not set")
	}

	if config.JWTAccessSecret == "" {
		slog.Error("JWT_ACCESS_SECRET is not set", "error", "JWT_ACCESS_SECRET is not set")
		return nil, errors.New("JWT_ACCESS_SECRET is not set")
	}

	if config.JWTRefreshSecret == "" {
		slog.Error("JWT_REFRESH_SECRET is not set")
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