# Go SDK

Official Go client library for high-throughput backend microservices, streaming pipelines, and microservice architectures interacting with the Naagmani AI Gateway.

---

## Installation & Requirements

- **Supported Go Versions**: Go 1.22 or higher
- **Module Import**: `github.com/bhakha-services/naagmani-sdk-go`

```bash
go get github.com/bhakha-services/naagmani-sdk-go
```

---

## Client Initialization

The SDK client supports functional options for setting credentials, target base URLs, default projects, and timeout configurations:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/bhakha-services/naagmani-sdk-go"
)

func main() {
	client := naagmani.NewClient(
		naagmani.WithAPIKey(os.Getenv("NAAGMANI_API_KEY")),
		naagmani.WithBaseURL(os.Getenv("NAAGMANI_GATEWAY_URL")), // Default: http://localhost:8080/v1
		naagmani.WithProjectID(os.Getenv("NAAGMANI_PROJECT_ID")),
		naagmani.WithEnvironment("production"), // "test" or "production"
		naagmani.WithTimeout(30*time.Second),
	)

	req := naagmani.ChatCompletionRequest{
		Model: "smart", // Smart router policy
		Messages: []naagmani.ChatMessage{
			{Role: "system", Content: "You are an enterprise AI assistant."},
			{Role: "user", Content: "Explain Go concurrency primitives."},
		},
		Temperature: 0.7,
	}

	resp, err := client.ChatCompletions.Create(context.Background(), req)
	if err != nil {
		log.Fatalf("Request failed: %v", err)
	}

	fmt.Println(resp.Choices[0].Message.Content)
}
```

---

## Real-Time Streaming (SSE)

For interactive CLI utilities or web servers with Server-Sent Events:

```go
stream, err := client.ChatCompletions.CreateStream(ctx, naagmani.ChatCompletionRequest{
	Model: "smart",
	Messages: []naagmani.ChatMessage{
		{Role: "user", Content: "Draft a system architecture summary."},
	},
	Stream: true,
})
if err != nil {
	log.Fatalf("Stream creation failed: %v", err)
}
defer stream.Close()

for {
	chunk, err := stream.Recv()
	if err != nil {
		if errors.Is(err, io.EOF) {
			break
		}
		log.Fatalf("Stream read error: %v", err)
	}
	if len(chunk.Choices) > 0 {
		fmt.Print(chunk.Choices[0].Delta.Content)
	}
}
```

---

## Error Handling & Status Codes

The SDK returns structured errors that map to standard Naagmani and HTTP status codes:

```go
resp, err := client.ChatCompletions.Create(ctx, req)
if err != nil {
	var apiErr *naagmani.APIError
	if errors.As(err, &apiErr) {
		switch apiErr.StatusCode {
		case 401:
			log.Println("Unauthorized: check your NAAGMANI_API_KEY or Service Token.")
		case 403:
			log.Printf("Forbidden: capability or model not allowed: %s", apiErr.Message)
		case 429:
			log.Printf("Rate limit / budget exhausted: retry after %s", apiErr.RetryAfter)
		case 502, 503:
			log.Printf("Upstream model or Vault unavailable: %s", apiErr.Message)
		default:
			log.Printf("API Error (%d): %s", apiErr.StatusCode, apiErr.Message)
		}
		return
	}
	log.Fatalf("Network/client error: %v", err)
}
```

---

## Standard OpenAI Go Client Alternative

Because Naagmani conforms to the OpenAI specification, you can also use `github.com/sashabaranov/go-openai`:

```go
config := openai.DefaultConfig("your-naagmani-api-key")
config.BaseURL = "http://localhost:8080/v1"

client := openai.NewClientWithConfig(config)
```

---

## Related Documentation

- [Chat Completions API Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md)
- [Project Service Tokens](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/projects/service-tokens.md)
- [HDK Plugin Development in Go](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/development.md)

