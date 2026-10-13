# Customer Members API Reference

The **Customer Members API** manages project-scoped application end-user identities, external user mappings, and per-member FinOps spending limits.

---

## 1. Create a Customer Member

Creates a new Customer Member inside a specified Project workspace.

- **Method**: `POST`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members`
- **Authentication**: Bearer Token (`Portal User JWT` with `members.create` OR `Project Service Token` with `members.write`)

### Request Headers
| Header | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | `Bearer <TOKEN>` |
| `Content-Type` | `string` | `application/json` |

### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `name` | `string` | **Yes** | Human-readable label for the member. |
| `email` | `string` | **Yes** | Contact or notification email (unique within the project). |
| `external_user_id` | `string` | No | Authoritative external user identifier (e.g. `emp_101`). |
| `status` | `string` | No | `active` (default) or `inactive`. |
| `daily_budget_amount` | `number` | No | Maximum daily spending limit in USD. |
| `monthly_budget_amount` | `number` | No | Maximum monthly spending limit in USD. |
| `budget_currency` | `string` | No | Currency code (default: `USD`). |

### Example Request (curl)
```bash
curl -X POST "{{API_BASE_URL}}/v1/organizations/org_acme_corp/projects/proj_support_bot/members" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "email": "rahul.sharma@acme.com",
    "external_user_id": "emp_101",
    "status": "active",
    "daily_budget_amount": 25.00,
    "monthly_budget_amount": 250.00,
    "budget_currency": "USD"
  }'
```

### Example Request (TypeScript)
```typescript
import { NaagmaniClient } from '@naagmani/sdk';

const client = new NaagmaniClient({ token: process.env.NAAGMANI_API_TOKEN });

const member = await client.projects.createMember('org_acme_corp', 'proj_support_bot', {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@acme.com',
  externalUserId: 'emp_101',
  status: 'active',
  dailyBudgetAmount: 25.00,
  monthlyBudgetAmount: 250.00,
});
console.log('Created member ID:', member.id);
```

### Response (`201 Created`)
```json
{
  "id": "mbr_01J8K3M90A7B2C3D4E5F6G7H8J",
  "organization_id": "org_acme_corp",
  "project_id": "proj_support_bot",
  "name": "Rahul Sharma",
  "email": "rahul.sharma@acme.com",
  "external_user_id": "emp_101",
  "status": "active",
  "daily_budget_amount": 25.0,
  "monthly_budget_amount": 250.0,
  "budget_currency": "USD",
  "created_at": "2026-10-13T20:00:00Z",
  "updated_at": "2026-10-13T20:00:00Z"
}
```

---

## 2. List Project Customer Members

Retrieves a paginated list of Customer Members belonging to a project workspace.

- **Method**: `GET`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members`
- **Authentication**: Bearer Token (`members.read`)

### Query Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `limit` | `integer` | `50` | Maximum number of items to return (1–100). |
| `offset` | `integer` | `0` | Number of items to skip. |
| `query` | `string` | - | Case-insensitive search filter across name, email, and `external_user_id`. |

### Example Request (curl)
```bash
curl -X GET "{{API_BASE_URL}}/v1/organizations/org_acme_corp/projects/proj_support_bot/members?limit=20&offset=0" \
  -H "Authorization: Bearer <TOKEN>"
```

### Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "mbr_01J8K3M90A7B2C3D4E5F6G7H8J",
      "project_id": "proj_support_bot",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@acme.com",
      "external_user_id": "emp_101",
      "status": "active",
      "monthly_budget_amount": 250.0
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

---

## 3. Get Member by ID

- **Method**: `GET`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members/{memberID}`
- **Authentication**: Bearer Token (`members.read`)

---

## 4. Update Member Details

- **Method**: `PATCH`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members/{memberID}`
- **Authentication**: Bearer Token (`members.write`)

### Request Body
```json
{
  "name": "Rahul Sharma (Lead)",
  "status": "active",
  "daily_budget_amount": 35.0,
  "monthly_budget_amount": 300.0
}
```

---

## 5. Member FinOps Budget Management

### Get Member Budget
- **Method**: `GET`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members/{memberID}/budget`

### Update Member Budget
- **Method**: `PUT` or `PATCH`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members/{memberID}/budget`

### Request Body
```json
{
  "daily_budget_amount": 50.0,
  "monthly_budget_amount": 500.0,
  "budget_currency": "USD"
}
```

### Clear / Unset Member Budget
- **Method**: `DELETE`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members/{memberID}/budget`

Removes individual limits, reverting the member to standard project-level budget inheritance.

---

## 6. Delete Customer Member

- **Method**: `DELETE`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/members/{memberID}`
- **Authentication**: Bearer Token (`members.write`)
- **Response**: `204 No Content`

---

## 7. Common Error Responses

| HTTP Status | Error Code | Cause & Remediation |
| :--- | :--- | :--- |
| `400 Bad Request` | `VALIDATION_ERROR` | Missing required fields or negative budget amounts. |
| `403 Forbidden` | `PROJECT_ACCESS_DENIED` | Caller lacks `ProjectAccessAssignment` to this project. |
| `403 Forbidden` | `ENTITLEMENT_LIMIT_EXCEEDED` | Organization seat capacity (`max_members`) exceeded on Free tier. |
| `404 Not Found` | `MEMBER_NOT_FOUND` | Member ID does not exist in this project. |
| `409 Conflict` | `IDENTITY_COLLISION` | A member with this `external_user_id` or `email` already exists in this project. |
