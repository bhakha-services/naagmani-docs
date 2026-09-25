# Plugin Development Guide

In this tutorial, we will build an enterprise **DLP & Regex Masking Plugin** using Go and the official Naagmani HDK.

---

## Step 1: Initialize Project

```bash
mkdir pii-masking-plugin && cd pii-masking-plugin
go mod init github.com/myorg/pii-masking-plugin
go get github.com/naagmani/naagmani-hdk-go@latest
```

---

## Step 2: Define `plugin.json`

```json
{
  "id": "com.myorg.pii-masking",
  "name": "PII Masking Filter",
  "version": "1.0.0",
  "entrypoint": "./bin/plugin",
  "hooks": [
    { "name": "pre_route", "priority": 100, "on_failure": "fail-close" }
  ],
  "permissions": ["request:read_body", "request:mutate_body"]
}
```

---

## Step 3: Implement Hook in Go

```go
package main

import (
	"context"
	"regexp"
	"github.com/naagmani/naagmani-hdk-go/plugin"
)

var emailRegex = regexp.MustCompile(`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`)

func main() {
	p := plugin.New("com.myorg.pii-masking")

	p.OnPreRoute(func(ctx context.Context, req *plugin.PreRouteRequest) (*plugin.PreRouteResponse, error) {
		for i, msg := range req.Messages {
			// Redact email addresses
			req.Messages[i].Content = emailRegex.ReplaceAllString(msg.Content, "[REDACTED_EMAIL]")
		}

		return &plugin.PreRouteResponse{
			Action:   plugin.ActionContinue,
			Messages: req.Messages,
		}, nil
	})

	// Starts standard IPC loop
	p.Serve()
}
```

---

## Step 4: Build & Test Locally

```bash
# Compile binary
go build -o bin/plugin main.go

# Test using CLI simulator
naagmani plugins test ./ --sample-prompt "Reach me at test@example.com"
# Output:
# [OK] Intercepted in 0.8ms
# [OUTPUT] "Reach me at [REDACTED_EMAIL]"
```

---

## Next Steps

- [Testing & Validation Guide](/docs/plugins/testing)
- [Packaging & Publishing](/docs/plugins/publishing)
