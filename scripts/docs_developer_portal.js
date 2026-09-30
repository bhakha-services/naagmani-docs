const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const docsDir = path.resolve(__dirname, '../docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsDir, relPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`[Developer Portal] Updated: ${relPath}`);
}

// 1. Overview
writeDoc('developer-portal/overview.md', `
# Developer Portal Overview & Navigation

The **Naagmani Developer Portal** is the centralized web management console for managing AI infrastructure, credentials, routing policies, autonomous agents, and FinOps governance.

- **Local Development URL**: [{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}})
- **Production Hosted URL**: [{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}})

\`\`\`mermaid
graph TD
    Portal["Developer Portal Navigation"]
    Portal --> OrgMgmt["Organization Level (Members, Settings, Billing, FinOps)"]
    Portal --> ProjMgmt["Project Level (Agents, Skills, Tools, MCP, Service Tokens)"]
    Portal --> Observability["Global Observability (Provider Attempts, Audit Logs)"]
\`\`\`

---

## Portal Navigation Layout

### 1. Top Navigation Bar
- **Organization Selector**: Switch between team organizations seamlessly.
- **Project Selector**: Choose your active project workspace.
- **Documentation & User Menu**: Quick access to documentation links and user profile settings.

### 2. Organization Sidebar (Global Scope)
- **Dashboard**: High-level platform health, aggregate token velocity, and active projects.
- **Projects**: Manage project workspaces across your company.
- **Members**: Manage team members, RBAC roles, and individual monthly spending caps.
- **Usage & FinOps**: Organization-wide token metering, budget limits, and cost analytics.
- **Provider Attempts**: Real-time upstream dispatch trace inspector and retry cascade logs.
- **Audit Logs**: Immutable security compliance event trail.

### 3. Project Sidebar (Scoped Workload)
- **Agents**: Autonomous AI assistants, system prompts, and tool bindings.
- **Agent Playground**: Interactive testbed for debugging agent reasoning steps and tool calls.
- **Skills & Tools**: Reusable prompt skills and custom HTTP/gRPC tool schemas.
- **MCP Servers & Policies**: External Model Context Protocol integrations and security guardrails.
- **Model Playground**: Side-by-side model comparison, latency benchmarking, and token accounting.
- **Service Tokens**: Scoped machine-to-machine credentials.

---

## Next Steps

- Manage team members: [Members & Access Control](members.md)
- Issue service tokens: [Project Service Tokens Guide](service-tokens.md)
- Build autonomous agents: [Autonomous Agents & Assistants](agents.md)
`);

// 2. Members & Access Control
writeDoc('developer-portal/members.md', `
# Members & Access Control

Manage team members, assign Role-Based Access Control (RBAC) permissions, and enforce individual spending limits directly in the Developer Portal.

- **Portal Page**: [{{DEVELOPER_PORTAL_URL}}/members]({{DEVELOPER_PORTAL_URL}}/members)

\`\`\`mermaid
graph LR
    Owner["Owner (Billing & Deletion)"] --> Admin["Admin (Projects & Tokens)"]
    Admin --> Member["Member (Playgrounds & Inference)"]
\`\`\`

---

## Member Roles & Permissions

| Permission | Owner | Admin | Member |
| :--- | :---: | :---: | :---: |
| Delete Organization | Yes | No | No |
| Manage Billing & Org Budget | Yes | No | No |
| Invite Members & Update Roles | Yes | Yes | No |
| Create & Delete Projects | Yes | Yes | No |
| Create Project Service Tokens | Yes | Yes | Yes |
| Use Playgrounds & Inference | Yes | Yes | Yes |

---

## Setting Member-Specific Spending Limits

1. Navigate to the **Members** page at [{{DEVELOPER_PORTAL_URL}}/members]({{DEVELOPER_PORTAL_URL}}/members).
2. Click on a member to open their **Member Detail Profile** (e.g. \`/members/mbr_123...\`).
3. Under the **Spending Budget & Hierarchy Governance** card, click **Modify Member Budget**.
4. Enter the desired **Monthly Limit Amount** (e.g. \`$200.00\`).
5. Click **Save Budget**.

> [!NOTE]
> **Hierarchy Rule Enforcement**  
> A member's spending limit cannot exceed the parent Organization's monthly limit. If the organization budget is $3,000, setting a member cap of $30,000 will be cleanly rejected.

---

## Next Steps

- Issue machine credentials: [Project Service Tokens](service-tokens.md)
- View organization FinOps: [FinOps & Budget Controls](finops-budgets.md)
`);

