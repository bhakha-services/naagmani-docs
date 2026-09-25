# Anthropic Claude Integration

Naagmani transparently bridges OpenAI-compatible client payloads with Anthropic's native Messages API for `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`, and `claude-3-opus-20240229`.

---

## Automatic Protocol Translation

When a client sends a standard OpenAI JSON body with `model: "claude-3-5-sonnet-20241022"`, Naagmani automatically:
1. Extracts `system` messages and maps them to Anthropic's top-level `system` parameter.
2. Converts `tools` definitions into Anthropic tool schemas.
3. Translates `tool_calls` and `tool_results` into native blocks.
4. Normalizes streaming SSE events into OpenAI-compatible delta chunks.

---

## Credential Setup

Add your `sk-ant-...` key in the Portal:
- **Credential Pools**: [http://localhost:3000/credentials](http://localhost:3000/credentials)

---

## Next Steps

- [Google Gemini Integration](/docs/integrations/google)
- [DeepSeek Integration](/docs/integrations/deepseek)
