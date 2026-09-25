# Naagmani CLI Developer Guide

Integrate Naagmani directly into terminal workflows, CI/CD pipelines, and local developer environments using the official Naagmani CLI.

---

## Installation

```bash
# Install via Go
go install github.com/bhakha-services/naagmani-cli/cmd/naagmani@latest

# Or download binary release
curl -sSL https://get.naagmani.app | bash
```

---

## Core Workflows

```bash
# 1. Log into your Naagmani Organization
naagmani auth login

# 2. List your projects
naagmani projects list

# 3. Create a scoped Project Service Token
naagmani tokens create --project "support-ai" --env "production" --name "ci-token"

# 4. Test an inference request
naagmani chat --model "gpt-4o" --prompt "Hello from CLI!"
```

---

## Next Steps

- Full CLI command reference: [CLI Commands Reference](../cli/commands.md)
- CLI troubleshooting: [CLI Troubleshooting](../cli/troubleshooting.md)