// 3. Service Tokens in Portal
writeDoc('developer-portal/service-tokens.md', `
# Project Service Tokens Guide

Generate, scope, and manage machine-to-machine credentials for backend microservices and autonomous agents in the Developer Portal.

- **Portal Page**: \`/projects/[projectId]/service-tokens\` (e.g. [{{DEVELOPER_PORTAL_URL}}/projects]({{DEVELOPER_PORTAL_URL}}/projects))

\`\`\`mermaid
graph TD
    Create["Click + Create Service Token"] --> Config["Configure Name, Environment & Capabilities"]
    Config --> SetTTL["Select Expiration (30d, 90d, Custom)"]
    SetTTL --> Attribute["Optional: Attribute to Member"]
    Attribute --> Issue["Generate & Copy nst_live_..."]
\`\`\`

---

## How to Create a Service Token

1. Open your target **Project** in the Developer Portal.
2. In the project sidebar, select **Service Tokens**.
3. Click the **+ Create Service Token** button.
4. Fill in the token configuration:
   - **Token Name**: A descriptive label (e.g. \`order-processing-worker\`).
   - **Environment**: Select \`Development\`, \`Staging\`, or \`Production\`.
   - **Capabilities**: Choose allowed operations (\`inference:chat\`, \`tools:execute\`, \`mcp:access\`).
   - **Expiration (TTL)**: Select a duration (30 days, 90 days, or Never Expire).
   - **Member Attribution**: Optionally link this token to an engineer for personal budget metering.
5. Click **Generate Token**.
6. Copy the issued token (\`nst_live_...\`) immediately.

---

## Revoking a Compromised Token

If a token is exposed or no longer needed:
1. Locate the token in the **Service Tokens** table.
2. Click the **Revoke** action button.
3. Confirm revocation. The token is immediately blocked across all gateway data planes.

---

## Next Steps

- Understand token mechanics: [Project Service Tokens Concept](../concepts/project-service-tokens.md)
- API Reference: [Service Tokens API](../api/service-tokens.md)
`);

// 4. Autonomous Agents
writeDoc('developer-portal/agents.md', `
# Autonomous Agents & Assistants

Build, configure, and deploy autonomous AI agents capable of reasoning, calling tools, and querying external data sources.

- **Portal Page**: \`/projects/[projectId]/agents\`

\`\`\`mermaid
graph TD
    Agent["Autonomous Agent (Support Bot)"]
    Agent --> LLM["Model & Parameters (claude-3-5-sonnet, Temp: 0.2)"]
    Agent --> Prompt["System Instructions & Persona"]
    Agent --> Skills["Attached Skills (Search KnowledgeBase)"]
    Agent --> Tools["Bound Tools & MCP Servers (SQL, GitHub)"]
    Agent --> Guard["Guardrail Policies (PII Redaction)"]
\`\`\`

---

## Agent Configuration Parameters

1. **System Prompt**: Defines the core identity, reasoning guidelines, and behavioral boundaries for the agent.
2. **Model Selection**: Choose specific models or virtual tier aliases (e.g., \`smart-tier\` for reasoning).
3. **Temperature & Top-P**: Fine-tune determinism vs creativity.
4. **Tool Attachments**: Bind registered custom tools or external MCP server capabilities.
5. **Skill Attachments**: Attach structured few-shot prompt templates and operational skills.

---

## Testing in the Playground

Once configured, click **Open in Playground** to interactively test the agent's multi-turn reasoning and tool invocation trace.

---

## Next Steps

- Test agents interactively: [Agent Playground](agent-playground.md)
- Register custom tools: [Tools & Working Flow](tools.md)
- Connect MCP servers: [MCP Servers & Transports](mcp-servers.md)
`);

