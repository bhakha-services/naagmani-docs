# Installing Plugins from Marketplace

Adding pre-built capabilities to your Naagmani project takes just one click or a single CLI command.

---

## 1. Installation via Developer Portal

1. Navigate to **Plugins & Marketplace**: [http://localhost:3000/plugins](http://localhost:3000/plugins)
2. Locate your desired plugin (e.g., *PII Redaction Guardrail*).
3. Click **Install to Project**.
4. Select the target Environment (`production` or `test`).
5. Configure custom parameters in the auto-generated JSON schema form.
6. Click **Save & Activate**.

---

## 2. Installation via CLI

```bash
naagmani plugins install com.company.pii-guard --env production
```

---

## Next Steps

- [Publishing Your Own Plugins](/docs/marketplace/publishing)
- [Plugin Visibility & Scopes](/docs/marketplace/plugin-visibility)
