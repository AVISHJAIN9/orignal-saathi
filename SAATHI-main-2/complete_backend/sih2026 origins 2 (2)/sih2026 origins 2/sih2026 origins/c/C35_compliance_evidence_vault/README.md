# C35: Compliance Evidence Vault

- **Priority Tier**: High (A-Tier Document Repository)
- **Journey Stage**: Digital Evidence & Audit Storage
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Maintains verified evidence documents tied to specific standards/clauses, and provides centralized digital storage for factory audit records.

---

## 1. Overview & Capabilities
The **Compliance Evidence Vault** stores calibration certificates, NABL test reports, QAP manuals, and State Pollution Control Board NOCs mapped directly to BIS license numbers and standard clauses.

---

## 2. API Reference

### Endpoints
1. `GET /api/v1/compliance/evidence/{license_id}`
2. `POST /api/v1/compliance/evidence/upload`

### Request Payload (`POST /api/v1/compliance/evidence/upload`)
```json
{
  "document_id": "DOC-CAL-0982",
  "license_id": "CML-8400192831",
  "document_type": "CALIBRATION_CERT",
  "title": "Universal Testing Machine (UTM) 1000kN Calibration Certificate",
  "standard_clause_mapped": "IS 269:2015 Clause 6.1",
  "issue_date": "2023-11-10",
  "expiry_date": "2024-11-09",
  "issuing_authority": "National Test House (NABL Accredited)",
  "file_url": "https://storage.saathi.gov.in/evidence/utm_calib_2023.pdf"
}
```

### Response Payload (`GET /api/v1/compliance/evidence/CML-8400192831`)
```json
{
  "license_id": "CML-8400192831",
  "total_evidence_documents": 3,
  "valid_count": 1,
  "expiring_soon_count": 0,
  "expired_count": 2,
  "overall_vault_health": "WARNING",
  "documents": [
    {
      "document_id": "DOC-CAL-0982",
      "license_id": "CML-8400192831",
      "document_type": "CALIBRATION_CERT",
      "title": "Universal Testing Machine (UTM) 1000kN Calibration Certificate",
      "standard_clause_mapped": "IS 269:2015 Clause 6.1",
      "freshness_status": "EXPIRED",
      "is_active_for_audit": false
    }
  ]
}
```

---

## 3. Directory Structure
```
c/C35_compliance_evidence_vault/
├── __init__.py
├── engine.py
└── README.md
```
