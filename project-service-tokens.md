# Project Service Tokens

## 1. Purpose
Project Service Tokens (PST) provide scoped, non-interactive machine credentials for autonomous AI agents, CI/CD deployment pipelines, background microservices, and automated workflows without coupling credentials to individual human user accounts.

---

## 2. What a Project Service Token Is
A Project Service Token is an opaque, cryptographically verifiable Bearer token generated with 192 bits of random entropy (`crypto/rand`) and stored exclusively as a SHA-256 hash at rest.

- **Token Format:** `nm_st_<10_base32_chars>_<48_hex_chars>` (65 characters total)
  - `nm_st_`: Prefix for secret scanning tools (TruffleHog, GitHub Secret Scanning)
  - `<10 Base32 chars>`: Public identifier (e.g., `VAK8CS0FJP`) for UI display, Prometheus metrics, and audit logs
  - `<48 hex chars>`: High-entropy secret material (shown strictly once upon creation)
- **Masked Display:** `nm_st_VAK8CS0FJP_****...5678`

---

## 3. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│            Developer Portal (naagmani-developer)             │
│    - Manage tokens (/projects/[id]/service-tokens)           │
│    - One-time secret display modal & in-place rotation       │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTPS / JWT Auth
                               ▼
┌──────────────────────────────────────────────────────────────┐
│               Naagmani Cloud (naagmani-cloud)                │
│    - Multi-tenant management proxy & rate-limiting           │
│    - RBAC check (Org/Project Admin required for mutations)   │
│    - Redacted audit event persistence                        │
└──────────────────────────────┬───────────────────────────────┘
                               │ Private Network / mTLS
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 Naagmani OS (naagmani-os)                    │
│    - Token generation & SHA-256 constant-time verification   │
│    - Fast pipeline auth (<5ms indexed hash lookup)           │
│    - Mandatory RequestContext binding & capability gating    │
│    - PostgreSQL persistence (service_tokens table)           │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Authentication Flow

```
1. Client Request ──► Authorization: Bearer nm_st_VAK8CS0FJP_<48hex>
2. Naagmani OS Authenticator:
   ├── Parse: Extract public_id ("VAK8CS0FJP") and secret ("<48hex>")
   ├── Index Lookup: SELECT * FROM service_tokens WHERE public_id = $1
   ├── Verify Hash: subtle.ConstantTimeCompare(SHA256(secret), token_hash)
   ├── Validate State: status == "active" AND expires_at > NOW()
   └── Bind Context: Set OrgID, ProjectID, EnvironmentID, Capabilities in RequestContext
3. Authorizer / Gateway:
   ├── Enforce Scope: Verify RequestContext.ProjectID matches target route
   └── Enforce Capability: Verify required capability exists (e.g. inference.execute)
```

---

## 5. Organization, Project, and Environment Scoping
Every Project Service Token is strictly pinned to three hierarchy levels:
- **Organization (`organization_id`):** Mandatory root tenancy boundary.
- **Project (`project_id`):** Mandatory project container. Tokens cannot access other projects within the same organization.
- **Environment (`environment_id`):** Mandatory deployment stage (`Production` or `Test`).

Cross-tenant or cross-project requests automatically fail with `HTTP 403 Forbidden`.

---

## 6. Token Lifecycle

| Stage | Operation | State | Authentication Allowed | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Create** | `POST .../service-tokens` | `active` | Yes | Token generated, SHA-256 hashed, plaintext secret returned once. |
| **Use** | Bearer Auth Header | `active` / `expiring` | Yes | Validated against database hash; asynchronously updates `last_used_at`. |
| **Rotate** | `POST .../rotate` | `expiring` (predecessor)<br>`active` (successor) | Yes (Both) | Predecessor remains active for configured grace window (1–72 hours). |
| **Expire** | Natural TTL / Grace End | `expired` | No | Automatically rejected with `HTTP 401 Unauthorized`. |
| **Revoke** | `DELETE .../{id}` | `revoked` | No | Immediate hard invalidation across all edge gateways. |

---

## 7. Permissions & Security Rules

### Supported Capabilities (Dot-Notation)
- `models.read`: Discover and query available AI models (`GET /v1/models`).
- `inference.execute`: Execute completions, responses, and streaming inference (`POST /v1/chat/completions`).
- `usage.read`: Access project-level usage telemetry and spend analytics.
- `provider.use`: Utilize configured BYOK provider credentials for runtime executions.
- `members.read`: Access organization and project member profiles and directory.
- `members.write`: Provision, update, and manage member configurations.

