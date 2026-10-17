# Production Marketplace Signing Ceremony & Trust Authority

This specification governs the cryptographic hardware requirements, algorithm compatibility, multi-party ceremony protocols, and trust anchor lifecycle for the official Naagmani Marketplace Release Authority.

---

## 1. Cryptographic Algorithm & Cloud KMS Compatibility

Naagmani OS validates plugin package integrity and publisher authenticity using digital signatures verified over canonical envelope payloads (`CanonicalEnvelopePayload`) containing SHA-256 digests of plugin archives.

### Cloud KMS / HSM Algorithm Matrix

| Provider / Technology | Supported Asymmetric Algorithms | Ed25519 Support | ECDSA P-256 Support | Recommended Protection Level |
| :--- | :--- | :--- | :--- | :--- |
| **AWS KMS** | RSA (2048/3072/4096), ECDSA (NIST P-256, P-384, P-521), SECG P-256K1 | **NO** (Not natively supported by `kms:Sign`) | **YES** (`ECC_NIST_P256` / `ECDSA_SHA_256`) | FIPS 140-2 Level 3 Hardware Module |
| **GCP Cloud KMS** | RSA, ECDSA (P-256/P-384), Ed25519 (`EC_SIGN_ED25519`) | **YES** (Supported in Software, Cloud HSM, and EKM) | **YES** (`EC_SIGN_P256_SHA256`) | Cloud HSM (FIPS 140-2 Level 3) |
| **AWS CloudHSM** | RSA, ECDSA, Ed25519 via PKCS#11 | **YES** (Via OpenSSL PKCS#11 engine) | **YES** | Dedicated FIPS 140-2 Level 3 cluster |
| **HashiCorp Vault Transit** | RSA, ECDSA, Ed25519 | **YES** (Transit engine key type `ed25519`) | **YES** (`ecdsa-p256`) | HSM auto-unseal |
| **Hardware Tokens (YubiHSM 2)** | Native Ed25519, NIST Curves, RSA | **YES** | **YES** | Air-gapped physical HSM |

> [!CRITICAL]
> **Cloud KMS Asymmetric Constraint**:
> AWS KMS standard asymmetric keys do **not** support Ed25519.
>
> 1. If maintaining **Ed25519**, the production signing authority must be provisioned on **GCP Cloud KMS HSM** (`EC_SIGN_ED25519`), **AWS CloudHSM** with PKCS#11, or an **Air-Gapped Hardware HSM** (YubiHSM 2 / Thales Luna).
> 2. If deploying to **native AWS KMS**, the signing scheme must use `ECC_NIST_P256` with `ECDSA_SHA_256`.

---

## 2. Multi-Party Ceremony Protocol (M-of-N Quorum)

The official root signing key must **never** be generated on a developer workstation or in standard CI/CD.

### Quorum Requirements

- **Quorum Rule**: M-of-N authorization (3-of-5 Key Custodians).
- **Roles**:
  - **Ceremony Administrator**: Coordinates execution and logs all steps.
  - **Security Officer (Witness 1)**: Inspects physical/logical isolation and hardware tokens.
  - **Independent Auditor (Witness 2)**: Computes and signs cryptographic fingerprints.
  - **5 Appointed Custodians**: Hold smartcards / MFA keys required to authorize root operations.

---

## 3. Trust Anchor Enrollment & Permanent Dev Exclusion

The production root key is registered into `/etc/naagmani/trusted_publishers.json`:

```json
[
  {
    "id": "pub_naagmani_official",
    "name": "Naagmani Official Marketplace Authority",
    "public_keys": [
      "<OFFICIAL_PRODUCTION_HEX_PUBLIC_KEY>"
    ],
    "revoked_keys": [],
    "status": "active",
    "updated_at": "2026-10-17T00:00:00Z"
  }
]
```

### Permanent Dev Key Exclusion

The untrusted development root key:
`a658ab97ec0472fa7bd54ed579783e9a7296c272e7d69cb27e23db9603b65f07`

is **permanently excluded and strictly rejected** by the Naagmani OS production trust store. Any attempt to register or sign production packages with this key triggers an immediate hard crash / startup abort.

---

## 4. Key Rotation & Emergency Revocation

- **Rotation Cadence**: 24 months with a 30-day dual-signing grace period.
- **Emergency Revocation**: If a private signing key is compromised, Naagmani Cloud immediately broadcasts a signed `naagmani.package.revocation/v1` payload. Naagmani OS nodes instantly terminate running processes matching the revoked key and reject subsequent execution (`fail_close`).

---

## Related Documentation

- [Marketplace Publishing & Lifecycle](file:///e:/project/naagmani-project/naagmani-docs/docs/marketplace/publishing.md)
- [Plugin Installation & Scope Isolation](file:///e:/project/naagmani-project/naagmani-docs/docs/marketplace/installation.md)
- [Production Vault Operations](file:///e:/project/naagmani-project/naagmani/naagmani-os/docs/production-vault-operations.md)
