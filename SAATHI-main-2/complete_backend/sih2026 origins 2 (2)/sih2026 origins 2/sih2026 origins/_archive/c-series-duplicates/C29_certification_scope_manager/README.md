# C29: Certification Scope Manager

- **Priority Tier**: High (A-Tier Scope Endorsement Core)
- **Journey Stage**: License Maintenance & Product Line Expansion
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Manages scope additions, brand name endorsements, size/grade inclusions, and test sample routing for expanding existing BIS licenses.

---

## 1. Overview & Capabilities
The **Certification Scope Manager** automates statutory endorsements when licensees add new varieties, grades, sizes, or brand names to an active BIS license without applying for an entirely new license.

### Endorsement Types Handled
1. **Grade & Variety Additions**: Adding 53 Grade to an existing 43 Grade cement license.
2. **Brand Name Inclusions**: Endorsing co-brand or private-label trademarks under an existing CM/L.
3. **Dimensional Extensions**: Adding new wire gauge sizes or plug pin ratings.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/scope/endorse`

### Request Payload
```json
{
  "cml_number": "CML-8400192831",
  "standard_number": "IS 269:2015",
  "existing_scope_description": "OPC 43 Grade (IS 269:2015)",
  "requested_inclusion": "Include OPC 53 Grade and Brand 'SUPER-STRONG'",
  "in_house_test_capability_ready": true
}
```

### Response Payload
```json
{
  "cml_number": "CML-8400192831",
  "standard_number": "IS 269:2015",
  "current_scope": "OPC 43 Grade (IS 269:2015)",
  "requested_inclusion": "Include OPC 53 Grade and Brand 'SUPER-STRONG'",
  "status": "ELIGIBLE_FOR_INCLUSION",
  "statutory_pathway": "Endorsement Application under Scheme-I Guidelines Section 4.2",
  "testing_requirement": "Sample of new grade/size to be drawn and tested in factory presence or dispatched to recognized NABL lab.",
  "in_house_lab_ready": true,
  "fee_breakdown": {
    "endorsement_application_fee_inr": 5000.0,
    "gst_18_pct": 900.0,
    "total_inr": 5900.0
  },
  "checklist": [
    "Updated Form-V mentioning new variety/brand name",
    "Factory in-house preliminary test results for new grade/variety",
    "Declaration of brand ownership / trademark authorization certificate",
    "Calibration certificate of test equipment relevant to new parameters"
  ],
  "estimated_turnaround_days": 15,
  "timestamp": "2026-09-12T15:06:00Z"
}
```

---

## 3. Directory Structure
```
c/C29_certification_scope_manager/
├── __init__.py
├── engine.py
└── README.md
```