### Integration Limits & Spending Attribution
- **Requests Per Minute (RPM)**: Optional rate limit cap per token to protect downstream endpoints and background queues.
- **Hierarchical Spending Budget**: Spending limits are strictly governed by the Member → Project → Organization hierarchy.
- **Member Attribution Header**: Supply `X-Naagmani-Member-ID` during inference calls to attribute token spend to a directory member.

### Core Security Rules
1. **One-Time Secret Presentation:** Plaintext secret material is returned only during token creation or rotation. It is never stored in plaintext and cannot be retrieved via `GET` / `LIST` APIs.
2. **Strict Identity Separation:** Service tokens are machine principals (`PrincipalTypeServiceToken`). They are rejected by human-only administration endpoints (`RequireRole`).
3. **Log Sanitization:** Application logs redact Bearer tokens and record only masked identifiers (`nm_st_****...xxxx`).
4. **Audit Trail:** Every mutation emits structured audit events (`service_token.created`, `service_token.rotated`, `service_token.revoked`) recording actor, target public ID, and IP address.

---

## 8. Cloud ↔ OS Interaction
- **Naagmani Cloud** acts as the secure management proxy, verifying user sessions, checking organizational roles, validating installation health, and writing audit events.
- **Naagmani OS** holds the authoritative `service_tokens` table, executes cryptographic parsing/validation, handles fast gateway auth, and updates usage timestamps.

---

## 9. Developer Portal Support
Available at `/projects/[projectSlug]/service-tokens`:
- Service token listing with environment badges, capability chips, creation/expiration dates, and status indicators.
- Create Token modal with custom TTL and capability picker.
- One-time secret copy-to-clipboard modal.
- In-place rotation modal with selectable grace period (1h, 24h, 72h).
- Immediate revocation confirmation with audit reason.

---

## 10. API Endpoint Summary

### Management APIs (Admin / Developer)
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/v1/projects/{projectId}/service-tokens` | Create a new token (returns plaintext secret once). |
| `GET` | `/v1/projects/{projectId}/service-tokens` | List project tokens (metadata only, paginated). |
| `GET` | `/v1/projects/{projectId}/service-tokens/{id}` | Get token metadata and masked identifier. |
| `POST` | `/v1/projects/{projectId}/service-tokens/{id}/rotate` | Rotate token with optional `grace_period_hours`. |
| `DELETE`| `/v1/projects/{projectId}/service-tokens/{id}` | Immediately revoke token with audit `reason`. |

*Note: For Naagmani Cloud proxy, prefix paths with `/v1/installations/{installationId}`.*

### Runtime Gateway APIs (Machine Auth)
| Method | Route | Required Capability |
| :--- | :--- | :--- |
| `POST` | `/v1/chat/completions` | `inference.execute` |
| `GET` | `/v1/models` | `models.read` |
| `GET` | `/v1/usage/analytics` | `usage.read` |

---

## 11. Current Implementation Status
- **Naagmani OS Core:** Implemented & 100% unit/integration tested (generation, constant-time verification, capability checks, RequestContext binding).
- **Naagmani Cloud Proxy:** Implemented & 100% integration tested (RBAC, proxy handlers, audit logging).
- **Developer Portal UI:** Fully operational with create, rotate, revoke, and secret display modals.
- **Database Migrations:** Applied (`service_tokens` table with unique indexes on `token_hash` and `public_id`).

---

## 12. Known Limitations & Pending Production Work
- **Static Expiration Cleanup:** Expired and revoked token rows currently persist in the database for historical audit reference; background pruning worker for expired tombstone records is scheduled for future maintenance.
- **Fine-Grained Model Whitelisting:** Capability checks currently operate at resource level (`models.read`, `inference.execute`); model-specific wildcard filters per token can be added if required.

---

## 13. Zomato AI Demo Integration

The `zomato-ai-demo` project serves as the flagship end-to-end integration and verification harness for Naagmani Project Service Tokens.

### Authentication & Token Flow
1. **Client Bearer Auth**: The demo client dynamically authenticates all outbound machine requests (`/v1/chat/completions`, `/v1/models`, `/v1/usage/analytics`) against Naagmani OS via `Authorization: Bearer nm_st_<public_id>_<secret>`.
2. **Dual Key Support**: The demo supports transparent failover between standard runtime API keys (`nm_live_...`) and Project Service Tokens (`nm_st_...`), with real-time token state inspection in the UI.
3. **Cloud Management Gateway**: Administrative PST operations (create, rotate, revoke, list) authenticate with Naagmani Cloud (`demo-developer@naagmani.local`) and proxy through `/v1/installations/{installationId}/projects/{projectId}/service-tokens`.

### Environment Configuration
The following environment variables configure the integration in `demos/zomato-ai-demo/.env`:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NAAGMANI_OS_URL` | Naagmani OS runtime gateway endpoint | `{{GATEWAY_URL}}` |
| `NAAGMANI_CLOUD_URL` | Naagmani Cloud management API endpoint | `{{API_BASE_URL}}` |
| `NAAGMANI_SERVICE_TOKEN` | Active Project Service Token (`nm_st_...`) | `nm_st_VAK8CS0FJP_0123...` |
| `NAAGMANI_API_KEY` | Fallback standard runtime API key | `nm_live_0123...` |
| `NAAGMANI_DEV_EMAIL` | Developer portal admin email for live token creation | `demo-developer@naagmani.local` |
| `NAAGMANI_DEV_PASSWORD` | Developer portal admin password | `NaagmaniDemo2026!` |
| `NAAGMANI_ORG_ID` | Active Organization UUID | `org_7c977f94-b351-414c-8c89-87a89ecc92c6` |
| `NAAGMANI_PROJECT_ID` | Active Project UUID ("Zomato AI Assistant") | `41088b35-0dab-45cd-86cf-ede6e68ff318` |
| `NAAGMANI_ENVIRONMENT_ID` | Active Environment UUID ("Test") | `9ccb1c2a-d984-4865-9ee6-84050110c104` |

