package payments

type CreateOrderRequest struct {
	OrderReference        string
	CustomerEmail         string
	CustomerID            string
	Amount                int64
	Currency              string
	CallbackURL           string
	TokenizeCard          bool
	AccountID             string
	SplitRequest          *SplitRequest
	OrderMetaData         map[string]string
	AllowedPaymentMethods []string
}

type SplitRequest struct {
	SplitType string
	SplitList []SplitListItem
}

type SplitListItem struct {
	AccountID string
	Value     string
}

type CreateOrderResponse struct {
	CheckoutLink   string
	OrderReference string
}

type ChargeCardRequest struct {
	OrderReference string
	CustomerEmail  string
	CustomerID     string
	Amount         int64
	Currency       string
	TokenKey       string
	CallbackURL    string
	AccountID      string
	SplitRequest   *SplitRequest
}

type ChargeCardResponse struct {
	Success       bool
	TransactionID string
	DeclineCode   string
	DeclineType   string // soft, hard, network
	Message       string
}

type ProvisionDVARequest struct {
	AccountRef     string
	AccountName    string
	Currency       string
	Bvn            string
	ExpectedAmount int64
	ExpiryDate     string
	CallbackURL    string
}

type ProvisionDVAResponse struct {
	AccountRef        string
	AccountHolderID   string
	BankAccountNumber string
	BankAccountName   string
	BankName          string
	Currency          string
	Expired           bool
}

type SuspendDVARequest struct {
	AccountID string
}

type SuspendDVAResponse struct {
	Suspended bool
}

type ExpireDVARequest struct {
	AccountRef string
}

type ExpireDVAResponse struct {
	Expired bool
}

type LookupDVARequest struct {
	Identifier string
}

type LookupDVAResponse struct {
	AccountRef        string
	AccountHolderID   string
	BankAccountNumber string
	BankAccountName   string
	BankName          string
	Currency          string
	Expired           bool
}

type VerifyTransactionRequest struct {
	TransactionID string
}

type VerifyTransactionResponse struct {
	TransactionID string
	MerchantTxRef string
	AmountKobo    int64
	Status        string
	Type          string
	Time          string
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
