const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const docsDir = path.resolve(__dirname, '../docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsDir, relPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`[Intro/Quickstart] Updated: ${relPath}`);
}

// 1. Introduction / What is Naagmani
writeDoc('introduction/what-is-naagmani.md', `
# What is Naagmani?

**Naagmani** is an enterprise-grade **AI Operating System & Gateway Runtime** designed to govern, optimize, and secure all Large Language Model (LLM) traffic across your engineering ecosystem.

Often described as the **"Android OS for AI"**, Naagmani acts as a centralized intelligent runtime layer between your application code and the fragmented landscape of foundational model providers (OpenAI, Anthropic Claude, Google Gemini, DeepSeek, and self-hosted open-source models).

\`\`\`mermaid
graph TD
    subgraph Clients["Your Client Applications"]
        WebApp["Web & Mobile Apps"]
        Backend["Backend Microservices"]
        Agents["Autonomous AI Agents"]
    end

    subgraph NaagmaniOS["Naagmani AI Operating System"]
        Auth["BYOK Key Vault & Scoped Tokens"]
        Router["Smart Model Router & Failover"]
        Governance["AI Guardrails, DLP & Policies"]
        Telemetry["Provider Attempt Accounting & FinOps"]
        MCP["MCP Gateway & Tool Registry"]
    end

    subgraph Upstream["AI Providers & Execution"]
        OpenAI["OpenAI (GPT-4o, o3-mini)"]
        Anthropic["Anthropic (Claude 3.5 Sonnet)"]
        Google["Google Gemini (2.5 Flash, Pro)"]
        DeepSeek["DeepSeek (V3, R1)"]
        SelfHosted["Self-Hosted (vLLM, Ollama)"]
    end

    Clients --> NaagmaniOS
    NaagmaniOS --> Upstream
\`\`\`

---

## Why Do You Need an AI Operating System?

Building modern AI applications directly against individual provider APIs introduces critical enterprise bottlenecks:

| Challenge with Direct Provider Calls | How Naagmani Solves It |
| :--- | :--- |
| **Provider Lock-In & Breaking Changes** | Unified OpenAI-compatible API format across all providers. Switch models with zero code changes. |
| **Outages & Rate Limit Disruptions** | Automatic retry cascades and dynamic failover across providers in under 50ms. |
| **Sprawling API Keys & Security Risks** | Centralized Bring-Your-Own-Key (BYOK) encrypted vault and scoped Project Service Tokens. |
| **Runaway Costs & Unpredictable Bills** | Hierarchical FinOps spending caps (Organization $\\rightarrow$ Project $\\rightarrow$ Member) with real-time token tracking. |
| **Tool Calling & Agent Fragmentation** | Native Model Context Protocol (MCP) server integration and tool execution sandboxing. |

---

## The Naagmani Mental Model

To understand how Naagmani organizes workloads, consider the following structural hierarchy:

1. **Organization**: The top-level account and billing tenant (e.g. Acme Corp). Governs aggregate spending limits, team members, and enterprise audit logs.
2. **Project**: An isolated application or business initiative (e.g. *Customer Support Bot*, *Internal Copilot*).
3. **Environment**: Deployment stages within a project (e.g. *Development*, *Staging*, *Production*) with segregated secrets, routing rules, and rate limits.
4. **Service Tokens & API Keys**: Scoped credentials issued to services or developers with explicit capability matrices and optional member attribution.
5. **Smart Routing & Attempts**: Intelligent multi-hop dispatch engine that executes upstream provider calls, logs durable latency and token accounting, and handles failovers automatically.

---

## Next Steps

- Explore the business and engineering rationale: [Why Naagmani?](why-naagmani.md)
- Learn about the multi-plane system architecture: [Architecture Overview](architecture.md)
- Send your first AI request in under 3 minutes: [Quickstart Guide](../quickstart/first-request.md)
- Access the web management console: [Developer Portal Overview](../developer-portal/overview.md)
`);

