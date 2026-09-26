# C23: Why NOT This Standard? Engine

- **Priority Tier**: High (A-Tier Rejection Justifier)
- **Journey Stage**: Pre-Application Standard Scoping & Legal Defense
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Provides deep, clause-anchored legal and chemical justifications why a specific candidate standard is rejected or legally inapplicable for a given product profile.

---

## 1. Overview & Capabilities
When preparing applications or defending audit scopes, manufacturers need to know not only why a standard *is* applicable, but also why alternative standards are *inapplicable*. The **Why NOT This Standard? Engine** produces definitive, clause-cited statutory explanations.

### Key Capabilities
1. **Clause-Level Rejection Proofs**: Pinpoints the exact clause (e.g. `IS 1489 Clause 4.1`, `IS 13428 Clause 3.1`) causing the mismatch.
2. **Chemical & Physical Threshold Justifications**: Highlights required constituent percentages (e.g. min 15% fly ash, min 25% GGBS slag).
3. **Actionable Remediation Guidance**: Suggests alternative applicable standards or necessary formulation shifts.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/standards/why-not`

### Request Payload
```json
{
  "candidate_standard": "IS 1489",
  "product_attributes": {
    "fly_ash_percent": 0
  }
}
```

### Response Payload
```json
{
  "candidate_standard": "IS 1489 (Part 1):2015",
  "standard_title": "Portland Pozzolana Cement — Specification",
  "is_applicable": false,
  "rejection_confidence": 0.99,
  "primary_rejection_reason": "IS 1489 mandates minimum 15% fly ash addition by mass. Pure clinker cement cannot be certified under PPC.",
  "clause_anchor": "Clause 4.1 Raw Materials",
  "recommended_corrective_action": "Apply under IS 269:2015 (Ordinary Portland Cement) or incorporate verified dry fly ash meeting IS 3812 (Part 1).",
  "timestamp": "2026-09-12T14:54:00Z"
}
```

---

## 3. Directory Structure
```
c/C23_why_not_this_standard?/
├── __init__.py
├── engine.py
└── README.md
```
