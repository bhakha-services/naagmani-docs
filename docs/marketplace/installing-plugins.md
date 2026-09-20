# Installing & Configuring Plugins

Learn how to search, install, and configure marketplace plugins in your Naagmani project.

---

## 1. Installing via Naagmani Developer Portal

1. In the Developer Portal, navigate to **Marketplace**.
2. Browse or search for the desired plugin (e.g. `dlp-sanitizer`).
3. Click **Install to Project**.
4. Select target project and environments (`production`, `test`).
5. Review requested permissions (`network:outbound`, `env:read`).
6. Configure plugin settings in the interactive JSON schema form.
7. Click **Deploy**.

---

## 2. Installing via CLI

Install directly from your terminal into the active project:

```bash
naagmani marketplace install @naagmani/dlp-sanitizer --env production
```

---

## 3. Configuring Plugin Pipelines

Once installed, declare your plugin execution order in your project configuration (`naagmani.yaml`):

```yaml
pipeline:
  plugins:
    - name: "@naagmani/ai-firewall"
      enabled: true
      on_error: "abort"
    - name: "@naagmani/dlp-sanitizer"
      enabled: true
      config:
        mask_emails: true
        mask_phone_numbers: true
```
