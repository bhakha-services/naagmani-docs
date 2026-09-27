# Entitlements & Runtime Enforcement

This document specifies the entitlement evaluation hierarchy, feature flags, numerical limits, and server-side enforcement mechanics in **Naagmani AI OS**.

---

## 1. Entitlement Resolution Hierarchy

Entitlements are evaluated with strict deterministic precedence:

```text
1. Cryptographic License (Ed25519 Payload)
         │
         ▼
2. Organization Governance & Budget Constraints
         │
         ▼
3. Project & Environment Policies
         │
         ▼
4. DefaultFree Fallback (Baseline open-source capabilities)
```

> [!IMPORTANT]
> A lower-level policy (e.g. Project setting) can never exceed or bypass limits established by the organization's cryptographically signed license.

---

## 2. Capability Catalog & Plan Matrix

| Entitlement Key | Description | Free | Pro | Enterprise |
|---|---|---|---|---|
| `router` | Multi-model intelligent routing | ✓ | ✓ | ✓ |
| `byok` | Zero-knowledge BYOK encryption | ✓ | ✓ | ✓ |
| `plugin_runtime` | Custom plugin execution | 5 plugins | 25 plugins | Unlimited |
| `advanced_routing` | Latency & cost-optimized fallback routing | ✗ | ✓ | ✓ |
| `enterprise_rbac` | Custom roles & granular permissions | ✗ | ✗ | ✓ |
| `audit_logs` | Audit event query & SIEM export | 7 Days | 30 Days | 365+ Days |
| `mcp_enterprise` | Model Context Protocol servers | 3 Servers | 20 Servers | Unlimited |
| `sso` | SAML 2.0 & OIDC Single Sign-On | ✗ | ✗ | ✓ |

---

## 3. Server-Side Enforcement (Fail-Closed)

Enforcement checks are performed server-side on all mutation and execution endpoints:

```go
// Example: Server-side RBAC & Feature check in Cloud API / OS Gateway
if !entitlementManager.HasFeature(entitlement.FeatureEnterpriseRBAC) {
    return apperrors.Forbidden("custom RBAC roles require an Enterprise license")
}
```

### Fail-Closed vs. Fail-Open Matrix:

| Capability Class | Policy on Missing / Invalid License | Error Response |
|---|---|---|
| **Core Inference & Chat** | Fail-Open (`DefaultFree` fallback) | Inference continues normally |
| **Enterprise RBAC Mutation** | Fail-Closed | `403 Forbidden` / `402 Payment Required` |
| **Audit Log Export** | Fail-Closed | `403 Forbidden` |
| **Custom Plugin Deployment** | Enforce Plan Quota | `400 Bad Request: plugin limit exceeded` |
| **MCP Server Registration** | Enforce Plan Quota | `400 Bad Request: server limit exceeded` |
