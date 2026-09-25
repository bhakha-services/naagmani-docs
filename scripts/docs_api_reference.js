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
  console.log(`[API Reference] Updated: ${relPath}`);
}

// 1. API Overview
writeDoc('api/overview.md', `
# API Overview & Standards

The Naagmani API suite is split into two primary surfaces:

1. **Gateway Data Plane API (\`:8080\`)**: Ultra-high-throughput, OpenAI-compatible AI inference proxy handling chat completions, embeddings, streaming SSE, and tool calling.
2. **Control Plane Management API (\`:8081\`)**: RESTful JSON API for managing Organizations, Projects, Service Tokens, Members, Budgets, and Telemetry.

---

## Base URLs

| Surface | Local Environment | Production Hosted |
| :--- | :--- | :--- |
| **Gateway Data Plane** | \`http://localhost:8080\` | \`https://gateway.naagmani.app\` |
| **Control Plane API** | \`http://localhost:8081\` | \`https://api.naagmani.app\` |

---

## Standard Headers

Every API request requires standard headers:

\`\`\`http
Authorization: Bearer <YOUR_API_KEY_OR_SERVICE_TOKEN>
Content-Type: application/json
X-Request-ID: req_01J8F0A2B3C4D5E6F7G8H9J0K1 (Optional client tracing ID)
\`\`\`

---

## Next Steps

- Authentication details: [Authentication & Headers](authentication.md)
- Chat completions spec: [Chat Completions API](chat-completions.md)
`);

// 2. Authentication
writeDoc('api/authentication.md', `
# Authentication & Headers

Naagmani authenticates API calls using Bearer tokens passed via the standard \`Authorization\` header.

---

## Supported Token Formats

\`\`\`http
Authorization: Bearer <TOKEN>
\`\`\`

| Token Prefix | Token Type | Target Surface | Permissions |
| :--- | :--- | :--- | :--- |
| **\`nsk_live_...\`** | Project API Key | Gateway Data Plane (\`:8080\`) | Model Inference, Streaming, Embeddings |
| **\`nst_live_...\`** | Project Service Token | Gateway Data Plane (\`:8080\`) | Scoped by Capability Matrix |
| **\`usr_sess_...\`** | User Session Token | Control Plane API (\`:8081\`) | RBAC Scoped Org & Project Management |

---

## Error Handling

If a token is invalid, missing, or expired:

\`\`\`json
{
  "code": "invalid_api_key",
  "message": "The provided API key is invalid or has been revoked.",
  "request_id": "req_01J8F0A2B3C4D5E6F7G8H9J0K1"
}
\`\`\`

---

## Next Steps

- Execute chat inference: [Chat Completions API](chat-completions.md)
- Issue service tokens: [Service Tokens API](service-tokens.md)
`);

// 3. Chat Completions
writeDoc('api/chat-completions.md', `
# Chat Completions API

Execute standard or streaming chat completions across any foundational model with unified OpenAI wire compatibility.

**Endpoint**: \`POST /v1/chat/completions\`  
**Surface**: Gateway Data Plane (\`:8080\`)

---

## Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **\`model\`** | \`string\` | Yes | Model ID (e.g. \`gpt-4o\`, \`claude-3-5-sonnet-20241022\`) or virtual alias (\`smart-tier\`). |
| **\`messages\`** | \`array\` | Yes | List of message objects (\`role\`: \`system\` | \`user\` | \`assistant\` | \`tool\`, \`content\`). |
| **\`temperature\`** | \`number\` | No | Sampling temperature between \`0.0\` and \`2.0\` (Default: \`1.0\`). |
| **\`max_tokens\`** | \`integer\` | No | Maximum tokens to generate in completion. |
| **\`stream\`** | \`boolean\` | No | Whether to stream back partial tokens via SSE (Default: \`false\`). |
| **\`tools\`** | \`array\` | No | List of JSON Schema tool definitions available to the model. |
| **\`tool_choice\`** | \`string\` / \`object\` | No | \`auto\`, \`none\`, \`required\`, or specific tool selection. |

---

## Example cURL Request

\`\`\`bash
curl -X POST "http://localhost:8080/v1/chat/completions" \\
  -H "Authorization: Bearer nsk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "system", "content": "You are a senior systems architect." },
      { "role": "user", "content": "Explain CAP theorem in 2 bullet points." }
    ],
    "temperature": 0.5,
    "max_tokens": 150
  }'
\`\`\`

---

## Response Example (\`HTTP 200 OK\`)

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
        "content": "• Consistency: Every read receives the most recent write or an error.\n• Availability: Every request receives a non-error response, without guarantee of latest data."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 32,
    "completion_tokens": 38,
    "total_tokens": 70
  }
}
\`\`\`

---

## Next Steps

- Real-time streaming spec: [Streaming (SSE) API](streaming.md)
- Vector embeddings spec: [Embeddings API](embeddings.md)
`);

