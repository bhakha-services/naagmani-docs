# Production Operations Overview

Deploying Naagmani in mission-critical, enterprise production environments requires robust high-availability, rate limiting, comprehensive observability, and scalable infrastructure.

---

## Key Production Capabilities

- **Zero-Downtime Hot Upgrades**: Hot-reload routing policies and credentials without dropping active HTTP/SSE connections.
- **Distributed Rate Limiting**: Redis-backed token bucket algorithm for cluster-wide enforcement.
- **Multi-Region Active-Active**: Deploy across multiple geographic regions with global latency routing.

---

## Next Steps

- [High Availability & Failover](/docs/production/reliability)
- [Rate Limiting & Quotas](/docs/production/rate-limits)
- [Observability & Prometheus Metrics](/docs/production/observability)
