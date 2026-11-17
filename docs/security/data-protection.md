# Data protection and privacy controls

Request handling, logging, plugins and upstream providers have separate data-handling behavior. Review all of them when configuring a deployment.

## Payload logging

The default `metadata_only` request-logging policy excludes request/response bodies from those logs. `redacted_payload` stores sanitized snapshots; `encrypted_payload` stores encrypted snapshots with permission-controlled reveal. Retention and cleanup apply to stored records.

This is not a platform-wide zero-data-retention guarantee. Agent conversation/memory features, plugins, application databases, backups and upstream providers can retain data independently. Disable or configure those features to meet your requirements.

## Privacy plugins and governance

Privacy protection depends on the installed plugin, its enabled capabilities and its policy. Install/configure the intended protection and test representative inputs before relying on masking, tokenization or blocking. Do not assume that every request automatically detects all PII, secrets, prompt injections or harmful content.

The project's **Governance** page manages policy rules and simulation. It is not a universal DLP toggle panel. See [governance and privacy plugins](/developer-portal/governance-routing/guardrails).

Protect configuration and encryption keys, and configure HTTPS for traffic crossing network trust boundaries. Encrypted storage does not make a malicious runtime administrator unable to access decrypted data.

See [request-log privacy](/security/inference-observability) and [offline deployment](/deploy/offline).
