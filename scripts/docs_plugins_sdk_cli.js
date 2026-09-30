const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', 'docs');

const files = {
  // ==========================================
  // PLUGINS & HDKs
  // ==========================================
  'plugins/overview.md': `# Plugin System Overview

The **Naagmani Plugin System** empowers developers to extend the core AI gateway runtime with custom hooks, guardrails, policy filters, protocol translations, and real-time transform logic.

Built with an isolated, sandboxed execution model, plugins run alongside the high-throughput Go engine without compromising security or memory boundaries.

\`\`\`mermaid
flowchart LR
    Client([Client Application]) --> Ingress[Gateway Ingress]
    
    subgraph PluginEngine ["Plugin Runtime Engine"]
        Ingress --> PreHook["pre_route Hook\n(Inspection / Rewrite)"]
        PreHook --> CoreRouting["Core Smart Routing & Vault"]
        CoreRouting --> PostHook["post_response Hook\n(DLP / Moderation)"]
    end
    
    PostHook --> Client
    CoreRouting --> Upstream["Upstream LLM / Tool"]
\`\`\`

---

## Why Use Plugins?

While standard API gateways offer static configurations, modern enterprise AI workloads require programmatic, contextual interventions:

1. **Deterministic Guardrails & DLP:** Redact PII (Personally Identifiable Information) before it touches external third-party models.
2. **Context Enrichment & RAG Injection:** Intercept requests to dynamically attach enterprise knowledge chunks based on semantic embeddings.
3. **Custom FinOps Routing:** Inject proprietary cost-optimization heuristics or team quota counters.
4. **Tool/Protocol Bridging:** Seamlessly transform internal RPC contracts into OpenAI-compatible tool specifications.

---

## Anatomy of a Plugin

A Naagmani plugin consists of three primary components:

| Component | Description | Reference |
| :--- | :--- | :--- |
| **Manifest (\`plugin.json\`)** | Metadata, capabilities, entrypoint binaries, and requested permissions. | [Plugin Manifest](/docs/plugins/manifest) |
| **Executable Hook Binary** | The compiled logic (Go, Rust, Python, or Node.js) communicating over the v1 Wire Protocol. | [Wire Protocol](/docs/plugins/protocol) |
| **Config Schema** | JSON schema defining user-configurable runtime parameters in the Developer Portal. | [Portal Settings](/docs/developer-portal/overview) |

---

## Architectural Principles

### 1. Sandboxed Isolation
Plugins run in dedicated, non-privileged child processes or WebAssembly (Wasm) runtimes. If a plugin panics or encounters an unhandled exception, the core gateway isolates the failure and falls back gracefully based on the plugin's configured failure mode (\`fail-open\` or \`fail-close\`).

### 2. Zero-Copy gRPC/IPC Protocol
All hook payloads (request buffers, response streams, attempt telemetry) are exchanged via high-speed Unix Domain Sockets or shared IPC pipes using standard Protocol Buffers, adding **< 1.2ms** median latency overhead.

---

## Quick Example: PII Redaction Filter

\`\`\`json
{
  "name": "enterprise-dlp-filter",
  "version": "1.0.0",
  "description": "Scans and redacts SSNs and credit card numbers prior to model dispatch.",
  "entrypoint": "bin/dlp_hook",
  "hooks": ["pre_route", "post_response"],
  "permissions": ["request:read_body", "request:mutate_body"]
}
\`\`\`

---

## Developer Portal Management

You can inspect, activate, configure, and monitor plugins directly from the Developer Portal:
- Navigate to **Plugins & Marketplace**: [{{DEVELOPER_PORTAL_URL}}/plugins]({{DEVELOPER_PORTAL_URL}}/plugins)

---

## Next Steps

- [Plugin Architecture & Isolation](/docs/plugins/architecture)
- [Plugin Manifest Specification](/docs/plugins/manifest)
- [Wire Protocol (v1)](/docs/plugins/protocol)
- [Go Plugin HDK Guide](/docs/sdk/go)
`,

  'plugins/architecture.md': `# Plugin Architecture & Isolation

Naagmani is designed with a **Micro-Kernel Gateway Architecture**. The core runtime handles transport multiplexing, token metering, and cryptographically verified vault access, while extensible logic is delegated to isolated worker processes known as **Hook Daemons**.

\`\`\`mermaid
flowchart TD
    subgraph Gateway ["Naagmani Core Data Plane (Go)"]
        A[Inbound Client Request] --> B[Pipeline Controller]
        B --> C{Hook Dispatcher}
        C -->|IPC / Socket| D[Plugin IPC Supervisor]
        C -->|Direct| E[Upstream AI Adapter]
    end

    subgraph Sandboxes ["Sandboxed Plugin Workers"]
        D -->|Stdio/RPC| P1["Plugin A: Auth Validator"]
        D -->|Unix Socket| P2["Plugin B: DLP Redaction"]
    end

    E --> UpstreamLLM[(Anthropic / OpenAI)]
\`\`\`

---

## Execution Isolation Models

Naagmani supports two execution runtimes for plugins:

### 1. Managed Subprocess (IPC / Stdio)
- **Languages:** Go, Python, Node.js, Rust.
- **Mechanism:** The Gateway forks the plugin binary and establishes high-speed bidirectional communication via standard input/output or Unix Domain Sockets.
- **Resource Constraints:** Process memory and CPU limits are enforced via OS-level cgroups / job objects.

### 2. WebAssembly (Wasm / WASI) *(Beta)*
- **Languages:** Rust, C, TinyGo.
- **Mechanism:** Direct embedded execution within the Gateway memory space using Wasmer/Wasmtime sandboxing.
- **Latency:** Sub-millisecond execution (< 0.2ms) with strictly sandboxed memory access.

---

## Failure Modes & Resilience

Every hook in your \`plugin.json\` can define its failure policy if the plugin daemon crashes, times out, or returns a 500 error:

| Mode | Gateway Action | Use Case |
| :--- | :--- | :--- |
| **\`fail-close\`** (Default) | The gateway terminates the client request with \`502 Bad Gateway\` and logs the hook crash in Audit Logs. | Security filters, DLP sanitizers, custom authorization checks. |
| **\`fail-open\`** | The gateway logs a warning, bypasses the failed hook, and proceeds with standard model routing. | Observability scrapers, non-critical analytics, experimental enrichment. |

---

## Lifecycle Overview

\`\`\`mermaid
sequenceDiagram
    participant GW as Naagmani Gateway
    participant P as Plugin Process

    GW->>P: Spawn process (STDIN/STDOUT pipe)
    GW->>P: Handshake Request {"protocol_version": "v1"}
    P-->>GW: Handshake ACK {"capabilities": ["pre_route", "post_response"]}
    
    loop Every Matching Request
        GW->>P: Hook Event Payload
        P-->>GW: Mutated Payload / Action Decision
    end

    GW->>P: SIGTERM (Graceful shutdown)
\`\`\`

---

## Related Guides

- [Plugin Manifest Specification](/docs/plugins/manifest)
- [Plugin Lifecycle & Heartbeats](/docs/plugins/lifecycle)
- [Go Plugin Development (HDK)](/docs/sdk/go)
`,

  'plugins/manifest.md': `# Plugin Manifest (\`plugin.json\`)

Every Naagmani plugin must contain a root descriptor named \`plugin.json\`. This manifest defines the plugin's identity, entrypoint, required capabilities, and schema configuration.

---

## Full Manifest Schema

\`\`\`json
{
  "$schema": "https://naagmani.app/schemas/v1/plugin.json",
  "id": "com.company.pii-guard",
  "name": "PII & Secret Guardrail",
  "version": "1.2.0",
  "description": "Scans prompts for API keys, passwords, and PII before dispatching to public models.",
  "author": {
    "name": "DevSecOps Team",
    "email": "security@company.com",
    "url": "https://company.com"
  },
  "runtime": {
    "type": "native",
    "entrypoint": "./bin/pii_guard",
    "env": {
      "LOG_LEVEL": "info"
    }
  },
  "hooks": [
    {
      "name": "pre_route",
      "priority": 100,
      "timeout_ms": 250,
      "on_failure": "fail-close"
    },
    {
      "name": "post_response",
      "priority": 50,
      "timeout_ms": 300,
      "on_failure": "fail-open"
    }
  ],
  "permissions": [
    "request:read_body",
    "request:mutate_body",
    "response:read_body",
    "telemetry:emit"
  ],
  "config_schema": {
    "type": "object",
    "properties": {
      "redact_ssn": {
        "type": "boolean",
        "default": true,
        "description": "Mask US Social Security Numbers"
      },
      "custom_regex_patterns": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Additional regular expressions to redact"
      }
    },
    "required": ["redact_ssn"]
  }
}
\`\`\`

---

## Key Fields Explained

### \`id\` (string, required)
Unique reverse-domain identifier (e.g., \`com.example.analytics\`).

### \`runtime\` (object, required)
- **\`type\`**: Execution runtime: \`native\` (compiled binary) or \`wasm\`.
- **\`entrypoint\`**: Relative path to the executable binary or Wasm artifact.

### \`hooks\` (array of objects)
Defines which execution stages the plugin intercepts:
- **\`name\`**: Target hook point (e.g., \`pre_route\`, \`post_response\`, \`on_error\`).
- **\`priority\`**: Execution order (higher numbers execute first, e.g. 100 before 50).
- **\`timeout_ms\`**: Maximum allowed processing latency before triggering the failure policy.
- **\`on_failure\`**: Either \`fail-close\` (reject request) or \`fail-open\` (bypass).

### \`permissions\` (array of strings)
Declares access limits for least-privilege enforcement. See [Permissions & Security](/docs/plugins/permissions).

---

## Validating Your Manifest

You can validate your \`plugin.json\` using the Naagmani CLI:

\`\`\`bash
naagmani plugins validate ./my-plugin
# Output: [OK] plugin.json schema valid. 2 hooks declared. 0 security warnings.
\`\`\`

---

## Next Steps

- [Wire Protocol (v1)](/docs/plugins/protocol)
- [Plugin Execution Hooks](/docs/plugins/hooks)
`,

  'plugins/protocol.md': `# Wire Protocol (v1)

Naagmani and its plugin worker processes communicate using a line-delimited JSON-RPC or Protocol Buffers protocol over standard streams (\`stdin\`/\`stdout\`) or Unix Domain Sockets.

---

## Protocol Lifecycle

1. **Initialization Handshake**: The gateway launches the plugin process and sends an \`init\` command.
2. **Readiness Probe**: The plugin responds with its negotiated capabilities and status.
3. **Event Execution Loop**: The gateway dispatches hook payloads and awaits completion messages.
4. **Shutdown Signal**: The gateway transmits a \`shutdown\` event before terminating the process.

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant GW as Gateway Core
    participant PL as Plugin Worker

    GW->>PL: {"type": "init", "config": {...}, "protocol_version": 1}
    PL-->>GW: {"type": "ready", "status": "ok", "version": "1.0.0"}
    
    Note over GW,PL: Active Request Pipeline
    GW->>PL: {"type": "hook_event", "hook": "pre_route", "payload": {...}}
    PL-->>GW: {"type": "hook_response", "action": "continue", "mutations": {...}}
\`\`\`

---

## Frame Types

### 1. Init Message
\`\`\`json
{
  "type": "init",
  "protocol_version": 1,
  "config": {
    "redact_ssn": true,
    "environment": "production"
  },
  "organization_id": "org_ad094812-07ef-4db5-b2ba-6585bd9df55e",
  "project_id": "prj_88194488-29a9-4081-b552-47514a60f601"
}
\`\`\`

### 2. Hook Event Message
\`\`\`json
{
  "type": "hook_event",
  "event_id": "evt_998124_1790355",
  "hook": "pre_route",
  "context": {
    "request_id": "req_klskuy2d3_1790355262227",
    "model": "gpt-4o",
    "token_id": "nst_live_9b2d8819..."
  },
  "payload": {
    "messages": [
      {
        "role": "user",
        "content": "My social security number is 000-12-3456."
      }
    ],
    "temperature": 0.7
  }
}
\`\`\`

### 3. Hook Response Message
\`\`\`json
{
  "type": "hook_response",
  "event_id": "evt_998124_1790355",
  "action": "continue",
  "mutations": {
    "messages": [
      {
        "role": "user",
        "content": "My social security number is [REDACTED_SSN]."
      }
    ]
  },
  "metadata": {
    "redaction_count": 1,
    "rule": "US_SSN"
  }
}
\`\`\`

---

## Action Decision Types

| Action | Meaning |
| :--- | :--- |
| **\`continue\`** | Proceed to the next hook or upstream model with optional mutations. |
| **\`short_circuit\`** | Terminate the pipeline immediately and return the plugin's response directly to the client (e.g. cached response or guardrail rejection). |
| **\`block\`** | Terminate the request with an HTTP error code (e.g., \`400 Bad Request\` or \`403 Forbidden\`). |

---

## Next Steps

- [Plugin Lifecycle & Process Monitoring](/docs/plugins/lifecycle)
- [Plugin Development with Go HDK](/docs/sdk/go)
`,

  'plugins/lifecycle.md': `# Plugin Lifecycle & Process Management

Understanding how Naagmani spawns, monitors, hot-reloads, and cleanly terminates plugin daemons ensures zero-downtime operations and predictable latency.

---

## Lifecycle Stages

\`\`\`mermaid
stateDiagram-v2
    [*] --> Starting: Spawn Process
    Starting --> Initializing: Send Handshake
    Initializing --> Healthy: Handshake ACK
    Healthy --> Executing: Inbound Hook Event
    Executing --> Healthy: Hook Response Returned
    Healthy --> Degraded: Health Check Timeout / Err
    Degraded --> Terminating: Max Failures Exceeded
    Healthy --> Terminating: Config Reload / SIGTERM
    Terminating --> [*]: Process Exit
\`\`\`

---

## 1. Process Boot & Handshake

When a project environment activates a plugin:
1. The gateway executes the \`entrypoint\` binary in a fresh execution context.
2. The gateway sets the environment variables (\`NAAGMANI_ENV\`, \`PORTAL_API_URL\`, \`PROJECT_ID\`).
3. The gateway issues an \`init\` JSON-RPC payload.
4. If the plugin fails to reply within **3000ms**, the gateway flags the plugin as \`DEAD\` and triggers the fallback policy.

---

## 2. Heartbeats & Health Checks

For native socket and RPC plugins, Naagmani dispatches a lightweight \`ping\` event every 15 seconds. If a plugin worker process stops responding:
- It is removed from the active routing ring.
- In-flight requests are rerouted according to the \`on_failure\` rule.
- A new replacement worker process is automatically spawned up to 3 retry attempts.

---

## 3. Hot Reloading Configuration

When an administrator updates plugin settings in the Developer Portal ([{{DEVELOPER_PORTAL_URL}}/plugins]({{DEVELOPER_PORTAL_URL}}/plugins)), Naagmani performs a **hot configuration push**:

\`\`\`json
{
  "type": "config_update",
  "new_config": {
    "redact_ssn": true,
    "similarity_threshold": 0.85
  }
}
\`\`\`

The plugin updates its internal state in-memory without dropping active connection streams.

---

## Next Steps

- [Plugin Execution Hooks](/docs/plugins/hooks)
- [Permissions & Security Model](/docs/plugins/permissions)
`,

  'plugins/hooks.md': `# Execution Hooks

Naagmani offers discrete hook interception points along the complete request/response lifecycle.

\`\`\`mermaid
flowchart TD
    A[Client Request] --> B[pre_auth]
    B --> C[pre_route]
    C --> D[pre_model_call]
    D --> E[Upstream AI Execution]
    E --> F[post_model_call]
    F --> G[post_response]
    G --> H[Client Response]
    
    E -.->|Error Encountered| I[on_error]
\`\`\`

---

## Supported Hook Points

| Hook Name | When It Executes | Can Mutate Payload? | Common Use Cases |
| :--- | :--- | :--- | :--- |
| **\`pre_auth\`** | Before token validation and project context resolution. | Headers only | Custom JWT decryption, IP whitelisting. |
| **\`pre_route\`** | After project auth, before selecting the upstream provider/model. | Yes (Full) | Semantic routing, RAG context enrichment, PII masking. |
| **\`pre_model_call\`** | Immediately before dispatching payload to the selected provider adapter. | Yes (Provider payload) | Model-specific prompt formatting, token clipping. |
| **\`post_model_call\`** | Immediately after provider response or first stream chunk. | Yes | Output moderation, toxic content filtering. |
| **\`post_response\`** | Final stage before sending bytes to client. | Yes | Watermarking, telemetry calculation. |
| **\`on_error\`** | Triggered when upstream provider returns 4xx/5xx or timeouts. | Error payload | Custom error formatting, alert webhooks. |

---

## Hook Priority & Ordering

Multiple plugins can attach to the same hook point. They execute strictly ordered by their \`priority\` integer in descending order:

1. \`Plugin A\` (\`priority: 100\`)
2. \`Plugin B\` (\`priority: 50\`)
3. \`Plugin C\` (\`priority: 10\`)

Each plugin receives the output resulting from the preceding plugin in the pipeline.

---

## Next Steps

- [Permissions & Security](/docs/plugins/permissions)
- [Plugin Development Guide](/docs/plugins/development)
`,

  'plugins/permissions.md': `# Permissions & Security Model

To protect sensitive tenant data and model credentials, Naagmani enforces a strict **Least-Privilege Security Sandbox** for all plugins.

---

## Permission Scopes

Plugins must declare all required permissions in their \`plugin.json\` manifest. Any attempt to read or mutate unpermitted fields will be blocked by the Gateway kernel.

| Scope | Description | Risk Level |
| :--- | :--- | :--- |
| **\`request:read_body\`** | Read incoming prompt messages and request arguments. | Medium |
| **\`request:mutate_body\`** | Modify or rewrite prompt messages, temperature, and parameters. | High |
| **\`request:read_headers\`** | Inspect inbound HTTP request headers. | Low |
| **\`response:read_body\`** | Inspect generated model responses and tool outputs. | Medium |
| **\`response:mutate_body\`**| Modify generated output before it reaches the client. | High |
| **\`vault:read_secrets\`** | Request decrypted project credentials (restricted to certified plugins). | Critical |
| **\`telemetry:emit\`** | Append custom metrics and trace tags to Attempt Telemetry. | Low |

---

## Secret Isolation

Plugins **never** have direct access to provider API keys (e.g. your master OpenAI or Anthropic credentials). The Gateway decrypts vault credentials internally and dispatches requests directly to upstream endpoints.

---

## Next Steps

- [Building a Plugin: Step-by-Step](/docs/plugins/development)
- [Testing & Validation](/docs/plugins/testing)
`,

  'plugins/development.md': `# Plugin Development Guide

In this tutorial, we will build an enterprise **DLP & Regex Masking Plugin** using Go and the official Naagmani HDK.

---

## Step 1: Initialize Project

\`\`\`bash
mkdir pii-masking-plugin && cd pii-masking-plugin
go mod init github.com/myorg/pii-masking-plugin
go get github.com/naagmani/naagmani-hdk-go@latest
\`\`\`

---

## Step 2: Define \`plugin.json\`

\`\`\`json
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
\`\`\`

---

## Step 3: Implement Hook in Go

\`\`\`go
package main

import (
	"context"
	"regexp"
	"github.com/naagmani/naagmani-hdk-go/plugin"
)

var emailRegex = regexp.MustCompile(\`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\`)

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
\`\`\`

---

## Step 4: Build & Test Locally

\`\`\`bash
# Compile binary
go build -o bin/plugin main.go

# Test using CLI simulator
naagmani plugins test ./ --sample-prompt "Reach me at test@example.com"
# Output:
# [OK] Intercepted in 0.8ms
# [OUTPUT] "Reach me at [REDACTED_EMAIL]"
\`\`\`

---

## Next Steps

- [Testing & Validation Guide](/docs/plugins/testing)
- [Packaging & Publishing](/docs/plugins/publishing)
`,

  'plugins/testing.md': `# Testing & Validation

Testing your plugins prior to deployment prevents latency spikes, memory leaks, and pipeline failures.

---

## 1. Unit Testing with HDK Mock Suite

The Go HDK provides an in-memory testing harness to simulate gateway invocations:

\`\`\`go
package main

import (
	"context"
	"testing"
	"github.com/naagmani/naagmani-hdk-go/testing/harness"
	"github.com/stretchr/testify/assert"
)

func TestEmailRedaction(t *testing.T) {
	h := harness.New(myPreRouteHandler)

	resp, err := h.ExecutePreRoute(context.Background(), &plugin.PreRouteRequest{
		Messages: []plugin.Message{
			{Role: "user", Content: "Contact me at alice@naagmani.app"},
		},
	})

	assert.NoError(t, err)
	assert.Equal(t, "[REDACTED_EMAIL]", resp.Messages[0].Content)
}
\`\`\`

---

## 2. CLI Benchmark & Latency Testing

Use the CLI to test execution speed under load:

\`\`\`bash
naagmani plugins benchmark ./ --concurrency 50 --requests 1000
# Output:
# ── Benchmark Summary ──────────────────────────
#   Total Invocations:   1,000
#   p50 Latency:         0.45 ms
#   p95 Latency:         0.92 ms
#   p99 Latency:         1.21 ms
#   Memory Footprint:    12.4 MB
#   Status:              PASS (meets < 2ms criteria)
\`\`\`

---

## Next Steps

- [Packaging & Publishing](/docs/plugins/publishing)
- [Marketplace Installation](/docs/marketplace/installing-plugins)
`,

  'plugins/publishing.md': `# Packaging & Publishing

Once your plugin has passed testing, you can package it into a distributable archive and publish it to the Naagmani Marketplace or your organization's private registry.

---

## 1. Package Archive Structure

A published plugin bundle is a standard compressed archive (\`.tar.gz\` or \`.zip\`) containing:

\`\`\`text
my-plugin-1.0.0.tar.gz
├── plugin.json          # Manifest
├── README.md            # Documentation & usage
├── LICENSE              # License file
└── bin/
    ├── plugin-linux-amd64
    ├── plugin-linux-arm64
    └── plugin-darwin-arm64
\`\`\`

---

## 2. Publishing via CLI

Authenticate and push the package directly to your organization registry:

\`\`\`bash
# Package binary
naagmani plugins pack ./ -o ./dist/pii-guard-1.0.0.tar.gz

# Publish to private registry
naagmani plugins publish ./dist/pii-guard-1.0.0.tar.gz --scope organization --visibility private
\`\`\`

---

## Next Steps

- [Marketplace Overview](/docs/marketplace/overview)
- [Installing Plugins into Environments](/docs/marketplace/installing-plugins)
`,

  // ==========================================
  // SDKs
  // ==========================================
  'sdk/go.md': `# Go SDK & HDK Reference

The official **Naagmani Go SDK** (\`naagmani-sdk-go\`) and **Plugin HDK** (\`naagmani-hdk-go\`) provide high-performance, idiomatic Go clients for both the Data Plane Gateway and Control Plane APIs.

---

## Installation

\`\`\`bash
go get github.com/naagmani/naagmani-go@latest
\`\`\`

---

## 1. Chat Completion Client

\`\`\`go
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
		naagmani.WithBaseURL("{{GATEWAY_URL}}/v1"),
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
	fmt.Printf("Total Tokens Used: %d\n", resp.Usage.TotalTokens)
}
\`\`\`

---

## 2. Real-Time Streaming (SSE)

\`\`\`go
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
\`\`\`

---

## 3. Project Service Tokens Management

\`\`\`go
import "github.com/naagmani/naagmani-go/tokens"

token, err := client.Tokens.Create(context.Background(), &tokens.CreateRequest{
    Name:         "ci-build-agent",
    Capabilities: []string{"inference:chat", "tools:execute"},
    TTLSeconds:   86400, // 24 hours
})
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Generated Secret: %s\n", token.SecretKey)
\`\`\`

---

## Next Steps

- [Node.js / TypeScript SDK](/docs/sdk/node)
- [Python SDK](/docs/sdk/python)
- [API Reference](/docs/api/overview)
`,

  'sdk/node.md': `# Node.js & TypeScript SDK

The **Naagmani Node.js SDK** (\`@naagmani/sdk\`) delivers typed TypeScript definitions, complete OpenAI client drop-in compatibility, and full support for both browser and Node.js runtimes.

---

## Installation

\`\`\`bash
npm install @naagmani/sdk
# or
pnpm add @naagmani/sdk
# or
yarn add @naagmani/sdk
\`\`\`

---

## 1. Basic Chat Completion

\`\`\`typescript
import { Naagmani } from '@naagmani/sdk';

const naagmani = new Naagmani({
  apiKey: process.env.NAAGMANI_SERVICE_TOKEN || 'nst_live_9b2d8819...',
  baseURL: '{{GATEWAY_URL}}/v1',
});

async function run() {
  const completion = await naagmani.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert TypeScript architect.' },
      { role: 'user', content: 'What are branded types in TypeScript?' }
    ],
    temperature: 0.5,
  });

  console.log(completion.choices[0].message.content);
  console.log('Attempt Trace ID:', completion.system_fingerprint);
}

run().catch(console.error);
\`\`\`

---

## 2. Server-Sent Events (SSE) Streaming

\`\`\`typescript
const stream = await naagmani.chat.completions.create({
  model: 'claude-3-5-sonnet-20241022',
  messages: [{ role: 'user', content: 'Write a Fibonacci sequence function.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
\`\`\`

---

## 3. Drop-in OpenAI Compatibility

If your application already uses the official \`openai\` npm package, you only need to change the \`baseURL\` and \`apiKey\`:

\`\`\`typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'nst_live_9b2d8819...',
  baseURL: '{{GATEWAY_URL}}/v1',
});

// All standard methods work seamlessly with Naagmani Smart Routing!
const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello Naagmani!' }],
});
\`\`\`

---

## Next Steps

- [Python SDK](/docs/sdk/python)
- [Go SDK](/docs/sdk/go)
`,

  'sdk/python.md': `# Python SDK Reference

The **Naagmani Python SDK** (\`naagmani\`) offers native async/sync clients, Pydantic v2 schemas, LangChain integration adapters, and full streaming support.

---

## Installation

\`\`\`bash
pip install naagmani
\`\`\`

---

## 1. Synchronous Completion

\`\`\`python
import os
from naagmani import Naagmani

client = Naagmani(
    api_key=os.getenv("NAAGMANI_API_KEY", "nst_live_9b2d8819..."),
    base_url="{{GATEWAY_URL}}/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a senior Python performance specialist."},
        {"role": "user", "content": "Explain Python 3.13 free-threading (GIL removal)."}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
print(f"Usage: {response.usage.total_tokens} tokens")
\`\`\`

---

## 2. Asynchronous Streaming

\`\`\`python
import asyncio
from naagmani import AsyncNaagmani

async def main():
    aclient = AsyncNaagmani(api_key="nst_live_9b2d8819...", base_url="{{GATEWAY_URL}}/v1")
    
    stream = await aclient.chat.completions.create(
        model="claude-3-5-sonnet-20241022",
        messages=[{"role": "user", "content": "Write a FastAPI CRUD endpoint."}],
        stream=True
    )
    
    async for chunk in stream:
        delta = chunk.choices[0].delta.content or ""
        print(delta, end="", flush=True)

asyncio.run(main())
\`\`\`

---

## 3. LangChain & LlamaIndex Integration

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o",
    openai_api_key="nst_live_9b2d8819...",
    openai_api_base="{{GATEWAY_URL}}/v1"
)

response = llm.invoke("Summarize the benefits of AI API gateways.")
print(response.content)
\`\`\`

---

## Next Steps

- [CLI Manual](/docs/cli/installation)
- [API Reference Overview](/docs/api/overview)
`,

  // ==========================================
  // CLI MANUAL
  // ==========================================
  'cli/installation.md': `# CLI Installation & Setup

The **Naagmani CLI** (\`naagmani\`) is the unified command-line tool for developers to interact with projects, inspect attempt telemetry, test plugins locally, and manage cloud resources.

---

## Installation Methods

### Homebrew (macOS / Linux)
\`\`\`bash
brew install naagmani/tap/naagmani
\`\`\`

### Standalone Binary (Linux / macOS / Windows)

#### Linux / macOS (curl)
\`\`\`bash
curl -fsSL https://get.naagmani.app/install.sh | bash
\`\`\`

#### Windows (PowerShell)
\`\`\`powershell
irm https://get.naagmani.app/install.ps1 | iex
\`\`\`

### Via Go
\`\`\`bash
go install github.com/naagmani/naagmani-cli/cmd/naagmani@latest
\`\`\`

---

## Verify Installation

\`\`\`bash
naagmani version
# Output:
# naagmani version 1.4.2 (built 2026-09-25)
# OS/Arch: darwin/arm64
\`\`\`

---

## Shell Autocompletion

Enable tab autocompletion for your shell:

\`\`\`bash
# Bash
naagmani completion bash > /etc/bash_completion.d/naagmani

# Zsh
naagmani completion zsh > "\${fpath[1]}/_naagmani"

# Fish
naagmani completion fish > ~/.config/fish/completions/naagmani.fish
\`\`\`

---

## Next Steps

- [CLI Authentication & Contexts](/docs/cli/authentication)
- [Commands Reference](/docs/cli/commands)
`,

  'cli/authentication.md': `# CLI Authentication

To execute operations against the Naagmani Control Plane, the CLI must authenticate your developer identity.

---

## Interactive Browser Login (Recommended)

Run \`login\` to open an OAuth2 browser confirmation flow:

\`\`\`bash
naagmani auth login
# Output:
# Attempting to automatically open the SSO authorization page in your default browser...
# If the browser does not open, visit:
# {{DEVELOPER_PORTAL_URL}}/cli-auth?code=ABCD-1234
#
# Waiting for authorization... [OK]
# Successfully authenticated as alice@company.com (Org: org_ad094812-07ef)
\`\`\`

---

## Headless / CI Authentication

For CI/CD pipelines and automated environments, provide a Project Service Token or Personal Access Key via environment variables:

\`\`\`bash
export NAAGMANI_API_KEY="nst_live_9b2d8819..."
export NAAGMANI_ORG_ID="org_ad094812-07ef-4db5-b2ba-6585bd9df55e"
export NAAGMANI_API_URL="{{API_BASE_URL}}"

# Verify context
naagmani auth status
\`\`\`

---

## Managing Workspaces & Contexts

Switch seamlessly between different organizations and projects:

\`\`\`bash
# List available contexts
naagmani context list

# Switch to production
naagmani context use production-org
\`\`\`

---

## Next Steps

- [Commands Reference](/docs/cli/commands)
- [Plugin Management](/docs/cli/plugins)
`,

  'cli/commands.md': `# CLI Commands Reference

Complete command matrix for the \`naagmani\` command-line interface.

---

## Core Command Categories

### \`naagmani auth\`
Manage authentication credentials and active sessions.
- \`naagmani auth login\`: Browser-based OAuth2 login.
- \`naagmani auth logout\`: Clear cached session credentials.
- \`naagmani auth status\`: Display active identity and token TTL.

---

### \`naagmani projects\`
Manage projects and environment namespaces.
- \`naagmani projects list\`: List all projects in active organization.
- \`naagmani projects create <name>\`: Provision a new project.
- \`naagmani projects switch <project_id>\`: Set default project context.

---

### \`naagmani tokens\`
Generate and revoke Project Service Tokens.
- \`naagmani tokens create --name <name> --capabilities <list> --ttl <sec>\`: Generate a new PST.
- \`naagmani tokens list\`: Show all active service tokens.
- \`naagmani tokens revoke <token_id>\`: Instantly revoke token credentials.

---

### \`naagmani attempts\`
Query execution traces and downstream model cascades.
- \`naagmani attempts list --limit 20\`: Fetch recent request attempts.
- \`naagmani attempts inspect <attempt_id>\`: Display detailed hop timings, TTFT, and sanitized error payloads.

---

### \`naagmani proxy\`
Start a local reverse proxy for development testing.
- \`naagmani proxy --port 8080\`: Spin up a local gateway connected to the remote control plane.

---

## Global Flags

| Flag | Shorthand | Description |
| :--- | :--- | :--- |
| **\`--json\`** | \`-j\` | Output all responses in machine-readable JSON format. |
| **\`--config\`** | \`-c\` | Path to custom YAML configuration file. |
| **\`--verbose\`** | \`-v\` | Enable debug logs and HTTP payload traces. |

---

## Next Steps

- [Plugin Management with CLI](/docs/cli/plugins)
- [CLI Diagnostics](/docs/cli/troubleshooting)
`,

  'cli/plugins.md': `# Plugin Management via CLI

The CLI provides commands to initialize, build, test, and publish custom Gateway plugins.

---

## 1. Scaffold a New Plugin

\`\`\`bash
naagmani plugins init my-custom-guard --template go
# Output:
# Created my-custom-guard/
# ├── plugin.json
# ├── main.go
# ├── go.mod
# └── README.md
\`\`\`

---

## 2. Validate Plugin Manifest

\`\`\`bash
naagmani plugins validate ./my-custom-guard
\`\`\`

---

## 3. Local Test Simulation

Test plugin execution against real or synthetic prompt payloads without needing a running gateway server:

\`\`\`bash
naagmani plugins test ./my-custom-guard \\
  --hook pre_route \\
  --input '{"messages":[{"role":"user","content":"Sample test input"}]}'
\`\`\`

---

## 4. Benchmark Performance

\`\`\`bash
naagmani plugins benchmark ./my-custom-guard --concurrency 20 --requests 500
\`\`\`

---

## 5. Package & Publish

\`\`\`bash
naagmani plugins pack ./my-custom-guard -o ./dist/plugin.tar.gz
naagmani plugins publish ./dist/plugin.tar.gz --scope organization
\`\`\`

---

## Next Steps

- [CLI Troubleshooting](/docs/cli/troubleshooting)
- [Marketplace Overview](/docs/marketplace/overview)
`,

  'cli/troubleshooting.md': `# CLI Diagnostics & Troubleshooting

Common errors encountered when using the \`naagmani\` CLI and their resolutions.

---

## 1. Authentication & Token Errors

### Error: \`401 Unauthorized / Token Expired\`
- **Cause:** The cached OAuth session or Project Service Token has expired.
- **Fix:** Run \`naagmani auth login\` to re-authenticate or generate a new token via \`naagmani tokens create\`.

---

## 2. Connection Refused

### Error: \`dial tcp 127.0.0.1:8081: connect: connection refused\`
- **Cause:** Local development server or Docker container is not running.
- **Fix:** Start the Control Plane container:
  \`\`\`bash
  docker start naagmani-os
  \`\`\`
  Or specify the remote production URL using \`--api-url https://api.naagmani.app\`.

---

## 3. Plugin Validation Warnings

### Error: \`entrypoint binary not executable\`
- **Cause:** Missing POSIX execution permissions on the target binary.
- **Fix:**
  \`\`\`bash
  chmod +x ./bin/plugin
  \`\`\`

---

## Next Steps

- [Common Errors Guide](/docs/troubleshooting/common-errors)
- [Developer Portal CLI Guide](/docs/developer-portal/cli-workflow)
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`[OK] Written ${relPath}`);
}

console.log('Finished writing plugins, SDK, and CLI documentation!');
