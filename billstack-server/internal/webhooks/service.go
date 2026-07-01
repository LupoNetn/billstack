package webhooks

import (
	"fmt"
	
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

type Service interface{}

type Svc struct {
	db sqlc.Querier
}

func NewService(db sqlc.Querier) Service {
	return &Svc{
		db: db,
	}
}

func RouteWebhook(eventType string, payload any) {
	switch eventType {
		case "payment.received":
			fmt.Println("received an event")
		case "card.charged":
			fmt.Println("card charged")
	}
}
