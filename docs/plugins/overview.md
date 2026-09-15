# Plugin System Overview

The Naagmani Plugin System is an open, modular extensibility framework that enables developers to intercept, modify, secure, and inspect AI interactions across their infrastructure.

---

## What is a Naagmani Plugin?

A Naagmani plugin is an independent binary, script, or container that communicates with the Naagmani Runtime over the **Naagmani Plugin Protocol (`naagmani.plugin/v1`)**.

Plugins can:
- **Sanitize and inspect inputs** (PII masking, secret detection, prompt injection defense).
- **Inject dynamic context** (retrieval-augmented generation, enterprise vector search, knowledge graph lookups).
- **Enforce governance policies** (cost tracking, token limits, content moderation).
- **Bridge external tools and services** (MCP servers, database query tools, enterprise APIs).
- **Transform and validate outputs** (JSON schema compliance, citation verification, hallucination checks).

---

## Ecosystem Repositories

The Naagmani plugin ecosystem is organized across public open-source repositories:

| Repository | Purpose | Authoritative For |
| :--- | :--- | :--- |
| **[`naagmani-plugins`](https://github.com/bhakha-services/naagmani-plugins)** | Protocol specification, official HDKs (Go, Node, Python), and reference plugins. | Canonical protocol spec & HDK source. |
| **[`naagmani-cli`](https://github.com/bhakha-services/naagmani-cli)** | CLI tooling for creating, scaffolding, packaging, and validating plugins. | Developer build & testing workflow. |
| **[`naagmani-docs`](https://github.com/bhakha-services/naagmani-docs)** | Developer guides, architectural documentation, and API references. | Conceptual explanations & tutorials. |

---

## Key Design Principles

1. **Language Agnostic**: Develop in Go, TypeScript/JavaScript, Python, Rust, or any language capable of reading/writing JSON-RPC over `stdio`.
2. **Process Isolation**: Plugins run as child processes with strict resource limits and security boundaries.
3. **Explicit Permissions**: Plugins must declare requested capabilities in `plugin.json` and receive runtime approval.
4. **Deterministic Hook Pipelines**: Plugins execute in a configured sequence (`pre_prompt` -> Upstream Inference -> `post_generation`).
5. **Zero External Dependencies at Runtime**: Plugins are packaged as self-contained bundles.
