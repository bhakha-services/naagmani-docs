# How Naagmani works

Applications call the OS gateway with a scoped application credential. The gateway resolves request context, applies applicable policy/limits, selects a provider/model, executes enabled plugin hooks, calls the provider and records available usage/attempt information.

## Service roles

| Service | Responsibility |
| --- | --- |
| Developer Portal | User interface for projects, providers, credentials, policies and operations |
| Control-plane API | Management operations and permissions |
| OS gateway | Inference routing and runtime/plugin execution |
| PostgreSQL and Redis | Persistent data and applicable shared runtime/cache state |

For self-hosted installations these services run locally. The service name `cloud` in the Compose stack refers to the local control-plane API. It does not require hosted Accounts for local user login. Hosted deployments use Accounts as their human identity authority.

## Configuration before inference

Create/select a project and environment, configure provider credentials, and issue an application key or Project Service Token. Use a configured model or an existing routing-policy alias. A healthy installation does not automatically include usable upstream model credentials.

The gateway implements `GET /v1/models`, `POST /v1/chat/completions` and `POST /v1/responses`. Provider/model/adapter support determines optional request features. Retry and failover depend on policy, eligible candidates and streaming state.

See [quickstart](/get-started/quickstart), [routing](/concepts/routing), [providers](/concepts/providers) and [deployment](/deploy/installation).
