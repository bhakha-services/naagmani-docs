# FinOps & Budgets API Reference

Manage spending caps and hierarchical budget targets across Organizations, Projects, and Members.

**Surface**: Control Plane API (`:8081`)

---

## 1. Update Organization Budget

`PUT /v1/organizations/{orgId}/budget`

### Request Body:
```json
{
  "monthly_budget_amount": 5000.00,
  "daily_budget_amount": 250.00,
  "budget_currency": "USD"
}
```

---

## 2. Update Member Budget

`PUT /v1/organizations/{orgId}/members/{memberId}/budget`

### Hierarchy Validation:
The member limit **cannot exceed** the parent organization's limit. If the parent limit is $5,000, passing $10,000 returns:

```json
{
  "code": "invalid_request",
  "message": "member monthly budget ($10000.00) exceeds parent organization monthly budget ($5000.00)",
  "request_id": "req_01J8F0A2B3"
}
```
