# Security: Data Protection & Privacy

Data protection is central to enterprise AI compliance. Naagmani guarantees data privacy, transit encryption, and flexible data residency.

---

## Data in Transit & at Rest

- **In Transit**: All API communication requires TLS 1.3 (with TLS 1.2 fallback). Legacy or insecure ciphers are disabled.
- **At Rest**: All stored configurations, cached schemas, and metadata are encrypted with AES-256-GCM.
- **No Training on Customer Data**: Prompts and completions routed through Naagmani are never stored, sampled, or used to train public or proprietary AI foundation models.

---

## Data Loss Prevention (DLP) Sanitization

When the DLP plugin is enabled in your execution pipeline:

1. **Pre-Transmission Scanning**: User inputs are scanned using high-speed pattern matching and named-entity recognition (NER).
2. **Redaction / Tokenization**: Detected PII (social security numbers, credit cards, emails, API keys, passwords) is replaced with secure tokens (e.g. `[EMAIL_1]`) or masked hashes.
3. **De-Tokenization (Optional)**: If configured, the response handler replaces the token back with the original value before returning to the authorized client application.

---

## Compliance Readiness

Naagmani is engineered to support enterprise regulatory compliance standards:
- **SOC 2 Type II** readiness
- **GDPR / CCPA** compliance controls
- **HIPAA** compliance support with BAA execution (Enterprise tier)
