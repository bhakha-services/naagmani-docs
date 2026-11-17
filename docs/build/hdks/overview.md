# Plugin HDK

The Host Development Kit helps implement plugins in Go, Node.js/TypeScript and Python. Plugins run as worker processes and communicate with the gateway using newline-framed JSON-RPC 2.0 over standard input/output.

Plugins declare metadata, hooks, permissions, capabilities and runtime configuration in `plugin.json`. Runtime policy and entitlements determine whether they can execute for a request. Installing a package alone does not enable every capability.

The supervisor manages process startup, registration, health and termination. Hook failure behavior depends on configured timeouts and failure policy. A worker crash can still fail the affected request. Process separation does not establish a complete host-security sandbox; apply deployment restrictions for untrusted code.

Start with [manifest format](/build/hdks/manifest), [protocol](/build/hdks/protocol), [development](/build/hdks/development), [testing](/build/hdks/testing) and [publishing](/build/hdks/publishing).
