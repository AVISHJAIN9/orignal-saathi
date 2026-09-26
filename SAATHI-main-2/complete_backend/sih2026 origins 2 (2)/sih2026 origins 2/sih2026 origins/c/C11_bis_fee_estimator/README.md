# C11: BIS Fee Estimator Engine

- **Priority Tier**: High (A-Tier Core Financial Calculator)
- **Journey Stage**: Compliance & Financial Planning
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: End-to-end statutory fee calculator, MSME concession analyzer, lab testing estimator, and annual marking fee (AMF) forecaster.

---

## 1. Overview & Capabilities
The **BIS Fee Estimator** module calculates full statutory and third-party financial requirements for BIS certification under Scheme-I (ISI Mark), Scheme-II, FMCS (Foreign Manufacturers Certification Scheme), and CRS (Compulsory Registration Scheme).

### Key Highlights
1. **Statutory Fee Schedule**:
   - Application Fee (Rs. 1,000 baseline)
   - Annual License Fee (Rs. 1,000 per premises)
   - Preliminary Factory Inspection charges (Domestic manday rates vs FMCS international logistics)
2. **Annual Marking Fee (AMF)**:
   - Volume-based calculation (production unit × unit marking rate) vs Statutory Minimum Marking baseline
   - Standard-specific rate tables (`IS 269`, `IS 10500`, `IS 1293`, `IS 302`, `IS 13252`, `IS 16046`, `IS 15885`)
3. **MSME Concessions**:
   - **Micro Enterprises (Udyam Verified)**: 50% concession on Application Fee and Minimum Marking Fee.
   - **Small Enterprises (Udyam Verified)**: 20% concession on Application Fee and Minimum Marking Fee.
   - **Medium / Large Enterprises**: Standard statutory fee schedule.
4. **Foreign Manufacturers (FMCS)**:
   - USD 10,000 Performance Bank Guarantee (PBG) calculation.
   - Inspector international travel, DA, and visa escort baseline estimates.
5. **Lab Testing Estimator**:
   - Dual-sample calculation (preliminary counter sample + factory audit sample) payable to accredited NABL/BIS laboratories.
6. **GST Calculation**:
   - Standard 18% Goods & Services Tax breakdown on statutory fees and lab charges.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/fee-estimator/detailed`

### Request Payload
```json
{
  "standard_number": "IS 269:2015",
  "annual_production_units": 15000.0,
  "production_unit_type": "MT",
  "business_scale": "MICRO",
  "is_foreign_manufacturer": false,
  "scheme_type": "Scheme-I",
  "num_factories": 1
}
```

### Response Payload
```json
{
  "standard_number": "IS 269:2015",
  "standard_name": "Ordinary Portland Cement",
  "business_scale": "MICRO",
  "scheme_type": "Scheme-I",
  "concession_applied": "50% Special Concession for Micro Enterprises (Udyam Verified)",
  "discount_percentage": 50,
  "is_foreign_manufacturer": false,
  "num_factories": 1,
  "cost_breakdown": {
    "application_fee": 500.0,
    "annual_license_fee": 1000.0,
    "factory_inspection_charge": 14000.0,
    "independent_lab_testing_estimate": 36000.0,
    "annual_marking_fee_gross": 165000.0,
    "annual_marking_fee_net": 82500.0,
    "performance_bank_guarantee_inr": 0.0
  },
  "subtotal_pre_tax": 134000.0,
  "gst_tax_18_percent": 24120.0,
  "total_estimated_budget_inr": 158120.0,
  "currency": "INR",
  "assumptions": [
    "Marking fee unit rate: Rs. 11.0 per Metric Tonne (MT).",
    "Statutory minimum annual marking fee: Rs. 88,000.0.",
    "MSME concessions apply strictly to Application Fee and Minimum Marking Fee upon valid Udyam submission.",
    "Lab testing fee is payable directly to accredited NABL/BIS laboratory based on preliminary & factory samples."
  ]
}
```

---

## 3. Directory Structure
```
c/C11_bis_fee_estimator/
├── __init__.py
├── engine.py
└── README.md
```
