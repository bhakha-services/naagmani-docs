# Limits and quotas

Configure provider credentials under **Organization → Providers & Health** and application credentials under the selected project's **API Keys** or **Service Tokens** page. Use the controls exposed by your installed version.

Provider quotas, application request limits, concurrency, budgets and license capacity are separate constraints. Increasing one does not override the others. Check the actual error code/body and provider-attempt records when a request is rejected.

The inference runtime and the management API can apply different rate-limit policies. Configure shared infrastructure consistently when using multiple instances, then test burst and sustained traffic against your own deployment.

See [providers](/concepts/providers), [budgets](/developer-portal/operations/budgets) and [monitoring](/production/observability).