// 5. Agent Playground
writeDoc('developer-portal/agent-playground.md', `
# Agent Playground & Interactive Testing

The **Agent Playground** provides an interactive execution testbed to debug autonomous agents, inspect tool invocations, and observe reasoning steps before deploying to production.

- **Portal Page**: \`/projects/[projectId]/playground\`

\`\`\`mermaid
sequenceDiagram
    actor Dev as Developer
    participant PG as Agent Playground
    participant Agent as Autonomous Agent
    participant Tool as Bound Tool (e.g. DB Query)

    Dev->>PG: Send Prompt: "What was customer #102's last order?"
    PG->>Agent: Execute Agent Reasoning Loop
    Agent-->>PG: Generate Thought: "I need to call query_customer_orders"
    PG->>Tool: Execute Tool {"customerId": 102}
    Tool-->>PG: Return Tool Output {"orderId": "ord_99", "amount": "$45.00"}
    PG->>Agent: Feed Tool Output back to Model
    Agent-->>PG: Synthesize Final Response
    PG-->>Dev: Display Formatted Message + Tool Trace Ladder
\`\`\`

---

## Key Features

1. **Multi-Turn Chat History**: Test conversation continuity and context memory.
2. **Execution Step Inspector**: View exact tool arguments, raw tool responses, and model thoughts.
3. **Parameter Overrides**: Tweak temperature, max tokens, and system instructions on the fly.
4. **Token & Latency Accounting**: Real-time display of tokens consumed during multi-step tool calls.

---

## Next Steps

- Define agent skills: [Skills & Orchestration](skills.md)
- Connect MCP tools: [MCP Servers & Transports](mcp-servers.md)
`);

// 6. Skills
writeDoc('developer-portal/skills.md', `
# Agent Skills & Orchestration

**Skills** are modular, reusable behavioral units that teach autonomous agents how to perform specialized workflows.

- **Portal Page**: \`/projects/[projectId]/skills\`

\`\`\`mermaid
graph LR
    Skill["Skill: Order Refund Specialist"]
    Skill --> Rules["Policy Rules (Refunds < $100 auto-approved)"]
    Skill --> Templates["Structured Few-Shot Prompt Templates"]
    Skill --> Tools["Required Tools (Stripe API, CRM)"]
\`\`\`

---

## Anatomy of a Skill

1. **Name & Identifier**: Unique slug (e.g. \`customer-refund-workflow\`).
2. **System Prompt Addendum**: Specialized instructions appended to the agent's base system prompt.
3. **Few-Shot Examples**: Representative input/output pairs demonstrating desired reasoning quality.
4. **Required Tool Capabilities**: List of tools that must be present for the skill to execute.

---

## Next Steps

- Register custom tools: [Tools & Working Flow](tools.md)
- Build agents: [Autonomous Agents & Assistants](agents.md)
`);

// 7. Tools
writeDoc('developer-portal/tools.md', `
# Tools Architecture & Working Flow

**Tools** allow AI models and autonomous agents to interact with external databases, APIs, and microservices via standard JSON Schema function calling.

- **Portal Page**: \`/projects/[projectId]/tools\`

\`\`\`mermaid
graph TD
    LLM["Model (Needs Customer Data)"] -->|tool_call: get_customer_by_id| GW["Naagmani Tool Engine"]
    GW --> Validate{"Validate Parameters against JSON Schema"}
    Validate -->|Valid| Execute["Execute Target HTTP / gRPC Endpoint"]
    Validate -->|Invalid| Error["Return Schema Validation Error to Model"]
    Execute --> Result["Inject Tool Output into Conversation Context"]
\`\`\`

---

## Tool Definition Format

Every tool in Naagmani is defined with standard JSON Schema parameter specifications:

\`\`\`json
{
  "name": "fetch_user_account",
  "description": "Fetches a user account and subscription status by email.",
  "parameters": {
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "format": "email",
        "description": "The user's registered email address."
      },
      "include_billing": {
        "type": "boolean",
        "description": "Whether to return active subscription and invoice history."
      }
    },
    "required": ["email"]
  },
  "endpoint": {
    "url": "https://internal-api.example.com/v1/users",
    "method": "POST"
  }
}
\`\`\`

---

## Next Steps

- Integrate Model Context Protocol: [MCP Servers & Transports](mcp-servers.md)
- Enforce tool access policies: [MCP Tool Policies](mcp-policies.md)
`);

