# Smart Routing Policies & Failover

Create virtual model aliases (such as `smart`, `fast`, `code-gen`), configure dynamic routing strategies, and establish automated multi-provider failover cascades to guarantee high availability and cost optimization.

- **Portal Location**: `Projects > [Your Project] > Governance & Routing > Routing Policies` (`/projects/[slug]/routing-policies`)
- **API Endpoint**: `/v1/projects/{projectId}/environments/{envId}/routing-policies`

---

## What is a Routing Policy?

A **Routing Policy** maps a virtual model alias name (e.g. `smart`) to an ordered or weighted candidate pool of upstream provider models (e.g. DeepSeek, Anthropic Claude, OpenAI).

Instead of hardcoding vendor model names in your frontend or microservices, your code simply requests:
```json
{ "model": "smart" }
```
Naagmani evaluates real-time provider health, latency, token costs, and priority order to dispatch the request to the optimal candidate, seamlessly recovering if an upstream provider fails.

```mermaid
graph TD
    Request["Application Request: { model: 'smart' }"] --> Policy["Routing Policy: 'smart'"]
    Policy --> P1["1. Primary: DeepSeek (deepseek-chat)"]
    P1 -->|429 Rate Limit or 5xx Server Error| P2["2. Secondary: Anthropic (claude-3-5-sonnet)"]
    P2 -->|"Timeout (>15s) or Outage"| P3["3. Tertiary: OpenAI (gpt-4o)"]
```

---

## Implemented Routing Strategies

Naagmani supports 6 deterministic and dynamic routing algorithms:

| Strategy | Algorithm Name | Description | Best For |
|---|---|---|---|
| **Priority** | `priority` | Evaluates candidates sequentially by priority index ($1, 2, 3...$). Priority 1 is always executed unless it experiences an outage or rate limit. | Production high-availability with a preferred primary model. |
| **Failover** | `failover` | Active-Passive pairing. Primary candidate handles 100% of traffic until degraded, instantly shifting all load to secondary standby. | Critical enterprise workloads with warm standby. |
| **Lowest Latency** | `lowest_latency` | Evaluates real-time Time-To-First-Token (TTFT) across providers and dispatches to the fastest candidate. | Real-time chat, autocomplete, and voice agent applications. |
| **Lowest Cost** | `lowest_cost` | Dynamically selects the candidate with the lowest cost per 1M input/output tokens. | Background batch processing, summarization, and data extraction. |
| **Weighted** | `weighted` | Distributes incoming traffic proportionally across candidate models (e.g. 80% / 20%). | A/B testing new model versions, dark launches, and load distribution. |
| **Default** | `default` | Deterministic single-provider routing without dynamic scoring. | Fixed-model workloads. |

---

## The Failover Cascade Engine

When a candidate model is selected:
1. **Health Verification**: If a provider is marked **🔴 Unreachable** due to consecutive errors, it is skipped proactively before sending the request.
2. **Execution Attempt #1**: The gateway dispatches the request to Candidate #1 with a configurable timeout (e.g. 10s).
3. **Trigger Evaluation**: If Candidate #1 returns **HTTP 429 (Rate Limit)**, **HTTP 5xx (Server Error)**, **HTTP 529 (Overloaded)**, or hits a network timeout, the gateway catches the exception.
4. **Instant Cascade to Candidate #2**: Without disconnecting the client or breaking an active SSE stream header, the gateway dispatches the payload to Candidate #2.
5. **Telemetry Logging**: Every attempt hop is permanently logged with status and latency in [Provider Attempts](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/operations/attempts.md).

---

## Configuring a Policy in Developer Portal

1. In your project workspace, navigate to **Governance & Routing > Routing Policies**.
2. Click **Create Routing Policy**.
3. Configure:
   - **Policy Name / Alias**: The model name sent in client API requests (e.g. `smart`, `fast`, `economy`).
   - **Routing Strategy**: Select `priority`, `lowest_latency`, `lowest_cost`, or `weighted`.
   - **Automatic Failover Toggle**: Enabled (recommended).
   - **Candidate List**:
     - *Row 1*: Provider: `deepseek`, Model: `deepseek-chat`, Priority: `1`.
     - *Row 2*: Provider: `anthropic`, Model: `claude-3-5-sonnet`, Priority: `2`.
     - *Row 3*: Provider: `openai`, Model: `gpt-4o`, Priority: `3`.
4. Click **Save Policy**. The policy is immediately active across all gateway instances within < 50ms.

---

## Calling Your Policy via API

Client code specifies the policy name as the `model` parameter:

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer nak_live_your_key_here" \
  -d '{
    "model": "smart",
    "messages": [{"role": "user", "content": "Explain quantum computing simply."}]
  }'
```

---

## Troubleshooting Routing Policies

| Symptom | Cause | Resolution |
|---|---|---|
| `404 Not Found: model alias not found` | The requested model name does not match any active policy or provider model in this project/environment. | Verify the policy name in **Routing Policies** and check environment selection (`test` vs `production`). |
| All candidates fail in cascade | All upstream provider keys are expired or hit global quotas simultaneously. | Check [Providers & Health](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/organization/providers.md) to inspect real-time provider statuses. |

---

## Related Documentation

- [Providers & Health (BYOK)](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/organization/providers.md)
- [Provider Attempt Accounting](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/operations/attempts.md)
- [Chat Completions API](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md)
