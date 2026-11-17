# Plugin troubleshooting

Use `naagmani plugin validate <directory>` to check the manifest, then run the plugin's language-specific tests. Inspect runtime health and container logs if the plugin fails to load or execute.

Check the plugin version, runtime protocol, declared hooks/capabilities, permissions, dependencies and environment assignment. An installed artifact may still be disabled or not authorized for the current request.

See [testing and validation](/build/hdks/testing), [plugin CLI commands](/build/cli/plugins) and [lifecycle hooks](/build/hdks/lifecycle).
