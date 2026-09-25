# Documentation & Quality Standards

To maintain high documentation quality and complete parity with the underlying codebase, Naagmani adheres to strict editorial, architectural, and engineering documentation standards.

---

## The Golden Rule for Engineering

> [!IMPORTANT]
> **NO PUBLIC FEATURE IS COMPLETE UNTIL ITS PUBLIC DOCUMENTATION IS COMPLETE.**
> Whenever a new capability, API parameter, portal view, or plugin hook is added or modified in the codebase, its corresponding public documentation must be updated in the same release pull request.

---

## Required Documentation Elements

For every new public feature, the documentation must provide:

1. **What is this feature?** A clear, jargon-free explanation.
2. **Why does it exist?** Real-world developer and enterprise motivation.
3. **When should I use it?** Clear architectural guidance and use-case matrix.
4. **How does it work?** High-level data flow or sequence diagram (Mermaid).
5. **Developer Portal Workflow**: Step-by-step instructions with direct portal links.
6. **API Contract & Reference**: Request methods, headers, payloads, and response shapes.
7. **Code Examples**: Executable snippets in cURL, TypeScript, Python, and Go.
8. **Permissions & Security**: Least-privilege requirements and security implications.
9. **Troubleshooting & Errors**: Common status codes and remediation steps.

---

## Language & Style Guidelines

### 1. Progressive Disclosure
Introduce concepts simply before presenting advanced configurations. Avoid requiring the reader to jump across disconnected pages to understand basic operations.

### 2. Implementation Parity
Never document aspirational or unreleased features as currently available. If a capability is in beta or planned, clearly display the corresponding status badge.

### 3. Public Safety & Zero Secret Leakage
Documentation must never expose internal table schemas, unencrypted private keys, operational credentials, or internal microservice topology. Use standard placeholders like \`nst_live_...\` or \`org_...\`.

---

## Developer Portal Canonical URLs

All documentation cross-references must use canonical portal paths:
- **Overview**: [http://localhost:3000](http://localhost:3000)
- **Members**: [http://localhost:3000/members](http://localhost:3000/members)
- **Project Service Tokens**: [http://localhost:3000/service-tokens](http://localhost:3000/service-tokens)
- **Agents**: [http://localhost:3000/agents](http://localhost:3000/agents)
- **Skills**: [http://localhost:3000/skills](http://localhost:3000/skills)
- **Tools**: [http://localhost:3000/tools](http://localhost:3000/tools)
- **MCP Servers**: [http://localhost:3000/mcp](http://localhost:3000/mcp)
- **Guardrails**: [http://localhost:3000/guardrails](http://localhost:3000/guardrails)
- **Credential Pools**: [http://localhost:3000/credentials](http://localhost:3000/credentials)
- **Routing Policies**: [http://localhost:3000/routing-policies](http://localhost:3000/routing-policies)
- **FinOps & Budgets**: [http://localhost:3000/finops](http://localhost:3000/finops)
- **Audit Logs**: [http://localhost:3000/audit-logs](http://localhost:3000/audit-logs)

---

## Next Steps

- [What is Naagmani?](/docs/introduction/what-is-naagmani)
- [Architecture Overview](/docs/introduction/architecture)
- [Quickstart Overview](/docs/quickstart/overview)
