# Project Access & Assignment API Reference

The **Project Access API** manages human Portal User authorizations and assignments to individual Project workspaces via `ProjectAccessAssignment`.

---

## 1. List Accessible Projects

Lists all project workspaces accessible to the authenticated Portal User.

- **Method**: `GET`
- **Route**: `/v1/organizations/{orgID}/projects`
- **Authentication**: Bearer Token (`projects.read`)

> [!NOTE]
> - **Owners & Admins**: Returns all projects across all organization installations.
> - **Standard Users**: Returns strictly projects explicitly assigned via `ProjectAccessAssignment`.

### Example Request (curl)
```bash
curl -X GET "{{API_BASE_URL}}/v1/organizations/org_acme_corp/projects" \
  -H "Authorization: Bearer <PORTAL_USER_JWT>"
```

### Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "proj_support_bot",
      "name": "Customer Support Copilot",
      "slug": "support-bot",
      "description": "Production customer support agent workspace",
      "status": "active",
      "created_at": "2026-09-01T12:00:00Z"
    }
  ]
}
```

---

## 2. List Assigned Users for a Project

Lists Portal Users currently assigned to a specific project workspace.

- **Method**: `GET`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/users`
- **Alias Route**: `/v1/organizations/{orgID}/projects/{projectID}/access`
- **Authentication**: Bearer Token (`projects.read`)

### Example Request (curl)
```bash
curl -X GET "{{API_BASE_URL}}/v1/organizations/org_acme_corp/projects/proj_support_bot/users" \
  -H "Authorization: Bearer <TOKEN>"
```

### Response (`200 OK`)
```json
{
  "data": [
    {
      "assignment_id": "paa_01J8K3M90A7B2C3D4E5F6G7H8J",
      "user_id": "usr_alice_101",
      "email": "alice@acme.com",
      "name": "Alice Johnson",
      "role": "member",
      "assigned_at": "2026-10-01T10:30:00Z",
      "assigned_by": "usr_owner_001"
    }
  ]
}
```

---

## 3. Assign Portal User to Project

Grants a human Portal User authorization to enter and manage a project workspace.

- **Method**: `POST`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/users`
- **Alias Route**: `/v1/organizations/{orgID}/projects/{projectID}/access`
- **Authentication**: Bearer Token (`projects.manage`)

### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `user_id` | `string` | **Yes** | Organization Portal User ID to assign. |

### Example Request (curl)
```bash
curl -X POST "{{API_BASE_URL}}/v1/organizations/org_acme_corp/projects/proj_support_bot/users" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr_alice_101"
  }'
```

### Example Request (TypeScript)
```typescript
import { NaagmaniClient } from '@naagmani/sdk';

const client = new NaagmaniClient({ token: process.env.NAAGMANI_API_TOKEN });

const assignment = await client.projects.assignUser('org_acme_corp', 'proj_support_bot', {
  userId: 'usr_alice_101',
});
console.log('User assigned to project:', assignment.assignmentId);
```

### Response (`201 Created`)
```json
{
  "assignment_id": "paa_01J8K3M90A7B2C3D4E5F6G7H8J",
  "project_id": "proj_support_bot",
  "user_id": "usr_alice_101",
  "created_at": "2026-10-13T20:45:00Z"
}
```

---

## 4. Revoke Portal User from Project

Revokes a Portal User's access to a project workspace.

- **Method**: `DELETE`
- **Route**: `/v1/organizations/{orgID}/projects/{projectID}/users/{userID}`
- **Alias Route**: `/v1/organizations/{orgID}/projects/{projectID}/access/{userID}`
- **Authentication**: Bearer Token (`projects.manage`)
- **Response**: `204 No Content`

---

## 5. List User's Assigned Projects

Lists all projects assigned to a specific organization user.

- **Method**: `GET`
- **Route**: `/v1/organizations/{orgID}/users/{memberID}/projects`
- **Authentication**: Bearer Token (`projects.read`)

---

## 6. Common Error Responses

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `400 Bad Request` | `INVALID_USER` | Target user is not a member of the organization. |
| `403 Forbidden` | `PERMISSION_DENIED` | Actor lacks `projects.manage` permission. |
| `404 Not Found` | `PROJECT_NOT_FOUND` | Specified project ID does not exist. |
| `409 Conflict` | `ALREADY_ASSIGNED` | Target user is already assigned to this project. |
