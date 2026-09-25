# Go SDK & HDK Reference

The official **Naagmani Go SDK** (`naagmani-sdk-go`) and **Plugin HDK** (`naagmani-hdk-go`) provide high-performance, idiomatic Go clients for both the Data Plane Gateway and Control Plane APIs.

---

## Installation

```bash
go get github.com/naagmani/naagmani-go@latest
```

---

## 1. Chat Completion Client

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/naagmani/naagmani-go"
	"github.com/naagmani/naagmani-go/chat"
)

func main() {
	client := naagmani.NewClient(
		naagmani.WithAPIKey("nst_live_9b2d8819..."),
		naagmani.WithBaseURL("http://localhost:8080/v1"), // or https://gateway.naagmani.app/v1
	)

	req := &chat.CompletionRequest{
		Model: "gpt-4o",
		Messages: []chat.Message{
			{Role: "system", Content: "You are a helpful Go engineering assistant."},
			{Role: "user", Content: "Explain Goroutines and channels concisely."},
		},
		Temperature: 0.7,
	}

	resp, err := client.Chat.CreateCompletion(context.Background(), req)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}

	fmt.Println(resp.Choices[0].Message.Content)
	fmt.Printf("Total Tokens Used: %d
", resp.Usage.TotalTokens)
}
```

---

## 2. Real-Time Streaming (SSE)

```go
stream, err := client.Chat.CreateCompletionStream(context.Background(), req)
if err != nil {
    log.Fatal(err)
}
defer stream.Close()

for {
    chunk, err := stream.Recv()
    if err != nil {
        break // Stream completed
    }
    fmt.Print(chunk.Choices[0].Delta.Content)
}
```

---

## 3. Project Service Tokens Management

```go
import "github.com/naagmani/naagmani-go/tokens"

token, err := client.Tokens.Create(context.Background(), &tokens.CreateRequest{
    Name:         "ci-build-agent",
    Capabilities: []string{"inference:chat", "tools:execute"},
    TTLSeconds:   86400, // 24 hours
})
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Generated Secret: %s
", token.SecretKey)
```

---

## Next Steps

- [Node.js / TypeScript SDK](/docs/sdk/node)
- [Python SDK](/docs/sdk/python)
- [API Reference](/docs/api/overview)
