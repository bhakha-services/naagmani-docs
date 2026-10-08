# CLI Diagnostics & Troubleshooting

Diagnose system issues, verify connectivity, and troubleshoot common CLI errors.

---

## 1. Run Automated Diagnostics

The `naagmani doctor` command runs comprehensive pre-flight verification across your environment:

```bash
naagmani doctor
```

```text
[✓] Docker runtime: Docker version 24.0.7 (healthy)
[✓] Docker Compose: v2.23.3 (healthy)
[✓] Go compiler: go version go1.22.5 (healthy)
[✓] Node.js runtime: v20.12.0 (healthy)
[✓] Network: Naagmani Cloud reachable at http://localhost:8081
[✓] Gateway: Naagmani OS reachable at http://localhost:8080
[✓] Disk space: 45GB available
All 7 checks passed successfully!
```

---

## 2. Common CLI Errors & Fixes

### Error: `Exit code 2: authentication required`
*Cause*: Session token is expired or `NAAGMANI_TOKEN` is invalid.
*Fix*: Run `naagmani login` or update your `NAAGMANI_TOKEN` environment variable.

### Error: `Exit code 3: manifest validation failed`
*Cause*: `plugin.json` contains syntax errors or invalid hook declarations.
*Fix*: Run `naagmani plugin validate .` to inspect line-by-line schema violations.

### Error: `Exit code 4: network connectivity failure`
*Cause*: Cannot connect to `NAAGMANI_CLOUD_URL` or `NAAGMANI_OS_URL`.
*Fix*: Verify platform containers are running with `naagmani platform status`.

---

## Related Documentation

- [Command Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/commands.md)
- [CLI Authentication](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/authentication.md)
