# C25: Clause-Level Requirement Extraction Engine

- **Priority Tier**: High (A-Tier Machine-Actionable Parser)
- **Journey Stage**: Standard Breakdown & Technical Analysis
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Parses raw standard text into structured, machine-actionable requirement nodes with parameter names, test methods, tolerances, and mandatory criticality flags.

---

## 1. Overview & Capabilities
The **Clause-Level Requirement Extraction Engine** converts complex Indian Standards into structured, machine-readable parameter nodes. Each node specifies the exact test method, acceptable limits/tolerances, and statutory criticality tier.

### Key Capabilities
1. **Machine-Actionable Parameter Extraction**: Maps parameters (e.g. Compressive Strength, Proof Stress, Setting Time, Arsenic Limits, Glow Wire Resistance).
2. **Standard Reference Test Methods**: Identifies designated testing protocols (e.g. `IS 4031`, `IS 3025`, `IS 1608`, `IS 11000`).
3. **Criticality Classification**: Flags `MANDATORY_CRITICAL`, `MANDATORY_SAFETY`, and `MANDATORY` items.
4. **Interactive Clause/Parameter Filtering**: Supports regex or substring searches across standard clauses.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/clauses/extract`

### Request Payload
```json
{
  "standard_number": "IS 269:2015",
  "clause_filter": "Compressive"
}
```

### Response Payload
```json
{
  "standard_number": "IS 269:2015",
  "standard_matched": "IS 269:2015",
  "total_extracted_clauses": 1,
  "mandatory_critical_count": 1,
  "requirements": [
    {
      "clause_id": "6.2",
      "parameter": "Compressive Strength (28-Day)",
      "test_method": "IS 4031 (Part 6) - 2000 kN Compression Testing Machine",
      "acceptable_limit": "Grade 33: >=33 MPa; Grade 43: 43-58 MPa; Grade 53: >=53 MPa",
      "criticality": "MANDATORY_CRITICAL"
    }
  ],
  "timestamp": "2026-09-12T14:58:00Z"
}
```

---

## 3. Directory Structure
```
c/C25_clause_level_requirement_extraction/
├── __init__.py
├── engine.py
└── README.md
```
