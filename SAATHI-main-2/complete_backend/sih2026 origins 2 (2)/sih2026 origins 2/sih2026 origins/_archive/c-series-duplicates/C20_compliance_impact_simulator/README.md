# C20: Compliance Impact Simulator

- **Priority Tier**: High (A-Tier Engineering Change Simulator)
- **Journey Stage**: Engineering & Material Change Management
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Simulates before/after compliance pathways when product specifications, raw materials, or manufacturing parameters are modified.

---

## 1. Overview & Capabilities
The **Compliance Impact Simulator** evaluates whether engineering or chemical changes trigger mandatory independent lab re-testing, formal notification to the BIS Branch Office, or standard scope violations.

### Key Evaluation Rules
1. **Cement & Pozzolana (`IS 269` / `IS 1489`)**: Fly ash percentage limits (<= 35.0%), compressive strength re-tests (28-day cure), soundness testing.
2. **Electrical Accessories (`IS 1293`)**: Current rating changes (6A to 16A), glow wire temperature tests (850°C), temperature rise limits (45 K).
3. **Potable Water (`IS 10500`)**: Filtration technology shifts (RO to UV/UF), microbiological potability assays.
4. **Structural Steel (`IS 2062`)**: Carbon equivalent limits (<= 0.42), tensile/yield stress validation.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/impact/simulate`

### Request Payload
```json
{
  "standard_number": "IS 269:2015",
  "original_parameters": {
    "fly_ash_percent": 20.0
  },
  "modified_parameters": {
    "fly_ash_percent": 30.0
  },
  "change_description": "Increasing fly ash blending from 20% to 30% for eco-grade PPC cement."
}
```

### Response Payload
```json
{
  "standard_number": "IS 269:2015",
  "change_severity": "MEDIUM_RETEST_REQUIRED",
  "is_independent_retesting_required": true,
  "must_notify_bis_branch_office": true,
  "estimated_retest_duration_days": 28,
  "affected_tests_and_actions": [
    "28-Day Compressive Strength & Fineness Re-validation Test per IS 4031",
    "Setting Time and Soundness Test (Le-Chatelier & Autoclave)"
  ],
  "regulatory_advice": "Statutory notification is mandatory if changes affect rated specifications or safety-critical parameters. Maintain internal quality verification records in factory logs."
}
```

---

## 3. Directory Structure
```
c/C20_compliance_impact_simulator/
├── __init__.py
├── engine.py
└── README.md
```
