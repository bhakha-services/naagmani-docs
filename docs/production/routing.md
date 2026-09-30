# Traffic Routing Strategies

Naagmani supports versatile routing policies tailored to specific organizational goals.

---

## Routing Modes

| Strategy | Description | Best For |
| :--- | :--- | :--- |
| **Lowest Cost** | Automatically selects the cheapest model capable of handling the prompt context. | Batch processing, ETL classification. |
| **Lowest Latency** | Dispatches to the provider with the fastest recent TTFT (Time To First Token). | Real-time chat, autocomplete. |
| **Priority Fallback** | Tries primary provider first, cascading sequentially down fallback list. | Enterprise reliability. |
| **Weighted Round-Robin** | Distributes load proportionately across multiple keys or providers (e.g. 70/30 split). | Canary testing, A/B model evaluations. |

Configure policies in the Portal:
- **Routing Policies**: [{{DEVELOPER_PORTAL_URL}}/routing-policies]({{DEVELOPER_PORTAL_URL}}/routing-policies)

---

## Next Steps

- [Observability & Metrics](/docs/production/observability)
