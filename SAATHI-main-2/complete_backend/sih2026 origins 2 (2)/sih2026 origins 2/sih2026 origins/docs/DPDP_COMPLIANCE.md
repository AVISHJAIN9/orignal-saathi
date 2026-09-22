# SAATHI — DPDP Act Compliance Documentation

> [!IMPORTANT]
> This document is both a technical specification and a legal record.
> It must be updated whenever data processing practices change.
> Last updated: **2026-09-13**

---

## 1. Legal Basis

SAATHI processes personal data of Indian citizens under the **Digital Personal Data Protection Act, 2023 (DPDP Act)**.

**Data Fiduciary:** Bureau of Indian Standards (BIS) / Ministry of Consumer Affairs, Food & Public Distribution  
**Data Processor:** SAATHI platform operators  
**Applicable Regulation:** DPDP Act, 2023; IT Act, 2000; CERT-In Guidelines

---

## 2. Data Categories Processed

| Category | Examples | Legal Basis |
|---|---|---|
| Identity data | Business name, registration number, GSTIN | Consent + Legitimate Interest (compliance assistance) |
| Contact data | Email, phone number | Consent |
| Compliance data | License numbers, CML codes, factory addresses | Legitimate Interest (public compliance information) |
| Usage data | Chat queries, feature interactions | Consent (analytics) / Legitimate Interest (service improvement) |
| Device/session data | IP address, session tokens | Legitimate Interest (security) |

**Sensitive personal data:** SAATHI does not process any sensitive personal data as defined under DPDP Act Section 2(t).

---

## 3. Data Retention Schedule

| Data Type | Retention Period | Deletion Mechanism | Legal Authority |
|---|---|---|---|
| Chat conversation logs | **90 days** | Automated `DELETE FROM conversations WHERE created_at < NOW() - INTERVAL '90 days'` (daily cron) | DPDP Act S.8(7) |
| Query history / search logs | **180 days** | Automated deletion cron | DPDP Act S.8(7) |
| User account data | Until account deletion + 30 days | Right-to-erasure API (see §5) | DPDP Act S.12 |
| Compliance document evidence | **3 years** (CML renewal cycle) | Manual review + deletion | BIS certification requirements |
| Session audit logs (S16 consent records) | **7 years** | Manual review only | IT Act S.7A; DPDP Act S.8(6) |
| System audit trails (C37) | **7 years** | Manual review only | IT Act S.7A |
| Error logs | **30 days** | Log rotation | Operational |
| BIS source documents (ingested PDFs) | Indefinite (public documents) | N/A — public information | |

---

## 4. Consent Management (S16 Module)

**Module:** `s/S16_consent_and_dpdp_compliance_manager/index.js`

### Consent Capture
- Consent is collected at first login and at any time the purpose or data categories change.
- Consent records are version-tracked: each consent record includes `consent_version`, `consent_timestamp`, `ip_address_hash` (SHA-256, not plaintext).
- Withdrawal of consent is possible at any time from the account settings page.

### Consent Record Schema
```sql
consent_records (
  id, user_id, consent_version, purpose_codes TEXT[],
  consented_at TIMESTAMP, withdrawn_at TIMESTAMP,
  ip_address_hash VARCHAR(64), user_agent_hash VARCHAR(64)
)
```

### Re-consent Triggers
- Change in data processing purpose
- Addition of new data categories
- Change in third-party data sharing
- Annual re-consent for long-lived accounts (> 12 months inactive)

---

## 5. Right to Erasure API

**Endpoint:** `DELETE /api/v1/users/{userId}/data` (P1 Auth Service)

**What it deletes:**
- All chat conversations and message history
- All query logs and search history
- User profile and business profile data
- Consent records (replaced with a `WITHDRAWN` record per DPDP Act)
- All manufacturer-specific compliance data uploaded by the user

**What is NOT deleted:**
- System audit trails (C37 — legally required for 7 years)
- Anonymised/aggregated analytics (cannot be re-identified)
- BIS public source documents (these are public information, not user data)

**SLA:** Erasure completed within **72 hours** of verified request (DPDP Act S.12).

**Implementation status:** 🔲 Phase 5 — endpoint spec defined, implementation pending

---

## 6. Third-Party Data Sharing

| Third Party | Data Shared | Purpose | DPA Signed |
|---|---|---|---|
| OpenAI / Azure OpenAI | Chat queries (without PII, stripped before sending) | LLM inference | 🔲 Required |
| Google (Gemini) | Chat queries (PII-stripped) | LLM fallback | 🔲 Required |
| Sarvam AI | Chat queries in regional languages | Indic translation | 🔲 Required |
| Meta / WhatsApp | Conversation metadata | WhatsApp channel delivery | 🔲 Required |

> [!CAUTION]
> Data Processing Agreements (DPAs) with all third-party processors must be executed before production launch. DPDP Act S.8(2) requires this.

**PII Stripping:** Before any query is sent to an external LLM, a PII scrubbing step must remove:
- GSTIN numbers
- CML/license numbers
- Names and email addresses
- Phone numbers
- Factory addresses

**Implementation status:** 🔲 Phase 2 — PII scrubber to be added as M5 preprocessing step

---

## 7. Data Residency

All production data must be stored within India (`ap-south-1` or `asia-south1` region). This includes:
- PostgreSQL database (RDS/Cloud SQL in India region)
- Redis (ElastiCache/Memorystore in India region)
- S3/GCS document storage (India region bucket)
- Backups (India region only)

Third-party LLM API calls technically route data outside India. Until a self-hosted LLM option is operational, this must be disclosed in the privacy policy and covered by DPAs.

---

## 8. Security Measures (DPDP Act S.8(4))

| Measure | Status |
|---|---|
| Encryption at rest (database) | 🔲 Configure RDS encryption at rest |
| Encryption in transit (TLS 1.3) | ✅ Enforced by nginx / ALB |
| helmet() HTTP security headers | ✅ Added to all NestJS services 2026-09-13 |
| Rate limiting | ✅ Redis-backed ThrottlerGuard (P1) |
| Secret management | ✅ AWS/GCP Secrets Manager (no plaintext) |
| Pre-commit secret scanning | ✅ gitleaks hook added 2026-09-13 |
| CERT-In empanelled security audit | 🔲 Required before public launch |
| Penetration testing | 🔲 Annual requirement |
| Vulnerability disclosure policy | 🔲 Required before public launch |

---

## 9. Breach Notification

Per DPDP Act S.8(6): must notify CERT-In and affected data principals within **72 hours** of discovering a breach.

**Incident Response Contact:**  
- CERT-In: https://www.cert-in.org.in/  
- Notify: incident@cert-in.org.in  
- Internal: engineering lead + legal team

**Runbook:** `infra/dr/INCIDENT_RESPONSE.md` (to be created in Phase 5)

---

## 10. Data Protection Officer (DPO)

Per DPDP Act, a DPO must be appointed before processing commences at scale.

**Status:** 🔲 Appointment pending — required before production launch
