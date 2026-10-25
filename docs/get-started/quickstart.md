# Quickstart Guide

Get up and running with Naagmani in under 5 minutes. This guide walks you through logging in to the Developer Portal, setting up an AI provider, and creating an API key.

---

## Step 1: Access the Developer Portal

1. Open your browser and navigate to the **Naagmani Developer Portal**:
   - For **Self-Hosted** deployments: `http://localhost:3001`
   - For **Cloud / Hosted** deployments: `http://localhost:3000` (or your custom cloud domain)
2. Log in with your developer account or sign up to create your initial **Organization**.

> [!TIP]
> **Need to spin up a self-hosted instance in under 60 seconds?**
> Run the official [1-Command Automated Installer](/deploy/installation):
> - **Linux & macOS**: `curl -fsSL https://naagmani.com/install.sh | bash`
> - **Windows (PowerShell)**: `iwr -useb https://naagmani.com/install.ps1 | iex`

```text
Developer Portal Location:
http://localhost:3001 (Self-Hosted) or http://localhost:3000 (Cloud)
```

---

## Step 2: Configure an Upstream AI Provider (BYOK)

Before sending inference requests, link at least one upstream AI provider credential:

1. In the left navigation sidebar under the **Organization** section, click **Providers & Health** (`/providers`).
2. Click **Connect Provider**.
3. Select your provider (e.g., **OpenAI**, **Anthropic**, **DeepSeek**, or **Google Gemini**).
4. Enter your provider API Key and optional base URL.
5. Click **Save Credential**. Naagmani will run an automated connectivity health check to verify the key.

> [!TIP]
> Your keys are encrypted using AES-256 in the secure BYOK vault and never exposed in client API responses.

---

## Step 3: Create a Project & Select Environment

1. In the sidebar, click **Projects & Workspaces** → **All Projects** (`/projects`).
2. Click **New Project** and enter a name (e.g., `Customer Copilot`, slug: `customer-copilot`).
3. Inside your project workspace, select your target environment (**`test`** or **`production`**).

---

## Step 4: Generate an API Key

1. Inside your active project workspace, click **Workspace** → **API Keys** (`/projects/customer-copilot/api-keys`).
2. Click **Generate API Key**.
3. Provide a key name (e.g., `Local Dev Key`) and select the target environment (`test`).
4. Click **Create Key**.
5. Copy the generated secret key (starts with `nak_...` or `nsk_...`).

> [!CAUTION]
> The raw secret key is displayed **only once**. Save it securely in your environment variables.

```bash
export NAAGMANI_API_KEY="nak_test_9f8e7d6c5b4a321..."
export NAAGMANI_BASE_URL="http://localhost:8080/v1"
```

---

## Next Steps

Now that you have configured a provider and generated an API key, proceed to:
- [Make Your First AI Request](/get-started/first-request)
- Learn about [Project Service Tokens](/developer-portal/projects/service-tokens) for automated microservices.
