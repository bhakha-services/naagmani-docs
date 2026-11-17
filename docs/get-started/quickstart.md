# Quickstart

## 1. Open your portal

For a self-hosted installation, open the portal URL printed by the installer (default shell-installer port `3001`) and use your local owner credentials. For a hosted deployment, use the portal URL supplied by your operator and sign in through Accounts.

Do not use a developer workstation's `localhost` URL as a public hosted URL. See [installation](/deploy/installation) if the platform is not running yet.

## 2. Add a provider

Open **Organization → Providers & Health**, add a supported provider and supply credentials. Confirm the provider is active and reachable. A self-hosted model server must also be reachable from the gateway container.

## 3. Choose a project and environment

Open the project workspace and select Test or Production. Create an application API key or a Project Service Token with `inference.execute`. Store the secret on your application's server; it is displayed at creation time.

## 4. Choose a model

Use a model available through your configured providers. A virtual name such as `smart` works only after you create a routing policy with that name. Provider availability and license requirements still apply.

## 5. Send a request

Set the gateway URL and the credential you created:

```bash
export NAAGMANI_GATEWAY_URL="http://localhost:8080"
export NAAGMANI_API_KEY="<your-application-credential>"
export NAAGMANI_MODEL="<configured-model-or-routing-policy>"
curl -fsS "$NAAGMANI_GATEWAY_URL/v1/chat/completions" \
  -H "Authorization: Bearer $NAAGMANI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$NAAGMANI_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}"
```

Replace the sample host/port with your gateway endpoint. The control-plane API and portal are different services from the inference gateway.

See [first request](/get-started/first-request), [models](/api/models) and [authentication](/api/authentication).
