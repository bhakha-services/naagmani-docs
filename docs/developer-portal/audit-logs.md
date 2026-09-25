# Security Audit Logs

Naagmani maintains an immutable compliance audit trail capturing every administrative event, credential modification, and security policy evaluation.

- **Portal Page**: [http://localhost:3000/audit-logs](http://localhost:3000/audit-logs)

---

## Tracked Event Types

- **Authentication**: `login.success`, `login.failure`, `password.reset`.
- **Credentials**: `api_key.created`, `api_key.revoked`, `service_token.created`, `service_token.revoked`.
- **Members**: `member.created`, `member.role_updated`, `member.budget_modified`.
- **Providers & Vault**: `provider.created`, `provider.updated`, `vault.accessed`.
- **Guardrails & Security**: `rate_limit.triggered`, `policy.violation`, `dlp.redacted`.

---

## Filtering Audit Events

Use the interactive filter drawer to search events by **Actor User/Token**, **Event Type**, **HTTP Status**, and **Time Window**.

---

## Next Steps

- Security architecture: [Security & Governance](../security/overview.md)
