# Security Audit Logs & Request Observability

Naagmani maintains an immutable compliance audit trail capturing every administrative event, credential modification, and 12-stage AI inference request trace across your organization.

- **Portal Location**: `Organization > Audit Logs` (`/audit-logs`) or `Projects > [Your Project] > Operations > Audit Logs` (`/projects/[slug]/audit-logs`)
- **Canonical Operations Guide**: [Security Audit Logs & Inference Trace Observability](operations/audit-logs.md)
- **Deep Architecture**: [Inference Payload Observability Architecture](../security/inference-observability.md)

---

## Quick Navigation & Overview

The audit logging subsystem combines two key functions:

1. **Administrative Audit Trail**: Every credential rotation (`api_key.created`, `api_key.revoked`), user invitation, role mutation, and log retention modification is immutably logged with actor attribution.
2. **Inference Request Observability**: Deep lifecycle tracing across 12 authentic runtime stages, including Privacy Shield PII transformations and multi-boundary payload inspection.

### Cryptographic Security at Rest
To protect against database breaches, untrusted DBAs, and insider threats, all stored payloads are envelope-encrypted using **AES-256-GCM** keys wrapped by KMS, coupled with tenant-isolated Additional Authenticated Data (AAD). 

Viewing decrypted payloads requires an authorized **Privileged Reveal Protocol** (`audit.payload_reveal`) with mandatory business justification, generating an immutable audit trail event.

For complete step-by-step instructions on configuring policies (`metadata_only`, `redacted_payload`, `encrypted_payload`), using the 12-stage timeline inspector, and viewing transformation diffs, see the full guide:

👉 **[Read the Full Developer Portal Audit Logs Guide](operations/audit-logs.md)**
