# API overview

Naagmani separates inference from administration.

| Surface | Purpose | Typical self-hosted script port |
| --- | --- | --- |
| OS gateway | Model listing, chat completions, Responses and streaming | 8080 |
| Local control-plane API | Organizations, projects, users, permissions, credentials and operations | 8081 |
| Developer Portal | Browser management interface | 3001 |

Your configuration may use different ports or HTTPS hostnames. The hosted control plane can proxy supported gateway requests, but credential requirements still depend on the route. Use the endpoint supplied by your deployment operator.

The gateway registers GET /v1/models, POST /v1/chat/completions and POST /v1/responses. Optional parameters and behavior depend on the selected adapter/model; OpenAI compatibility does not cover every OpenAI API.

Send Authorization: Bearer <credential> to authenticated endpoints and Content-Type: application/json with JSON bodies. Management operations require a permitted management credential or an explicitly supported machine capability; a gateway key does not grant unrestricted administration.

See [authentication](/api/authentication), [chat completions](/api/chat-completions), [response formats](/api/responses), [model listing](/api/models) and [streaming](/api/streaming).
