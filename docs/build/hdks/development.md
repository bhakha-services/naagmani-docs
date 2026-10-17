# Building Plugins with HDK — Developer Tutorial

This tutorial walks through building a complete, working Naagmani HDK plugin from scratch using the official HDK libraries in **Go**, **Node.js/TypeScript**, and **Python**.

We will build a **Prompt Injection & PII Redactor Plugin** that:
1. Intercepts incoming chat prompts on `request.before`.
2. Blocks requests containing known prompt injection patterns.
3. Redacts email addresses into anonymous tokens.
4. Audits total processed tokens on `response.after`.

---

## Prerequisites

- **Naagmani CLI**: Installed (`naagmani version`)
- **Runtime**: Go 1.22+, Node.js 20+, or Python 3.10+
- **Local Naagmani OS**: Running locally or via Docker Compose

---

## 1. Scaffold a New Plugin Project

Use the Naagmani CLI to scaffold your project:

```bash
# For Go
naagmani plugin create email-guardrail --language go

# For Node.js / TypeScript
naagmani plugin create email-guardrail --language node

# For Python
naagmani plugin create email-guardrail --language python
```

The CLI initializes the canonical project directory:
```text
email-guardrail/
├── plugin.json       # Manifest metadata & hook declarations
├── main.go / index.ts / main.py
└── Makefile / package.json / pyproject.toml
```

---

## 2. Define the Manifest (`plugin.json`)

Configure your plugin's permissions and hooks in `plugin.json`:

```json
{
  "name": "email-guardrail",
  "version": "1.0.0",
  "api_version": "v1",
  "description": "Enterprise prompt injection and email redaction guardrail",
  "author": "Security Engineering",
  "runtime": {
    "language": "go",
    "command": "./bin/email-guardrail"
  },
  "priority": 10,
  "failure_policy": "fail_close",
  "timeout_ms": 500,
  "hooks": [
    "request.before",
    "response.after"
  ],
  "permissions": [
    "request.read",
    "request.modify",
    "response.read"
  ],
  "capabilities": [
    "security.guardrail"
  ]
}
```

---

## 3. Implement the Plugin

### Option A: Go Implementation (`main.go`)

Install the Go HDK:
```bash
go get github.com/bhakha-services/naagmani-plugins/hdk/go/plugin
```

Write `main.go`:
```go
package main

import (
	"log"
	"regexp"
	"strings"

	"github.com/bhakha-services/naagmani-plugins/hdk/go/plugin"
)

var emailRegex = regexp.MustCompile(`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`)

func main() {
	p := plugin.New("email-guardrail").
		Version("1.0.0").
		Description("Enterprise prompt injection and email redaction guardrail").
		Author("Security Engineering").
		Capabilities("security.guardrail")

	// Hook 1: Synchronous Inbound Request Inspection & Redaction
	p.OnRequestBefore(func(ctx *plugin.Context, req *plugin.Request) (*plugin.Result, error) {
		// 1. Inspect Tenant Identity
		log.Printf("[email-guardrail] RequestID=%s OrgID=%s Env=%s",
			ctx.RequestID, ctx.Tenant.OrganizationID, ctx.Tenant.EnvironmentID)

		hasModifications := false

		for i := range req.Messages {
			content := req.Messages[i].Content

			// 2. Prompt Injection Defense (Block request)
			if strings.Contains(strings.ToLower(content), "ignore previous instructions") {
				return plugin.Block("Prompt injection attempt detected"), nil
			}

			// 3. Email Redaction (Modify request)
			if emailRegex.MatchString(content) {
				req.Messages[i].Content = emailRegex.ReplaceAllString(content, "[EMAIL_REDACTED]")
				hasModifications = true
			}
		}

		if hasModifications {
			return plugin.ModifyRequest(req), nil
		}

		return plugin.Continue(), nil
	})

	// Hook 2: Asynchronous Post-Response Telemetry & Audit
	p.OnResponseAfter(func(ctx *plugin.Context, resp *plugin.Response) (*plugin.Result, error) {
		log.Printf("[email-guardrail:audit] RequestID=%s Model=%s Tokens=%d",
			ctx.RequestID, resp.Model, resp.Usage.TotalTokens)
		return plugin.Continue(), nil
	})

	// Start standard I/O event loop
	if err := p.Run(); err != nil {
		log.Fatalf("Plugin failed: %v", err)
	}
}
```

