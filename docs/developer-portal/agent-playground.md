# Agent Playground & Interactive Testing

The **Agent Playground** provides an interactive execution testbed to debug autonomous agents, inspect tool invocations, and observe reasoning steps before deploying to production.

- **Portal Page**: `/projects/[projectId]/playground`

```mermaid
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
```

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
