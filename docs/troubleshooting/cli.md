# CLI Diagnostics

Troubleshooting local command execution, network connectivity, and configuration issues.

---

## 1. Resetting Cached CLI Credentials

If your session is corrupted:
```bash
rm -rf ~/.naagmani/credentials.json
naagmani auth login
```

---

## 2. Debugging HTTP Payloads

Add the `--verbose` flag to any CLI command to display raw request and response headers:

```bash
naagmani projects list --verbose
```

---

## Next Steps

- [Common Errors Guide](/docs/troubleshooting/common-errors)
- [Return to Quickstart](/docs/quickstart/overview)
