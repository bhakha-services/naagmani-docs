# CLI Authentication & Context

Log in to Naagmani Cloud or self-hosted control plane instances and manage active tenant contexts.

---

## Interactive Login

```bash
naagmani login
```

This prompts for your Developer Portal credentials or opens an interactive browser authorization session.

---

## Inspecting Active Identity

Check your current authenticated user, active Organization, and default Project:

```bash
naagmani whoami
```

```text
Authenticated Identity:
  User:        alex@acme.com (ID: usr_01J8F0A7B...)
  Org:         Acme Corporation (ID: org_acme_corp)
  Project:     Customer Support (ID: proj_support_bot)
  Environment: production
  Cloud URL:   http://localhost:8081
```

---

## Non-Interactive & CI/CD Authentication

In automated GitHub Actions or CI/CD pipelines, configure authentication via standard environment variables:

| Environment Variable | Description |
|---|---|
| `NAAGMANI_TOKEN` | Bearer session token or Project Service Token (`nsk_live_...`). |
| `NAAGMANI_API_KEY` | Scoped API Key (`nak_live_...`). |
| `NAAGMANI_ORG_ID` | Default Organization ID. |
| `NAAGMANI_PROJECT_ID` | Default Project ID. |
| `NAAGMANI_ENVIRONMENT` | Target environment (`test` or `production`). |
| `NAAGMANI_CLOUD_URL` | Control plane endpoint (default: `http://localhost:8081`). |
| `NAAGMANI_OS_URL` | Gateway OS endpoint (default: `http://localhost:8080`). |

---

## Logging Out

Purge locally stored session tokens:

```bash
naagmani logout
```

---

## Related Documentation

- [Command Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/commands.md)
- [Project Service Tokens](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/projects/service-tokens.md)
