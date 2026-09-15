# Marketplace Overview

The Naagmani Marketplace connects AI engineers, security teams, and tool authors to discover, share, and distribute production-ready plugins for the Naagmani AI Operating System.

---

## Ecosystem Categories

| Category | Description | Popular Examples |
| :--- | :--- | :--- |
| **Security & Privacy** | Real-time DLP, secret masking, guardrails, prompt firewall. | `dlp-sanitizer`, `ai-firewall-node` |
| **Data & RAG** | Vector search, knowledge graph retrieval, database connectors. | `rag-retriever`, `qdrant-bridge` |
| **Model Context Protocol (MCP)** | Bridges to MCP servers, development tools, and desktop applications. | `mcp-bridge`, `github-mcp` |
| **Agent Runtimes** | Autonomous execution runtimes, memory managers, state machines. | `agent-runtime`, `session-memory` |
| **Observability** | Custom compliance loggers, semantic evaluation, cost analyzers. | `datadog-ai-tracer`, `langfuse-sync` |

---

## Quality & Verification

Every plugin published to the public marketplace undergoes automated security scanning:
- Static analysis against the canonical `naagmani.plugin/v1` schema.
- Vulnerability scanning on declared runtime dependencies.
- Malware and dangerous syscall detection.
- Verified publisher badges for recognized open-source and enterprise partners.