// 4. Streaming SSE
writeDoc('api/streaming.md', `
# Streaming (SSE) API

Stream tokens back in real time over standard Server-Sent Events (SSE).

**Endpoint**: \`POST /v1/chat/completions\`  
**Required Payload Field**: \`"stream": true\`

---

## Event Stream Protocol

Each chunk is returned as a UTF-8 text block prefixed with \`data: \`:

\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":" World!"},"finish_reason":null}]}

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

---

## Next Steps

- Embeddings spec: [Embeddings API](embeddings.md)
- Telemetry reference: [Provider Attempts API](attempts.md)
`);

// 5. Embeddings
writeDoc('api/embeddings.md', `
# Embeddings API

Generate high-dimensional vector representations for semantic search, RAG retrieval, and clustering.

**Endpoint**: \`POST /v1/embeddings\`  
**Surface**: Gateway Data Plane (\`:8080\`)

---

## Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **\`model\`** | \`string\` | Yes | Embedding model (e.g. \`text-embedding-3-small\`, \`text-embedding-3-large\`). |
| **\`input\`** | \`string\` / \`array\` | Yes | Input text or array of strings to embed. |
| **\`dimensions\`** | \`integer\` | No | Desired vector dimensions (supported models only). |

---

## Example cURL Request

\`\`\`bash
curl -X POST "http://localhost:8080/v1/embeddings" \\
  -H "Authorization: Bearer nsk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "text-embedding-3-small",
    "input": "Naagmani AI Operating System"
  }'
\`\`\`

---

## Response Example

\`\`\`json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [-0.00692, -0.00533, 0.01254, "... 1536 floats"]
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
\`\`\`
`);

// 6. Service Tokens API
writeDoc('api/service-tokens.md', `
# Project Service Tokens API Reference

Programmatically issue, list, and revoke scoped Project Service Tokens.

**Surface**: Control Plane API (\`:8081\`)

---

## 1. Create a Service Token

\`POST /v1/projects/{projectId}/service-tokens\`

### Request Body:
\`\`\`json
{
  "name": "data-pipeline-worker",
  "environment_id": "env_prod_01J8F0A2B3",
  "capabilities": ["inference:chat", "tools:execute"],
  "expires_in_days": 30,
  "member_id": "mbr_23255f47-29a9-41df-8495-3a6edca814c8"
}
\`\`\`

### Response (\`HTTP 201 Created\`):
\`\`\`json
{
  "id": "st_9f8a2b1c3d4e",
  "public_id": "nst_live_9f8a2b1c...",
  "token": "nst_live_9f8a2b1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
  "name": "data-pipeline-worker",
  "environment_id": "env_prod_01J8F0A2B3",
  "capabilities": ["inference:chat", "tools:execute"],
  "expires_at": "2026-10-25T23:59:59Z",
  "status": "active",
  "created_at": "2026-09-25T23:00:00Z"
}
\`\`\`

---

## 2. List Service Tokens

\`GET /v1/projects/{projectId}/service-tokens\`

---

## 3. Revoke a Service Token

\`DELETE /v1/projects/{projectId}/service-tokens/{tokenId}\`

### Response:
\`HTTP 204 No Content\`
`);

