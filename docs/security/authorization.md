# Role-Based Access Control (RBAC)

Access to organizations, projects, and resources is governed by strict, hierarchical RBAC policies.

---

## Organization Roles

| Role | Permissions |
| :--- | :--- |
| **Owner** | Full administrative rights, organization billing, member management, and workspace deletion. |
| **Admin** | Manage projects, credentials, guardrails, and members. Cannot delete the organization. |
| **Member** | Create and run models, view logs, deploy plugins, and configure project settings. |
| **Viewer** | Read-only access to metrics, logs, and playgrounds. Cannot generate tokens or alter configurations. |

---

## Managing Roles in Portal

Assign roles directly in the Developer Portal:
- **Members**: [http://localhost:3000/members](http://localhost:3000/members)

---

## Next Steps

- [Tenant & Sandbox Isolation](/docs/security/isolation)
- [Security Audit Logs](/docs/security/audit-logs)