### Available Demo Operations
The Zomato AI web interface includes a dedicated **🔑 Project Service Tokens** tab with:
- **Active Token Status Banner**: Live display of token type (`nm_st_` vs `nm_live_`), masked public identifier, environment ID, and capability badges.
- **Token Management Console**:
  - **Create Token**: Generates new tokens with custom names, environments, and capability scopes (`models.read`, `inference.execute`, `usage.read`).
  - **One-Time Secret Display**: Modal displaying the plaintext secret with clipboard copy and security warnings.
  - **Rotate Token**: Dual-authentication zero-downtime rotation with configurable grace periods (1–72 hours).
  - **Revoke Token**: Immediate token invalidation with custom audit reason tracking.
  - **Set Active Runtime Token**: Hot-swaps the active token used for subsequent chat ordering without restarting the server.
- **Automated Authorization Matrix (10 Scenarios)**:
  1. Valid token with `inference.execute` on `/v1/chat/completions` (Expected: 200 OK)
  2. Valid token with `models.read` on `/v1/models` (Expected: 200 OK)
  3. Valid token with `usage.read` on `/v1/usage/analytics` (Expected: 200 OK)
  4. Missing capability (`models.read` only) accessing `/v1/chat/completions` (Expected: 403 Forbidden)
  5. Missing capability (`inference.execute` only) accessing `/v1/models` (Expected: 403 Forbidden)
  6. Missing capability (`inference.execute` only) accessing `/v1/usage/analytics` (Expected: 403 Forbidden)
  7. Cross-project access attempt with non-matching project ID (Expected: 403 Forbidden)
  8. Cross-environment access attempt with non-matching environment ID (Expected: 403 Forbidden)
  9. Revoked token access attempt (Expected: 401 Unauthorized)
  10. Invalid / malformed secret attempt (Expected: 401 Unauthorized)
- **Interactive Raw API Console**: Directly craft and test arbitrary requests (`POST /v1/chat/completions`, `GET /v1/models`, `GET /v1/usage/analytics`, `POST /v1/.../service-tokens`) with custom headers and auth tokens.

### How to Run the Integration
```bash
# 1. Start Naagmani core services (PostgreSQL, OS, Cloud)
cd e:/project/naagmani-project/naagmani-cloud/deploy
docker compose up -d

# 2. Build and launch Zomato AI Demo
cd e:/project/naagmani-project/naagmani/demos/zomato-ai-demo
npm run build
npm start

# 3. Open Web UI
# Navigate to {{DOCS_URL}} and switch to the "Project Service Tokens" tab.

# 4. Run Automated Test Suite
npm test
```

### Limitations & Recommendations
- **Cloud vs Direct OS Token Creation**: Naagmani OS runtime gateway authenticates service tokens directly, but token *creation* is an administrative operation managed via the Naagmani Cloud proxy (`/v1/installations/{instId}/projects/{projId}/service-tokens`). The demo seamlessly routes management actions through the Cloud proxy while executing inference directly against Naagmani OS.
- **Grace Period Cleanup**: During zero-downtime rotation, the replaced token remains valid until the grace window closes; automated pruning of old tokens after grace expiration is managed by Naagmani OS's scheduled sweeper.

