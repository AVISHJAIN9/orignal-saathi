# C30: Change-of-Product Impact Analysis Engine

- **Priority Tier**: High (A-Tier Engineering Change Evaluator)
- **Journey Stage**: License Maintenance & Post-Grant Modifications
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Assesses the regulatory materiality of product design or material modifications and generates a statutory compliance action plan for active BIS licensees.

---

## 1. Overview & Capabilities
The **Change-of-Product Impact Analysis Engine** evaluates factory modifications (e.g. changing insulation plastic supplier, altering critical dimensions, shifting factory layout) against BIS Scheme-I Rule 18 regulations.

### Materiality Levels
1. **`MATERIAL_CHANGE`**: Raw material supplier or insulation plastic shift (requires prior written permission and NABL glow wire/flammability reports).
2. **`HIGH_SIGNIFICANCE_CHANGE`**: Factory layout modification or plant relocation (triggers mandatory on-site officer re-inspection visit).
3. **`MODERATE_SPEC_SHIFT`**: Dimensional tolerance updates.
4. **`MINOR_ADMINISTRATIVE`**: Informational intimation during regular annual license renewal.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/change/analyze`

### Request Payload
```json
{
  "license_id": "CML-8400192831",
  "component_modified": "INSULATION_PLASTIC",
  "description_of_change": "Switching flame retardant polycarbonate supplier from Sabic to Covestro",
  "change_type": "SUBSTITUTION"
}
```

### Response Payload
```json
{
  "license_id": "CML-8400192831",
  "component_modified": "INSULATION_PLASTIC",
  "materiality_classification": "MATERIAL_CHANGE",
  "statutory_action_required": "Prior Permission Required under BIS Scheme-I (Rule 18)",
  "requires_officer_re_inspection": false,
  "documentation_to_submit": [
    "Raw Material Supplier Mill Test Certificate",
    "Flammability & Glow-Wire Test Report from NABL Accredited Lab",
    "Updated Factory Quality Assurance Plan (QAP)"
  ],
  "compliance_risk_if_unnotified": "Notice of license suspension under BIS Act Section 29 for unauthorized critical material alteration.",
  "timestamp": "2026-09-12T15:08:00Z"
}
```

---

## 3. Directory Structure
```
c/C30_change_of_product_impact_analysis/
├── __init__.py
├── engine.py
└── README.md
```
