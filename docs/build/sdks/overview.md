# Application clients

Use HTTP clients or an OpenAI-compatible client for Naagmani's supported gateway endpoints. Client compatibility applies to the implemented chat/Responses fields, not every endpoint in the OpenAI API.

The examples below use standard language HTTP clients, without assuming a separately published Naagmani SDK package:

- [Node.js fetch](/build/sdks/node)
- [Python urllib](/build/sdks/python)
- [Go net/http](/build/sdks/go)

Set the gateway base URL, an application credential and a configured model. Keep credentials in backend services; do not bundle them into public browser/mobile code. API keys and Project Service Tokens are separate from provider keys and portal sessions.

The [HDK](/build/hdks/overview) is for implementing plugins, not calling inference from an application.
