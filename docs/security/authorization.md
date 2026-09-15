# Security: Authorization & RBAC

Naagmani implements granular Role-Based Access Control (RBAC) and declarative policy enforcement across teams, projects, and execution pipelines.

---

## Organizational Roles

| Role | Scope | Description |
| :--- | :--- | :--- |
| **Owner** | Organization | Full administrative control: billing, SSO, user management, audit logs. |
| **Admin** | Organization / Project | Manage projects, environments, API keys, and routing policies. |
| **Developer** | Project | Create API keys for test environments, test plugins locally, view metrics. |
| **Viewer** | Organization / Project | Read-only access to metrics, dashboards, and audit logs. |

---

## Policy-Based Access Control

Security teams can declare global policies that override individual project settings:

```yaml
policy:
  enforce_dlp: true
  disallowed_models:
    - "unapproved-external-model"
  max_tokens_per_request: 8192
  allowed_environments_for_live_keys:
    - "production"
```
