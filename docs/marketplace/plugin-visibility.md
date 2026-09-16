# Plugin Visibility & Trust Scopes

Naagmani separates visibility boundaries (who can view and download) from trust status (official vs community).

---

## Visibility Scopes

| Scope | Description | Access Boundary | Download Protection |
| :--- | :--- | :--- | :--- |
| **Community (Public)** | Publicly discoverable in the Marketplace across all workspaces and organizations. | Any authenticated developer. | Publicly downloadable artifact. |
| **Organization Private** | Isolated strictly to the owning organization. Does not leak into public catalogs. | Authenticated members of the owning organization. | Protected endpoint (`GET /v1/plugins/artifacts/{filename}`) verifying org membership. |
| **Official (Verified)** | Standard capabilities curated and endorsed by platform administrators. | Publicly discoverable. | Requires system administrator privilege (`is_system_admin: true`) to publish. |

---

## Private Artifact Security

Private plugin archives are protected at both discovery and download layers:
- Catalog queries filter private plugins to only those owned by the requester's active organization.
- Direct artifact downloads at `GET /v1/plugins/artifacts/{filename}` verify the requester's JWT authorization and organization membership or registered machine-to-machine installation token.
