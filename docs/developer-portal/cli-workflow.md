# Naagmani CLI Developer Guide

The official Naagmani CLI provides comprehensive tooling for scaffold creation, local testing, manifest validation, packaging, and publishing plugins to the marketplace.

---

## Installation & Setup

Install the CLI globally via npm or execute directly with `npx`:

```bash
# Global installation
npm install -g naagmani

# Verify installation
naagmani --version
```

---

## Authentication

Authenticate the CLI with your Naagmani Cloud account:

```bash
naagmani login --email dev@example.com --password mysecretpassword
```

---

## Plugin Development Workflow

### 1. Scaffold a New Plugin
```bash
naagmani plugin create pii-masker --language node
```

### 2. Validate Manifest Rules
```bash
cd pii-masker
naagmani plugin validate
```

### 3. Test Plugin Locally
```bash
naagmani plugin test --input ./fixtures/test-prompt.json
```

### 4. Publish to Marketplace
```bash
naagmani plugin publish --scope organization
```
