# C14: Renewal & Expiry Intelligence Engine

- **Priority Tier**: High (A-Tier Core License Lifecycle Engine)
- **Journey Stage**: License Maintenance & Post-Grant Compliance
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Tracks license validity, forecasts 90-day renewal windows, computes Annual Marking Fees (AMF), grace period penalties, and surveillance audit triggers.

---

## 1. Overview & Capabilities
The **Renewal & Expiry Intelligence Engine** ensures licensees avoid costly lapses, production stoppages, and late fee penalties.

### Key Capabilities
1. **Renewal Window Forecasting**:
   - Opens precisely 90 days before license expiration.
   - Calculates real-time countdowns (`days_until_expiry`).
2. **Grace Period & Penalty Computations**:
   - Manages statutory 90-day grace period post-expiry.
   - Automatically computes late filing surcharge (INR 5,000 baseline + INR 100/day penalty).
3. **Annual Marking Fee (AMF) Calculation**:
   - 0.2% of gross annual production value vs statutory minimum marking fee.
   - Integrates 50% Micro / 20% Small MSME concessions.
4. **Surveillance Audit Schedules**:
   - Factory surveillance audit triggers (every 6 months).
   - Market sample draw dates (every 12 months).
   - Laboratory instrument calibration check due dates.
5. **License Lookup & Custom Assessment**:
   - Direct lookup by `cml_number` or ad-hoc prediction based on production volume and scale.

---

## 2. API Reference

### Endpoints
1. `POST /api/v1/compliance/renewals/forecast`
2. `GET /api/v1/compliance/renewals/lookup/{cml_number}`

### Request Payload (`POST /api/v1/compliance/renewals/forecast`)
```json
{
  "cml_number": "CML-8400192831",
  "standard_number": "IS 269:2015",
  "license_issue_date": "2023-01-01",
  "validity_years": 2,
  "annual_production_volume": 10000.0,
  "unit_price_inr": 350.0,
  "enterprise_scale": "MICRO"
}
```

### Response Payload
```json
{
  "cml_number": "CML-8400192831",
  "standard_number": "IS 269:2015",
  "issue_date": "2023-01-01",
  "expiry_date": "2024-12-31",
  "days_until_expiry": 110,
  "renewal_window_opens": "2024-10-02",
  "status": "LICENSE_HEALTHY",
  "risk_tier": "NORMAL",
  "is_window_open": false,
  "is_expired": false,
  "is_in_grace_period": false,
  "enterprise_scale": "MICRO",
  "concession_note": "50% MSME Concession applied on AMF",
  "fees_payable": {
    "application_fee_inr": 500.0,
    "annual_marking_fee_inr": 12500.0,
    "late_fee_inr": 0.0,
    "subtotal_inr": 13000.0,
    "gst_18_pct": 2340.0,
    "total_payable_inr": 15340.0
  },
  "surveillance_audit_forecast": {
    "next_factory_inspection": "2023-06-30",
    "market_sample_drawing": "2023-12-27",
    "lab_calibration_due": "2023-11-27"
  },
  "recommended_action": "License active and compliant. Next renewal window opens on 2024-10-02.",
  "timestamp": "2026-09-12T14:35:00Z"
}
```

---

## 3. Directory Structure
```
c/C14_renewal_&_expiry_intelligence/
├── __init__.py
├── engine.py
└── README.md
```
