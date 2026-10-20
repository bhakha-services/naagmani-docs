# CLI Installation & Setup

The **Naagmani CLI (`naagmani`)** is the primary developer entry point for managing platform containers, authoring HDK plugins, inspecting real-time telemetry, and automating CI/CD pipelines.

---

## Installation Methods

### 1. Standalone Binary (Recommended)

Download the pre-compiled binary for your operating system:

```bash
# Linux / macOS (curl)
curl -fsSL https://naagmani.com/install.sh | bash

# Windows (PowerShell)
iwr -useb https://naagmani.com/install.ps1 | iex
```

### 2. Via NPM

```bash
npm install -g @naagmani/cli
```
---

## Verifying Installation

Verify that the CLI is installed and check system prerequisites:

```bash
naagmani version
naagmani doctor
```

---

## Next Steps

- Authenticate the CLI: [CLI Authentication](/build/cli/authentication)
- Explore all commands: [Command Reference](/build/cli/commands)
