package nomba

import (
	"encoding/json"
	"fmt"
)

// KoboAmount formats an int64 kobo amount as the string Nomba expects (e.g. "250000.00").
func KoboAmount(kobo int64) string {
	return fmt.Sprintf("%d.00", kobo)
}

type SplitListItem struct {
	AccountID string `json:"accountId"`
	Value     string `json:"value"`
}

type SplitRequest struct {
	SplitType string          `json:"splitType"`
	SplitList []SplitListItem `json:"splitList"`
}

type CheckoutOrder struct {
	OrderReference        string            `json:"orderReference,omitempty"`
	Amount                string            `json:"amount"`
	Currency              string            `json:"currency"`
	CustomerEmail         string            `json:"customerEmail,omitempty"`
	CustomerID            string            `json:"customerId,omitempty"`
	CallbackURL           string            `json:"callbackUrl,omitempty"`
	AccountID             string            `json:"accountId,omitempty"`
	SplitRequest          *SplitRequest     `json:"splitRequest,omitempty"`
	OrderMetaData         map[string]string `json:"orderMetaData,omitempty"`
	AllowedPaymentMethods []string          `json:"allowedPaymentMethods,omitempty"`
}

type CreateCheckoutOrderRequest struct {
	Order        CheckoutOrder     `json:"order"`
	TokenizeCard bool              `json:"tokenizeCard,omitempty"`
	Meta         map[string]string `json:"meta,omitempty"`
}

type CreateCheckoutOrderResponse struct {
	Code        string `json:"code"`
	Description string `json:"description"`
	Data        struct {
		CheckoutLink   string `json:"checkoutLink"`
		OrderReference string `json:"orderReference"`
	} `json:"data"`
}

type ChargeTokenizedCardRequest struct {
	Order    CheckoutOrder `json:"order"`
	TokenKey string        `json:"tokenKey"`
}

type ChargeTokenizedCardResponse struct {
	Code        string `json:"code"`
	Description string `json:"description"`
	Data        struct {
		Status       bool   `json:"status"`
		Message      string `json:"message"`
		ResponseCode string `json:"responseCode,omitempty"`
	} `json:"data"`
}

type CreateDVARequest struct {
	AccountRef     string  `json:"accountRef"`
	AccountName    string  `json:"accountName"`
	Currency       string  `json:"currency"`
	Bvn            string  `json:"bvn,omitempty"`
	ExpectedAmount float64 `json:"expectedAmount,omitempty"`
	ExpiryDate     string  `json:"expiryDate,omitempty"`
	CallbackURL    string  `json:"callbackUrl,omitempty"`
}

type VirtualAccountData struct {
	CreatedAt         string `json:"createdAt"`
	AccountHolderID   string `json:"accountHolderId"`
	AccountRef        string `json:"accountRef"`
	Bvn               string `json:"bvn"`
	AccountName       string `json:"accountName"`
	Currency          string `json:"currency"`
	BankName          string `json:"bankName"`
	BankAccountNumber string `json:"bankAccountNumber"`
	BankAccountName   string `json:"bankAccountName"`
	CallbackURL       string `json:"callbackUrl"`
	Expired           bool   `json:"expired"`
}

type CreateDVAResponse struct {
	Code        string             `json:"code"`
	Description string             `json:"description"`
	Data        VirtualAccountData `json:"data"`
}

type LookupVirtualAccountResponse struct {
	Code        string             `json:"code"`
	Description string             `json:"description"`
	Data        VirtualAccountData `json:"data"`
}

type SuspendVirtualAccountResponse struct {
	Code        string `json:"code"`
	Description string `json:"description"`
	Data        struct {
		Suspended bool `json:"suspended"`
	} `json:"data"`
}

type ExpireVirtualAccountResponse struct {
	Code        string `json:"code"`
	Description string `json:"description"`
	Data        struct {
		Expired bool `json:"expired"`
	} `json:"data"`
}

