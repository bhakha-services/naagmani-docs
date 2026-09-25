# Plugin Management via CLI

The CLI provides commands to initialize, build, test, and publish custom Gateway plugins.

---

## 1. Scaffold a New Plugin

```bash
naagmani plugins init my-custom-guard --template go
# Output:
# Created my-custom-guard/
# ├── plugin.json
# ├── main.go
# ├── go.mod
# └── README.md
```

---

## 2. Validate Plugin Manifest

```bash
naagmani plugins validate ./my-custom-guard
```

---

## 3. Local Test Simulation

Test plugin execution against real or synthetic prompt payloads without needing a running gateway server:

```bash
naagmani plugins test ./my-custom-guard \
  --hook pre_route \
  --input '{"messages":[{"role":"user","content":"Sample test input"}]}'
```

---

## 4. Benchmark Performance

```bash
naagmani plugins benchmark ./my-custom-guard --concurrency 20 --requests 500
```

---

## 5. Package & Publish

```bash
naagmani plugins pack ./my-custom-guard -o ./dist/plugin.tar.gz
naagmani plugins publish ./dist/plugin.tar.gz --scope organization
```

---

## Next Steps

- [CLI Troubleshooting](/docs/cli/troubleshooting)
- [Marketplace Overview](/docs/marketplace/overview)
