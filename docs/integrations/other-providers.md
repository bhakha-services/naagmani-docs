# Self-Hosted Models (Ollama, vLLM & LocalAI)

In addition to managed cloud providers, Naagmani allows you to route traffic to self-hosted, air-gapped, or on-premises model servers.

---

## Supported Local Runtimes

- **vLLM**: High-throughput GPU inference engine.
- **Ollama**: Lightweight local model runner.
- **TGI (Text Generation Inference)**: Hugging Face serving engine.
- **LocalAI**: Drop-in OpenAI alternative.

---

## Configuring a Custom Endpoint

In **Credential Pools** ([http://localhost:3000/credentials](http://localhost:3000/credentials)), select **Custom / Self-Hosted**:

```json
{
  "provider": "custom_openai",
  "base_url": "http://gpu-cluster.internal:8000/v1",
  "auth_header": "Bearer internal-cluster-secret",
  "models": ["llama-3.3-70b-instruct", "mistral-large-2411"]
}
```

---

## Next Steps

- [Security Architecture](/docs/security/overview)
- [High Availability & Failover](/docs/production/reliability)
