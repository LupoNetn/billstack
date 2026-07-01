package generate

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	math "math/rand/v2"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func EmailVerificationCode() string {
	b := make([]byte, 6)
	for i := range b {
		b[i] = charset[math.IntN(len(charset))]
	}
	return string(b)
}

func ApiKey(prefix string) (string, string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", "", err
	}

	token := hex.EncodeToString(bytes)
	apikey := fmt.Sprintf("%s_%s", prefix, token)

	hash := sha256.Sum256([]byte(apikey))
	hashedApiKey := hex.EncodeToString(hash[:])

	return apikey, hashedApiKey, nil
}

func WebhookSecret() (string, error) {
	bytes := make([]byte, 24)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return fmt.Sprintf("whsec_%s", hex.EncodeToString(bytes)), nil
}

