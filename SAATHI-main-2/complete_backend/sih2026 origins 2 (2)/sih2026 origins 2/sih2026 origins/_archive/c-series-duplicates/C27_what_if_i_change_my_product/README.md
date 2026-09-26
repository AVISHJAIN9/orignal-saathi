# C27: "What If I Change My Product?" Sandbox Engine

- **Priority Tier**: High (A-Tier Engineering Sandbox)
- **Journey Stage**: Engineering Changes & License Lifecycle
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Simulates material and design modifications (e.g., changing raw material blend, altering dimensions, increasing power wattage) and calculates regulatory impact: Endorsement vs Full Re-testing vs New License.

---

## 1. Overview & Capabilities
The **"What If I Change My Product?" Sandbox** allows R&D and quality engineers to simulate product modifications prior to implementation. It predicts whether a change triggers a minor scope endorsement, type re-testing, or a full new license application.

### Change Scenarios Evaluated
1. **`RAW_MATERIAL_BLEND`**: Switching constituent additives (e.g. adding fly ash/slag transitions OPC to PPC, requiring new license).
2. **`VOLTAGE_WATTAGE`**: Increasing current or wattage ratings (e.g. 6A to 16A triggers type re-test + endorsement).
3. **`PACKAGING`**: Changing packaging sacks (e.g. paper bags to HDPE woven bags requires informational intimation).
4. **`SUPPLIER_SUBSTITUTION`**: Raw material supplier changes requiring in-house QAP validation.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/what-if/simulate`

### Request Payload
```json
{
  "current_standard": "IS 269:2015",
  "current_product": "OPC 43 Grade Cement",
  "proposed_change": "Add 20% fly ash to make PPC eco-cement",
  "change_type": "RAW_MATERIAL_BLEND"
}
```

### Response Payload
```json
{
  "current_standard": "IS 269:2015",
  "current_product": "OPC 43 Grade Cement",
  "proposed_change": "Add 20% fly ash to make PPC eco-cement",
  "change_type": "RAW_MATERIAL_BLEND",
  "regulatory_verdict": "REQUIRES_NEW_LICENSE",
  "applicable_standard": "IS 1489 (Part 1):2015 (Portland Pozzolana Cement)",
  "impact_summary": "Adding fly ash or slag transitions product from OPC (IS 269) to a separate composite standard. A fresh CML license application is required under Form-I.",
  "estimated_fee_inr": 35000.0,
  "estimated_timeline_weeks": 8,
  "factory_audit_required": true,
  "compliance_steps": [
    "1. Prepare technical specification sheet for new product variant",
    "2. Conduct internal baseline testing in calibrated in-house laboratory",
    "3. Submit Form-I for new CML grant on Manakonline portal"
  ],
  "timestamp": "2026-09-12T15:02:00Z"
}
```

---

## 3. Directory Structure
```
c/C27_what_if_i_change_my_product?/
├── __init__.py
├── engine.py
└── README.md
```
