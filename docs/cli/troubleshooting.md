# CLI Troubleshooting

Common issues encountered when running the Naagmani CLI and their solutions.

---

## 1. `naagmani: command not found`

- **Cause**: The global npm bin directory or manual install directory is not in your system `$PATH`.
- **Solution**:
  - Run `npm bin -g` to check where npm installs binaries.
  - Add that directory to your PATH (e.g. in `~/.bashrc`, `~/.zshrc`, or Windows Environment Variables).

---

## 2. Manifest Validation Failed (`naagmani validate`)

- **Cause**: `plugin.json` is missing mandatory keys or contains invalid types.
- **Common Fixes**:
  - Ensure `name` contains only lowercase letters, numbers, and hyphens.
  - Ensure `runtime.protocol_version` is set exactly to `naagmani.plugin/v1`.
  - Ensure `entrypoint` points to an existing, executable file relative to `plugin.json`.

---

## 3. Dev Mode Process Exited Prematurely (`naagmani dev`)

- **Cause**: The plugin entrypoint threw an unhandled runtime exception during startup or failed the `initialize` handshake.
- **Solution**:
  - Check the `stderr` logs output in the dev console.
  - Ensure runtime dependencies are installed (e.g. `npm install` or `pip install -r requirements.txt`).
  - Verify that standard output (`stdout`) is not being written to by user code (use logger on `stderr` instead).

---

## 4. Permission Denied on Binary Execution (Linux / macOS)

- **Cause**: The built entrypoint binary lacks executable permissions (`+x`).
- **Solution**:
  ```bash
  chmod +x dist/index.js # or chmod +x bin/plugin
  ```