// 2. Introduction / Why Naagmani
writeDoc('introduction/why-naagmani.md', `
# Why Naagmani?

Modern software engineering teams are transitioning from single-model prototypes to complex multi-model, multi-agent production systems. However, managing raw provider connections at scale introduces severe operational overhead.

Naagmani provides the **Five Core Pillars** of enterprise AI infrastructure:

\`\`\`mermaid
graph LR
    A["5 Pillars of Naagmani"] --> B["1. High Availability & Failover"]
    A --> C["2. FinOps & Budget Hierarchy"]
    A --> D["3. BYOK Credential Vault"]
    A --> E["4. MCP & Agent Extensibility"]
    A --> F["5. Full-Stack Observability"]
\`\`\`

---

## 1. Zero-Downtime Reliability & Failovers

When foundational model providers suffer API outages, elevated 5xx error rates, or capacity throttling (HTTP 429 / 529), direct client applications break.

With Naagmani:
- **Intelligent Cascade Routing**: If Anthropic Claude returns an \`OVERLOADED\` error, Naagmani instantly routes the prompt to OpenAI GPT-4o or Google Gemini with zero application code changes.
- **Provider Health Probing**: Background probes monitor upstream provider latency and error rates, proactively routing traffic away from degraded regions.
- **Sub-50ms Failover Overhead**: Retries happen at the gateway layer, preserving client connections and streaming pipelines.

---

## 2. Granular FinOps & Multi-Tier Spending Caps

AI infrastructure spending can spiral rapidly without strict enforcement. Naagmani implements an authoritative 3-tier budget hierarchy:

1. **Organization Budget**: Enforces the absolute hard limit for the enterprise billing cycle.
2. **Project Budget**: Allocates portions of the organizational limit to individual project teams.
3. **Member / Service Token Budget**: Caps specific engineers or autonomous background processes to prevent accidental runaway loops.

---

## 3. Bring-Your-Own-Key (BYOK) Security Vault

Naagmani never forces you to use middleman model markups. You provide your direct OpenAI, Anthropic, Gemini, or DeepSeek API keys:
- Keys are encrypted in an isolated vault using AES-256-GCM.
- Client applications only hold scoped **Naagmani API Keys** or **Project Service Tokens**.
- Real upstream provider keys are never exposed to frontend code, developers, or client devices.

---

## 4. Native Model Context Protocol (MCP) & Autonomous Agents

As language models transition from chat interfaces into autonomous agents that read databases and execute APIs, Naagmani serves as the runtime gateway:
- Connect to standard **MCP Servers** over \`stdio\`, \`SSE\`, or HTTP streams.
- Define granular **MCP Tool Policies** (allowlist / blocklist / approval workflows).
- Test agents interactively in the **Agent Playground** before deploying to production.

---

## 5. Discrete Attempt Telemetry & Audit Trails

Every discrete upstream interaction is recorded as a **Provider Attempt**:
- Exact duration and **Time to First Token (TTFT)**.
- Token breakdown (Prompt Tokens, Completion Tokens, Total).
- Upstream cost attribution (Cost of Goods Sold - COGS).
- Full security audit logging identifying which user, service token, and IP initiated the request.

---

## Next Steps

- Understand the internal components: [Architecture Overview](architecture.md)
- Learn foundational terms: [Foundational Concepts](concepts.md)
- Create your first API Key: [Quickstart Guide](../quickstart/api-key.md)
`);

