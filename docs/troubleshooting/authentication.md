# Authentication Troubleshooting

In-depth guide to resolving SSO, JWT token, and Project Service Token authentication issues.

---

## 1. Service Token Prefix Validation
All Project Service Tokens must start with the `nst_live_` prefix:
- **Valid:** `nst_live_9b2d88194488...`
- **Invalid:** `sk-...` or `bearer_...`

---

## 2. Inspecting Token Metadata via API
Verify token capabilities and expiration:

```bash
curl {{API_BASE_URL}}/v1/organizations/{org_id}/service-tokens \
  -H "Authorization: Bearer <ADMIN_SESSION_TOKEN>"
```

---

## Next Steps

- [Plugin Debugging](/docs/troubleshooting/plugins)
- [CLI Diagnostics](/docs/troubleshooting/cli)