---

### Option B: Node.js / TypeScript Implementation (`src/index.ts`)

Install dependencies:
```bash
npm install @naagmani/hdk
```

Write `src/index.ts`:
```typescript
import { Plugin, Context, Request, Response, Result } from "@naagmani/hdk";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const plugin = new Plugin({
  name: "email-guardrail",
  version: "1.0.0",
  description: "Enterprise prompt injection and email redaction guardrail",
  author: "Security Engineering",
  capabilities: ["security.guardrail"],
});

// Hook 1: Request Inspection & Redaction
plugin.onRequestBefore((ctx: Context, req: Request): Result => {
  console.error(`[email-guardrail] Processing RequestID=${ctx.requestId}`);

  let modified = false;

  for (const message of req.messages) {
    // 1. Block prompt injection
    if (message.content.toLowerCase().includes("ignore previous instructions")) {
      return Result.block("Prompt injection attempt detected");
    }

    // 2. Redact email addresses
    if (EMAIL_REGEX.test(message.content)) {
      message.content = message.content.replace(EMAIL_REGEX, "[EMAIL_REDACTED]");
      modified = true;
    }
  }

  if (modified) {
    return Result.modifyRequest(req);
  }

  return Result.continue();
});

// Hook 2: Post-Response Telemetry
plugin.onResponseAfter((ctx: Context, resp: Response): Result => {
  console.error(`[email-guardrail:audit] Completed: Tokens=${resp.usage?.totalTokens}`);
  return Result.continue();
});

// Start event loop
plugin.run().catch((err) => {
  console.error("Fatal plugin error:", err);
  process.exit(1);
});
```

---

### Option C: Python Implementation (`main.py`)

Install package:
```bash
pip install naagmani-hdk
```

Write `main.py`:
```python
import re
import sys
from naagmani.plugin import Plugin, Context, Request, Response, Result

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

plugin = (
    Plugin("email-guardrail")
    .set_version("1.0.0")
    .set_description("Enterprise prompt injection and email redaction guardrail")
    .set_author("Security Engineering")
    .add_capabilities("security.guardrail")
)

@plugin.on("request.before")
def handle_request(ctx: Context, req: Request) -> Result:
    sys.stderr.write(f"[email-guardrail] RequestID={ctx.request_id}\n")

    modified = False

    for msg in req.messages:
        # 1. Prompt Injection Block
        if "ignore previous instructions" in msg.content.lower():
            return Result.block("Prompt injection attempt detected")

        # 2. Email Redaction
        if EMAIL_REGEX.search(msg.content):
            msg.content = EMAIL_REGEX.sub("[EMAIL_REDACTED]", msg.content)
            modified = True

    if modified:
        return Result.modify_request(req)

    return Result.continue_()

@plugin.on("response.after")
def handle_response_after(ctx: Context, resp: Response) -> Result:
    sys.stderr.write(f"[email-guardrail:audit] Tokens={resp.usage.total_tokens}\n")
    return Result.continue_()

if __name__ == "__main__":
    plugin.run()
```

---

## 4. Local Testing & Validation

### Validate Manifest
```bash
naagmani plugin validate .
```
Expected output:
```text
✓ plugin.json is valid.
  Name:        email-guardrail (v1.0.0)
  Language:    go
  Hooks:       [request.before, response.after]
  Permissions: [request.read, request.modify, response.read]
```

### Build & Package
```bash
naagmani plugin package .
```
This generates a compiled distribution tarball and SHA-256 checksum:
```text
✓ Built distribution package: email-guardrail-1.0.0-linux-amd64.tar.gz
✓ SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

### Local Dev Link
Attach the plugin directly to your local running Naagmani OS gateway:
```bash
naagmani plugin dev .
```
Now send an inference request through `http://localhost:8080/v1/chat/completions`. Your plugin will intercept prompts in real time.
