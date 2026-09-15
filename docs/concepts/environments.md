# Environments

An **Environment** represents an isolated runtime stage within a Project.

---

## Standard Tiers

1. **Development (`development`)**:
   - Used for local developer debugging and feature engineering.
   - Typically paired with sandbox model quotas and mock/low-cost models.
2. **Staging (`staging`)**:
   - Pre-production environment for integration tests and QA verification.
3. **Production (`production`)**:
   - High-availability tier with strict rate limits, audit logging, and failover model routing enabled.

---

## Environment Isolation

- **Zero Cross-Talk**: API keys generated in `staging` cannot access `production` gateway runtimes.
- **Independent Vaults**: Production provider keys remain strictly segregated from developer sandbox keys.
