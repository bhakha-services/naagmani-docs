# Monitoring and observability

Use the portal's provider-health, attempts, usage and audit/request-log views to inspect operation. The gateway exposes `GET /v1/health`; the local control-plane API exposes `GET /health`. Health checks alone do not establish inference success or provider readiness.

Collect container logs with your deployment's logging system. Use request IDs to correlate a client failure with runtime requests and upstream attempts. Treat log exports as sensitive data and apply access/retention controls.

Do not assume a generic `/metrics` endpoint, particular Prometheus metric names or bundled Grafana dashboards unless your deployed build explicitly provides that integration.

See [provider attempts](/developer-portal/operations/attempts), [audit logs](/security/audit-logs), [request privacy](/security/inference-observability) and [reliability](/production/reliability).
