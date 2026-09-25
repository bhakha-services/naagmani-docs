# Creating an API Key

To authenticate requests against the Naagmani Gateway Data Plane, your application requires a valid API Key or Project Service Token.

---

## Option A: Via the Developer Portal

1. Log into the **Naagmani Developer Portal** at [http://localhost:3000](http://localhost:3000) or [https://developer.naagmani.app](https://developer.naagmani.app).
2. In the left navigation sidebar, select your active **Project**.
3. Click on **API Keys** in the project menu.
4. Click **+ Create API Key**.
5. Give your key a descriptive name (e.g. `production-backend-key`), choose an environment (`Production`), and click **Generate**.
6. Copy your API key (prefixed with `nsk_live_...`). Store it securely—it is only displayed once.

---

## Option B: Via the Naagmani CLI

If you have the Naagmani CLI installed:

```bash
# Authenticate CLI
naagmani auth login

# Generate a new project API key
naagmani keys create --project "my-copilot" --env "production" --name "cli-generated-key"
```

---

## Key Format

Naagmani credentials use standard prefix identifiers for fast identification:

- **`nsk_live_...`**: Standard Project API Key
- **`nsk_test_...`**: Sandbox / Development API Key
- **`nst_live_...`**: Scoped Project Service Token (Machine-to-Machine)

---

## Next Steps

- Use your key to make a request: [Sending Your First Request](first-request.md)
- Learn about scoped machine tokens: [Project Service Tokens Guide](../concepts/project-service-tokens.md)
