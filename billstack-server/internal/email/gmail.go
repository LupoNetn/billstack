package email

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
)

type Mailer struct {
	service *gmail.Service
}

func NewMailer(ctx context.Context, credentialsPath string, tokenPath string) (*Mailer, error) {
	b, err := os.ReadFile(credentialsPath)
	if err != nil {
		slog.Error("Unable to read credentials file")
		return nil, fmt.Errorf("unable to read credentials file: %w", err)
	}

	config, err := google.ConfigFromJSON(b, gmail.GmailSendScope)
	if err != nil {
		slog.Error("Unable to get google config from json")
		return nil, fmt.Errorf("unable to parse credentials config: %w", err)
	}

	client, err := getClient(ctx, config, tokenPath)
	if err != nil {
		slog.Error("unable to get google client")
		return nil, fmt.Errorf("unable to get authenticated client: %w", err)
	}

	srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		slog.Error("unable to create gmail service")
		return nil, fmt.Errorf("unable to retrieve Gmail client: %w", err)
	}

	return &Mailer{service: srv}, nil

}

func (m *Mailer) Send(to, subject, body string) error {
	messageStr := fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s", to, subject, body)

	encodedMessage := base64.URLEncoding.EncodeToString([]byte(messageStr))

	var msg gmail.Message
	msg.Raw = encodedMessage

	_, err := m.service.Users.Messages.Send("me", &msg).Do()
	if err != nil {
		slog.Error("Unable to send email")
		return fmt.Errorf("unable to send email: %w", err)
	}

	return nil
}

// internal authentication helpers
func getClient(ctx context.Context, config *oauth2.Config, tokenPath string) (*http.Client, error) {
	tok, err := tokenFromFile(tokenPath)
	if err != nil {
		// Token doesn't exist or is invalid, trigger terminal auth workflow
		tok, err = getTokenFromWeb(ctx, config)
		if err != nil {
			return nil, err
		}
		if err := saveToken(tokenPath, tok); err != nil {
			return nil, err
		}
	}
	return config.Client(ctx, tok), nil
}

func getTokenFromWeb(ctx context.Context, config *oauth2.Config) (*oauth2.Token, error) {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser, authorize the app, then paste the code here:\n%v\n\nCode: ", authURL)

	var authCode string
	if _, err := fmt.Scan(&authCode); err != nil {
		return nil, fmt.Errorf("unable to read authorization code: %w", err)
	}

	tok, err := config.Exchange(ctx, authCode)
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve token from web: %w", err)
	}
	return tok, nil
}

func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

func saveToken(path string, token *oauth2.Token) error {
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		return fmt.Errorf("unable to cache oauth token: %w", err)
	}
	defer f.Close()
	return json.NewEncoder(f).Encode(token)
}