// 8. MCP Servers
writeDoc('developer-portal/mcp-servers.md', `
# Model Context Protocol (MCP) Servers

Naagmani provides first-class support for the **Model Context Protocol (MCP)**, the open standard for connecting AI agents to external tools, databases, and enterprise data sources.

- **Portal Page**: \`/projects/[projectId]/mcp-servers\`

\`\`\`mermaid
graph TD
    Agent["Autonomous Agent"] --> NaagmaniMCP["Naagmani MCP Gateway"]
    NaagmaniMCP --> S1["Filesystem MCP Server (stdio)"]
    NaagmaniMCP --> S2["PostgreSQL / SQLite MCP Server (Stream)"]
    NaagmaniMCP --> S3["GitHub / Jira Enterprise MCP Server (SSE)"]
\`\`\`

---

## Supported MCP Transports

| Transport | Description | Best For |
| :--- | :--- | :--- |
| **\`stdio\`** | Standard input/output process pipes. | Local tools, developer CLI tools, sandboxed binaries. |
| **\`sse\`** | Server-Sent Events over HTTP. | Remote cloud tools, web services, SaaS integrations. |
| **\`stream\`** | Raw bidirectional TCP/HTTP streaming. | High-throughput enterprise microservices. |

---

## Connecting an MCP Server

1. Navigate to **MCP Servers** in your active Project.
2. Click **+ Connect MCP Server**.
3. Select the transport type (\`stdio\`, \`sse\`, or \`stream\`).
4. Enter connection parameters (e.g. command path or SSE endpoint URL).
5. Click **Connect & Discover Tools**. Naagmani will query the server and register all exposed tools automatically.

---

## Next Steps

- Define security policies: [MCP Tool Policies](mcp-policies.md)
- Test in playground: [Agent Playground](agent-playground.md)
`);

// 9. MCP Policies
writeDoc('developer-portal/mcp-policies.md', `
# MCP Tool Policies & Enterprise Governance

Enforce granular security guardrails, allowlists, and execution approval workflows on tools exposed via Model Context Protocol (MCP) servers.

- **Portal Page**: \`/projects/[projectId]/mcp-policies\`

\`\`\`mermaid
graph LR
    ToolCall["Agent Tool Call (drop_table)"] --> PolicyEngine["Naagmani MCP Policy Engine"]
    PolicyEngine --> Check{"Policy Decision"}
    Check -->|Allowed| Exec["Execute Tool"]
    Check -->|Blocked| Block["Reject (HTTP 403 Security Policy)"]
    Check -->|Requires Approval| Notify["Pause & Notify Human Reviewer"]
\`\`\`

---

## Policy Types

1. **Tool Allowlists & Blocklists**: Explicitly allow or prohibit specific tools (e.g. allow \`read_file\`, block \`delete_file\`).
2. **Parameter Constraints**: Restrict tool parameters (e.g., limit SQL queries to \`SELECT\` statements only).
3. **Human-in-the-Loop Approvals**: Pause destructive tool executions until an administrator approves the action.
4. **Rate Limiting**: Cap the number of times an agent can invoke a specific tool per minute.

---

## Next Steps

- Configure content guardrails: [AI Guardrails & Governance](guardrails.md)
- View security audit trail: [Security Audit Logs](audit-logs.md)
`);

// 10. AI Guardrails & Governance
writeDoc('developer-portal/guardrails.md', `
# AI Guardrails & Content Governance

Protect your applications from prompt injection, sensitive data leakage (PII/DLP), and toxic content using Naagmani's multi-layered guardrail pipeline.

- **Portal Page**: \`/projects/[projectId]/governance\`

\`\`\`mermaid
graph LR
    Prompt["User Prompt"] --> PII["PII / DLP Anonymizer (SSN, Credit Card)"]
    PII --> PromptShield["Prompt Injection Defense"]
    PromptShield --> Model["LLM Inference Engine"]
    Model --> Toxicity["Output Toxicity & Compliance Filter"]
    Toxicity --> Response["Safe Response to User"]
\`\`\`

---

## Active Guardrail Filters

1. **PII Masking & Redaction**: Automatically redacts social security numbers, credit card details, phone numbers, and email addresses before sending prompts upstream.
2. **Prompt Injection & Jailbreak Defense**: Detects adversarial jailbreak techniques and overrides.
3. **Output Content Moderation**: Scans model responses for hate speech, violence, and proprietary corporate secrets.

---

## Next Steps

- Build model routing rules: [Smart Routing Policies](routing-policies.md)
- Review audit logs: [Security Audit Logs](audit-logs.md)
`);

// 11. Model Playground
writeDoc('developer-portal/model-playground.md', `
# Model Playground & Prompt Engineering

The **Model Playground** allows engineers to compare foundational models side-by-side, inspect streaming latency (TTFT), and evaluate cost efficiency.

- **Portal Page**: \`/projects/[projectId]/model-playground\`

---

## Features

- **Side-by-Side Comparison**: Run the same prompt simultaneously against GPT-4o, Claude 3.5 Sonnet, Gemini 2.5 Flash, and DeepSeek R1.
- **Latency & TTFT Metrics**: Real-time adapter duration and time-to-first-token benchmarking.
- **Token Breakdown & Cost Estimation**: Exact prompt tokens, completion tokens, and calculated cost in USD.
- **Code Export**: Export your tested prompt and parameter settings directly to cURL, TypeScript, or Python code.

---

## Next Steps

- Test autonomous agents: [Agent Playground](agent-playground.md)
- Configure provider keys: [BYOK & Credential Pools](credential-pools.md)
`);

