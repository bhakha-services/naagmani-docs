# Audit logs and request logs

Naagmani exposes administrative audit events separately from gateway request and provider-attempt records. The portal's organization **Audit Logs** page and project-scoped views display records according to user permissions.

## Storage and retention

Audit records are database-backed and support retention cleanup. Do not treat them as an HMAC-signed, immutable or tamper-evident archive. Restrict database access and export records to independently protected storage if your organization requires it.

## Payload policies

| Policy | Request-log payload handling |
| --- | --- |
| `metadata_only` | Excludes payload bodies from request logs |
| `redacted_payload` | Stores sanitized payload snapshots |
| `encrypted_payload` | Stores encrypted snapshots; reveal requires permission and a reason |

Available retention depends on the effective entitlement. Metadata logging does not establish compliance or prevent other features from retaining conversation data.

Organization retention uses `GET /v1/organizations/{orgID}/retention` and `PUT /v1/organizations/{orgID}/retention`. The update field is `log_retention_days`, alongside `payload_logging_policy`. Use a human management credential with the required permission, not a gateway API key.

See [portal audit controls](/developer-portal/operations/audit-logs) and [inference observability](/security/inference-observability).
