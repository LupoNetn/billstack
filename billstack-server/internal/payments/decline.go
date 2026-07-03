package payments

import "strings"

var hardDeclineCodes = map[string]bool{
	"05": true,
	"41": true,
	"43": true,
	"54": true,
	"57": true,
	"62": true,
}

var networkDeclineCodes = map[string]bool{
	"91": true,
	"96": true,
}

func CategorizeDecline(responseCode string) string {
	code := strings.TrimSpace(responseCode)
	if hardDeclineCodes[code] {
		return "hard"
	}
	if networkDeclineCodes[code] {
		return "network"
	}
	if code == "51" {
		return "soft"
	}
	if code == "" {
		return "soft"
	}
	return "soft"
}
