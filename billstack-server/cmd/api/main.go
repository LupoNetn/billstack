package main

// @title BillStack API
// @version 1.0
// @description Billing and subscriptions API
// @host localhost:6060
// @BasePath /api/v1

import (
	"context"
	"log/slog"
	"time"

	"github.com/luponetn/billstack/internal/config"
	"github.com/luponetn/billstack/internal/db"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/email"
	"github.com/luponetn/billstack/internal/logger"
	"github.com/luponetn/billstack/internal/nomba"
	"github.com/luponetn/billstack/internal/payments"
)

type App struct {
	Cfg config.Config
}

func main() {
	//TODO: make env check dynamic
	logger.Init("development")

	config, err := config.LoadConfig()
	if err != nil {
		slog.Error("could not load environment variables", "error", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Minute)
	defer cancel()
	dbPool, dbErr := db.ConnectDb(ctx, config.DBUrl)
	if dbErr != nil {
		slog.Error("could not connect to database", "error", dbErr)
		return
	}

	queries := sqlc.New(dbPool)

	defer dbPool.Close()

	//Create Payments Service
	paymentsService := payments.NewPaymentService(dbPool, queries)

	//implement nomba token fetch
	nombaCtx := context.Background()
	nomba.Cache.StartRefresher(nombaCtx)

	var mailer *email.Mailer

	mailer, err = email.NewMailer(ctx, "./credentials.json", "./token.json")
	if err != nil {
		slog.Warn("Email service disabled", "error", err)
		mailer = nil
	}

	if mailer != nil {
		err = mailer.Send(
			"lupooluwatobi@gmail.com",
			"BillStack Notification",
			"This email was sent using our clean, reusable internal package!",
		)
		if err != nil {
			slog.Error("unable to send email", "error", err)
		}
	}

	app := &App{
		Cfg: *config,
	}

	router := CreateRouter()

	serverErr := RunServer(router, app.Cfg.Port, queries, app, mailer, dbPool, queries, paymentsService)
	if serverErr != nil {
		slog.Error("failed to start server", "error", serverErr)
		return
	}

}
