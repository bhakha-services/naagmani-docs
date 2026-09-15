# Models & Aliases

Naagmani abstracts model identifiers using semantic aliases and virtual model targets, allowing applications to decouple prompt engineering from brittle model version strings.

---

## Model Naming Formats

Naagmani accepts three formats for the `model` parameter:

### 1. Direct Model Name
Target an explicit upstream model directly:
- `gpt-4o`
- `claude-3-7-sonnet-20250219`
- `deepseek-chat`
- `gemini-2.5-pro`

### 2. Provider-Prefixed Model
Disambiguate models when multiple providers host identical open-weights models:
- `openai/gpt-4o`
- `anthropic/claude-3-5-sonnet`
- `groq/llama-3.3-70b-versatile`
- `deepseek/deepseek-reasoner`

### 3. Virtual Model Aliases (Recommended)
Use logical tier aliases configured in your project dashboard or policy:
- `smart` → Dynamically routes to the best frontier reasoning model (e.g., Claude 3.7 Sonnet or GPT-4o).
- `fast` → Dynamically routes to low-latency models (e.g., Gemini 2.5 Flash, Claude 3.5 Haiku, GPT-4o mini).
- `economy` → Routes to cost-optimized high-throughput endpoints.
- `code` → Routes to models optimized for code completion and syntax correctness.

---

## Model Capabilities Mapping

Naagmani normalizes capabilities across models so clients do not need custom payload translation:

| Capability | Supported Providers / Models | Normalization Behavior |
| :--- | :--- | :--- |
| **Tool / Function Calling** | OpenAI, Anthropic, Gemini, Mistral | Standardized JSON Schema definition and call structure. |
| **Structured Outputs** | OpenAI, Anthropic, Gemini | Enforced via provider-native schema constraints or grammar filtering. |
| **Streaming (SSE)** | All supported providers | Standardized OpenAI-compatible server-sent events (`data: {...}`). |
| **Vision / Multimodal** | GPT-4o, Claude 3.5/3.7, Gemini 2.5 | Normalized image URLs and base64 payloads. |
| **Reasoning / Thinking Tokens** | o1, o3-mini, Claude 3.7 (thinking), DeepSeek-R1 | Preserved or separated into dedicated `reasoning_content` blocks. |

---

## Model Deprecation & Lifecycle

When an upstream provider deprecates a model snapshot:
1. Virtual model aliases automatically transition to the recommended successor without code changes.
2. Naagmani logs deprecation warnings in your request telemetry headers:
   `X-Naagmani-Warning: Model 'gpt-4-0613' is deprecated upstream.`
