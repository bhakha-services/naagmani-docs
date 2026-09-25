# Authentication & BYOK Security

Naagmani separates authentication into two distinct operational planes:

1. **Management / Control Plane**: OAuth2 SSO (Google, GitHub, SAML/OIDC) and Personal Access Tokens for portal users.
2. **Inference / Data Plane**: Project Service Tokens (`nst_live_...`) for microservices, background jobs, and agents.

---

## Bring-Your-Own-Key (BYOK) Security Vault

When you register provider API keys in Naagmani:
- Keys are encrypted in memory prior to database persistence.
- Database records store only ciphertext and cryptographic hashes for indexing.
- Key material is decrypted exclusively inside the Data Plane memory enclave during an active provider dispatch and wiped immediately after socket transmission.

---

## Next Steps

- [Role-Based Access Control](/docs/security/authorization)
- [Data Protection & DLP](/docs/security/data-protection)
