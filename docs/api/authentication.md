# API authentication

Send application credentials in the Authorization header:

```http
Authorization: Bearer <credential>
```

| Credential | Format | Accepted use |
| --- | --- | --- |
| Application API key | `nm_live_...` | Supported gateway operations for its project/environment and scopes |
| Project Service Token | `nm_st_...` | Explicit permitted machine capabilities |
| Local portal access credential | Opaque local token | Local management APIs with user permissions |
| Accounts access token | Signed JWT | Hosted management APIs accepting that authority |

Test/production scope is part of the credential context; it is not selected by changing a key prefix. A provider API key and the private API-to-OS machine credential are not application credentials.

Keys and service tokens do not automatically grant human administration. Use the credential type documented for the endpoint. Missing, expired, revoked or invalid credentials are rejected; inspect the actual response body and request ID for details.

The public gateway exposes chat completions, Responses and model listing; an inference capability does not make an unregistered API route available.

See [portal session authentication](/security/authentication), [API keys](/developer-portal/projects/api-keys), [Project Service Tokens](/api/service-tokens) and [chat completions](/api/chat-completions).
