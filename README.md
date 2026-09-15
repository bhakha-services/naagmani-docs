# Naagmani Documentation (`naagmani-docs`)

Official developer documentation, architectural guides, API references, CLI manuals, and Plugin SDK guides for the **Naagmani AI Operating System**.

---

## 📚 Documentation Sections

Explore the full documentation structure:

- [**1. Introduction**](docs/introduction/what-is-naagmani.md): What is Naagmani, why it exists, product architecture, and foundational concepts.
- [**2. Quickstart**](docs/quickstart/overview.md): Getting an API key, sending your first inference request, and streaming responses.
- [**3. Concepts**](docs/concepts/organizations.md): Multi-tenancy, projects, environments, BYOK provider vaults, smart routing, and usage metering.
- [**4. API Reference**](docs/api/overview.md): OpenAI-compatible Chat Completions, Responses, Embeddings, Authentication, and error handling.
- [**5. Plugins & HDKs**](docs/plugins/overview.md): Plugin architecture, `naagmani.plugin/v1` wire protocol, lifecycle hooks, permissions, and publishing.
- [**6. SDK Guides**](docs/sdk/go.md): Authoring plugins with the Go HDK, Node.js/TypeScript HDK, and Python HDK.
- [**7. CLI Manual**](docs/cli/installation.md): Installation, authentication, local cluster management, plugin scaffolding, and packaging.
- [**8. Model Integrations**](docs/integrations/openai.md): Connecting OpenAI, Anthropic, Google Gemini, DeepSeek, and custom LLM providers.
- [**9. Security & Governance**](docs/security/overview.md): Zero-leakage BYOK architecture, RBAC, tenant isolation, and audit logging.
- [**10. Production Operations**](docs/production/overview.md): High availability, distributed rate limiting, failover routing, and observability.
- [**11. Marketplace**](docs/marketplace/overview.md): Discovering, installing, and publishing commercial and open-source plugins.
- [**12. Troubleshooting**](docs/troubleshooting/common-errors.md): Diagnosing common gateway errors, authentication issues, and CLI errors.

---

## 🔗 Related Ecosystem Repositories

- **CLI Distribution**: [`bhakha-services/naagmani-cli`](https://github.com/bhakha-services/naagmani-cli)
- **Plugin HDKs & Templates**: [`bhakha-services/naagmani-plugins`](https://github.com/bhakha-services/naagmani-plugins)

---

## 🤝 Contributing

We welcome documentation improvements, corrections, and new tutorials! Please check [CONTRIBUTING.md](CONTRIBUTING.md) for style guides and contribution instructions.

## 📄 License

This documentation is licensed under the [Apache License 2.0](LICENSE).
Copyright 2026 Bhakha Services / Naagmani Team.
