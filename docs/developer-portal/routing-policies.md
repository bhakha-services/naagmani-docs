# Smart Routing Policies

Create visual routing rules and automated fallback cascades to ensure 99.99% availability and cost optimization for your AI workloads.

- **Portal Page**: `/projects/[projectId]/routing-policies`

```mermaid
graph TD
    Rule["Routing Policy: Production Flagship"]
    Rule --> P1["Primary: Anthropic claude-3-5-sonnet"]
    Rule -->|Fallback on 5xx / Overload| P2["Secondary: OpenAI gpt-4o"]
    Rule -->|Fallback on Timeout| P3["Tertiary: Google gemini-2.5-flash"]
```

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
