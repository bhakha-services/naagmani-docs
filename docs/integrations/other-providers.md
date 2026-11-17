# Compatible model servers

Use an endpoint compatible with the selected adapter. The gateway container must be able to reach it; localhost inside the container refers to that container, not your host model server.

Configure the provider under **Organization → Providers & Health** in the Developer Portal. Confirm the credential is active and the endpoint is reachable, then select a model offered by your configured provider or create a routing policy.

Send requests to Naagmani's gateway with your application credential, not the provider key. Supported optional fields depend on the selected adapter/model.

See [provider behavior](/concepts/providers), [quickstart](/get-started/quickstart) and [chat completions](/api/chat-completions).
