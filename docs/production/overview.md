# Production Operations Overview

Running mission-critical AI workloads in production requires high availability, predictable latencies, automated fallbacks, and comprehensive monitoring.

---

## Production Checklist

Before launching user-facing AI features into production with Naagmani:

- [ ] **Environment Separation**: Ensure production workloads use `nmn_live_` API keys and are configured under the `production` environment.
- [ ] **Configure Fallbacks**: Set up multi-provider routing (e.g. OpenAI primary + Anthropic backup) to prevent downtime during upstream outages.
- [ ] **Enforce Rate Limits**: Configure per-user and per-service rate limits to prevent runaway traffic loops.
- [ ] **Spend Caps**: Set monthly budget caps and soft alert thresholds.
- [ ] **Observability**: Configure OpenTelemetry or Prometheus metrics export to your monitoring dashboards.
- [ ] **Timeout Budgets**: Establish tight socket timeouts on client calls to avoid hung frontend threads.
- [ ] **Security Guardrails**: Activate DLP and Prompt Firewall plugins in the request pipeline.
