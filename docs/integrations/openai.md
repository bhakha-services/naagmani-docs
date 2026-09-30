# OpenAI Integration Guide

Naagmani provides seamless, native proxying and intelligent fallback routing for all official OpenAI models, including `gpt-4o`, `gpt-4o-mini`, `o1`, `o1-mini`, and `text-embedding-3-large`.

---

## Configuration

1. Open **Credential Pools** in the Developer Portal: [{{DEVELOPER_PORTAL_URL}}/credentials]({{DEVELOPER_PORTAL_URL}}/credentials)
2. Click **Add Provider Credential**.
3. Select **OpenAI**, input your `sk-proj-...` API key, and configure rate limits or priority weighting.

```json
{
  "provider": "openai",
  "api_key": "sk-proj-...",
  "base_url": "https://api.openai.com/v1",
  "weight": 100,
  "max_rpm": 5000
}
```

---

## Supported Features

- **Chat Completions & Reasoning Tokens**: Full support for reasoning effort parameters in `o1` series models.
- **Function / Tool Calling**: Schema-validated JSON tool invocations.
- **Server-Sent Events (SSE)**: Byte-level chunk forwarding with sub-millisecond overhead.
- **Embeddings**: High-throughput vectorized outputs.

---

## Example Invocations

```bash
curl -X POST {{GATEWAY_URL}}/v1/chat/completions \
  -H "Authorization: Bearer nst_live_9b2d8819..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Explain vector indexing."}],
    "temperature": 0.7
  }'
```

---

## Next Steps

- [Anthropic Claude Integration](/docs/integrations/anthropic)
- [Smart Routing & Cascading](/docs/concepts/routing)
