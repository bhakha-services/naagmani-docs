# Creating an API Key

To authenticate requests to the Naagmani Gateway, client applications must provide a **Naagmani API Key**.

---

## 1. Key Formats

Naagmani API keys are cryptographically hashed and prefixed to indicate their environment scope:
- **Production Keys**: `nm_live_<32_character_hash>`
- **Test / Development Keys**: `nm_test_<32_character_hash>`

---

## 2. Generating Keys via the CLI

You can generate and manage API keys directly using the [Naagmani CLI](../cli/installation.md):

```bash
# Login to your Naagmani environment
naagmani login

# View active environment and identity
naagmani whoami

# Configure key environment variable
export NAAGMANI_API_KEY="nm_test_your_generated_api_key_here"
```

---

## 3. Best Practices

- **Never commit keys to Git**: Store `NAAGMANI_API_KEY` in your application environment or secrets manager.
- **Environment Isolation**: Always use `nm_test_` keys for local testing and CI/CD pipelines to prevent polluting production usage metrics.

---

## Next Steps

- Execute your first chat completion: [First Request Guide](first-request.md)
