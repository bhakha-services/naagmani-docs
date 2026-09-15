# Providers

Naagmani integrates with multiple upstream AI foundation model providers through unified protocol translation and routing adapters.

---

## Supported Providers

Naagmani provides unified connectivity and normalized interfaces across major industry model providers:

| Provider | Integration Type | Maturity | Key Models Supported |
| :--- | :--- | :--- | :--- |
| **OpenAI** | Native Adapter | `AVAILABLE` | GPT-4o, GPT-4o mini, o1, o3-mini, text-embedding-3 |
| **Anthropic** | Native Adapter | `AVAILABLE` | Claude 3.7 Sonnet, Claude 3.5 Sonnet, Claude 3.5 Haiku |
| **Google Gemini** | Native Adapter | `AVAILABLE` | Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 1.5 Pro |
| **DeepSeek** | Native Adapter | `AVAILABLE` | DeepSeek-V3, DeepSeek-R1 |
| **Mistral AI** | Native Adapter | `AVAILABLE` | Mistral Large 2, Mistral NeMo, Codestral |
| **Groq / Cerebras** | High-Throughput Adapter | `AVAILABLE` | Llama 3.3 70B, Llama 3.1 8B |
| **Custom / Self-Hosted** | OpenAI-Compatible Adapter | `AVAILABLE` | vLLM, Ollama, TGI, SGLang |
| **AWS Bedrock / Azure** | Cloud Gateway Adapter | `BETA` | Bedrock Claude / Titan, Azure OpenAI endpoints |

---

## BYOK (Bring Your Own Key) vs. Naagmani Managed

Naagmani supports two credential management modes for upstream providers:

### 1. Bring Your Own Key (BYOK)
- Store your provider API keys securely in the Naagmani Vault (encrypted with AES-256-GCM).
- Requests routed to the provider use your dedicated account and contractual pricing.
- Naagmani meters orchestrations, plugins, and routing without adding provider token markups.

### 2. Naagmani Managed Routing
- Leverage pre-configured enterprise provider capacity managed by Naagmani Cloud.
- Unified billing: all model consumption is consolidated into a single monthly invoice.

---

## Provider Fallbacks & Resilience

Naagmani monitors provider health in real-time. When a provider encounters rate limits (HTTP 429), server errors (HTTP 5xx), or excessive latency, Naagmani's dynamic router can automatically failover to secondary configured providers without application-level retry code.

See [Routing](routing.md) for configuration strategies.
