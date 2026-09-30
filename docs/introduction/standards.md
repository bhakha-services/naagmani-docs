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
- **Overview**: [{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}})
- **Members**: [{{DEVELOPER_PORTAL_URL}}/members]({{DEVELOPER_PORTAL_URL}}/members)
- **Project Service Tokens**: [{{DEVELOPER_PORTAL_URL}}/service-tokens]({{DEVELOPER_PORTAL_URL}}/service-tokens)
- **Agents**: [{{DEVELOPER_PORTAL_URL}}/agents]({{DEVELOPER_PORTAL_URL}}/agents)
- **Skills**: [{{DEVELOPER_PORTAL_URL}}/skills]({{DEVELOPER_PORTAL_URL}}/skills)
- **Tools**: [{{DEVELOPER_PORTAL_URL}}/tools]({{DEVELOPER_PORTAL_URL}}/tools)
- **MCP Servers**: [{{DEVELOPER_PORTAL_URL}}/mcp]({{DEVELOPER_PORTAL_URL}}/mcp)
- **Guardrails**: [{{DEVELOPER_PORTAL_URL}}/guardrails]({{DEVELOPER_PORTAL_URL}}/guardrails)
- **Credential Pools**: [{{DEVELOPER_PORTAL_URL}}/credentials]({{DEVELOPER_PORTAL_URL}}/credentials)
- **Routing Policies**: [{{DEVELOPER_PORTAL_URL}}/routing-policies]({{DEVELOPER_PORTAL_URL}}/routing-policies)
- **FinOps & Budgets**: [{{DEVELOPER_PORTAL_URL}}/finops]({{DEVELOPER_PORTAL_URL}}/finops)
- **Audit Logs**: [{{DEVELOPER_PORTAL_URL}}/audit-logs]({{DEVELOPER_PORTAL_URL}}/audit-logs)

---

## Next Steps

- [What is Naagmani?](/docs/introduction/what-is-naagmani)
- [Architecture Overview](/docs/introduction/architecture)
- [Quickstart Overview](/docs/quickstart/overview)
