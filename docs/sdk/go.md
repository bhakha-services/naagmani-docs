# Go HDK (`hdk/go`)

The Go Host Development Kit (HDK) provides high-performance, strongly typed abstractions for building Naagmani plugins in Go.

---

## Installation

Add the Go HDK package to your `go.mod`:

```bash
go get github.com/bhakha-services/naagmani-plugins/hdk/go
```

---

## Quick Example

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/bhakha-services/naagmani-plugins/hdk/go/hdk"
)

type MyPlugin struct{}

func (p *MyPlugin) HandlePrePrompt(ctx context.Context, req *hdk.PrePromptRequest) (*hdk.PrePromptResponse, error) {
	for i := range req.Messages {
		if strings.Contains(req.Messages[i].Content, "DROP TABLE") {
			return &hdk.PrePromptResponse{
				Status: hdk.StatusReject,
				Action: hdk.ActionAbort,
				Error: &hdk.HookError{
					Code:    "SQL_INJECTION_RISK",
					Message: "Prompt contains prohibited SQL statements.",
				},
			}, nil
		}
	}

	return &hdk.PrePromptResponse{
		Status:   hdk.StatusOk,
		Action:   hdk.ActionPass,
		Messages: req.Messages,
	}, nil
}

func main() {
	server := hdk.NewServer(&MyPlugin{})
	if err := server.Serve(); err != nil {
		fmt.Printf("Plugin server error: %v\n", err)
	}
}
```

---

## Key Interfaces

- `hdk.PrePromptHandler`: Implement `HandlePrePrompt(ctx, req)` for input interception.
- `hdk.PostGenerationHandler`: Implement `HandlePostGeneration(ctx, req)` for output inspection.
- `hdk.ErrorHandler`: Implement `HandleError(ctx, req)` for alert forwarding.
