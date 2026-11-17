# Reliability and failover

Routing policies can select configured candidates and retry eligible upstream failures. This can improve resilience when another candidate is available; it does not guarantee a particular uptime or recovery time.

Test timeouts, rate-limit errors, unavailable providers, exhausted quotas and interrupted streams. A response that has already started streaming cannot always be transparently replayed against another provider.

Platform availability also depends on the portal/API/gateway instances, database, Redis, network, plugin dependencies and model services. A single-node Compose update or host outage can interrupt service. Redundant hosting, load balancing, backups and regional failover require an operator-designed deployment.

Use [routing policies](/concepts/routing), [provider attempt logs](/developer-portal/operations/attempts), [monitoring](/production/observability) and [backup/update procedures](/deployment/upgrades) to validate your target behavior.
