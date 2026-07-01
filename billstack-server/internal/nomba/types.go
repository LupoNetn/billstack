package nomba

// give the nested struct its own name
type CheckoutOrder struct {
	OrderReference string `json:"orderReference"`
	Amount         int64  `json:"amount"`
	Currency       string `json:"currency"`
	CustomerEmail  string `json:"customerEmail"`
	CallbackURL    string `json:"callbackUrl"`
}

type CreateCheckoutOrderRequest struct {
	Order        CheckoutOrder `json:"order"`
	TokenizeCard bool          `json:"tokenizeCard"`
}

type CreateCheckoutOrderResponse struct {
	Code string `json:"code"`
	Data struct {
		CheckoutLink   string `json:"checkoutLink"`
		OrderReference string `json:"orderReference"`
	} `json:"data"`
}

type CreateDVARequest struct {
	AccountRef     string `json:"accountRef"`
	AccountName    string `json:"accountName"`
	Bvn            string `json:"bvn"`
	ExpectedAmount int64  `json:"expectedAmount"`
}

type CreateDVAResponse struct {
	Code        string `json:"code"`
	Description string `json:"description"`
	Data        struct {
		CreatedAt         string `json:"createdAt"`
		AccountHolderId   string `json:"accountHolderId"`
		AccountRef        string `json:"accountRef"`
		Bvn               string `json:"bvn"`
		AccountName       string `json:"accountName"`
		Currency          string `json:"currency"`
		BankName          string `json:"bankName"`
		BankAccountNumber string `json:"bankAccountNumber"`
		BankAccountName   string `json:"bankAccountName"`
		CallbackUrl       string `json:"callbackUrl"`
		Expired           bool   `json:"expired"`
	}
}