// 3. Introduction / Architecture
writeDoc('introduction/architecture.md', `
# Product Architecture

Naagmani is architected as a high-throughput, decoupled platform split cleanly across a **Control Plane**, a **Data Plane Gateway**, and an **Observability & Management Suite**.

\`\`\`mermaid
graph TB
    subgraph ClientLayer["Developer & Client Layer"]
        SDK["Naagmani SDKs (Go, TypeScript, Python)"]
        CLI["Naagmani CLI (naagmani)"]
        Portal["Developer Portal (Port 3000)"]
    end

    subgraph ControlPlane["Naagmani Control Plane (Port 8081)"]
        AuthSvc["Auth & Tenant Service"]
        OrgSvc["Organization & Project Hierarchy"]
        TokenSvc["Service Token & Vault Manager"]
        AuditSvc["Audit Logger & Event Store"]
        FinOpsSvc["FinOps & Budget Ledger"]
    end

    subgraph DataPlane["Naagmani OS Gateway Data Plane (Port 8080)"]
        Proxy["OpenAI-Compatible Ingress Proxy"]
        Guard["Security & Guardrail Pipeline"]
        Router["Smart Routing & Failover Engine"]
        MCPGw["Model Context Protocol Gateway"]
        AttemptLog["Provider Attempt Telemetry Engine"]
    end

    subgraph UpstreamProviders["Upstream AI Execution"]
        CloudLLM["Cloud Providers (OpenAI, Anthropic, Gemini, DeepSeek)"]
        LocalLLM["Private Models (vLLM, Ollama, TGI)"]
        MCPServers["External MCP Servers (Filesystem, SQL, GitHub)"]
    end

    ClientLayer --> ControlPlane
    ClientLayer --> DataPlane
    ControlPlane <--> DataPlane
    DataPlane --> UpstreamProviders
\`\`\`

---

## Architectural Planes

### 1. Data Plane Gateway (\`naagmani-os\`)
- **Port**: \`8080\` (Default Gateway Port)
- **Role**: Ultra-low-latency reverse proxy executing prompt translation, SSE streaming accumulation, routing failovers, guardrail filters, and MCP tool orchestration.
- **Performance**: Written in Go with sub-millisecond dispatch overhead.

### 2. Control Plane (\`naagmani-cloud\`)
- **Port**: \`8081\` (Cloud API Port)
- **Role**: Authoritative state management for Organizations, Projects, Environments, Members, BYOK Vault secrets, Service Token issuance, and FinOps budget ledgers.
- **Storage**: Backed by PostgreSQL and Redis for fast token validation and rate limiting.

### 3. Developer Portal (\`naagmani-developer\`)
- **Port**: \`3000\` (Web Console)
- **Role**: Premium web console for managing API keys, service tokens, routing policies, provider attempts trace inspector, and interactive playgrounds.

---

## Request Lifecycle

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor App as Client Application
    participant GW as Naagmani Gateway (:8080)
    participant CP as Control Plane (:8081)
    participant AI as Upstream Provider (Anthropic)
    participant Fallback as Fallback Provider (OpenAI)

    App->>GW: POST /v1/chat/completions (Bearer nsk_live_...)
    GW->>CP: Validate Token, Quota & Capabilities
    CP-->>GW: Token Valid (Org: Acme, Project: Copilot, Limit OK)
    GW->>AI: Dispatch Request (claude-3-5-sonnet)
    AI-->>GW: HTTP 529 Overloaded Error
    Note over GW: Attempt #1 Failed -> Trigger Cascade
    GW->>Fallback: Failover Dispatch (gpt-4o)
    Fallback-->>GW: HTTP 200 OK + Stream Chunks
    GW-->>App: Forward OpenAI-compatible SSE Stream
    GW->>CP: Record Provider Attempt #1 (Failed) & #2 (Succeeded) + Token COGS
\`\`\`

---

## Next Steps

- Review core entities: [Foundational Concepts](concepts.md)
- Follow the hands-on tutorial: [Quickstart Guide](../quickstart/overview.md)
`);

