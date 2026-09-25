# CLI Diagnostics & Troubleshooting

Common errors encountered when using the `naagmani` CLI and their resolutions.

---

## 1. Authentication & Token Errors

### Error: `401 Unauthorized / Token Expired`
- **Cause:** The cached OAuth session or Project Service Token has expired.
- **Fix:** Run `naagmani auth login` to re-authenticate or generate a new token via `naagmani tokens create`.

---

## 2. Connection Refused

### Error: `dial tcp 127.0.0.1:8081: connect: connection refused`
- **Cause:** Local development server or Docker container is not running.
- **Fix:** Start the Control Plane container:
  ```bash
  docker start naagmani-os
  ```
  Or specify the remote production URL using `--api-url https://api.naagmani.app`.

---

## 3. Plugin Validation Warnings

### Error: `entrypoint binary not executable`
- **Cause:** Missing POSIX execution permissions on the target binary.
- **Fix:**
  ```bash
  chmod +x ./bin/plugin
  ```

---

## Next Steps

- [Common Errors Guide](/docs/troubleshooting/common-errors)
- [Developer Portal CLI Guide](/docs/developer-portal/cli-workflow)
