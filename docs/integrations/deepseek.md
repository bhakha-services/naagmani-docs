# DeepSeek Integration

Naagmani provides first-class support for DeepSeek's open reasoning and general-purpose models, including `deepseek-chat` (V3) and `deepseek-reasoner` (R1).

---

## Key Capabilities

- **Chain-of-Thought Streaming**: Dedicated extraction of `reasoning_content` blocks alongside final answers.
- **Ultra-Cost Effective Routing**: Route high-volume classification and summary workloads to DeepSeek with automatic fallback to OpenAI or Anthropic upon upstream timeouts.

---

## Setup in Developer Portal

1. Obtain your API Key from the DeepSeek Open Platform.
2. Store the key in [http://localhost:3000/credentials](http://localhost:3000/credentials).
3. Set your routing policy to prefer `deepseek-chat` as primary.

---

## Next Steps

- [Self-Hosted LLMs](/docs/integrations/other-providers)
- [Provider Attempt Telemetry](/docs/concepts/providers)