// 4. Introduction / Foundational Concepts
writeDoc('introduction/concepts.md', `
# Foundational Concepts

Before integrating Naagmani into your codebase, familiarize yourself with these core concepts:

\`\`\`mermaid
graph TD
    Org["Organization (Acme Corp)"] --> P1["Project A (E-Commerce)"]
    Org --> P2["Project B (Internal HR)"]
    P1 --> E1["Development Environment"]
    P1 --> E2["Production Environment"]
    E2 --> ST["Project Service Tokens"]
    E2 --> AK["API Keys"]
    E2 --> Agents["Autonomous Agents"]
\`\`\`

---

## Core Vocabulary

### 1. Organization
The top-level root account representing your company or team. Governs billing, enterprise membership, global guardrails, and compliance logs.

### 2. Project
A logical workspace dedicated to a specific application or product line. Projects isolate credentials, routing policies, tools, and agents from other teams.

### 3. Environment
An execution boundary inside a project (e.g. \`Development\`, \`Staging\`, \`Production\`). Environments allow teams to safely test experimental model weights without affecting production workloads.

### 4. Project Service Token (\`nst_...\`)
A specialized machine-to-machine credential bound to a project and environment. Supports fine-grained capability matrices (e.g., \`inference:chat\`, \`tools:execute\`), TTL expiration, and human member attribution.

### 5. Smart Model Routing
An automated policy engine that dynamically routes inference requests across foundational model providers based on cost optimization, latency thresholds, or fallback priority chains.

### 6. Provider Attempt
A discrete unit of upstream execution telemetry. If a request experiences 2 failovers before succeeding, Naagmani records 3 discrete attempts, detailing latency, tokens, cost, and upstream error reasons for each hop.

### 7. Model Context Protocol (MCP)
An open protocol enabling AI models to safely access tools, filesystems, and databases. Naagmani acts as a secure MCP gateway, enforcing permissions and audit logging on every tool invocation.

---

## Progressive Learning Path

| Step | Topic | Link |
| :--- | :--- | :--- |
| **1** | Get started in 5 minutes | [Quickstart Overview](../quickstart/overview.md) |
| **2** | Send your first AI request | [First Request](../quickstart/first-request.md) |
| **3** | Deep dive into tenancy | [Organizations & Projects](../concepts/organizations.md) |
| **4** | Secure your infrastructure | [Project Service Tokens](../concepts/project-service-tokens.md) |
| **5** | Master the web console | [Developer Portal Guide](../developer-portal/overview.md) |
| **6** | Build autonomous agents | [Agent & MCP Guide](../developer-portal/agents.md) |
`);

// 5. Quickstart / Overview
writeDoc('quickstart/overview.md', `
# Quickstart Overview

Welcome to Naagmani! In this quickstart guide, you will learn how to get up and running with Naagmani in under 5 minutes.

\`\`\`mermaid
graph LR
    S1["1. Create API Key"] --> S2["2. Send Request"] --> S3["3. Stream SSE"] --> S4["4. Inspect Trace"]
\`\`\`

---

## Prerequisites

Before starting, ensure you have:
1. Access to the [**Naagmani Developer Portal**]({{DEVELOPER_PORTAL_URL}}).
2. An active Organization and Project.
3. \`curl\`, Node.js (\`>= 18\`), Python (\`>= 3.9\`), or Go (\`>= 1.21\`) installed.

---

## Quickstart Steps

1. **[Create an API Key](api-key.md)**: Generate a scoped credential for your application.
2. **[Send Your First Request](first-request.md)**: Execute a standard OpenAI-compatible chat completion.
3. **[Stream Responses](streaming.md)**: Receive token-by-token responses using Server-Sent Events (SSE).
4. **[Inspect Execution Traces](provider-attempts.md)**: View real-time provider latency, tokens, and failover telemetry.

---

> [!TIP]
> **Zero SDK Migration Required**  
> Because Naagmani is 100% wire-compatible with the OpenAI API specification, you can use official OpenAI SDKs simply by changing the \`baseURL\`.
`);

// 6. Quickstart / API Key
writeDoc('quickstart/api-key.md', `
# Creating an API Key

To authenticate requests against the Naagmani Gateway Data Plane, your application requires a valid API Key or Project Service Token.

---

## Option A: Via the Developer Portal

1. Log into the **Naagmani Developer Portal** at [{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}}) or [{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}}).
2. In the left navigation sidebar, select your active **Project**.
3. Click on **API Keys** in the project menu.
4. Click **+ Create API Key**.
5. Give your key a descriptive name (e.g. \`production-backend-key\`), choose an environment (\`Production\`), and click **Generate**.
6. Copy your API key (prefixed with \`nsk_live_...\`). Store it securely—it is only displayed once.

---

## Option B: Via the Naagmani CLI

If you have the Naagmani CLI installed:

\`\`\`bash
# Authenticate CLI
naagmani auth login

# Generate a new project API key
naagmani keys create --project "my-copilot" --env "production" --name "cli-generated-key"
\`\`\`

---

## Key Format

Naagmani credentials use standard prefix identifiers for fast identification:

- **\`nsk_live_...\`**: Standard Project API Key
- **\`nsk_test_...\`**: Sandbox / Development API Key
- **\`nst_live_...\`**: Scoped Project Service Token (Machine-to-Machine)

---

## Next Steps

- Use your key to make a request: [Sending Your First Request](first-request.md)
- Learn about scoped machine tokens: [Project Service Tokens Guide](../concepts/project-service-tokens.md)
`);

