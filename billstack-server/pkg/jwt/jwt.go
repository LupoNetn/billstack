package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Claims struct {
	MerchantID uuid.UUID `json:"merchant_id"`
	Email      string    `json:"email"`
	jwt.RegisteredClaims
}

func GenerateTokenPair(JwtAccessSecret string, JwtRefreshSecret string, merchantID uuid.UUID, merchantEmail string) (string, string, error) {
	accessClaims := Claims{
		MerchantID: merchantID,
		Email:      merchantEmail,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "billstack.com",
			Subject:   merchantID.String(),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Audience:  []string{"billstack.com"},
			ID:        uuid.New().String(),
		},
	}

	refreshClaims := Claims{
		MerchantID: merchantID,
		Email:      merchantEmail,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "billstack.com",
			Subject:   merchantID.String(),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(14 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Audience:  []string{"billstack.com"},
			ID:        uuid.New().String(),
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)

	accessTokenString, err := accessToken.SignedString([]byte(JwtAccessSecret))
	if err != nil {
		return "", "", err
	}

	refreshTokenString, err := refreshToken.SignedString([]byte(JwtRefreshSecret))
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}

func VerifyJwtToken(tokenString string, jwtSecret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}

			return []byte(jwtSecret), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, jwt.ErrTokenMalformed
	}

	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}

	return claims, nil
}
