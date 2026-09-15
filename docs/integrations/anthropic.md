# Anthropic Integration

Naagmani natively interfaces with Anthropic's Claude models, translating OpenAI-standard payloads into Anthropic Messages API structures and normalizing response tokens and thinking blocks.

---

## Supported Models

| Model | ID | Context Window | Capabilities |
| :--- | :--- | :--- | :--- |
| **Claude 3.7 Sonnet** | `claude-3-7-sonnet-20250219` | 200k tokens | Hybrid Reasoning / Extended Thinking, Coding |
| **Claude 3.5 Sonnet** | `claude-3-5-sonnet-20241022` | 200k tokens | Vision, Tool Calling, Structured Outputs |
| **Claude 3.5 Haiku** | `claude-3-5-haiku-20241022` | 200k tokens | Ultra-low latency, High throughput |

---

## Configuration (BYOK)

```yaml
providers:
  anthropic:
    api_key: "${ANTHROPIC_API_KEY}"
```

---

## Extended Thinking Support

When invoking Claude 3.7 Sonnet via Naagmani, extended thinking tokens can be configured directly in standard payloads:

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "messages": [
    {"role": "user", "content": "Prove that the square root of 2 is irrational."}
  ],
  "reasoning_effort": "high"
}
```
Naagmani extracts and normalizes the internal reasoning traces.
