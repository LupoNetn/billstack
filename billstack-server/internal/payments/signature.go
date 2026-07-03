package payments

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

func verifyNombaWebhookSignature(payload []byte, signature, timestamp string) bool {
	secret := os.Getenv("NOMBA_WEBHOOK_SECRET")
	if secret == "" {
		return false
	}

	signature = strings.TrimSpace(signature)
	if signature == "" {
		return false
	}

	// Raw-body signature format:
	// X-Nomba-Signature: sha256=<hex>
	if strings.HasPrefix(strings.ToLower(signature), "sha256=") {
		return verifyRawBodySignature(payload, signature, secret)
	}

	// Structured signature format:
	// nomba-signature: <base64>
	if timestamp == "" {
		return false
	}

	return verifyStructuredSignature(payload, signature, timestamp, secret)
}

func verifyRawBodySignature(payload []byte, signature, secret string) bool {
	signature = strings.TrimPrefix(strings.ToLower(signature), "sha256=")

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(payload)

	expected := mac.Sum(nil)

	actual, err := hex.DecodeString(signature)
	if err != nil {
		return false
	}

	return hmac.Equal(expected, actual)
}

func verifyStructuredSignature(payload []byte, signature, timestamp, secret string) bool {
	var event nombaWebhookEnvelope

	if err := json.Unmarshal(payload, &event); err != nil {
		return false
	}

	expected, err := generateStructuredSignature(event, secret, timestamp)
	if err != nil {
		return false
	}

	return hmac.Equal(
		[]byte(expected),
		[]byte(signature),
	)
}

type nombaWebhookEnvelope struct {
	EventType string          `json:"event_type"`
	RequestID string          `json:"requestId"`
	Data      json.RawMessage `json:"data"`
}

type nombaSignatureData struct {
	Merchant struct {
		UserID   string `json:"userId"`
		WalletID string `json:"walletId"`
	} `json:"merchant"`

	Transaction struct {
		TransactionID string `json:"transactionId"`
		Type          string `json:"type"`
		Time          string `json:"time"`
		ResponseCode  string `json:"responseCode"`
	} `json:"transaction"`
}

func generateStructuredSignature(
	event nombaWebhookEnvelope,
	secret,
	timestamp string,
) (string, error) {

	var data nombaSignatureData

	if err := json.Unmarshal(event.Data, &data); err != nil {
		return "", err
	}

	responseCode := data.Transaction.ResponseCode
	if strings.EqualFold(responseCode, "null") {
		responseCode = ""
	}

	hashingPayload := fmt.Sprintf(
		"%s:%s:%s:%s:%s:%s:%s:%s:%s",
		event.EventType,
		event.RequestID,
		data.Merchant.UserID,
		data.Merchant.WalletID,
		data.Transaction.TransactionID,
		data.Transaction.Type,
		data.Transaction.Time,
		responseCode,
		timestamp,
	)

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(hashingPayload))

	return base64.StdEncoding.EncodeToString(mac.Sum(nil)), nil
}