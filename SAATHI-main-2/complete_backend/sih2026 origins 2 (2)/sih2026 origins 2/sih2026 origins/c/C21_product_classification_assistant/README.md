# C21: Product Classification Assistant

- **Priority Tier**: High (A-Tier Classification Core)
- **Journey Stage**: Pre-Filing & Product Identification
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Multi-dimensional classification assistant mapping trade descriptions to exact 8-digit HS Codes, BIS Sectional Technical Departments, and candidate Indian Standards with confidence scoring.

---

## 1. Overview & Capabilities
The **Product Classification Assistant** ingests commercial trade names, material formulations, and intended uses to deterministically map items to statutory Indian Standards and 8-digit customs Harmonized System (HS) codes.

### Key Capabilities
1. **8-Digit HS Customs Code Mapping**: Links domestic BIS requirements to customs tariff lines for ICEGATE import/export compliance.
2. **BIS Technical Department Routing**: Identifies responsible directorates (`MTD`, `CED`, `ETD`, `FAD`, `LITD`, `PCD`, `MED`, `HM`).
3. **Regulatory Scheme Mapping**: Routes products to Scheme-I (ISI Mark), Scheme-IV (Hallmarking), or CRS (Compulsory Registration Scheme).
4. **Mandatory QCO Applicability Status**: Instantly flags if the mapped standard is covered under a legally binding Quality Control Order.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/classification/suggest`

### Request Payload
```json
{
  "trade_name": "TMT Rebar 12mm Fe 500D",
  "composition_material": "Thermo-Mechanically Treated High Strength Steel",
  "intended_use": "Earthquake resistant reinforced concrete construction"
}
```

### Response Payload
```json
{
  "trade_name": "TMT Rebar 12mm Fe 500D",
  "suggested_standard": "IS 1786:2008",
  "standard_title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement",
  "suggested_hs_code": "72142090",
  "bis_department": "MTD (Metallurgical Engineering Department)",
  "applicable_scheme": "Scheme-I (ISI Mark)",
  "confidence": 0.98,
  "qco_status": "MANDATORY_ENFORCED",
  "timestamp": "2026-09-12T14:50:00Z"
}
```

---

## 3. Directory Structure
```
c/C21_product_classification_assistant/
├── __init__.py
├── engine.py
└── README.md
```
