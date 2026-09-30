# Rate Limiting & Quotas

Protect upstream provider quotas and prevent noisy-neighbor congestion across internal teams.

---

## Rate Limiting Algorithms

1. **Token Bucket Algorithm**: Allows smooth bursts while maintaining steady sustained throughput.
2. **Concurrency Limiter**: Restricts maximum concurrent in-flight requests per project or member.

---

## Configuration

Set rate limits directly per credential in [**Credential Pools**]({{DEVELOPER_PORTAL_URL}}/credentials) or per token in [**Project Service Tokens**]({{DEVELOPER_PORTAL_URL}}/service-tokens).

---

## Next Steps

- [Observability & Metrics](/docs/production/observability)
- [Scaling & Concurrency](/docs/production/scaling)
