# C22: Multi-Standard Conflict Detector

- **Priority Tier**: High (A-Tier Ambiguity Resolver)
- **Journey Stage**: Pre-Application Standard Scoping
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Detects overlapping Indian Standards, resolves scope conflicts, and provides evidence-backed reconciliation across competing candidate standards.

---

## 1. Overview & Capabilities
Manufacturers often encounter multiple overlapping Indian Standards that appear applicable to their product. The **Multi-Standard Conflict Detector** systematically compares candidate standards, evaluates product attributes against mandatory compositional thresholds, and identifies the single legally valid primary standard.

### Conflict Domains Resolved
1. **Cement Variants**: `IS 269` (OPC) vs `IS 1489` (PPC Fly Ash) vs `IS 455` (PSC Slag).
2. **Potable Water**: `IS 14543` (Packaged Drinking Water) vs `IS 13428` (Natural Mineral Water).
3. **Electrical Accessories**: `IS 1293` (Domestic Plugs <= 16A) vs `IS/IEC 60309` (Industrial Plugs).
4. **Structural Steel**: `IS 1786` (TMT Concrete Rebars) vs `IS 2062` (Structural Plates/Sections).

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/conflicts/resolve`

### Request Payload
```json
{
  "product_description": "Ordinary Portland Cement without fly ash additives",
  "declared_attributes": {
    "fly_ash_present": false,
    "grade": "43"
  }
}
```

### Response Payload
```json
{
  "product": "Ordinary Portland Cement without fly ash additives",
  "conflict_detected": true,
  "recommended_primary_standard": "IS 269:2015 (Ordinary Portland Cement)",
  "candidate_standards_evaluated": 3,
  "rejected_alternatives": [
    {
      "standard_number": "IS 1489 (Part 1):2015 (Portland Pozzolana Cement)",
      "rejection_reason": "Product contains 0% fly ash pozzolana additions. IS 1489 strictly mandates 15% to 35% pozzolana content.",
      "scope_mismatch_clause": "Clause 4.1 Raw Materials",
      "chemical_exclusion": "Pozzolana additions absent"
    },
    {
      "standard_number": "IS 455:2015 (Portland Slag Cement)",
      "rejection_reason": "No granulated blast furnace slag (25% to 70%) is utilized in the mix design.",
      "scope_mismatch_clause": "Clause 5.1 Slag Constituent",
      "chemical_exclusion": "GGBS slag constituent absent"
    }
  ],
  "conflict_resolution_logic": "Resolved based on chemical constituents, raw material origins, mechanical form factors, and mandatory scope exclusions.",
  "why_not_alternatives_summary": "Alternative standards were excluded because product attributes do not satisfy mandatory compositional thresholds.",
  "timestamp": "2026-09-12T14:52:00Z"
}
```

---

## 3. Directory Structure
```
c/C22_multi_standard_conflict_detector/
├── __init__.py
├── engine.py
└── README.md
```
