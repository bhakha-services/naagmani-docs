---
title: "Autonomous Agents & Assistants"
description: "Configure, orchestrate, and deploy multi-turn LLM agents with tools, skills, and guardrails in Naagmani."
---

# Autonomous Agents & Assistants

Naagmani provides a complete lifecycle framework for designing, evaluating, and operating autonomous AI agents in production. Agents in Naagmani combine Large Language Models (LLMs) with skills, tools, MCP servers, and governance guardrails to handle multi-step reasoning and complex automation.

---

## What is a Naagmani Agent?

An **Agent** is a stateful orchestration entity configured within a Project. Unlike single-turn LLM completions, an agent possesses:

- **Identity & Persona**: Configured via system instructions, persona prompts, and domain guidelines.
- **Model Intelligence**: Backed by any foundational model configured in your provider credential pool (e.g., GPT-4o, Claude 3.5 Sonnet, DeepSeek-V3).
- **Tool Access**: Direct access to local function schemas, REST API endpoints, and remote Model Context Protocol (MCP) servers.
- **Dynamic Skills**: Curated prompt workflows and step-by-step routines for specific tasks.
- **Policy Enforcement**: Built-in limits for maximum iterations, tool execution timeouts, token budgets, and output guardrails.

---

## Agent Architecture

```
[User / Application Request]
             │
             ▼
    ┌─────────────────┐
    │  Agent Runtime  │ ◄── [System Prompt & Memory]
    └────────┬────────┘
             │ (Reasoning loop)
    ┌────────▼────────┐
    │  Model Engine   │ ◄── [Provider Credential Pools]
    └────────┬────────┘
             │ (Tool Call Decisions)
    ┌────────▼────────────────────────────────────┐
    │              Execution Layer                │
    ├──────────────┬───────────────┬──────────────┤
    │ Local Tools  │  MCP Servers  │ Custom Skills│
    └──────────────┴───────────────┴──────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Governance Gate │ ◄── [PII, Cost, Guardrails]
    └────────┬────────┘
             │
             ▼
    [Agent Response & Action Output]
```

---

## Core Capabilities

### 1. Multi-Turn Reasoning
Agents iterate through thought-action-observation cycles. If a tool call fails or produces partial results, the agent evaluates the error and adjusts its approach autonomously.

### 2. Guardrails & Limits
Prevent infinite loops and runaway costs by setting strict thresholds:
- **Max Iterations**: Restrict how many decision cycles an agent can execute per invocation (e.g., 5-10 turns).
- **Max Tool Calls**: Cap total API requests per task.
- **Timeout**: Set maximum execution time in seconds.
- **Cost / Token Caps**: Limit consumption per task.

### 3. Integrated Tool Calling & MCP
Agents automatically receive definitions of registered Tools and connected MCP servers in standard JSON schema format, compatible with OpenAI, Anthropic, and Gemini function calling specs.

---

## Testing in Agent Playground

You can interactively test and debug your agents in the **Agent Playground**:
1. Navigate to **Projects** > **[Your Project]** > **Agent Playground**.
2. Select the target agent or configure transient parameters.
3. Test tool triggers, inspect raw function call requests and responses, and verify token usage in real time.

---

## Managing Agents in the Developer Portal

In the Developer Portal under **Projects > Agents**, you can:
- View all active and archived agents for your project.
- Inspect attached tools, skills, and model configurations.
- Launch directly into the **Agent Playground** to run simulated user conversations.
- Audit run histories and token metrics in the project analytics.
