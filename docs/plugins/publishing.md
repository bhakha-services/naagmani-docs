# Packaging & Publishing Plugins

Once your plugin passes validation and testing, package it for distribution to your team, organization, or the global Naagmani Marketplace.

---

## 1. Packaging

Compile or bundle your plugin dependencies and package the distribution archive:

```bash
# Package the plugin in current directory
naagmani package
```

This creates a self-contained tarball:
`my-custom-plugin-1.0.0.tgz` containing:
- `plugin.json`
- Built runtime artifacts (`dist/` or compiled binary)
- `README.md` and `LICENSE`

---

## 2. Authentication

Authenticate your CLI session using an API key or personal access token:

```bash
naagmani login
```

---

## 3. Publishing

Publish the package to the Naagmani Plugin Registry:

```bash
# Publish with organization/team scope
naagmani publish

# Publish with explicit access level
naagmani publish --access public
# Or private to your organization
naagmani publish --access private
```

---

## 4. Versioning & Rollbacks

- **Semantic Versioning**: Always increment `version` in `plugin.json` prior to publishing new releases.
- **Rollback**: If a published version causes unintended behavior, you can rollback the active deployment tier:
  ```bash
  naagmani rollback my-custom-plugin@1.0.0
  ```
