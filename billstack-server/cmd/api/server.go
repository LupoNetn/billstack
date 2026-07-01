package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/luponetn/billstack/internal/auth"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/internal/email"
	"github.com/luponetn/billstack/internal/merchants"
	"github.com/luponetn/billstack/internal/payments"
	"github.com/luponetn/billstack/internal/plans"
	"github.com/luponetn/billstack/internal/subscriptions"
	"github.com/luponetn/billstack/internal/webhooks"
)

func CreateRouter() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",  // Next.js
			"http://localhost:5173",  // Vite
			"https://yourdomain.com", // production frontend
		},

		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},

		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Requested-With",
		},

		ExposeHeaders: []string{
			"Content-Length",
		},

		AllowCredentials: true,

		MaxAge: 12 * time.Hour,
	}))

	return router
}

func SetupRoutes(router *gin.Engine, querier sqlc.Querier, app *App, mailer *email.Mailer, dbPool *pgxpool.Pool, queries *sqlc.Queries, paymentsService payments.PaymentsService) {
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "BillStack Server is running",
		})
	})

	authService := auth.NewService(querier, app.Cfg.JWTAccessSecret, app.Cfg.JWTRefreshSecret)
	authHandler := auth.NewHandler(authService)
	auth.NewRouter(router, authHandler)

	merchantsService := merchants.NewService(querier, mailer)
	merchantsHandler := merchants.NewHandler(merchantsService)
	merchants.NewRouter(router, merchantsHandler, app.Cfg.JWTAccessSecret, querier)

	plansService := plans.NewService(querier)
	plansHandler := plans.NewHandler(plansService)
	plans.NewRouter(router, plansHandler, app.Cfg.JWTAccessSecret, querier)

	subscriptionsService := subscriptions.NewService(querier, dbPool, queries, paymentsService)
	subscriptionsHandler := subscriptions.NewHandler(subscriptionsService)
	subscriptions.NewRouter(router, subscriptionsHandler, querier)

	webhooksService := webhooks.NewService(querier)
	webhooksHandler := webhooks.NewHandler(webhooksService)
	webhooks.NewRouter(router, *webhooksHandler)
}

func RunServer(router *gin.Engine, port string, querier sqlc.Querier, app *App, mailer *email.Mailer, dbPool *pgxpool.Pool, queries *sqlc.Queries, paymentsService payments.PaymentsService) error {
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  10 * time.Second,
	}

	SetupRoutes(router, querier, app, mailer, dbPool, queries, paymentsService)

	startErr := make(chan error, 1)
	slog.Info("server starting up on port", "port", port)
	go func() {
		if err := server.ListenAndServe(); err != nil {
			startErr <- err
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-startErr:
		slog.Error("server failed to start", "err", err)
		return err
	case <-quit:
		slog.Info("received shutdown signal, shutting down gracefully...")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		slog.Error("server forced to shutdown", "err", err)
		return err
	}

	slog.Info("server gracefully exited")

	return nil
}
