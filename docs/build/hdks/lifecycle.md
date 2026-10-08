# Plugin Lifecycle & Execution Hooks

Understand the complete lifecycle of an HDK plugin process and the available execution hook phases.

---

## Worker Process Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Starting: Spawn Subprocess
    Starting --> Initializing: Send Handshake 'init'
    Initializing --> Healthy: Handshake ACK Received
    Healthy --> Executing: Inbound 'hook_event'
    Executing --> Healthy: Hook Response Returned
    Healthy --> Degraded: Health Check Timeout / Stderr Panic
    Degraded --> Terminating: Max Retries Exceeded
    Healthy --> Terminating: Config Reload / SIGTERM
    Terminating --> [*]: Process Exit
```

---

## Execution Hook Pipeline

```mermaid
flowchart TD
    Req[Client Request] --> H1[1. pre_auth: Validate custom auth tokens]
    H1 --> H2[2. pre_route: Inspect/rewrite requested model & prompt]
    H2 --> H3[3. pre_model_call: Modify payload right before upstream dispatch]
    H3 --> Upstream[(Upstream Model Execution)]
    Upstream --> H4[4. post_model_call: Inspect raw provider response]
    H4 --> H5[5. post_response: Redact output & enrich telemetry]
    H5 --> Resp[Client Response]
    
    Upstream -.->|Error Encountered| HE[on_error: Catch 429/5xx & trigger fallback]
```

---

## Hook Descriptions

| Hook Name | Execution Point | Primary Use Case |
|---|---|---|
| `pre_route` | Before routing policy resolution. | Prompt injection defense, PII masking, virtual alias rewrites. |
| `pre_model_call`| Immediately prior to upstream HTTP dispatch. | Injecting dynamic system prompts or few-shot examples. |
| `post_model_call`| When raw completion returns from upstream. | Measuring token counts, checking moderation flags. |
| `post_response` | Immediately before returning SSE stream or JSON to client. | DLP masking on output text, watermarking, response enrichment. |
| `on_error` | When an upstream provider returns an error (429/5xx). | Logging diagnostic traces or mutating failover candidates. |

---

## Related Documentation

- [HDK Overview](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/overview.md)
- [Plugin Development Guide](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/development.md)
