# CLI Authentication

Authenticate your local machine with the Naagmani Platform to enable plugin publishing, policy deployments, and metric queries.

---

## Interactive Login

```bash
naagmani login
```

This command opens your browser to authenticate with the Naagmani Developer Portal. Upon approval, an access token is saved locally to `~/.naagmani/config.json`.

---

## Non-Interactive / CI/CD Login

In automated CI/CD runners (e.g. GitHub Actions, GitLab CI), set the `NAAGMANI_API_KEY` environment variable:

```bash
export NAAGMANI_API_KEY="nmn_live_xxxxxxxxxxxxxxxxxxxxxxxx"
```

Or pass via flag:

```bash
naagmani whoami --token $NAAGMANI_API_KEY
```

---

## Verifying Identity

Check the currently authenticated user, active organization, and project scope:

```bash
naagmani whoami
```

Example output:
```text
Authenticated as: developer@example.com
Organization: Acme Corp (org_987asdf)
Active Project: Customer-AI-Assistant (proj_12345)
Role: Admin
```

---

## Logging Out

Clear stored local credentials:

```bash
naagmani logout
```
