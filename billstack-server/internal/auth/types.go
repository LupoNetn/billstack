package auth

import (
	"errors"

	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

// Errors
var (
	ErrUserAlreadyExists  = errors.New("user already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidToken       = errors.New("invalid token")
)

// Types
type CreateMerchantRequest struct {
	PersonalName string `json:"personal_name" validate:"required"`
	Password     string `json:"password" validate:"required,min=6"`
	Email        string `json:"email" validate:"required,email"`
}

type LoginMerchantRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type merchantResponse struct {
	PersonalName string `json:"personal_name" validate:"required"`
	Email        string `json:"email" validate:"required,email"`
}

// Helper Funcs
func ToResponse(m sqlc.Merchant) merchantResponse {
	return merchantResponse{
		PersonalName: m.PersonalName,
		Email:        m.Email,
	}
}
