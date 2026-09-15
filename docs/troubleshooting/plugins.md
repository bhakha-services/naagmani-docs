# Troubleshooting: Plugins

Diagnosing plugin communication, RPC framing, handshake errors, and timeouts.

---

## 1. JSON-RPC Parsing Error / Broken Stdout Channel

- **Symptom**: `Failed to decode plugin response: invalid character 'H' looking for beginning of value`.
- **Cause**: The plugin code executed a standard `console.log("Hello")` or `print("Debug info")` to `stdout`, corrupting the newline-delimited JSON-RPC stream.
- **Fix**: Direct all diagnostic output to `stderr`. Use HDK loggers (`context.log.info` in TS/Node, `context.logger.info` in Python) which automatically write to `stderr`.

---

## 2. Handshake Timeout (`initialize` Failed)

- **Symptom**: `Plugin did not complete 'initialize' handshake within 2000ms`.
- **Cause**: Heavy synchronous startup operations (e.g. loading large multi-gigabyte models into RAM or making blocking external network requests during import).
- **Fix**: Defer expensive asset loading to background tasks or optimize worker startup.

---

## 3. Permission Denied (`plugin_permission_denied`)

- **Symptom**: `Plugin requested outbound network connection to api.qdrant.io:6333 which is not declared in permissions`.
- **Fix**: Add `"network:outbound"` to the `permissions` array in `plugin.json` and re-deploy.
