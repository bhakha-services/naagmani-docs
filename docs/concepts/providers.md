# Providers and models

Naagmani has provider adapters for OpenAI, Anthropic, Google Gemini and DeepSeek. Configure credentials in **Organization → Providers & Health**. For an OpenAI-compatible model server, configure the compatible endpoint supported by your deployment.

## Choose a model

Model availability depends on the provider account, configured credentials, endpoint compatibility and the gateway release. Use the provider catalog and the gateway's `GET /v1/models` response instead of assuming every provider model or API is supported.

The chat API accepts direct model identifiers and configured routing-policy aliases. A name such as `smart` is not automatically a working model: create the policy first. Optional tools, streaming and reasoning fields depend on the adapter and model.

## Credentials and health

Provider keys belong in the provider configuration, not in your application. Applications use a Naagmani API key or Project Service Token. Check provider health, quotas and attempt logs when requests fail.

A compatible chat endpoint does not imply support for embeddings, realtime audio, every multimodal feature or arbitrary provider APIs. The public gateway currently exposes chat completions, Responses and model listing.

See [routing](/concepts/routing), [provider setup](/developer-portal/organization/providers) and [API overview](/api/overview).
