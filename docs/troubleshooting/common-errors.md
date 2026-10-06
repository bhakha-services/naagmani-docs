# Common Errors Guide

Quick diagnosis and resolution steps for frequent HTTP status codes and operational errors.

---

## 1. `401 Unauthorized / invalid_token`
- **Symptom:** API requests return `{"code": "unauthorized", "message": "invalid service token"}`.
- **Diagnosis:** The token secret is mistyped, revoked, or has passed its expiration TTL.
- **Resolution:** Check active tokens in [{{DEVELOPER_PORTAL_URL}}/service-tokens]({{DEVELOPER_PORTAL_URL}}/service-tokens) or generate a new token.

---

## 2. `400 Bad Request / member budget exceeds parent`
- **Symptom:** Attempting to update a member budget fails with `"member monthly budget exceeds parent organization monthly budget"`.
- **Diagnosis:** FinOps budget hierarchy enforcement blocks child budgets from exceeding parent organization ceilings.
- **Resolution:** Increase the parent organization budget first in [{{DEVELOPER_PORTAL_URL}}/finops]({{DEVELOPER_PORTAL_URL}}/finops) before increasing the member limit.

---

## 3. `429 Too Many Requests / budget_exceeded`
- **Symptom:** Requests are blocked with code `budget_exceeded`.
- **Diagnosis:** The project or member has hit their hard monthly spending cap.
- **Resolution:** Increase the budget limit in the Developer Portal or wait for the monthly billing cycle reset.

---

## 4. `502 Bad Gateway / provider_unreachable`
- **Symptom:** Upstream AI provider is timing out or returning 5xx.
- **Diagnosis:** Outage on the provider side.
- **Resolution:** Configure automated secondary and tertiary fallback routes in [{{DEVELOPER_PORTAL_URL}}/routing-policies]({{DEVELOPER_PORTAL_URL}}/routing-policies).

---

## 5. `400 Bad Request / Model Not Supported`
- **Symptom:** Gateway returns `{"code": "invalid_request", "message": "Model '<name>' is not supported or no matching routing policy found."}`.
- **Diagnosis:** The incoming `model` string does not correspond to an enabled upstream provider model, nor is there an active **Routing Policy** matching that alias (or `"model": "auto"` without an active Enterprise license).
- **Resolution:**
  1. Check enabled providers in [{{DEVELOPER_PORTAL_URL}}/providers]({{DEVELOPER_PORTAL_URL}}/providers).
  2. If using an alias like `"smart"`, `"code-gen"`, or `"fallback-chain"`, create a policy matching that name under [{{DEVELOPER_PORTAL_URL}}/routing-policies]({{DEVELOPER_PORTAL_URL}}/routing-policies).
  3. Verify the provider API key credentials are saved and active.

---

## Next Steps

- [Authentication Troubleshooting](/docs/troubleshooting/authentication)
- [Routing Concepts & Resolution Modes](/docs/concepts/routing)
- [Virtual Aliases & Model Matching](/docs/concepts/models)
- [Plugin Debugging](/docs/troubleshooting/plugins)
- [CLI Diagnostics](/docs/troubleshooting/cli)
