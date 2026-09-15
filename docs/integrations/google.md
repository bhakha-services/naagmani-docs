# Google Gemini Integration

Naagmani integrates with Google Cloud's Gemini models, supporting large context windows (up to 2M tokens), multimodal audio/video understanding, and fast reasoning.

---

## Supported Models

| Model | ID | Context Window | Capabilities |
| :--- | :--- | :--- | :--- |
| **Gemini 2.5 Pro** | `gemini-2.5-pro` | 1M tokens | Deep reasoning, Multimodal, Complex code generation |
| **Gemini 2.5 Flash** | `gemini-2.5-flash` | 1M tokens | Fast, Cost-efficient, Multimodal |
| **Gemini 1.5 Pro** | `gemini-1.5-pro` | 2M tokens | Extreme context length document analysis |

---

## Configuration (BYOK)

Provide your Google AI Studio API key or Google Cloud Vertex AI credentials:

```yaml
providers:
  google:
    api_key: "${GEMINI_API_KEY}"
```

---

## Multimodal Request Example

```bash
curl -X POST https://api.naagmani.com/v1/chat/completions \
  -H "Authorization: Bearer NAAGMANI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Describe this architectural diagram:"},
          {"type": "image_url", "image_url": {"url": "https://example.com/diagram.png"}}
        ]
      }
    ]
  }'
```
