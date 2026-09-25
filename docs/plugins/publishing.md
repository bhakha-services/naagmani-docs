# Packaging & Publishing

Once your plugin has passed testing, you can package it into a distributable archive and publish it to the Naagmani Marketplace or your organization's private registry.

---

## 1. Package Archive Structure

A published plugin bundle is a standard compressed archive (`.tar.gz` or `.zip`) containing:

```text
my-plugin-1.0.0.tar.gz
├── plugin.json          # Manifest
├── README.md            # Documentation & usage
├── LICENSE              # License file
└── bin/
    ├── plugin-linux-amd64
    ├── plugin-linux-arm64
    └── plugin-darwin-arm64
```

---

## 2. Publishing via CLI

Authenticate and push the package directly to your organization registry:

```bash
# Package binary
naagmani plugins pack ./ -o ./dist/pii-guard-1.0.0.tar.gz

# Publish to private registry
naagmani plugins publish ./dist/pii-guard-1.0.0.tar.gz --scope organization --visibility private
```

---

## Next Steps

- [Marketplace Overview](/docs/marketplace/overview)
- [Installing Plugins into Environments](/docs/marketplace/installing-plugins)