// 12. Credential Pools
writeDoc('developer-portal/credential-pools.md', `
# BYOK & Credential Pools

Store your direct commercial provider credentials securely in the **Bring-Your-Own-Key (BYOK)** encrypted vault and configure failover pools.

- **Portal Page**: [{{DEVELOPER_PORTAL_URL}}/providers]({{DEVELOPER_PORTAL_URL}}/providers)

\`\`\`mermaid
graph TD
    Pool["OpenAI Credential Pool"]
    Pool --> Key1["Primary API Key (Account A) - Weight 80%"]
    Pool --> Key2["Secondary API Key (Account B) - Weight 20%"]
\`\`\`

---

## Configuring Provider Credentials

1. Navigate to **Providers** in the Developer Portal ([{{DEVELOPER_PORTAL_URL}}/providers]({{DEVELOPER_PORTAL_URL}}/providers)).
2. Click on the desired provider (e.g. **OpenAI**, **Anthropic**, **Google**, or **DeepSeek**).
3. Enter your provider API Key and optional Organization ID.
4. Click **Connect Provider**.
5. Keys are encrypted with AES-256-GCM.

---

## Next Steps

- Configure routing cascades: [Smart Routing Policies](routing-policies.md)
- View attempt telemetry: [Provider Attempt Accounting](attempts.md)
`);

// 13. Routing Policies
writeDoc('developer-portal/routing-policies.md', `
# Smart Routing Policies

Create visual routing rules and automated fallback cascades to ensure 99.99% availability and cost optimization for your AI workloads.

- **Portal Page**: \`/projects/[projectId]/routing-policies\`

\`\`\`mermaid
graph TD
    Rule["Routing Policy: Production Flagship"]
    Rule --> P1["Primary: Anthropic claude-3-5-sonnet"]
    Rule -->|Fallback on 5xx / Overload| P2["Secondary: OpenAI gpt-4o"]
    Rule -->|Fallback on Timeout| P3["Tertiary: Google gemini-2.5-flash"]
\`\`\`

---

## Creating a Routing Policy

1. Navigate to **Routing Policies** in your active Project.
2. Click **+ Create Routing Policy**.
3. Select a strategy:
   - **Priority Fallback Cascade**: Ordered list of models.
   - **Lowest Cost**: Dynamic routing to the lowest $/token provider.
   - **Lowest Latency**: Dynamic routing to the fastest TTFT provider.
4. Define health thresholds and cooldown timeouts.
5. Click **Deploy Policy**.

---

## Next Steps

- View execution traces: [Provider Attempt Accounting](attempts.md)
- Review FinOps controls: [FinOps & Budget Controls](finops-budgets.md)
`);

// 14. Provider Attempt Accounting (Inspector Drawer)
writeDoc('developer-portal/attempts.md', `
# Provider Attempt Accounting & Trace Inspector

Inspect granular upstream dispatch attempts, Time to First Token (TTFT), token breakdowns, and step-by-step failover cascade ladders.

- **Portal Page**: [{{DEVELOPER_PORTAL_URL}}/attempts]({{DEVELOPER_PORTAL_URL}}/attempts)

\`\`\`mermaid
graph LR
    Table["Attempts Table (Real-Time Dispatches)"] -->|Click Row or Cascade Chain| Drawer["Slide-Over Trace Inspector Drawer"]
    Drawer --> Flow["Cascade Flow (Hop 1 -> Hop 2)"]
    Drawer --> Metrics["Duration, TTFT, Tokens & COGS"]
    Drawer --> Diagnostics["Sanitized Upstream Error Diagnostics"]
\`\`\`

---

## Features & Capabilities

### 1. Unified Dispatch Table
- **Attempt & Logical Request ID**: Click to copy IDs instantly.
- **Provider & Model**: Identifies whether the request used Server-Sent Events (SSE) streaming.
- **Status & Latency**: Succeeded, Failed, or Stream Interrupted with exact millisecond duration and TTFT.
- **Token Accounting**: Prompt tokens, Completion tokens, and calculated Cost of Goods Sold (COGS).

### 2. Slide-Over Trace Inspector Drawer
Clicking any row or the **Inspect / Cascade Chain** button slides open the right-hand Inspector Drawer:
- **Direct 1-Hop Execution**: Clean card for single direct dispatches.
- **Multi-Hop Failover Ladder**: Interactive step-by-step ladder showing which provider failed, the exact failure reason (e.g. \`HTTP 529 Upstream Overload\`), and the secondary provider that succeeded.
- **Diagnostic Panel**: Full sanitized provider error messages and request identifiers.

---

## Next Steps

- API Reference: [Provider Attempts API](../api/attempts.md)
- Explore FinOps: [FinOps & Budget Controls](finops-budgets.md)
`);

