# Testing & Validating Plugins

Validate plugin manifest integrity, simulate edge-case failure modes, and run integration tests prior to marketplace publishing.

---

## 1. Automated Manifest Validation

Verify that your `plugin.json` conforms to the protocol specification:

```bash
naagmani plugin validate .
```

Checks performed:
- Strict JSON Schema validation on `plugin.json`.
- Entrypoint binary path exists and has executable permissions.
- Declared hooks are supported in Wire Protocol v1.
- Network and filesystem permissions follow strict allowlist conventions.

---

## 2. Unit Testing Hook Handlers

You can feed simulated JSON-RPC events directly via `stdin` in standard unit tests:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"init","params":{"protocol_version":1}}' | ./bin/my-plugin
```

Expected output:
```json
{"jsonrpc":"2.0","id":1,"result":{"status":"ok","version":"1.0.0"}}
```

---

## Related Documentation

- [Building Plugins with HDK](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/development.md)
- [Packaging & Publishing](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/publishing.md)
