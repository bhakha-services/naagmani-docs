# Public content review — 2026-11-17

## Scope and evidence

Compared customer-facing content against checked-out installer, CLI, local/hosted authentication, gateway route, provider, governance UI, entitlement, audit and plugin sources. This is a source-parity review, not certification that every feature or externally published package/image has been exercised end to end. Public registry releases can lag these source trees. No production deployment or customer installation was performed.

## Corrected findings

| Area | Finding | Source evidence | Correction |
| --- | --- | --- | --- |
| Script installation | Conflicting host ports, fixed startup duration, CLI-only labeling | naagmani-marketing/public/install.sh defaults around lines 766–790; install.ps1 prompts | Retained working entry commands; documented actual script prompts and defaults, separately from CLI defaults |
| Manual deployment | Embedded Compose examples used fixed credentials and stale settings | naagmani/deployments/self-hosted templates | Complete downloadable copies of the reviewed GHCR/Coolify templates, environment and DB initialization; unique credentials required |
| Rendering | Literal localhost URLs were rewritten into unrelated service URLs | lib/env-urls.ts | Only explicit placeholders are replaced; local commands/callback examples remain unchanged |
| CLI installation | Wrong @naagmani/cli package; login advertised unimplemented browser/device flow | naagmani-cli/npm/package.json; cmd/login.go; main.go | Correct package name, explicit local-password flow, accurate credential boundaries |
| CLI flags | Plugin examples used unsupported flags and positional ordering | naagmani-cli/main.go flag parsers | Correct scaffolding/package flag order, supported publish options and distinct marketplace installation workflow |
| API capability | Public embeddings route advertised but not registered | naagmani/naagmani-os/api/http/router.go:93–95 | Removed navigation/recipes; retained an availability note at the old URL |
| Client SDKs | Dedicated package APIs could not be established from available implementations | Workspace package/module inventory | Standard Node/Python/Go HTTP examples instead of invented/unverified package methods; no global claim that such packages cannot exist elsewhere |
| Identity | Hosted SSO, local login and machine credentials conflated; speculative social/SAML claims | Accounts config/OIDC handlers; local identity and portal flows | Clear separate authorities, 15-minute access / 30-day rolling refresh defaults with release/config caveat; correct nm_live_ and nm_st_ formats |
| Governance | Fictional DLP sensitivity toggles were described as actual UI | naagmani-developer project governance page | Actual policy rule/simulation workflow; plugin-dependent protection stated explicitly |
| Licensing | Static unsupported plan matrix, automatic renewal/heartbeat and 14-day grace | OS entitlement manager/verifier and CLI license commands | Signed JSON import, local verification/expiry, effective grants, explicit connected-operation limits; CLI envelope inspection distinguished from cryptographic verification |
| Security | Hardware enclave, zero-knowledge, immutable/HMAC audit archive and certification claims | Provider/vault, Cloud audit/retention and request-log implementations | Concrete encryption/logging controls with proper boundaries; no compliance or immutability guarantee |
| Providers/operations | Speculative complete model catalogs, fixed failover/uptime/capacity promises, generic metrics/Grafana claims | Provider factory/adapters/catalog, router and registered HTTP routes | Configured model availability, operator responsibility and observed API surfaces |
| Plugins/publication | WASM/Protocol Buffers/cgroup guarantees, universal scans and internal HSM ceremony status presented as product features | Plugin stdio supervisor, HDKs, CLI and publisher form | Actual process/JSON-RPC workflow; review/publication not portrayed as certification; internal ceremony document archived outside docs |
| Public scope | Internal reorganization reports were web pages | source.config.ts and lib/docs.ts load docs/ recursively | Three internal documents moved to maintenance/archive; existing useful legacy URLs point to maintained guides |

## Verification

- Documentation link/navigation and code-fence gate passes; includes public downloadable assets and rejects local file links.
- URL-rendering regression tests cover installer ports, callback examples and explicit service placeholders.
- Both downloadable Compose templates validated with docker compose config --quiet using temporary test-only credentials. No deployment was started by these checks.
- Node client example passed node --check; Go standard-library example compiled using go test (no test functions). Python example reviewed but not executed; no usable Python runtime was available in this session.
- Actual CLI scaffolding with flags before the plugin name generated a Node plugin; actual manifest validation passed.
- Production webpack build passed during iteration; final build and rendered-page checks are recorded in workspace tmp/docs-final-build.log and the accompanying validation logs.

Build notes: restricted sandbox blocked Turbopack/PostCSS subprocesses and chunk output; webpack production build was run with local process/filesystem access. This is an environment limitation, not a documentation content failure.

Final verification: 171 public documents, 90 navigation entries and 434 links passed the quality gate; all three URL regressions passed. The final production webpack build completed successfully. The production server was started at http://127.0.0.1:13403 and the installation/Compose/Coolify/authentication pages plus all four download assets returned HTTP 200. All three archived internal page URLs returned HTTP 404. A real browser inspection confirmed the installation commands and their literal local ports remained intact; its screenshot is workspace output/playwright/public-docs-installation.png. Built navigation contained no signing-ceremony entry.
