# Production Routing Strategies

Best practices for deploying advanced routing topologies in enterprise environments.

---

## 1. Weighted A/B Canary Routing

Gradually roll out a new frontier model or prompt revision to a fraction of your live traffic:

```yaml
routing_policy:
  alias: "smart-chat"
  strategy: "weighted"
  weights:
    - target: "openai/gpt-4o"
      weight: 90 # 90% traffic to stable baseline
    - target: "anthropic/claude-3-7-sonnet-20250219"
      weight: 10 # 10% canary traffic
```

---

## 2. Dynamic Latency Optimization

For interactive chat applications and real-time voice agents, Naagmani can route queries to the provider reporting the lowest Time-to-First-Token (TTFT) over the trailing 60-second window:

```yaml
routing_policy:
  alias: "voice-assistant"
  strategy: "lowest_latency"
  candidates:
    - "groq/llama-3.3-70b-versatile"
    - "cerebras/llama3.1-70b"
    - "google/gemini-2.5-flash"
```

---

## 3. Geographic Edge Routing

Deploy Naagmani Edge Gateway instances across multiple regions (US East, US West, Europe, Asia Pacific). Requests are routed to the nearest geographic edge node with regional provider endpoint connectivity to minimize network round-trips.
