# CLI Installation & Setup

The **Naagmani CLI (`naagmani`)** is the primary developer entry point for managing platform containers, authoring HDK plugins, inspecting real-time telemetry, and automating CI/CD pipelines.

---

## Installation Methods

### 1. Standalone Binary (Recommended)

Download the pre-compiled binary for your operating system:

```bash
# Linux / macOS (curl)
curl -fsSL https://get.naagmani.com/install.sh | bash

# Windows (PowerShell)
iwr -useb https://get.naagmani.com/install.ps1 | iex
```

### 2. Via NPM

```bash
npm install -g @naagmani/cli
```

### 3. Build from Source (Go 1.22+)

```bash
git clone https://github.com/bhakha-services/naagmani-cli.git
cd naagmani-cli
go build -o naagmani main.go
sudo mv naagmani /usr/local/bin/
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

- Authenticate the CLI: [CLI Authentication](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/authentication.md)
- Explore all commands: [Command Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/commands.md)
