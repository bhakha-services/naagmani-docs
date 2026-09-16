# Packaging & Publishing Plugins

Naagmani plugins follow an immutable, content-addressed distribution model. Plugins are prebuilt and packaged locally before being published to the **Naagmani Cloud ArtifactStore** via the CLI or the **Developer Portal Publisher**.

---

## 1. Plugin Architecture & Bundle Requirements

A Naagmani plugin distribution package is a standard `.tar.gz` archive produced by `naagmani plugin package`.

### Required Archive Structure
```text
plugin-bundle-1.0.0.tar.gz
├── plugin.json          # Authoritative plugin manifest
├── dist/                # Compiled entrypoint (e.g., dist/index.js, main.py, or binary)
├── README.md            # Plugin documentation and usage instructions
└── LICENSE              # Open source or proprietary software license
```

### Manifest Specifications (`plugin.json`)
```json
{
  "name": "custom-security-guard",
  "version": "1.0.0",
  "api_version": "naagmani.plugin/v1",
  "priority": 15,
  "failure_policy": "fail_close",
  "timeout_ms": 1500,
  "permissions": ["runtime.intercept", "telemetry.emit"],
  "hooks": ["request.before", "response.before"],
  "runtime": {
    "language": "nodejs",
    "entrypoint": "dist/index.js"
  }
}
```

---

## 2. Packaging a Plugin Locally

Build your code and generate the `.tar.gz` archive using the CLI:

```bash
# 1. Build entrypoint and vendor dependencies
naagmani plugin build

# 2. Package into a validated prebuilt bundle
naagmani plugin package --output ./dist/custom-security-guard-1.0.0.tar.gz
```

The packager checks that:
- Root `plugin.json` exists and matches the `naagmani.plugin/v1` protocol.
- Declared entrypoint exists inside the archive.
- Archive size is within limits (maximum 50MB compressed / 200MB uncompressed).

---

## 3. Publishing Methods

### Option A: Publishing via Developer Portal (Web UI)
1. Open the **Developer Portal** and navigate to the **Publisher** tab.
2. **Step 1 (Plugin Info)**: Provide the plugin identifier (e.g. `custom-security-guard`), display name, category, capabilities, and visibility.
3. **Step 2 (Release Info)**: Provide semantic version (e.g. `1.0.0`), protocol target (`naagmani.plugin/v1`), and release notes.
4. **Step 3 (Prebuilt Artifact)**: Drag & drop your `.tar.gz` bundle.
5. **Step 4 (Review & Publish)**: Click **Confirm & Publish Artifact**.

The browser performs a direct multipart/form-data upload to `POST /v1/plugins/publish`. The backend unpacks the stream in memory, enforces decompression limits, extracts and validates the manifest, computes the authoritative SHA-256 digest, stores the binary in `FSArtifactStore`, and immutably records the `PluginVersion`.

### Option B: Publishing via CLI
Authenticate and publish directly from your terminal:

```bash
# 1. Login to Naagmani Cloud
naagmani login --email dev@example.com

# 2. Publish the prebuilt tarball
naagmani plugin publish ./dist/custom-security-guard-1.0.0.tar.gz \
  --visibility community \
  --release-notes "Initial production release"
```

---

## 4. Visibility & Trust Model

Naagmani separates **Visibility Scope** from **Trust Status**:

| Visibility | Audience | Permissions Required |
| :--- | :--- | :--- |
| **Community (Public)** | Visible and installable in the global Marketplace across all tenants. | Authenticated publisher. |
| **Organization Private** | Strictly isolated to members of your organization. Private artifact downloads require authentication and membership verification. | Verified member of owning organization with `publisher` or `admin` role. |
| **Official** | Verified platform capability standard. Ordinary customers cannot publish official plugins. | Platform System Admin (`is_system_admin: true`). |

---

## 5. Version Immutability & Safety

- **Strict Immutability**: Once version `1.0.0` of a plugin is published with a SHA-256 digest, that version cannot be overwritten or altered. Attempting to publish an existing version returns `409 Conflict`.
- **Atomic Persistence**: If artifact inspection, path traversal checks, or database persistence fail at any step, no partial or broken releases are left in the Marketplace catalog.
