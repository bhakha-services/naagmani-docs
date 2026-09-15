# OpenAI Integration

Naagmani provides deep integration with OpenAI models, supporting standard chat completions, structured outputs, function calling, vision, reasoning models, and prompt caching.

---

## Supported Models

| Model | ID | Context Window | Capabilities |
| :--- | :--- | :--- | :--- |
| **GPT-4o** | `gpt-4o` | 128k tokens | Vision, Audio, Tool Calling, Structured Outputs |
| **GPT-4o mini** | `gpt-4o-mini` | 128k tokens | High-speed, Cost-optimized, Vision |
| **o1** | `o1` | 200k tokens | Advanced Reasoning, Thinking tokens |
| **o3-mini** | `o3-mini` | 200k tokens | Fast Reasoning, STEM & Coding tasks |
| **Embeddings** | `text-embedding-3-small`, `text-embedding-3-large` | 8k tokens | Dimensionality reduction (256-3072) |

---

## Configuration (BYOK)

To connect your own OpenAI API key:

### Via Naagmani Developer Portal
1. Navigate to **Integrations** > **OpenAI**.
2. Paste your OpenAI API Key (`sk-...`) and optional Organization ID / Project ID.
3. Save configuration.

### Via YAML Configuration
```yaml
providers:
  openai:
    api_key: "${OPENAI_API_KEY}"
    organization_id: "org-xxxx" # Optional
```

---

## Calling OpenAI Models via Naagmani

```bash
curl -X POST https://api.naagmani.com/v1/chat/completions \
  -H "Authorization: Bearer NAAGMANI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Explain quantum entanglement simply."}
    ]
  }'
```
