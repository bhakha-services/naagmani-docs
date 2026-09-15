# Security: Isolation & Sandboxing

Naagmani enforces strict tenant and execution isolation across all layers of the platform.

---

## Tenant Isolation

1. **Logical Separation**: Every request is tagged with Organization and Project IDs, ensuring strict database row-level security and cache partitioning.
2. **Dedicated Worker Pools**: Enterprise tiers deploy dedicated worker instances and private VPC endpoints with no multi-tenant shared memory or execution space.

---

## Plugin Process Sandboxing

Plugins operate as isolated subprocesses outside the main gateway memory space:

- **Resource Limits**: CPU quotas and memory limits (e.g. max 512MB RAM per worker) prevent runaway memory usage or DoS conditions.
- **Restricted System Calls**: System call filtering (seccomp on Linux) prevents plugins from spawning unapproved child processes or accessing unauthorized host filesystems.
- **Network Boundaries**: Outbound socket access is restricted unless the plugin explicitly requests the `network:outbound` permission in its manifest.
