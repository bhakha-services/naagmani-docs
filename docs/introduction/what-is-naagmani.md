# What is Naagmani?

**Naagmani** is an enterprise-grade **AI Operating System & Gateway Runtime** designed to govern, optimize, and secure all Large Language Model (LLM) traffic across your organization.

Often described as the **"Android OS for AI"**, Naagmani acts as a standardized platform runtime layer between your application code and the fragmented landscape of foundational model providers (OpenAI, Anthropic, Google Gemini, DeepSeek, and private self-hosted models).

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Applications                        │
│          (Web Apps, Microservices, Agents, Tools)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ OpenAI-compatible API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Naagmani AI Operating System              │
│                                                             │
│  • BYOK Key Vault        • Multi-Language Plugin Pipeline   │
│  • Smart Model Router    • Real-Time Usage & FinOps Metering│
│  • Failover & Resiliency • Policy & Entitlement Enforcement │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Cloud Model Providers   │ │  Self-Hosted SLM / Private │
│  OpenAI • Anthropic • Gemini │ │   vLLM • Ollama • TGI      │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## Core Capabilities

1. **Unified OpenAI-Compatible API**: Direct your existing OpenAI SDK clients, LangChain agents, or bespoke applications to Naagmani with a single base URL change.
2. **Bring-Your-Own-Key (BYOK) Security Vault**: Store your provider keys in an encrypted vault. Applications call Naagmani using tenant-scoped API keys without ever exposing underlying provider credentials to developers or client devices.
3. **Smart Model Routing & Automatic Failover**: Dynamically route requests across providers based on cost, latency, token limits, or provider health. Seamlessly fall back to secondary models during provider outages without downtime.
4. **Pluggable Architecture (`naagmani.plugin/v1`)**: Extend gateway behavior with isolated, language-independent plugins written in Go, TypeScript/Node.js, or Python for prompt injection defense, DLP/PII masking, Model Context Protocol (MCP) execution, and RAG retrieval.
5. **Real-time Usage Metering & FinOps**: Granular tracking of prompt tokens, completion tokens, costs, and tenant quotas across organizations, projects, and environments.

---

## Next Steps

- Understand why enterprise teams choose Naagmani: [Why Naagmani?](why-naagmani.md)
- Learn the high-level architecture: [Architecture Overview](architecture.md)
- Make your first request in under 5 minutes: [Quickstart Guide](../quickstart/overview.md)
