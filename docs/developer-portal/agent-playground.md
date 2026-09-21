# Agent Playground & Interactive Testing

The **Agent Playground** provides a sandbox environment to test autonomous agent reasoning loops, multi-turn conversations, tool executions, and skill behaviors in real-time before deploying to production.

---

## 1. Features & Capabilities

- **Interactive Multi-Turn Chat**: Test complex conversational flows with state persistence.
- **Live Tool Invocation Inspector**: Inspect JSON-RPC tool parameters emitted by the LLM, sandbox execution results, and latency metrics in real-time.
- **Skill Activation & Testing**: Toggle project-bound skills and observe how agent reasoning changes.
- **Streaming & Token Telemetry**: Observe first-token latency (TTFT), completion tokens, and estimated FinOps cost per turn.

---

## 2. Using the Agent Playground

1. Navigate to **Projects** $\rightarrow$ `[Your Project]` $\rightarrow$ **Agent Playground** (`/projects/[projectId]/playground`).
2. Select the target **Environment** (e.g., Development, Production) and **Model Provider**.
3. Choose the active **Skills** and **MCP Tools** you wish to expose to the agent during this session.
4. Input your test prompt and click **Send**.
5. Inspect the generated tool calls and responses in the side drawer.

---

## 3. Related Documentation

- [Tools Architecture & Working Flow](./tools.md)
- [Agent Skills & Orchestration](./skills.md)
- [Model Context Protocol (MCP) Servers](./mcp-servers.md)