// 7. Provider Attempts API
writeDoc('api/attempts.md', `
# Provider Attempts API Reference

Query upstream dispatch telemetry, TTFT, token accounting, and retry cascade logs.

**Surface**: Control Plane API (\`:8081\`)

---

## 1. List Provider Attempts

\`GET /v1/organizations/{orgId}/attempts?per_page=50&status=succeeded&provider=openai\`

### Query Parameters:
- **\`page\`** (int): Page number (Default: 1).
- **\`per_page\`** (int): Results per page (Default: 50, Max: 100).
- **\`status\`** (string): Filter by \`succeeded\`, \`failed\`, \`timed_out\`, \`canceled\`, \`stream_interrupted\`.
- **\`provider\`** (string): Filter by \`openai\`, \`anthropic\`, \`google\`, \`deepseek\`.
- **\`failover_only\`** (bool): Return only attempts where retries/failovers occurred.

---

## 2. Get Attempts by Request ID

\`GET /v1/organizations/{orgId}/requests/{requestId}/attempts\`

Returns the full ordered execution cascade (Hop #1 $\\rightarrow$ Hop #2) for a specific logical request.

### Response Example:
\`\`\`json
{
  "data": [
    {
      "id": "att_hop1_uuid",
      "request_id": "req_01J8F0A2B3C4D5E6F7G8H9J0K1",
      "attempt_index": 0,
      "provider": "Anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "status": "failed",
      "http_status_code": 529,
      "failure_category": "http_5xx_upstream",
      "provider_error_message": "Overloaded: Anthropic API is experiencing elevated traffic.",
      "duration_ms": 550,
      "failover_occurred": true
    },
    {
      "id": "att_hop2_uuid",
      "request_id": "req_01J8F0A2B3C4D5E6F7G8H9J0K1",
      "attempt_index": 1,
      "provider": "OpenAI",
      "model": "gpt-4o",
      "status": "succeeded",
      "http_status_code": 200,
      "duration_ms": 1300,
      "total_tokens": 600,
      "estimated_cost_usd": 0.00285,
      "failover_occurred": true
    }
  ]
}
\`\`\`
`);

// 8. FinOps & Budgets API
writeDoc('api/budgets.md', `
# FinOps & Budgets API Reference

Manage spending caps and hierarchical budget targets across Organizations, Projects, and Members.

**Surface**: Control Plane API (\`:8081\`)

---

## 1. Update Organization Budget

\`PUT /v1/organizations/{orgId}/budget\`

### Request Body:
\`\`\`json
{
  "monthly_budget_amount": 5000.00,
  "daily_budget_amount": 250.00,
  "budget_currency": "USD"
}
\`\`\`

---

## 2. Update Member Budget

\`PUT /v1/organizations/{orgId}/members/{memberId}/budget\`

### Hierarchy Validation:
The member limit **cannot exceed** the parent organization's limit. If the parent limit is $5,000, passing $10,000 returns:

\`\`\`json
{
  "code": "invalid_request",
  "message": "member monthly budget ($10000.00) exceeds parent organization monthly budget ($5000.00)",
  "request_id": "req_01J8F0A2B3"
}
\`\`\`
`);

// 9. Responses & Formats
writeDoc('api/responses.md', `
# Responses & Payload Formats

Naagmani returns standard JSON response payloads complying strictly with OpenAI wire protocols.

---

## Non-Streaming Chat Completion

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
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21
  }
}
\`\`\`
`);

// 10. Errors & Status Codes
writeDoc('api/errors.md', `
# Errors & Status Codes

Naagmani returns clear, structured JSON errors with standard HTTP status codes and machine-readable error codes.

---

## Standard Error Schema

\`\`\`json
{
  "code": "invalid_request",
  "message": "Detailed human-readable explanation of why the request failed.",
  "request_id": "req_01J8F0A2B3C4D5E6F7G8H9J0K1"
}
\`\`\`

---

## HTTP Status Codes & Error Codes

| HTTP Status | Error Code | Description & Mitigation |
| :---: | :--- | :--- |
| **\`400\`** | \`invalid_request\` | Malformed JSON payload or hierarchy budget constraint violation. |
| **\`401\`** | \`invalid_api_key\` | Provided API Key or Service Token is invalid, revoked, or expired. |
| **\`403\`** | \`permission_denied\` | Token lacks the required capability in its capability matrix. |
| **\`404\`** | \`not_found\` | The requested project, member, or model resource does not exist. |
| **\`429\`** | \`quota_exceeded\` | Tenant or member has exceeded their configured monthly/daily spending cap. |
| **\`502\`** | \`upstream_failure\` | All primary and fallback providers in the routing policy failed. |
| **\`504\`** | \`upstream_timeout\` | Upstream model adapter timed out waiting for provider response. |
`);

console.log('Finished writing API Reference documentation.');
