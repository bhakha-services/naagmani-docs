# Security: Authentication

Deep dive into authentication mechanisms, key derivation, and session controls within Naagmani.

---

## API Key Architecture

- **Entropy**: Naagmani API keys are generated using CSPRNG (Cryptographically Secure Pseudo-Random Number Generators) with 256 bits of entropy.
- **Storage**: Keys are never stored in plaintext on disk or in gateway memory caches. They are hashed using standard cryptographic hashing (SHA-256 with project salt) before persistence.
- **Prefix Scoping**: Keys use explicit prefixes (`nmn_live_`, `nmn_test_`) allowing edge gateways and automated secret scanners (e.g. GitHub Secret Scanning) to instantly detect accidental exposures.

---

## Secret Storage (BYOK Vault)

Upstream provider credentials (OpenAI, Anthropic, Gemini keys) provided by customers are encrypted at rest using **AES-256-GCM** with per-organization key envelopes. 

Key encryption keys (KEKs) can be managed via:
- Naagmani Cloud HSM / Key Management Service
- AWS KMS / Google Cloud KMS / Azure Key Vault integration (Enterprise tier)