// 7. Quickstart / First Request
writeDoc('quickstart/first-request.md', `
# Sending Your First Request

Now that you have an API key, let's execute your first AI completion through Naagmani.

---

## Code Examples

### 1. cURL

\`\`\`bash
curl -X POST "{{GATEWAY_URL}}/v1/chat/completions" \\
  -H "Authorization: Bearer nsk_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "system", "content": "You are a helpful engineering assistant." },
      { "role": "user", "content": "Explain what an AI gateway runtime does in 2 sentences." }
    ],
    "temperature": 0.7
  }'
\`\`\`

---

### 2. TypeScript / Node.js (Using OpenAI SDK)

\`\`\`typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NAAGMANI_API_KEY || "nsk_live_YOUR_API_KEY",
  baseURL: "{{GATEWAY_URL}}/v1", // Point directly to Naagmani Gateway
});

async function main() {
  const completion = await client.chat.completions.create({
    model: "claude-3-5-sonnet-20241022", // Switch models seamlessly!
    messages: [
      { role: "system", content: "You are a helpful engineering assistant." },
      { role: "user", content: "Hello Naagmani! What models can I route to?" },
    ],
  });

  console.log("Response:", completion.choices[0].message.content);
  console.log("Tokens used:", completion.usage?.total_tokens);
}

main().catch(console.error);
\`\`\`

---

### 3. Python (Using OpenAI SDK)

\`\`\`python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("NAAGMANI_API_KEY", "nsk_live_YOUR_API_KEY"),
    base_url="{{GATEWAY_URL}}/v1"  # Point directly to Naagmani Gateway
)

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "system", "content": "You are an AI platform architect."},
        {"role": "user", "content": "Why should applications use an AI gateway?"}
    ]
)

print("Response:", response.choices[0].message.content)
print("Usage:", response.usage)
\`\`\`

---

### 4. Go

\`\`\`go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	payload := map[string]interface{}{
		"model": "gpt-4o",
		"messages": []map[string]string{
			{"role": "user", "content": "Explain Naagmani in one sentence."},
		},
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "{{GATEWAY_URL}}/v1/chat/completions", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("NAAGMANI_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("Status:", resp.Status)
	fmt.Println("Response:", string(respBody))
}
\`\`\`

---

## Expected Response Structure

\`\`\`json
{
  "id": "chatcmpl_01J8F0A2B3C4D5E6F7G8H9J0K1",
  "object": "chat.completion",
  "created": 1790355262,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "An AI gateway runtime sits between client applications and AI providers to manage model routing, credentials, and traffic governance."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 28,
    "completion_tokens": 24,
    "total_tokens": 52
  }
}
\`\`\`

---

## Next Steps

- Stream tokens in real time: [Streaming Responses](streaming.md)
- Inspect execution latency & failovers: [Execution Trace Telemetry](provider-attempts.md)
`);

