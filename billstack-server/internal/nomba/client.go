package nomba

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"
)

type TokenCache struct {
	token     string
	expiresAt time.Time
	mu        sync.Mutex
}

type tokenRequest struct {
	ClientID     string `json:"client_id"`
	GrantType    string `json:"grant_type"`
	ClientSecret string `json:"client_secret"`
}

type tokenResponse struct {
	Code string `json:"code"`
	Data struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	} `json:"data"`
}

var Cache = &TokenCache{}

func (t *TokenCache) GetToken() string {
	t.mu.Lock()
	defer t.mu.Unlock()
	return t.token
}

func (t *TokenCache) FetchToken(ctx context.Context) error {
	baseUrl := os.Getenv("NOMBA_BASE_URL")
	url := fmt.Sprintf("%s/auth/token/issue", baseUrl)
	

	body := tokenRequest{
		ClientID:     os.Getenv("NOMBA_TEST_CLIENT_ID"),
		GrantType:    "client_credentials",
		ClientSecret: os.Getenv("NOMBA_TEST_PRIVATE_KEY"),
	}

	bodyBytes, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("failed to marshal token request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(bodyBytes))
	if err != nil {
		return fmt.Errorf("failed to create token request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("accountId", os.Getenv("NOMBA_ACCOUNT_ID"))

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("token request failed: %w", err)
	}
	defer resp.Body.Close()

	var result tokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return fmt.Errorf("failed to decode token response: %w", err)
	}

	if result.Code != "00" {
		return fmt.Errorf("nomba token error: code %s", result.Code)
	}

	// store in cache
	t.mu.Lock()
	t.token = result.Data.AccessToken
	t.expiresAt = time.Now().Add(time.Duration(result.Data.ExpiresIn) * time.Second)
	t.mu.Unlock()

	return nil
}

func (t *TokenCache) StartRefresher(ctx context.Context) {
	// fetch immediately on startup so token is ready before first request
	if err := t.FetchToken(ctx); err != nil {
		fmt.Printf("initial nomba token fetch failed: %v\n", err)
	}

	go func() {
		ticker := time.NewTicker(30 * time.Minute)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				if err := t.FetchToken(ctx); err != nil {
					fmt.Printf("nomba token refresh failed: %v\n", err)
					// retry in 2 minutes if refresh fails
					time.Sleep(2 * time.Minute)
					t.FetchToken(ctx)
				}
			case <-ctx.Done():
				return
			}
		}
	}()
}

// Do makes an authenticated request to Nomba with all headers pre-attached
// every nomba API call uses this instead of building requests manually
func (t *TokenCache) Do(ctx context.Context, method string, path string, body any, result any) error {
	token := t.GetToken()
	if token == "" {
		return fmt.Errorf("nomba token not available, refresher may not have started")
	}

	// marshal body
	var bodyReader *bytes.Reader
	if body != nil {
		bodyBytes, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request body: %w", err)
		}
		bodyReader = bytes.NewReader(bodyBytes)
	} else {
		bodyReader = bytes.NewReader([]byte{})
	}

	// build full url
	baseURL := os.Getenv("NOMBA_BASE_URL")
	fullURL := fmt.Sprintf("%s%s", baseURL, path)

	req, err := http.NewRequestWithContext(ctx, method, fullURL, bodyReader)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// attach headers automatically — you never set these anywhere else
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("accountId", os.Getenv("NOMBA_ACCOUNT_ID"))

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("nomba request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		var nombaErr struct {
			Code        string `json:"code"`
			Description string `json:"description"`
		}
		json.NewDecoder(resp.Body).Decode(&nombaErr)
		return fmt.Errorf("nomba error %s: %s", nombaErr.Code, nombaErr.Description)
	}

	if result != nil {
		if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}
