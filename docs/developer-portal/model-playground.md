# Model Playground & Prompt Engineering

The **Model Playground** allows engineers and developers to test, benchmark, and compare LLM providers (OpenAI, Anthropic, Gemini, DeepSeek, Ollama) side-by-side with zero code changes.

---

## 1. Capabilities

- **Multi-Model Comparisons**: Test the same prompt against multiple model endpoints simultaneously.
- **Hyperparameter Tuning**: Dynamically adjust `temperature`, `top_p`, `max_tokens`, and `frequency_penalty`.
- **Latency & Streaming Benchmark**: Measure Time-to-First-Token (TTFT) and token generation speed.
- **Provider Failover Testing**: Validate automatic BYOK credential failover behavior live.

---

## 2. Using Model Playground in Developer Portal

1. Navigate to **Projects** $\rightarrow$ `[Your Project]` $\rightarrow$ **Model Playground** (`/projects/[projectId]/model-playground`).
2. Select your active Model and System Prompt.
3. Adjust inference parameters in the configuration panel.
4. Run inference and view formatted markdown output with token usage statistics.

---

## 3. Related Documentation

- [Smart Model Routing](../concepts/routing.md)
- [Model Providers & Virtual Aliases](../concepts/models.md)
- [BYOK & Credential Pools](./credential-pools.md)
