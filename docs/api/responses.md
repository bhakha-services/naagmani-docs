# Responses API

The `/v1/responses` endpoint provides an advanced, model-agnostic inference interface supporting extended thinking blocks, multi-step orchestration state, and explicit plugin pipeline bindings.

---

## Overview

While `/v1/chat/completions` provides 100% drop-in compatibility with the OpenAI schema, `/v1/responses` exposes enhanced Naagmani runtime features:

- Explicit extraction of `reasoning_content` (thinking tokens) from reasoning models (o1, DeepSeek-R1, Claude 3.7 Sonnet Extended Thinking).
- Execution trace metadata (plugin hook latencies, DLP sanitization markers).
- Direct MCP tool invocation orchestration.

---

## Endpoint Details

- **Method**: `POST`
- **Path**: `/v1/responses`
- **Content-Type**: `application/json`

---

## Request Format

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "input": [
    {
      "role": "user",
      "content": "Solve the mathematical proof for infinite primes."
    }
  ],
  "reasoning": {
    "enabled": true,
    "budget_tokens": 4096
  },
  "plugins": {
    "pipeline": ["dlp-sanitizer", "rag-retriever"],
    "options": {
      "dlp": { "mask_pii": true }
    }
  }
}
```

---

## Response Format

```json
{
  "id": "resp_01j8m9n2b7v6c5x4z3",
  "object": "response",
  "created": 1726401600,
  "model": "claude-3-7-sonnet-20250219",
  "output": {
    "role": "assistant",
    "content": "Euclid's proof of the infinitude of primes proceeds by contradiction...",
    "reasoning_content": "Let S be the finite set of all prime numbers {p_1, p_2, ..., p_n}..."
  },
  "telemetry": {
    "provider": "anthropic",
    "latency_ms": 1420,
    "plugins_executed": [
      { "id": "dlp-sanitizer", "latency_ms": 3, "status": "ok" },
      { "id": "rag-retriever", "latency_ms": 42, "status": "ok" }
    ]
  },
  "usage": {
    "prompt_tokens": 35,
    "completion_tokens": 312,
    "reasoning_tokens": 240,
    "total_tokens": 587
  }
}
```
