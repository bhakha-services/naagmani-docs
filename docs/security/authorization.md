# Access Control & Identity Architecture

Naagmani enforces a comprehensive, multi-tiered authorization and identity architecture with strict separation between human governance, customer directory identities, and machine credentials.

---

## 1. Domain Separation Matrix

| Identity Domain | Entity / Key Prefix | Authentication / Bearer | Purpose & Authorization Model |
| :--- | :--- | :--- | :--- |
| **Portal User** | `User` + `OrganizationMembership` | Human JWT session cookie / token | Dynamic RBAC permissions governing Developer Portal management actions. |
| **Customer Member** | `Member` (`mbr_...`) | `X-Naagmani-Member-ID` header | Application and customer directory identity for FinOps attribution and spending limits. Cannot log into Portal. |
| **Project Service Token** | `ServiceToken` (`nm_st_...`) | `Authorization: Bearer nm_st_...` | Machine-to-machine inference, discovery, and runtime management. Governed by PST capabilities (`inference.execute`, etc.). |
| **API Key** | `ApiKey` (`nm_app_...`) | `Authorization: Bearer nm_app_...` | Application runtime credential scoped to environments and customer member attribution. |

---

## 2. Dynamic RBAC Domain Model (Phase 2 Foundation)

Human access control for Developer Portal users is backed by a first-class dynamic RBAC architecture:

```
                    ORGANIZATION
                         |
             +-----------+-----------+
             |                       |
       PORTAL USERS             CUSTOMER MEMBERS
             |                       |
     User + Membership               Member (mbr_...)
             |
    UserRoleAssignment
             |
           Role
             |
       RolePermission
             |
         Permission
             |
      Canonical Registry
```

### Core Entities

1. **Permission**: Platform-defined canonical capability representing a distinct business action (e.g. `projects.read`, `billing.manage`).
2. **Role**: Organization-scoped container of permissions. Distinguishes between `system_defined: true` and custom roles.
3. **RolePermission**: Join entity linking roles to their authorized canonical permissions.
4. **UserRoleAssignment**: Organization-scoped assignment linking a human Portal User (`User` / `OrganizationMembership`) to one or more roles.

---

## 3. Canonical Permission Registry

The platform maintains a deterministic, canonical registry of platform capabilities. Permissions are read-only for tenants and seeded automatically during platform initialization.

| Resource Namespace | Canonical Permission Keys | Description |
| :--- | :--- | :--- |
| `organizations` | `organizations.read`, `organizations.manage` | Inspect and manage organization metadata and settings |
| `users` | `users.read`, `users.invite`, `users.manage` | List, invite, and administer human Portal User memberships |
| `roles` | `roles.read`, `roles.manage` | Inspect canonical permissions and manage organization custom roles |
| `projects` | `projects.read`, `projects.create`, `projects.update`, `projects.delete`, `projects.manage` | Full lifecycle control over workspaces and projects |
| `environments` | `environments.read`, `environments.manage` | Execution environment tier management |
| `service_tokens`| `service_tokens.read`, `service_tokens.create`, `service_tokens.update`, `service_tokens.revoke`, `service_tokens.manage` | Issue, rotate, and revoke Project Service Tokens |
| `api_keys` | `api_keys.read`, `api_keys.create`, `api_keys.revoke`, `api_keys.manage` | Application API key lifecycle |
| `providers` | `providers.read`, `providers.manage` | BYOK AI provider credentials and latency health probes |
| `billing` | `billing.read`, `billing.manage` | Subscription tiers, payment methods, and invoices |
| `usage` | `usage.read` | Organization and project token usage analytics |
| `audit` | `audit.read` | Immutable security and unified request audit trails |
| `mcp` | `mcp.read`, `mcp.manage` | Model Context Protocol servers, tools, and access policies |
| `policies` | `policies.read`, `policies.manage` | Intelligent routing policies and fallback hierarchies |
| `members` | `members.read`, `members.create`, `members.update`, `members.delete`, `members.manage` | Manage customer directory identities and spending limits |

---

## 4. System Default Roles vs Custom Roles

Every organization is automatically initialized with three default system roles:

1. **Owner (`owner`)**: Assigned all permissions across the canonical registry (`organizations.*`, `users.*`, `roles.*`, `billing.*`, etc.).
2. **Admin (`admin`)**: Administrative permissions for infrastructure, projects, tokens, providers, policies, and members.
3. **Member (`member`)**: Read permissions for projects, environments, usage, audit, and basic execution capabilities.

### Organization Custom Roles

Organizations can create custom roles with tailored permission subsets.
- **Tenant Isolation**: Custom roles created in Organization A cannot be viewed, updated, or assigned in Organization B.
- **Safety Invariants**:
  - Predefined system roles cannot be deleted.
  - Custom roles cannot be deleted while active Portal Users are assigned to them.
  - The final Owner of an organization cannot be stripped of their Owner role.
  - Unknown permission keys are rejected during role creation/update.

---

## 5. Security & Isolation Rules

- **No Machine Credential Conflation**: Creating or modifying human Portal Users, roles, or role assignments never generates API keys, PST secrets, or Customer Members.
- **Customer Members Are Outside RBAC**: End-user customer members cannot receive human RBAC roles, hold Portal permissions, or authenticate to the portal.
- **Tenant Context**: All role and permission evaluations are strictly evaluated within the active organization boundary.

---

## Next Steps

- [Developer Portal Roles & Permissions](/docs/developer-portal/roles)
- [Developer Portal Users](/docs/developer-portal/users)
- [Customer Members Directory](/docs/developer-portal/members)
- [Project Service Tokens](/docs/developer-portal/service-tokens)
- [Security Audit Logs](/docs/security/audit-logs)
