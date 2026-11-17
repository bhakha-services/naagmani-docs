# Audit logs and request inspection

Open **Organization → Audit Logs** or the project's **Audit Logs** view. Administrative events, runtime requests and provider attempts are distinct record types; available filters and details depend on the record and your permission.

## Inspect a request

Filter by request ID, actor, project, environment or time using the controls shown in your deployment. Open a record to inspect available status, timing, model/provider, token metrics and execution trace. Missing payloads can be expected under the selected logging policy.

## Payload access

- `metadata_only` omits request/response bodies from request logs.
- `redacted_payload` stores sanitized snapshots.
- `encrypted_payload` requires an authorized reveal operation with a reason to decrypt stored snapshots.

Reveal requires `audit.payload_reveal` and writes an audit event. Read/trace/payload visibility are permission-controlled. Do not assume every record contains every stage or payload boundary; capture depends on the executed path and policy.

## Retention

Organization settings expose retention and payload policy controls to authorized users. Effective entitlement limits the accepted retention period. Cleanup deletes eligible old records; logs are not an immutable archive or a regulatory certification.

See [request logs API](/api/request-logs), [audit behavior](/security/audit-logs) and [data protection](/security/data-protection).
