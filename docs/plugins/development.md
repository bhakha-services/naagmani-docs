# Plugin Development Guide

This guide walks you through building a custom Naagmani plugin from scratch using the official HDKs (Hardware/Host Development Kits).

---

## 1. Prerequisites

- **Naagmani CLI** installed: `npm install -g @naagmani/cli` or binary install.
- Go (1.22+), Node.js (18+), or Python (3.10+) depending on your target language.

---

## 2. Scaffolding a New Plugin

Use the `naagmani init` or `naagmani create` command to generate a complete starter template:

```bash
# Initialize a TypeScript/Node.js plugin
naagmani init my-custom-plugin --template node

# Or Go plugin
naagmani init my-custom-plugin --template go

# Or Python plugin
naagmani init my-custom-plugin --template python
```

This creates the standard project layout:

```text
my-custom-plugin/
├── plugin.json
├── package.json (or go.mod / pyproject.toml)
├── src/ (or main.go / plugin.py)
└── README.md
```

---

## 3. Implementing Hook Handlers

### TypeScript Example (`@naagmani/hdk`)

```typescript
import { Plugin, HookContext, PrePromptPayload, HookResult } from "@naagmani/hdk";

const plugin = new Plugin({
  name: "my-custom-plugin",
  version: "1.0.0"
});

plugin.onPrePrompt(async (context: HookContext, payload: PrePromptPayload): Promise<HookResult> => {
  // Inspect and modify messages
  const sanitizedMessages = payload.messages.map(msg => ({
    ...msg,
    content: typeof msg.content === "string" 
      ? msg.content.replace(/SECRET_\w+/g, "[MASKED]") 
      : msg.content
  }));

  return {
    status: "ok",
    action: "modify",
    payload: { messages: sanitizedMessages }
  };
});

plugin.start();
```

---

### Go Example (`hdk/go`)

```go
package main

import (
	"context"
	"strings"

	"github.com/bhakha-services/naagmani-plugins/hdk/go/hdk"
)

type MyPlugin struct{}

func (p *MyPlugin) HandlePrePrompt(ctx context.Context, req *hdk.PrePromptRequest) (*hdk.PrePromptResponse, error) {
	for i := range req.Messages {
		req.Messages[i].Content = strings.ReplaceAll(req.Messages[i].Content, "SECRET_KEY", "[MASKED]")
	}
	return &hdk.PrePromptResponse{
		Status:   hdk.StatusOk,
		Action:   hdk.ActionModify,
		Messages: req.Messages,
	}, nil
}

func main() {
	server := hdk.NewServer(&MyPlugin{})
	if err := server.Serve(); err != nil {
		panic(err)
	}
}
```

---

### Python Example (`naagmani-hdk`)

```python
from naagmani_hdk import Plugin, HookContext, HookResult

plugin = Plugin(name="my-custom-plugin", version="1.0.0")

@plugin.hook("pre_prompt")
def handle_pre_prompt(context: HookContext, payload: dict) -> HookResult:
    messages = payload.get("messages", [])
    for msg in messages:
        if isinstance(msg.get("content"), str):
            msg["content"] = msg["content"].replace("SECRET_KEY", "[MASKED]")
    
    return HookResult(
        status="ok",
        action="modify",
        payload={"messages": messages}
    )

if __name__ == "__main__":
    plugin.serve()
```
