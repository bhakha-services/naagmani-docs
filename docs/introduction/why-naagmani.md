# Why Naagmani?

As organizations scale their AI initiatives, integrating LLMs into production exposes critical architectural challenges:

- **Provider Fragmentation**: Each model provider (OpenAI, Anthropic, Google Gemini, DeepSeek, local vLLM) has different SDKs, credential schemes, rate limits, and error semantics.
- **Security & Secret Exposure**: Hardcoding provider API keys in client apps or distributed services leads to key leakage and unbounded financial liability.
- **Provider Outages & Rate Limit Lockouts**: If your sole model provider experiences an outage or throttles your TPM (Tokens Per Minute), your downstream application goes down.
- **Lack of Governance & Data Privacy**: Without an interception layer, sensitive PII, passwords, or intellectual property can accidentally be transmitted to third-party LLMs.

---

## How Naagmani Solves These Challenges

| Enterprise Challenge | Traditional Direct Integration | With Naagmani OS |
| :--- | :--- | :--- |
| **Provider Key Management** | Keys distributed across services and devs | Encrypted central vault; developers receive scoped Naagmani keys |
| **API Standardization** | Custom code per provider API | Unified OpenAI-compatible wire format for all models |
| **Reliability & Uptime** | Hard dependency on a single vendor | Automatic health probing and multi-provider failover |
| **Data Loss Prevention (DLP)** | Custom regexes duplicated in each app | Centralized, high-performance DLP & PII redaction plugins |
| **Cost & Token Control** | Manual end-of-month cloud billing analysis | Real-time token metering, per-project budgets, and rate limiting |
| **Extensibility** | Monolithic code rewrites | Isolated plugins speaking `naagmani.plugin/v1` in Go, Node, or Python |

---

## Next Steps

- Explore the platform topology: [Architecture](architecture.md)
- Learn foundational terms: [Core Concepts](concepts.md)