// 15. FinOps & Budget Controls
writeDoc('developer-portal/finops-budgets.md', `
# FinOps & Budget Controls

Monitor organization-wide spending velocity, enforce multi-tier budget caps, and analyze cost breakdowns across projects and members.

- **Portal Page**: [{{DEVELOPER_PORTAL_URL}}/usage]({{DEVELOPER_PORTAL_URL}}/usage)

\`\`\`mermaid
graph TD
    FinOps["FinOps Hub"]
    FinOps --> Summary["Real-Time Summary (Spent, Limit, Remaining, Health)"]
    FinOps --> Trends["Token & Cost Velocity Charts"]
    FinOps --> Caps["Hierarchical Budget Caps (Org -> Project -> Member)"]
\`\`\`

---

## Setting Organization & Project Budgets

1. Navigate to the **Usage & FinOps** hub at [{{DEVELOPER_PORTAL_URL}}/usage]({{DEVELOPER_PORTAL_URL}}/usage).
2. Click **+ Create Budget Target**.
3. Select your budget scope (**Organization**, **Project**, or **Environment**).
4. Set your **Monthly Limit** (e.g. \`$5,000.00\`) and alert notification threshold (e.g. \`80%\`).
5. Click **Deploy Budget**.

---

## Next Steps

- Manage member limits: [Members & Access Control](members.md)
- API Reference: [FinOps & Budgets API](../api/budgets.md)
`);

// 16. Audit Logs
writeDoc('developer-portal/audit-logs.md', `
# Security Audit Logs

Naagmani maintains an immutable compliance audit trail capturing every administrative event, credential modification, and security policy evaluation.

- **Portal Page**: [{{DEVELOPER_PORTAL_URL}}/audit-logs]({{DEVELOPER_PORTAL_URL}}/audit-logs)

---

## Tracked Event Types

- **Authentication**: \`login.success\`, \`login.failure\`, \`password.reset\`.
- **Credentials**: \`api_key.created\`, \`api_key.revoked\`, \`service_token.created\`, \`service_token.revoked\`.
- **Members**: \`member.created\`, \`member.role_updated\`, \`member.budget_modified\`.
- **Providers & Vault**: \`provider.created\`, \`provider.updated\`, \`vault.accessed\`.
- **Guardrails & Security**: \`rate_limit.triggered\`, \`policy.violation\`, \`dlp.redacted\`.

---

## Filtering Audit Events

Use the interactive filter drawer to search events by **Actor User/Token**, **Event Type**, **HTTP Status**, and **Time Window**.

---

## Next Steps

- Security architecture: [Security & Governance](../security/overview.md)
`);

// 17. CLI Developer Workflow
writeDoc('developer-portal/cli-workflow.md', `
# Naagmani CLI Developer Guide

Integrate Naagmani directly into terminal workflows, CI/CD pipelines, and local developer environments using the official Naagmani CLI.

---

## Installation

\`\`\`bash
# Install via Go
go install github.com/bhakha-services/naagmani-cli/cmd/naagmani@latest

# Or download binary release
curl -sSL https://get.naagmani.app | bash
\`\`\`

---

## Core Workflows

\`\`\`bash
# 1. Log into your Naagmani Organization
naagmani auth login

# 2. List your projects
naagmani projects list

# 3. Create a scoped Project Service Token
naagmani tokens create --project "support-ai" --env "production" --name "ci-token"

# 4. Test an inference request
naagmani chat --model "gpt-4o" --prompt "Hello from CLI!"
\`\`\`

---

## Next Steps

- Full CLI command reference: [CLI Commands Reference](../cli/commands.md)
- CLI troubleshooting: [CLI Troubleshooting](../cli/troubleshooting.md)
`);

console.log('Finished writing Developer Portal documentation.');
