# Environments

An **Environment** represents an isolated runtime stage within a Project.

---

## Standard Tiers

Naagmani platform supports exactly **two** canonical environment tiers:

1. **Test (`test`)**:
   - Used for local developer debugging, feature engineering, integration tests, and CI/CD verification pipelines.
   - Paired with test model quotas and mock or low-cost model backends.
   - Scoped with `nmn_test_` prefixed API keys.

2. **Production (`production`)**:
   - High-availability tier with strict rate limits, audit logging, and failover model routing enabled for live workloads.
   - Scoped with `nmn_live_` prefixed API keys.

---

## Environment Isolation

- **Zero Cross-Talk**: API keys generated for the `test` environment cannot access `production` gateway runtimes.
- **Independent Vaults**: Production provider keys remain strictly segregated from test sandbox keys.
- **Resource Scoping**: BYOK provider credentials, rate limits, model aliases, and routing policies are strictly partitioned per environment tier.
