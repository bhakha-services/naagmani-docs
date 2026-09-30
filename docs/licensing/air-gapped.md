# Air-Gapped & Offline Licensing

This guide provides the complete end-to-end operational procedure for activating enterprise licenses in disconnected or air-gapped environments.

---

## 1. Air-Gapped Licensing Architecture

In air-gapped or restricted network environments, Naagmani uses **self-contained, digitally signed Ed25519 license artifacts**:

```text
1. Customer Portal (Online) ──► Generate & Download "naagmani-license-lic_xxx.json"
                                          │
                                          ▼ (Secure Optical Media / USB)
2. Air-Gapped Server        ──► naagmani platform license activate naagmani-license.json
                                          │
                                          ▼
3. Local OS Engine          ──► Verifies Ed25519 signature against bundled public key
                                          │
                                          ▼
                                [ Enterprise Entitlements Active ]
```

---

## 2. Generating & Downloading Offline License

1. Log into the **Developer Portal** ([{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}})).
2. Navigate to **Settings ➔ License & Entitlements**.
3. Click **Download Signed License (.json)**.
4. Save the generated file `naagmani-license-<licID>.json`.

---

## 3. Transferring & Activating on Air-Gapped Server

### Step 1: Verify the Cryptographic Envelope
Before activation, verify the signature structure using the standalone CLI:

```bash
naagmani platform license verify naagmani-license-lic_xxx.json
```

Output:
```text
================================================================================
🔍 License Envelope Verification
================================================================================
License ID:       lic_01JXYZ9999
Installation ID:  inst_01JABC1234
Edition:          enterprise
Issued At:        2026-09-27T00:00:00Z
Expires At:       2027-09-27T00:00:00Z
Signature:        dGVzdC1zaW...VkLXZhbGlk (valid base64 envelope)

✓ License structure and cryptographic envelope are valid.
```

### Step 2: Activate the License
```bash
naagmani platform license activate naagmani-license-lic_xxx.json --dir /opt/naagmani
```

### Step 3: Restart Platform Containers
```bash
naagmani platform restart --dir /opt/naagmani
```

### Step 4: Check Active Status
```bash
naagmani platform license status --dir /opt/naagmani
```

---

## 4. Offline Clock & Expiration Considerations

In air-gapped environments:
- The platform uses the host system clock to evaluate `expires_at`.
- Ensure the server clock is synchronized via a local air-gapped NTP source.
- When an offline license expires, the platform grants a **14-day grace period** followed by a seamless fallback to `DefaultFree`. Core AI inference and existing plugins remain fully operational.
