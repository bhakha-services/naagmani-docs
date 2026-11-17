# Deployment troubleshooting

Start in the directory containing your installation's environment and Compose files.

```bash
docker compose config --quiet
docker compose ps
docker compose logs --tail 100 os cloud developer
```

Check the actual port mappings, not a fixed port copied from a different installation method. Verify gateway GET /v1/health and local API GET /health using the configured host ports.

For image pull failures, check the selected image reference, CPU architecture, registry reachability and access. For startup failures, inspect required environment values, database initialization, persistent storage and matching machine credentials on the local API and OS. Do not replace existing encryption keys as a generic repair step.

For a remote browser, use your server's real hostname and configure HTTPS. Container names such as cloud and os are internal network addresses.

Shell-script and CLI-generated installations can use different configuration/state layouts. Use the workflow for your installed version; do not assume a failed command always resumes safely or repairs database state. Back up before recovery or update operations.

See [installation](/deploy/installation), [Compose configuration](/deploy/docker-compose), [CLI diagnostics](/build/cli/troubleshooting) and [backups and upgrades](/deployment/upgrades).
