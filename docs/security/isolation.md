# Tenant & Sandbox Isolation

To guarantee security in multi-tenant environments, Naagmani enforces strict isolation across multiple layers:

---

## Isolation Dimensions

1. **Organization Isolation**: Logical and cryptographic boundaries preventing cross-tenant data leaks.
2. **Project & Environment Namespaces**: Distinct credential pools and token lifecycles between `test` and `production`.
3. **Plugin Process Sandboxing**: Separate OS process trees with limited system calls and no shared memory.

---

## Next Steps

- [Data Protection & DLP](/docs/security/data-protection)
- [Audit Trail & Compliance](/docs/security/audit-logs)
