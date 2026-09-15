# Other Providers & Self-Hosted Models

Naagmani allows connecting any OpenAI-compatible AI inference endpoint, including self-hosted open-source model servers and hardware accelerators.

---

## 1. Self-Hosted Inference Engines

### vLLM
```yaml
providers:
  custom_vllm:
    type: "openai_compatible"
    base_url: "http://vllm-cluster.internal:8000/v1"
    api_key: "${VLLM_API_KEY}"
    models:
      - "meta-llama/Llama-3.3-70B-Instruct"
      - "Qwen/Qwen2.5-Coder-32B-Instruct"
```

### Ollama (Local Development)
```yaml
providers:
  ollama:
    type: "openai_compatible"
    base_url: "http://localhost:11434/v1"
    models:
      - "llama3.2:latest"
      - "mistral:latest"
```

---

## 2. High-Throughput Hardware Providers

### Groq / Cerebras
Connect ultra-fast inference engines for low-latency voice and interactive chat agents:
```yaml
providers:
  groq:
    api_key: "${GROQ_API_KEY}"
    base_url: "https://api.groq.com/openai/v1"
    models:
      - "llama-3.3-70b-versatile"
```

---

## 3. Mistral AI & Cohere

Configure native API endpoints for Mistral Large, Codestral, and Cohere Command R+ models using standard API key bindings.
