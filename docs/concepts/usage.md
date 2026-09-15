# Usage & Telemetry

Naagmani provides real-time telemetry, token accounting, and cost tracking across all downstream applications and microservices.

---

## Token Accounting

Every request routed through Naagmani is precisely metered:

- **Prompt Tokens**: Number of input tokens processed by the upstream tokenizer.
- **Completion Tokens**: Number of output tokens generated.
- **Reasoning Tokens**: Dedicated thinking or internal reasoning tokens (e.g., o1, DeepSeek-R1, Claude 3.7 Extended Thinking).
- **Cached Tokens**: Tokens read from provider prompt caches (e.g., Anthropic Prompt Caching, OpenAI Prompt Caching).

### Usage in API Responses

API responses include a standardized `usage` object:

```json
{
  "id": "chatcmpl_89fd7s9df87sd",
  "object": "chat.completion",
  "model": "gpt-4o",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 42,
    "total_tokens": 192,
    "prompt_tokens_details": {
      "cached_tokens": 128
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0
    }
  }
}
```

---

## Response Headers

Naagmani returns telemetry metadata directly in response headers:

| Header | Description |
| :--- | :--- |
| `X-Naagmani-Request-Id` | Unique tracing identifier for the request. |
| `X-Naagmani-Provider` | The upstream provider that fulfilled the request (e.g., `anthropic`, `openai`). |
| `X-Naagmani-Model` | The actual upstream model executed. |
| `X-Naagmani-Latency-Ms` | Total execution latency in milliseconds. |
| `X-Naagmani-Cost-USD` | Estimated cost in USD for the transaction. |
| `X-Naagmani-Plugin-Latency-Ms` | Cumulative execution time spent in active plugin hooks. |

---

## Exporting Metrics

Naagmani supports streaming real-time usage data and traces to industry-standard observability backends:

- **OpenTelemetry (OTel)**: Native OTel traces and metrics export.
- **Prometheus**: Scrape gateway metrics via `/metrics`.
- **Datadog / New Relic**: Pre-built metric forwarding adapters.
- **Webhooks**: Real-time event streams for custom ingestion pipelines.
