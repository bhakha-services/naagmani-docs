# Plugin Debugging & Diagnostics

Techniques for diagnosing crashing, timing out, or misbehaving plugins.

---

## 1. Inspecting Plugin Crash Logs
When a plugin worker crashes, the Gateway logs the stack trace to the system audit trail:
- Check **Audit Logs**: [http://localhost:3000/audit-logs](http://localhost:3000/audit-logs)

---

## 2. Testing Locally with Verbose Tracing

```bash
naagmani plugins test ./my-plugin --verbose --hook pre_route
```

---

## 3. Timeout Adjustments
If your plugin performs heavy remote HTTP lookups or embedding calculations, increase `timeout_ms` in your `plugin.json` to prevent premature `fail-close` aborts.

---

## Next Steps

- [CLI Diagnostics](/docs/troubleshooting/cli)
- [Common Errors Guide](/docs/troubleshooting/common-errors)