type VerifyTransactionResponse struct {
	Code        string `json:"code"`
	Description string `json:"description"`
	Data        struct {
		TransactionID     string  `json:"transactionId"`
		MerchantTxRef     string  `json:"merchantTxRef"`
		TransactionAmount float64 `json:"transactionAmount"`
		Status            string  `json:"status"`
		Type              string  `json:"type"`
		Time              string  `json:"time"`
	} `json:"data"`
}

type NombaWebhookEvent struct {
	EventType string          `json:"event_type"`
	RequestID string          `json:"requestId"`
	Data      json.RawMessage `json:"data"`
}

type WebhookMerchant struct {
	WalletID      string  `json:"walletId"`
	WalletBalance float64 `json:"walletBalance"`
	UserID        string  `json:"userId"`
}

type WebhookTransaction struct {
	AliasAccountNumber    string  `json:"aliasAccountNumber"`
	Fee                   float64 `json:"fee"`
	SessionID             string  `json:"sessionId"`
	Type                  string  `json:"type"`
	TransactionID         string  `json:"transactionId"`
	AliasAccountName      string  `json:"aliasAccountName"`
	ResponseCode          string  `json:"responseCode"`
	ResponseCodeMessage   string  `json:"responseCodeMessage"`
	OriginatingFrom       string  `json:"originatingFrom"`
	MerchantTxRef         string  `json:"merchantTxRef"`
	TransactionAmount     float64 `json:"transactionAmount"`
	Narration             string  `json:"narration"`
	Time                  string  `json:"time"`
	AliasAccountReference string  `json:"aliasAccountReference"`
	AliasAccountType      string  `json:"aliasAccountType"`
	CardIssuer            string  `json:"cardIssuer"`
}

type WebhookCustomer struct {
	BankCode      string `json:"bankCode"`
	SenderName    string `json:"senderName"`
	BankName      string `json:"bankName"`
	AccountNumber string `json:"accountNumber"`
	RecipientName string `json:"recipientName"`
	CardPan       string `json:"cardPan"`
	ProductID     string `json:"productId"`
}

type WebhookOrder struct {
	Amount                 float64 `json:"amount"`
	OrderID                string  `json:"orderId"`
	CardType               string  `json:"cardType"`
	AccountID              string  `json:"accountId"`
	CardLast4Digits        string  `json:"cardLast4Digits"`
	CardCurrency           string  `json:"cardCurrency"`
	CustomerEmail          string  `json:"customerEmail"`
	CustomerID             string  `json:"customerId"`
	IsTokenizedCardPayment string  `json:"isTokenizedCardPayment"`
	OrderReference         string  `json:"orderReference"`
	PaymentMethod          string  `json:"paymentMethod"`
	CallbackURL            string  `json:"callbackUrl"`
	Currency               string  `json:"currency"`
}

type TokenizedCardData struct {
	TokenKey          string `json:"tokenKey"`
	CardType          string `json:"cardType"`
	TokenExpiryYear   string `json:"tokenExpiryYear"`
	TokenExpiryMonth  string `json:"tokenExpiryMonth"`
	CardPan           string `json:"cardPan"`
}

type PaymentSuccessData struct {
	Merchant           WebhookMerchant    `json:"merchant"`
	Terminal           json.RawMessage    `json:"terminal"`
	Transaction        WebhookTransaction `json:"transaction"`
	Customer           WebhookCustomer    `json:"customer"`
	Order              *WebhookOrder      `json:"order"`
	TokenizedCardData  *TokenizedCardData `json:"tokenizedCardData"`
}

type CardPaymentData struct {
	MerchantTxRef string
	OrderRef      string
	AmountKobo    int64
	Currency      string
	TransactionID string
	TokenKey      string
	PaidAt        string
}

type DVATransferData struct {
	AccountRef    string
	AmountKobo    int64
	Currency      string
	TransactionID string
	SenderBank    string
	SenderName    string
	PaidAt        string
}
