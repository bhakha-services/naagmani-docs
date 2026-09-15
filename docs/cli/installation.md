# CLI Installation

The **Naagmani CLI** (`naagmani`) is the official developer tool for scaffolding plugins, running local development servers, testing schemas, and deploying AI policies.

---

## Installation Methods

### 1. Via npm (Recommended)

The global npm package automatically installs the pre-compiled native Go binary for your OS/architecture:

```bash
npm install -g naagmani
```

Verify installation:

```bash
naagmani --version
# Output: naagmani CLI v1.0.0
```

---

### 2. Direct Binary Download

Pre-compiled single-binary executables are available on the [Naagmani CLI Releases](https://github.com/bhakha-services/naagmani-cli/releases) page for:
- Linux (`x86_64`, `arm64`)
- macOS Darwin (`Apple Silicon arm64`, `Intel x86_64`)
- Windows (`x86_64`, `arm64`)

#### Linux / macOS:
```bash
curl -fsSL https://github.com/bhakha-services/naagmani-cli/releases/latest/download/naagmani-linux-amd64 -o /usr/local/bin/naagmani
chmod +x /usr/local/bin/naagmani
```

#### Windows (PowerShell):
```powershell
Invoke-WebRequest -Uri "https://github.com/bhakha-services/naagmani-cli/releases/latest/download/naagmani-windows-amd64.exe" -OutFile "$env:USERPROFILE\bin\naagmani.exe"
```

---

## System Diagnostics

Run `naagmani doctor` to verify system dependencies, runtime environments, and network connectivity:

```bash
naagmani doctor
```
