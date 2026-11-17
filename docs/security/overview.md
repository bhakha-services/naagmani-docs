# Security controls

Naagmani includes scoped application credentials, role-based management permissions, provider credential encryption, governance policies and configurable request logging. These controls depend on deployment configuration and the endpoints being used.

- **Identity separation:** self-hosted local accounts and hosted Accounts sessions have different authorities.
- **Application scope:** API keys and Project Service Tokens carry application context and permissions.
- **Management access:** organization/project operations enforce applicable RBAC permissions.
- **Provider credentials:** encrypted storage protects stored keys; the runtime decrypts them for provider calls.
- **Observability:** administrative audit events and request logs support investigation, with configurable retention and payload policies.
- **Deployment protection:** configure HTTPS, network restrictions, key management, backups and updates for your environment.

An application feature is not a compliance certification. Do not infer SOC 2, ISO 27001, HIPAA or GDPR compliance from the presence of logging or encryption controls alone. Audit records have retention and cleanup operations; do not assume a cryptographically immutable archive.

See [authentication](/security/authentication), [authorization](/security/authorization), [audit logs](/security/audit-logs) and [data protection](/security/data-protection).
