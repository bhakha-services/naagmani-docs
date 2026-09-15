# DeepSeek Integration

Naagmani integrates with DeepSeek's open-weights frontier reasoning and chat models.

---

## Supported Models

| Model | ID | Context Window | Capabilities |
| :--- | :--- | :--- | :--- |
| **DeepSeek-V3** | `deepseek-chat` | 64k tokens | High performance general chat, coding, translation |
| **DeepSeek-R1** | `deepseek-reasoner` | 64k tokens | Mathematical and logical reasoning, chain-of-thought tokens |

---

## Configuration (BYOK)

```yaml
providers:
  deepseek:
    api_key: "${DEEPSEEK_API_KEY}"
    base_url: "https://api.deepseek.com/v1"
```

---

## Reasoning Content Output

When querying `deepseek-reasoner`, Naagmani provides the internal reasoning steps in `reasoning_content` (or separates them cleanly depending on endpoint parameters):

```bash
curl -X POST https://api.naagmani.com/v1/chat/completions \
  -H "Authorization: Bearer NAAGMANI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {"role": "user", "content": "How many r s are in strawberry?"}
    ]
  }'
```
