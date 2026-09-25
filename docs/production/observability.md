# Observability & Prometheus Metrics

Gain deep visibility into latency, token usage, error rates, and provider performance.

---

## Metrics Export (Prometheus)

Naagmani exposes standard Prometheus metrics at `:8081/metrics`:

```text
# TYPE naagmani_http_requests_total counter
naagmani_http_requests_total{status="200",provider="openai",model="gpt-4o"} 14209
naagmani_http_requests_total{status="429",provider="openai",model="gpt-4o"} 12

# TYPE naagmani_ttft_seconds histogram
naagmani_ttft_seconds_bucket{le="0.25",provider="anthropic"} 8400
naagmani_ttft_seconds_bucket{le="0.5",provider="anthropic"} 12100
```

---

## Grafana Dashboards

Pre-built dashboards are provided in the official repository under `/deploy/grafana/` for instant monitoring of:
- Gateway Throughput & P99 Latency
- Provider Cascade Failures
- Real-Time Budget Burn Rate

---

## Next Steps

- [Scaling & Concurrency](/docs/production/scaling)
- [Marketplace Overview](/docs/marketplace/overview)
