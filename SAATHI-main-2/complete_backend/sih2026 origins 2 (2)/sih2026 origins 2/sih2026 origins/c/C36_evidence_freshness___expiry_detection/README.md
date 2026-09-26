# C36: Evidence Freshness & Expiry Detection

- **Priority Tier**: High (A-Tier Freshness Engine)
- **Journey Stage**: Continuous Monitoring & Audit Readiness
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Monitors validity windows of calibration certificates, raw material test certificates, NABL lab reports, and environmental clearances, generating proactive renewal alerts.

---

## 1. Overview & Capabilities
The **Evidence Freshness & Expiry Detection** engine scans all documents inside an applicant's evidence vault against current calendar dates, detecting impending expiries within 30 days and alerting factory QA heads before inspection audits.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/evidence/freshness`

### Request Payload
```json
{
  "license_id": "CML-8400192831",
  "threshold_days": 30
}
```

### Response Payload
```json
{
  "license_id": "CML-8400192831",
  "threshold_days": 30,
  "total_documents_analyzed": 3,
  "critical_expired_count": 0,
  "expiring_soon_count": 2,
  "overall_evidence_health": "ACTION_REQUIRED",
  "documents": [
    {
      "document_id": "DOC-TEST-7712",
      "license_id": "CML-8400192831",
      "document_type": "NABL_TEST_REPORT",
      "title": "Quarterly Heavy Metals ICP-MS Analysis",
      "days_until_expiry": 18,
      "freshness_status": "EXPIRING_SOON",
      "recommended_action": "Expires in 18 days. Schedule re-testing or re-calibration."
    }
  ],
  "timestamp": "2026-09-12T15:15:00Z"
}
```

---

## 3. Directory Structure
```
c/C36_evidence_freshness___expiry_detection/
├── __init__.py
├── engine.py
└── README.md
```
