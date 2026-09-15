# Troubleshooting: Authentication

Diagnosing authentication, key scoping, and credential issues.

---

## 1. Test Key Used in Production Environment

- **Symptom**: Requests return `403 Forbidden: Test keys (nmn_test_) are not permitted in production routes.`
- **Cause**: An API key generated for `development` or `staging` was supplied to a production gateway endpoint.
- **Fix**: Generate and use a production-scoped key (`nmn_live_...`).

---

## 2. Missing Key Scope

- **Symptom**: `403 Forbidden: Key lacks required scope 'plugins:write'`
- **Cause**: Trying to publish a plugin or modify project policies with an inference-only API key.
- **Fix**: Re-issue the API key with administrative or plugin management scopes.

---

## 3. Clock Skew / Expired JWT (CLI / Portal)

- **Symptom**: CLI login loops or returns `token_expired`.
- **Fix**:
  - Run `naagmani logout` followed by `naagmani login`.
  - Ensure system clock on your local machine is synchronized via NTP.
