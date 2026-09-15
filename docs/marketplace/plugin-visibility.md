# Plugin Visibility & Scopes

Naagmani supports granular visibility tiers for published plugins to meet open-source and proprietary enterprise requirements.

---

## Visibility Tiers

| Tier | Flag | Description | Who Can Access |
| :--- | :--- | :--- | :--- |
| **Public** | `--access public` | Listed in global public Marketplace. | Any Naagmani developer worldwide. |
| **Organization Private** | `--access private` | Scoped to your organization registry. | Only authenticated members of your organization. |
| **Project Scoped** | `--access internal` | Private to a single project workspace. | Only project members with developer/admin roles. |

---

## Changing Visibility

Organization administrators can toggle plugin visibility in the Developer Portal under **Registry Settings** or via CLI:

```bash
naagmani marketplace visibility @acme/internal-rag --access private
```
