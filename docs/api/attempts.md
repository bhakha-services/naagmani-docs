# Provider Attempts API Reference

Query upstream dispatch telemetry, TTFT, token accounting, and retry cascade logs.

**Surface**: Control Plane API (`:8081`)

---

## 1. List Provider Attempts

`GET /v1/organizations/{orgId}/attempts?per_page=50&status=succeeded&provider=openai`

### Query Parameters:
- **`page`** (int): Page number (Default: 1).
- **`per_page`** (int): Results per page (Default: 50, Max: 100).
- **`status`** (string): Filter by `succeeded`, `failed`, `timed_out`, `canceled`, `stream_interrupted`.
- **`provider`** (string): Filter by `openai`, `anthropic`, `google`, `deepseek`.
- **`failover_only`** (bool): Return only attempts where retries/failovers occurred.

---

## 2. Get Attempts by Request ID

`GET /v1/organizations/{orgId}/requests/{requestId}/attempts`

Returns the full ordered execution cascade (Hop #1 $\rightarrow$ Hop #2) for a specific logical request.

### Response Example:
```json
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
```
