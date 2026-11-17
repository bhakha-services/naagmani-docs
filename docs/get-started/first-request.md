# Make your first AI request

Complete [quickstart](/get-started/quickstart) first: configure a reachable provider, select a project/environment and create an application credential.

## Chat completions

```bash
curl -fsS "http://localhost:8080/v1/chat/completions" \
  -H "Authorization: Bearer <your-application-credential>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<configured-model>","messages":[{"role":"user","content":"Hello"}]}'
```

Replace the gateway URL, credential and model. Use the model identifiers returned for your configured providers. A policy alias such as `smart` must exist before you use it.

Successful non-streaming requests return a chat-completion JSON object. Set `stream: true` for SSE and consume it incrementally. The selected adapter/model determines supported optional parameters and tool behavior.

## Troubleshooting

- `401`: check the credential and revocation/expiry state.
- `403`: check application capabilities, governance and entitlements.
- No eligible model/provider: check the provider credential, model identifier, policy and health.
- Connection failure: check the gateway hostname, port and network access from your client.

See [chat completions](/api/chat-completions), [streaming](/api/streaming) and client examples for [Node.js](/build/sdks/node), [Python](/build/sdks/python) and [Go](/build/sdks/go).
