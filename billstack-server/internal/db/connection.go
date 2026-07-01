package db

import (
	"context"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ConnectDb(ctx context.Context, DBUrl string) (*pgxpool.Pool, error) {
	config, err := pgxpool.ParseConfig(DBUrl)
	if err != nil {
		slog.Error("unable to set up database configuration for connection", "error", err)
		return nil, err
	}
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = 30 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		slog.Error("unable to create database connection pool", "error", err)
		return nil, err
	}

	if err := pool.Ping(ctx); err != nil {
		slog.Error("unable to ping database", "error", err)
		return nil, err
	}

	slog.Info("successfully connected to the database")

	return pool, nil
}
