# Developer Portal Overview & Dual Scope Model

The **Naagmani Developer Portal** is the centralized graphical interface for managing your AI infrastructure, tenant hierarchies, security policies, and real-time observability.

---

## The Dual Scope Mental Model

To balance organization-wide governance with project-level autonomy, the Developer Portal is built around two distinct operational contexts:

```mermaid
graph TD
    subgraph OrgScope["🏢 Organization Scope (Global Governance)"]
        Users["Portal Users & Invites"]
        Roles["Roles & RBAC Permissions"]
        Members["Customer Members"]
        Billing["Billing & Subscriptions"]
        Providers["Providers & BYOK Key Vault"]
        GlobalAudit["Organization Audit Logs"]
        OrgAttempts["Global Provider Attempts"]
    end

    subgraph ProjScope["📁 Project Workspace Scope (App-Level Context)"]
        Projects["Projects (e.g. ChatBot, Search)"]
        Env["Environments (test / production)"]
        APIKeys["Environment API Keys"]
        ST["Project Service Tokens"]
        Agents["AI Agents & Skills"]
        Routing["Smart Routing Policies"]
        Guardrails["AI Guardrails & DLP"]
        MCP["MCP Servers & Tool Policies"]
        ProjUsage["Project Usage & Budgets"]
    end

    OrgScope --> ProjScope
```

---

## 1. Organization Scope vs Project Workspace

Understanding when to operate at the **Organization level** versus inside a **Project Workspace** is key to navigating the Developer Portal:

| Scope | What Lives Here? | Why This Scope Exists | Primary Audience |
|---|---|---|---|
| **Organization Scope** | • Global Provider BYOK Keys<br>• Team Members & Roles (RBAC)<br>• Billing & Subscription Plans<br>• Organization Audit Logs<br>• Marketplace & Publisher | Centralized enterprise governance, shared API key vaults, security compliance, and financial accounting across all company projects. | Org Owners, Security Admins, Finance / FinOps Leads |
| **Project Workspace Scope** | • Environment API Keys (`test`/`prod`)<br>• Project Service Tokens<br>• Smart Routing Rules & Cascades<br>• AI Agents, Skills & Tools<br>• MCP Servers & Policies<br>• AI Guardrails (PII/DLP)<br>• Model & Agent Playgrounds | Isolated developer workspace for building, configuring, and testing specific AI workloads without affecting sibling applications. | Software Engineers, AI Application Developers, Data Scientists |

---

## Dynamic Navigation in the Developer Portal

The left navigation sidebar automatically adapts based on your active context:

```mermaid
flowchart LR
    Portal["Developer Portal Navigation"]
    Portal --> OrgNav["1. Organization Menu (Collapsible)"]
    Portal --> ProjNav["2. Projects & Workspaces Menu (Contextual)"]
    Portal --> CommNav["3. Commercial Admin (System Admins Only)"]

    OrgNav --> O1["Dashboard, Users, Roles, Members, Billing, Providers, Attempts, Usage, Audit Logs, Settings"]
    ProjNav --> P1["Workspace (Overview, API Keys, Service Tokens)"]
    ProjNav --> P2["AI & Capabilities (Agents, Agent Playground, Skills, Tools, Plugins, MCP)"]
    ProjNav --> P3["Governance & Routing (Routing Policies, MCP Policies, AI Guardrails)"]
    ProjNav --> P4["Operations (Model Playground, Usage, Audit Logs)"]
    ProjNav --> P5["Settings (Project Settings)"]
```

### Auto-Expanding Workspace Context
When you select an active project (e.g., `Projects > Customer Copilot`), the sidebar highlights the active project tag (`slug: customer-copilot`) and reveals project-specific sections:
- **Workspace**: Access keys and service tokens scoped strictly to that project.
- **AI & Capabilities**: Configure autonomous agents, skill prompts, tool JSON schemas, and MCP connectors.
- **Governance & Routing**: Define model cascades (`smart`, `fast`), failovers, and safety guardrails.
- **Operations**: Direct model testing playgrounds, token usage graphs, and project-specific audit trails.

---

## Resource Hierarchy & Scope Isolation

Resources in Naagmani strictly adhere to a 3-tier boundary:

```mermaid
graph TD
    Org["Organization (Global Boundary)"]
    Org --> BYOK["BYOK Key Vault (Shared Credentials)"]
    Org --> Proj1["Project A (Customer Support)"]
    Org --> Proj2["Project B (Internal HR Tool)"]

    Proj1 --> E1["Environment: test"]
    Proj1 --> E2["Environment: production"]

    E1 --> K1["API Key (nak_test_...)"]
    E2 --> K2["API Key (nak_live_...)"]
    E2 --> R1["Routing Policy ('smart' -> DeepSeek + Claude)"]

    Proj2 --> E3["Environment: production"]
    E3 --> K3["API Key (nak_live_...)"]
    E3 --> R2["Routing Policy ('smart' -> GPT-4o)"]
```

1. **Strict Project Isolation**: API keys, service tokens, and routing policies created inside *Project A* cannot access or influence *Project B*.
2. **Environment Separation**: `test` environments maintain separate rate limits, token budgets, and test credentials from `production`.
3. **Inherited BYOK Credentials**: Projects seamlessly leverage organization-level upstream provider connections without developers needing raw provider secrets.

---

## Next Steps

Explore specific Developer Portal capabilities:
- [Organizations & Settings](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/organization/organizations.md)
- [Providers & BYOK Health](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/organization/providers.md)
- [Projects & Environments](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/projects/projects.md)
- [Smart Routing Policies](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/governance-routing/routing.md)
