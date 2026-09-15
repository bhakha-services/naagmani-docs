# Plugin Hooks

Hooks are explicit interception points during request processing where plugins can inspect, transform, augment, or abort an AI workflow.

---

## Available Lifecycle Hooks

| Hook Name | Stage | Input Payload | Can Modify? | Common Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `pre_prompt` | Before upstream LLM call | Messages, Tools, Model parameters | **Yes** | DLP sanitization, RAG context injection, prompt injection defense. |
| `post_generation` | After upstream LLM response | Generated Choices, Tool Calls, Usage | **Yes** | Hallucination checks, output secret masking, format enforcement. |
| `on_error` | Upon upstream or pipeline failure | Error code, Error message, Context | No | Alerting, audit logging, custom error translation. |

---

## Hook Signatures & Behaviors

### 1. `pre_prompt`
Executed immediately after client authentication and policy validation, before sending the request to the upstream AI provider.

- **Action Options**:
  - `pass`: Allow request to proceed unchanged.
  - `modify`: Return updated `messages`, `tools`, or `temperature`.
  - `abort`: Block the request immediately with a custom error code and message.

### 2. `post_generation`
Executed immediately after the upstream provider finishes generating the response (or after the final stream token has completed).

- **Action Options**:
  - `pass`: Allow generated response to return to client unchanged.
  - `modify`: Return scrubbed or transformed response content.
  - `abort`: Intercept output (e.g. if proprietary source code or PII was generated) and replace with a safety notice.

### 3. `on_error`
Executed whenever an upstream provider returns a non-retryable error or a timeout occurs.
- Used primarily by observability, telemetry, and monitoring plugins.
