# CLI Authentication

To execute operations against the Naagmani Control Plane, the CLI must authenticate your developer identity.

---

## Interactive Browser Login (Recommended)

Run `login` to open an OAuth2 browser confirmation flow:

```bash
naagmani auth login
# Output:
# Attempting to automatically open the SSO authorization page in your default browser...
# If the browser does not open, visit:
# {{DEVELOPER_PORTAL_URL}}/cli-auth?code=ABCD-1234
#
# Waiting for authorization... [OK]
# Successfully authenticated as alice@company.com (Org: org_ad094812-07ef)
```

---

## Headless / CI Authentication

For CI/CD pipelines and automated environments, provide a Project Service Token or Personal Access Key via environment variables:

```bash
export NAAGMANI_API_KEY="nst_live_9b2d8819..."
export NAAGMANI_ORG_ID="org_ad094812-07ef-4db5-b2ba-6585bd9df55e"
export NAAGMANI_API_URL="{{API_BASE_URL}}"

# Verify context
naagmani auth status
```

---

## Managing Workspaces & Contexts

Switch seamlessly between different organizations and projects:

```bash
# List available contexts
naagmani context list

# Switch to production
naagmani context use production-org
```

---

## Next Steps

- [Commands Reference](/docs/cli/commands)
- [Plugin Management](/docs/cli/plugins)
