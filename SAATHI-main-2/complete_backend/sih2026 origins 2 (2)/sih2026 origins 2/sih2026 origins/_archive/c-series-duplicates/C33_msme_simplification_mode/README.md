# C33: MSME Simplification Mode

- **Priority Tier**: High (A-Tier Concession Engine)
- **Journey Stage**: Application Strategy & Concessions
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Calculates statutory government concessions, fee rebates (50% for Micro, 20% for Small), women/SC/ST entrepreneur incentives, and relaxed laboratory infrastructure rules.

---

## 1. Overview & Capabilities
The **MSME Simplification Mode** calculates statutory fee rebates and procedural relaxations reserved for Udyam-registered enterprises under Ministry of MSME and BIS Gazette directives.

### Key Benefits Computed
1. **Fee Rebates**: 50% concession for Micro enterprises, 20% concession for Small enterprises.
2. **Special Entrepreneur Incentives**: Additional 10% rebates for Women-owned and SC/ST-owned enterprises.
3. **Sub-contracting Relaxations**: Authorization to outsource high-capex testing to NABL accredited laboratories with an MOU.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/msme/benefits`

### Request Payload
```json
{
  "enterprise_scale": "MICRO",
  "udyam_registration_number": "UDYAM-MH-01-0099881",
  "is_women_owned": true,
  "is_sc_st_owned": false,
  "base_application_fee": 1000.0,
  "base_annual_marking_fee": 50000.0
}
```

### Response Payload
```json
{
  "enterprise_scale": "MICRO",
  "udyam_number": "UDYAM-MH-01-0099881",
  "total_concession_percentage": 60.0,
  "special_incentives_applied": [
    "10% Special Concession for Women-Owned Enterprise"
  ],
  "fee_comparison_inr": {
    "standard_gross_fee": 51000.0,
    "msme_discounted_application_fee": 400.0,
    "msme_discounted_annual_marking_fee": 20000.0,
    "total_msme_payable_inr": 20400.0,
    "total_saving_inr": 30600.0
  },
  "regulatory_relaxations": [
    "Allowed to subcontract high-capex testing to NABL accredited labs with an MOU",
    "Simplified 2-stage factory preliminary inspection without redundant documentation",
    "Priority grievance redressal window within 7 working days"
  ],
  "timestamp": "2026-09-12T15:10:00Z"
}
```

---

## 3. Directory Structure
```
c/C33_msme_simplification_mode/
├── __init__.py
├── engine.py
└── README.md
```
