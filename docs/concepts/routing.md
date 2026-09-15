# Routing & Fallbacks

Naagmani's intelligent routing engine directs AI traffic based on latency, cost, provider availability, and workload characteristics.

---

## Routing Strategies

Naagmani supports multiple configurable routing strategies at the Project and Environment level:

### 1. Priority Fallback
Requests are dispatched to primary providers. If the primary provider fails (HTTP 429 rate limit, 500/502/503/504 errors, or timeout), Naagmani instantly falls back to secondary targets.

```mermaid
graph LR
    Req[Client Request] --> Engine[Naagmani Router]
    Engine -->|Primary| P1[OpenAI GPT-4o]
    P1 -.->|503 Failover| P2[Anthropic Claude 3.7 Sonnet]
    P2 -.->|Backup| P3[Google Gemini 2.5 Pro]
```

### 2. Cost-Optimized Routing
Routes requests to the lowest-cost provider meeting the model capability tier (e.g., token pricing vs. context window size).

### 3. Latency / Load Balancing Routing
Distributes requests across multiple healthy provider regions or endpoints using weighted round-robin or dynamic latency probes to achieve the lowest time-to-first-token (TTFT).

### 4. Semantic Intent Routing (`BETA`)
Analyzes prompt complexity and token length before dispatching:
- Simple queries (formatting, extraction) → Routed to high-speed small models (`fast`).
- Complex multi-step reasoning → Routed to frontier models (`smart`).

---

## Retries and Circuit Breaking

Naagmani Gateway implements enterprise resilience patterns:

| Pattern | Default Configuration | Description |
| :--- | :--- | :--- |
| **Exponential Backoff** | Up to 3 attempts, initial delay 250ms | Retries transient upstream network glitches. |
| **Circuit Breaking** | Tripped after 5 consecutive 5xx errors in 10s | Temporarily halts traffic to failing providers to avoid cascading latencies. |
| **Timeout Budgets** | Configurable (default: 60s) | Prevents hanging client sockets on stalled upstream providers. |

---

## Routing Configuration Example

Routing policies can be declared in YAML or managed via the Naagmani Portal:

```yaml
routing_policy:
  alias: "smart"
  targets:
    - provider: "anthropic"
      model: "claude-3-7-sonnet-20250219"
      priority: 1
      timeout_ms: 30000
    - provider: "openai"
      model: "gpt-4o"
      priority: 2
      timeout_ms: 30000
    - provider: "google"
      model: "gemini-2.5-pro"
      priority: 3
      timeout_ms: 45000
  retry:
    max_retries: 2
    retry_on: [429, 500, 502, 503, 504]
```