// 8. Quickstart / Streaming
writeDoc('quickstart/streaming.md', `
# Streaming Responses

Naagmani provides full support for real-time Server-Sent Events (SSE) streaming for ultra-responsive user interfaces.

---

## How Streaming Works

When \`stream: true\` is provided, the Naagmani Gateway establishes a persistent HTTP connection and forwards tokens downstream as they arrive from the upstream model provider.

\`\`\`mermaid
sequenceDiagram
    autonumber
    Client->>Naagmani Gateway: POST /v1/chat/completions {"stream": true}
    Naagmani Gateway->>Provider: Open Upstream SSE Stream
    Provider-->>Naagmani Gateway: data: {"choices": [{"delta": {"content": "Hello"}}]}
    Naagmani Gateway-->>Client: data: {"choices": [{"delta": {"content": "Hello"}}]}
    Provider-->>Naagmani Gateway: data: {"choices": [{"delta": {"content": " World"}}]}
    Naagmani Gateway-->>Client: data: {"choices": [{"delta": {"content": " World"}}]}
    Provider-->>Naagmani Gateway: data: [DONE]
    Naagmani Gateway-->>Client: data: [DONE]
\`\`\`

---

## Code Examples

### 1. TypeScript / Node.js

\`\`\`typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NAAGMANI_API_KEY || "nsk_live_YOUR_KEY",
  baseURL: "{{GATEWAY_URL}}/v1",
});

async function streamDemo() {
  const stream = await client.chat.completions.create({
    model: "claude-3-5-sonnet-20241022",
    messages: [{ role: "user", content: "Write a poem about distributed systems." }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
  console.log("\n--- Stream Finished ---");
}

streamDemo().catch(console.error);
\`\`\`

---

### 2. Python

\`\`\`python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("NAAGMANI_API_KEY", "nsk_live_YOUR_KEY"),
    base_url="{{GATEWAY_URL}}/v1"
)

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explain quantum computing simply."}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)

print()
\`\`\`

---

## Partial Streaming Token Accumulation

Naagmani automatically captures partial token usage during SSE streams:
- Tracks **Time to First Token (TTFT)**.
- Reconstructs accurate token counts even if the client disconnects prematurely.
- Accurately meters downstream costs against the tenant's spending budget.

---

## Next Steps

- Inspect streaming telemetry: [Execution Trace Telemetry](provider-attempts.md)
- Learn about model fallbacks: [Routing & Fallbacks](../concepts/routing.md)
`);

// 9. Quickstart / Provider Attempts
writeDoc('quickstart/provider-attempts.md', `
# Execution Trace & Telemetry

Every request processed by the Naagmani Gateway generates rich, discrete **Provider Attempt Telemetry**.

---

## What is a Provider Attempt?

When your application sends an inference request, Naagmani's Smart Router dispatches it to a primary upstream provider. If that provider encounters an error (e.g. HTTP 529 Anthropic Overloaded), Naagmani cascades to a fallback provider (e.g. OpenAI GPT-4o).

Naagmani records every single attempt in the cascade:
- **Attempt Index**: \`0\`, \`1\`, \`2\` (Hop sequence)
- **Upstream Duration & TTFT**: Exact milliseconds spent waiting for the model adapter.
- **Token Breakdown**: Exact Prompt, Completion, and Total tokens.
- **Calculated COGS**: Exact provider cost in USD based on official pricing versions.
- **Upstream Diagnostic**: Sanitized provider error codes and messages if failure occurred.

\`\`\`mermaid
graph TD
    Req["Logical Request (req_01J8F0A...)"] --> Hop1["Hop #1: Anthropic claude-3-5-sonnet (550ms, HTTP 529 Failed)"]
    Hop1 -->|Failover Cascade| Hop2["Hop #2: OpenAI gpt-4o (1300ms, HTTP 200 Succeeded)"]
\`\`\`

---

## Viewing Traces in Developer Portal

You can inspect provider attempt telemetry interactively:

1. Open the **Naagmani Developer Portal** at [{{DEVELOPER_PORTAL_URL}}/attempts]({{DEVELOPER_PORTAL_URL}}/attempts).
2. Browse the **Provider Attempt Accounting** table.
3. Click on any row or click **Cascade Chain** to slide open the **Execution Trace Inspector Drawer**.
4. Review the step-by-step ladder showing which provider failed, the exact error reason, and the final successful response.

---

## Querying Attempts via API

\`\`\`bash
# List all recent provider attempts
curl -X GET "{{API_BASE_URL}}/v1/organizations/YOUR_ORG_ID/attempts?per_page=20" \\
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Query the full cascade chain for a specific request ID
curl -X GET "{{API_BASE_URL}}/v1/organizations/YOUR_ORG_ID/requests/req_01J8F0A2B3C4D5E6F7G8H9J0K1/attempts" \\
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
\`\`\`

---

## Next Steps

- Learn how budget limits are enforced: [FinOps & Budget Hierarchy](../concepts/billing.md)
- Explore Developer Portal features: [Developer Portal Guide](../developer-portal/overview.md)
`);

console.log('Finished writing Introduction and Quickstart documentation.');
