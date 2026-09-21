# Audit Logs & Compliance Trail

Naagmani maintains an immutable, append-only **Audit Log** recording every administrative action, API key generation, provider configuration change, tool invocation, and guardrail violation.

---

## 1. Audit Log Architecture

- **Tamper-Evident Storage**: Audit entries are indexed with cryptographic hashes and stored in write-once partitions.
- **Enterprise Scoping**: Accessible at both the **Organization** level (organization-wide compliance view) and **Project** level (fine-grained team inspection).
- **High Telemetry Retention**: Logs capture user identity, IP address, request payload metadata, tool invocation latency, tokens consumed, and HTTP status codes.

---

## 2. Inspecting Audit Logs in Developer Portal

1. Navigate to **Audit Logs** (`/audit-logs` for organization-wide or `/projects/[projectId]/audit-logs` for project workspace).
2. Filter logs by:
   - **Date Range**: Preset windows or custom ranges.
   - **Action Type**: E.g., `api_key.create`, `tool.execute`, `policy.violation`.
   - **User / Principal**: Filter by specific team member or service account.
3. Export logs in CSV or JSON format for enterprise SIEM integration (Splunk, Datadog).

---

## 3. Related Documentation

- [Security Overview](./overview.md)
- [Authorization & RBAC](./authorization.md)
- [Data Protection](./data-protection.md)
