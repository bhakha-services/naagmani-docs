# Troubleshooting: Common Errors

Quick solutions for common runtime, inference, and routing errors encountered when working with Naagmani.

---

## 1. `401 Unauthorized` / `invalid_api_key`

- **Symptom**: `{"error": {"code": "invalid_api_key", "message": "Invalid API key provided."}}`
- **Cause**: The API key is missing from headers, mistyped, or revoked.
- **Fix**: Verify that the `Authorization: Bearer NAAGMANI_API_KEY` header is set properly. Check your active environment in the Developer Portal.

---

## 2. `429 Too Many Requests` / `insufficient_quota`

- **Symptom**: `{"error": {"code": "insufficient_quota", "message": "Project monthly budget cap exceeded."}}`
- **Cause**: Spending has reached the hard limit set on the project or organization.
- **Fix**: Increase the budget in **Project Settings** > **Billing & Budgets** or enable auto-recharge.

---

## 3. `503 Service Unavailable` / `provider_unavailable`

- **Symptom**: All configured upstream targets failed or timed out.
- **Fix**:
  - Check provider status dashboards (OpenAI, Anthropic status).
  - Configure multi-provider fallback routing (e.g. `smart` alias with multiple targets).
  - Increase the timeout budget in your routing policy.

---

## 4. `504 Gateway Timeout`

- **Symptom**: The request took longer than the configured gateway timeout budget.
- **Fix**:
  - When requesting long reasoning chains (e.g. o1 or Claude 3.7 Extended Thinking), increase client socket timeout to 120s+.
  - Enable streaming (`stream: true`) to receive chunks continuously.
