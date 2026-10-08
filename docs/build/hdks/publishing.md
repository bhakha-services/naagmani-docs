# Packaging & Publishing Plugins

Package your plugin into an immutable distribution archive, calculate SHA-256 integrity checksums, and publish release versions to the Naagmani Marketplace.

---

## 1. Package the Distribution Archive

```bash
naagmani plugin package .
```

This compiles your binaries for target architectures and outputs:
- `dist/my-plugin-1.0.0.tar.gz`
- `dist/my-plugin-1.0.0.tar.gz.sha256`

---

## 2. Publish Release

```bash
# Publish to private organization catalog
naagmani plugin publish . --visibility organization

# Publish to global marketplace
naagmani plugin publish . --visibility public
```

---

## Related Documentation

- [Marketplace Publisher Portal](file:///e:/project/naagmani-project/naagmani-docs/docs/marketplace/publishing.md)
- [CLI Command Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/commands.md)
