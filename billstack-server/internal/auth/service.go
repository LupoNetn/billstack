package auth

import (
	"context"
	"errors"
	"log/slog"
	"strings"

	"github.com/jackc/pgx/v5"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
	"github.com/luponetn/billstack/pkg/jwt"
)

type Service interface {
	CreateMerchant(ctx context.Context, arg CreateMerchantRequest) (sqlc.Merchant, error)
	LoginMerchant(ctx context.Context, arg LoginMerchantRequest) (sqlc.Merchant, string, string, error)
	Refresh(ctx context.Context, refreshToken string) (string, string, error)
}

type Svc struct {
	db               sqlc.Querier
	jwtAccessSecret  string
	jwtRefreshSecret string
}

func NewService(db sqlc.Querier, jwtAccessSecret, jwtRefreshSecret string) Service {
	return &Svc{db: db, jwtAccessSecret: jwtAccessSecret, jwtRefreshSecret: jwtRefreshSecret}
}

// implement service interface
func (s *Svc) CreateMerchant(ctx context.Context, arg CreateMerchantRequest) (sqlc.Merchant, error) {
	email := strings.TrimSpace(arg.Email)
	existingUser, err := s.db.GetMerchantByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return s.db.CreateNewMerchant(ctx, sqlc.CreateNewMerchantParams{
				PersonalName: arg.PersonalName,
				Email:        arg.Email,
				Password:     arg.Password,
			})
		}

		slog.Error("error getting merchant", slog.Any("err", err))
		return sqlc.Merchant{}, err
	}

	if existingUser != (sqlc.Merchant{}) && existingUser.Email == email {
		return sqlc.Merchant{}, ErrUserAlreadyExists
	}

	return sqlc.Merchant{}, ErrUserAlreadyExists

}

func (s *Svc) LoginMerchant(ctx context.Context, arg LoginMerchantRequest) (sqlc.Merchant, string, string, error) {
	emailString := strings.TrimSpace(arg.Email)
	merchant, err := s.db.GetMerchantByEmail(ctx, emailString)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Error("No merchant found with the provided email", slog.Any("email", arg.Email))
			return sqlc.Merchant{}, "", "", ErrInvalidCredentials
		}
		slog.Error("error getting merchant", slog.Any("err", err))
		return sqlc.Merchant{}, "", "", err
	}

	accessToken, refreshToken, err := jwt.GenerateTokenPair(s.jwtAccessSecret, s.jwtRefreshSecret, merchant.ID, merchant.Email)
	if err != nil {
		slog.Error("error generating token", slog.Any("err", err))
		return sqlc.Merchant{}, "", "", err
	}

	return merchant, accessToken, refreshToken, nil
}

func (s *Svc) Refresh(ctx context.Context, refreshToken string) (string, string, error) {
	tokenClaims, err := jwt.VerifyJwtToken(refreshToken, s.jwtRefreshSecret)
	if err != nil {
		slog.Error("error verifying token", slog.Any("err", err))
		return "", "", ErrInvalidToken
	}

	accessToken, refreshToken, err := jwt.GenerateTokenPair(s.jwtAccessSecret, s.jwtRefreshSecret, tokenClaims.MerchantID, tokenClaims.Email)
	if err != nil {
		slog.Error("error generating token", slog.Any("err", err))
		return "", "", err
	}

	return accessToken, refreshToken, nil

}
