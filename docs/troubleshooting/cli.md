# Troubleshooting: CLI Issues

Solutions for command-line interface execution, building, and validation issues.

---

## 1. `naagmani: EACCES: permission denied`

- **Cause**: Trying to install `@naagmani/cli` globally without appropriate npm permissions on Linux/macOS.
- **Fix**: Use `npx @naagmani/cli` or configure npm to use a non-root directory for global packages:
  ```bash
  mkdir -p ~/.npm-global
  npm config set prefix '~/.npm-global'
  export PATH=~/.npm-global/bin:$PATH
  ```

---

## 2. Validation Errors on Windows

- **Cause**: Windows backslash path separators (`\`) used in `plugin.json` entrypoints.
- **Fix**: Always use forward slashes (`/`) in `plugin.json` (e.g. `"entrypoint": "dist/index.js"`), which are cross-platform compatible.

---

## 3. Diagnostic Health Check (`naagmani doctor`)

When in doubt, run the automated environment diagnostics tool:

```bash
naagmani doctor
```

This validates your Node.js, Go, Python, network proxies, and authentication configuration.
