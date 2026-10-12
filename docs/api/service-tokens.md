# Project Service Tokens API Reference

Programmatically issue, list, and revoke scoped Project Service Tokens, as well as provision and govern Child User Tokens via the B2B Partner Services Gateway.

**Surface**: Control Plane API & B2B Partner Gateway (`/v1/*`)

---

## 1. Create a Service Token

`POST /v1/projects/{projectId}/service-tokens`

### Request Body:
```json
{
  "name": "data-pipeline-worker",
  "environment_id": "env_prod_01J8F0A2B3",
  "capabilities": ["inference.execute", "models.read"],
  "expires_in_days": 30
}
```

### Response (`HTTP 201 Created`):
```json
{
  "token": "nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678",
  "service_token": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "public_id": "VAK8CS0FJP",
    "name": "data-pipeline-worker",
    "environment_id": "env_prod_01J8F0A2B3",
    "capabilities": ["inference.execute", "models.read"],
    "expires_at": "2026-10-25T23:59:59Z",
    "status": "active",
    "created_at": "2026-09-25T23:00:00Z"
  }
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

---

## 4. B2B Partner Services Gateway (`/v1/services/*`)

*Authenticated using: `Authorization: Bearer nm_st_...` (Master Service Token)*

### Provision Child User Token
`POST /v1/services/tokens`

#### Request:
```json
{
  "external_user_id": "zomato_emp_101",
  "name": "Rahul Sharma",
  "email": "rahul.sharma@zomato.com",
  "department": "customer_support",
  "monthly_budget_usd": 15.00,
  "requests_per_minute": 30,
  "allowed_models": ["gpt-4o-mini", "claude-3-haiku"],
  "expires_in_days": 30
}
```

#### Response (`HTTP 201 Created`):
```json
{
  "api_key": "nm_live_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678",
  "id": "c39a2d04-4e5f-4172-8394-a5b6c7d8e9f0",
  "key_prefix": "nm_live_",
  "masked_identifier": "nm_live_8f14...5678",
  "member_id": "mbr_23255f47-29a9-41df-8495-3a6edca814c8",
  "external_user_id": "zomato_emp_101",
  "name": "Rahul Sharma",
  "department": "customer_support",
  "status": "active",
  "monthly_budget_usd": 15.00,
  "requests_per_minute": 30,
  "allowed_models": ["gpt-4o-mini", "claude-3-haiku"],
  "expires_at": "2026-11-10T18:00:00Z",
  "created_at": "2026-10-11T18:00:00Z"
}
```

### List Partner Tokens
`GET /v1/services/tokens`

### Get Token Details
`GET /v1/services/tokens/{tokenId}`

### Get Token Real-Time Usage & Spend
`GET /v1/services/tokens/{tokenId}/usage`

### Revoke Partner Token
`DELETE /v1/services/tokens/{tokenId}?reason=employee_offboarded`

