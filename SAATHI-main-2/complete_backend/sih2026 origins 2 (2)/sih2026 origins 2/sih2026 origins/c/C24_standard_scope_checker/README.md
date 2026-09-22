# C24: Standard Scope Checker

- **Priority Tier**: High (A-Tier Boundary Validator)
- **Journey Stage**: Pre-Filing Boundary Verification
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Evaluates fine-grained product attributes against official statutory scope boundaries, mandatory operating limits, and explicit exclusions of Indian Standards.

---

## 1. Overview & Capabilities
The **Standard Scope Checker** runs boundary condition algorithms against manufacturer technical specifications (e.g. voltage limits, diameter ranges, pozzolana %, TDS levels) to verify if an item sits 100% inside a standard's legal scope.

### Scope Check Dimensions
1. **Operating Limits**: Voltage (<= 250V), current (<= 16A), frequency, diameter tolerances.
2. **Material Formulations**: Clinker/gypsum ratios, pozzolana limits (<= 5% minor addition in OPC).
3. **Explicit Scope Exclusions**: Lists items covered under sister standards (e.g. `IS/IEC 60309` industrial plugs, `IS 1489` PPC cement).

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/scope/check`

### Request Payload
```json
{
  "standard_number": "IS 1293:2019",
  "product_parameters": {
    "voltage": 240,
    "current_rating": 16,
    "phases": 1
  }
}
```

### Response Payload
```json
{
  "standard_number": "IS 1293:2019",
  "title": "Plugs and Socket-Outlets of Rated Voltage up to and including 250V and Rated Current up to and including 16A",
  "is_within_scope": true,
  "overall_verdict": "FULL_SCOPE_CONFORMITY",
  "scope_conditions_check": [
    {
      "scope_condition": "Rated voltage not exceeding 250 V a.c.",
      "is_satisfied": true,
      "status": "PASS"
    },
    {
      "scope_condition": "Rated current not exceeding 16 A",
      "is_satisfied": true,
      "status": "PASS"
    },
    {
      "scope_condition": "Single-phase a.c. 50 Hz supply",
      "is_satisfied": true,
      "status": "PASS"
    }
  ],
  "explicit_standard_exclusions": [
    "Industrial 3-phase plugs and socket-outlets (covered under IS/IEC 60309)",
    "Appliance couplers for household use (covered under IS/IEC 60320)",
    "Plugs for extra-low voltage applications (< 50V a.c.)"
  ],
  "guidance": "Product qualifies for certification under this standard.",
  "timestamp": "2026-09-12T14:56:00Z"
}
```

---

## 3. Directory Structure
```
c/C24_standard_scope_checker/
├── __init__.py
├── engine.py
└── README.md
```
