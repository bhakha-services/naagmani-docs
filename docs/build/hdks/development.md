# Building Plugins with HDK

Step-by-step tutorial on creating, compiling, and testing a custom Naagmani HDK plugin in Go or TypeScript.

---

## 1. Scaffold a New Plugin Project

Use the Naagmani CLI to generate a plugin skeleton:

```bash
naagmani plugin create my-custom-filter --language go
# or
naagmani plugin create my-custom-filter --language node
```

This creates the project structure:
```text
my-custom-filter/
├── plugin.json
├── main.go (or src/index.ts)
└── Makefile
```

---

## 2. Implement the Hook Handler (Go Example)

```go
package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type HookEvent struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      int             `json:"id"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params"`
}

type HookResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      int         `json:"id"`
	Result  interface{} `json:"result"`
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Text()
		var event HookEvent
		if err := json.Unmarshal([]byte(line), &event); err != nil {
			continue
		}

		if event.Method == "init" {
			resp := HookResponse{
				JSONRPC: "2.0",
				ID:      event.ID,
				Result: map[string]interface{}{
					"status":  "ok",
					"version": "1.0.0",
				},
			}
			out, _ := json.Marshal(resp)
			fmt.Println(string(out))
			continue
		}

		if event.Method == "hook_event" {
			// Process and redact prompt
			resp := HookResponse{
				JSONRPC: "2.0",
				ID:      event.ID,
				Result: map[string]interface{}{
					"action": "continue",
				},
			}
			out, _ := json.Marshal(resp)
			fmt.Println(string(out))
		}
	}
}
```

---

## 3. Local Testing with Live Gateway

Link and test your plugin live against a local Naagmani gateway:

```bash
# Validates manifest and runs pre-flight tests
naagmani plugin dev .
```

---

## Related Documentation

- [Testing & Validation](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/testing.md)
- [Packaging & Publishing](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/publishing.md)
