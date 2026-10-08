# Go SDK

Official Go client library for high-throughput backend microservices interacting with the Naagmani Gateway.

---

## Installation

```bash
go get github.com/bhakha-services/naagmani-sdk-go
```

---

## Example Usage

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/bhakha-services/naagmani-sdk-go"
)

func main() {
	client := naagmani.NewClient(
		naagmani.WithAPIKey(os.Getenv("NAAGMANI_API_KEY")),
		naagmani.WithBaseURL("http://localhost:8080/v1"),
	)

	req := naagmani.ChatCompletionRequest{
		Model: "smart",
		Messages: []naagmani.ChatMessage{
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

## Related Documentation

- [Chat Completions API](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md)
- [Project Service Tokens](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/projects/service-tokens.md)
