# API Overview

The Naagmani Gateway provides a unified, high-performance REST API designed to be compatible with industry standards while providing enhanced orchestration, routing, and plugin lifecycle execution.

---

## Base URLs

| Environment | Endpoint URL | Description |
| :--- | :--- | :--- |
| **Production Cloud** | `https://api.naagmani.com/v1` | Production enterprise cloud gateway. |
| **Local OS Runtime** | `http://localhost:8080/v1` | Local Naagmani daemon or edge instance. |

---

## Key Endpoints

| Endpoint | Method | Description | Status |
| :--- | :--- | :--- | :--- |
| `/v1/chat/completions` | `POST` | Generate chat completions with full streaming and tool-calling support. | `AVAILABLE` |
| `/v1/responses` | `POST` | Unified responses API supporting structured reasoning and multimodal flows. | `AVAILABLE` |
| `/v1/embeddings` | `POST` | Generate vector embeddings across single or batch text inputs. | `PLANNED` |
| `/v1/models` | `GET` | List available models, virtual aliases, and active provider targets. | `AVAILABLE` |
| `/v1/plugins` | `GET` | Query installed plugins and active pipeline hooks. | `AVAILABLE` |
| `/v1/health` | `GET` | Gateway health check and cluster readiness probe. | `AVAILABLE` |

---

## Protocol Standards

- **Encoding**: Request and response payloads are formatted in `application/json; charset=utf-8`.
- **Streaming**: Server-Sent Events (SSE) formatted as `text/event-stream`.
- **Authentication**: Bearer token via `Authorization` header.
- **Idempotency**: Pass `Idempotency-Key` header on mutating requests to guarantee at-most-once execution.

---

## SDK & Client Compatibility

Because Naagmani's `/v1/chat/completions` and `/v1/embeddings` adhere to standard schemas, you can use official Naagmani SDKs or any standard OpenAI-compatible client library by simply reconfiguring the `base_url` and `api_key`.
