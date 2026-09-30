# Data Protection & DLP

Protecting proprietary enterprise data, user privacy, and compliance integrity is built directly into Naagmani's data pipeline.

---

## Zero Data Retention (ZDR)

Naagmani does **not** persist request prompt contents or generated completions to persistent disk unless explicitly enabled via audit tap configurations. All payload transformations occur purely in-memory.

---

## PII Masking & Guardrail Filters

- Mask Social Security Numbers, phone numbers, and email addresses.
- Redact database connection strings, JWT tokens, and private RSA keys before external model transmission.

Configure guardrails in the Portal:
- **AI Guardrails**: [{{DEVELOPER_PORTAL_URL}}/guardrails]({{DEVELOPER_PORTAL_URL}}/guardrails)

---

## Next Steps

- [Security Audit Logs](/docs/security/audit-logs)
- [Production Operations Overview](/docs/production/overview)
