# Project Service Tokens API Reference

Programmatically issue, list, and revoke scoped Project Service Tokens.

**Surface**: Control Plane API (`:8081`)

---

## 1. Create a Service Token

`POST /v1/projects/{projectId}/service-tokens`

### Request Body:
```json
{
  "name": "data-pipeline-worker",
  "environment_id": "env_prod_01J8F0A2B3",
  "capabilities": ["inference:chat", "tools:execute"],
  "expires_in_days": 30,
  "member_id": "mbr_23255f47-29a9-41df-8495-3a6edca814c8"
}
```

### Response (`HTTP 201 Created`):
```json
{
  "id": "st_9f8a2b1c3d4e",
  "public_id": "nst_live_9f8a2b1c...",
  "token": "nst_live_9f8a2b1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
  "name": "data-pipeline-worker",
  "environment_id": "env_prod_01J8F0A2B3",
  "capabilities": ["inference:chat", "tools:execute"],
  "expires_at": "2026-10-25T23:59:59Z",
  "status": "active",
  "created_at": "2026-09-25T23:00:00Z"
}
```

---

## 2. List Service Tokens

`GET /v1/projects/{projectId}/service-tokens`

---

## 3. Revoke a Service Token

`DELETE /v1/projects/{projectId}/service-tokens/{tokenId}`

### Response:
`HTTP 204 No Content`
