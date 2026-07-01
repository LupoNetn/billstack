package payments

type CreateOrderRequest struct {
	OrderReference string
	CustomerEmail  string
	Amount         int64
	Currency       string
	CallbackURL    string
	TokenizeCard   bool
}

type CreateOrderResponse struct {
	CheckoutLink   string
	OrderReference string
}

type ChargeCardRequest struct {
	OrderReference string
	CustomerEmail  string
	Amount         int64
	Currency       string
	TokenKey       string
}

type ChargeCardResponse struct {
	Success       bool
	TransactionID string
	DeclineCode   string
	DeclineType   string // soft, hard, network
}

type ProvisionDVARequest struct {
	AccountRef     string `json:"accountRef"`
	AccountName    string `json:"accountName"`
	Bvn            string `json:"bvn"`
	ExpectedAmount int64  `json:"expectedAmount"`
}

type ProvisionDVAResponse struct {
	AccountRef        string
	AccountHolderID   string
	BankAccountNumber string
	BankAccountName   string
	BankName          string
}

type Transaction struct {
	MerchantTxRef string
	Amount        int64
	Status        string
	Currency      string
	PaidAt        string
}

type ListTransactionsParams struct {
	DateFrom string
	DateTo   string
	Status   string
}

type WebhookEvent struct {
	Event     string      `json:"event"`
	RequestID string      `json:"requestId"`
	Data      WebhookData `json:"data"`
}

type WebhookData struct {
	MerchantTxRef string `json:"merchantTxRef"`
	Amount        int64  `json:"amount"`
	Currency      string `json:"currency"`
	TransactionID string `json:"transactionId"`
	TokenKey      string `json:"tokenKey"`
	AccountRef    string `json:"accountRef"`
	SenderBank    string `json:"senderBank"`
	PaidAt        string `json:"paidAt"`
}
