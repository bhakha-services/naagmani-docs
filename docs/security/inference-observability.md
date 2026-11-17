# Inference observability and payload privacy

The gateway can record request metadata, execution stages, provider attempts and payload snapshots according to logging policy. Trace availability depends on the executed request path and capture configuration.

Administrative events, request logs, provider-attempt logs and agent memory have different purposes. A metadata-only request-log policy does not automatically disable conversation/memory storage elsewhere.

## Payload modes

| Mode | Behavior |
| --- | --- |
| `metadata_only` | Request-log bodies are excluded |
| `redacted_payload` | Sanitized snapshots can be stored |
| `encrypted_payload` | Encrypted snapshots can be stored and revealed through permission-checked operations |

Encrypted storage depends on the configured key management. Protect keys and backups; this is not end-to-end encryption that hides plaintext from the authorized runtime.

## Access

Organization/project permissions control record visibility. Revealing an encrypted snapshot requires `audit.payload_reveal` and a justification, and records an audit event. Reveal does not make it safe to copy payloads into unrestricted logs or support tickets.

The control-plane paths are `GET /v1/organizations/{orgID}/request-logs`, `GET /v1/organizations/{orgID}/request-logs/{id}` and `POST /v1/organizations/{orgID}/request-logs/{id}/reveal`. Use a permitted human management credential.

For the UI workflow, see [audit inspection](/developer-portal/operations/audit-logs). For other data retention, see [data protection](/security/data-protection).
