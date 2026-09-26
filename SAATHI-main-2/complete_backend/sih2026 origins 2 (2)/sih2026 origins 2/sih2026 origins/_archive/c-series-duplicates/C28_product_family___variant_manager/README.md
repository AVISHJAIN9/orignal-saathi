# C28: Product Family & Variant Manager

- **Priority Tier**: High (A-Tier Family Clustering Engine)
- **Journey Stage**: Application Scope & Evidence Optimization
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Handles family grouping, lead model testing protocols, and shared test evidence reuse across product variants.

---

## 1. Overview & Capabilities
The **Product Family & Variant Manager** enables manufacturers of multi-model product lines (e.g. modular switches, LED driver ranges, water purifier models) to group variants into a single certification family.

### Key Benefits
1. **Lead Model Strategy**: Only the designated lead/worst-case model undergoes full destructive type testing.
2. **Shared Evidence Reuse**: Variant models reuse generic safety certificates (e.g. Glow wire flammability, IP ingress rating).
3. **Fee & Timeline Reductions**: Delivers an estimated ~40% reduction in laboratory testing costs.

---

## 2. API Reference

### Endpoints
1. `POST /api/v1/compliance/family/define`
2. `GET /api/v1/compliance/family/{family_id}`

### Request Payload (`POST /api/v1/compliance/family/define`)
```json
{
  "family_name": "Modular Switch Series",
  "standard_number": "IS 3854:1997",
  "lead_model_number": "SW-MOD-16A",
  "variants": [
    {
      "model_number": "SW-MOD-16A",
      "variant_name": "16A Switch",
      "rating_or_spec": "16A 250V",
      "is_lead_model": true,
      "shares_critical_components": true
    },
    {
      "model_number": "SW-MOD-6A",
      "variant_name": "6A Switch",
      "rating_or_spec": "6A 250V",
      "is_lead_model": false,
      "shares_critical_components": true
    }
  ]
}
```

### Response Payload
```json
{
  "status": "FAMILY_REGISTERED",
  "details": {
    "family_id": "FAM-02",
    "family_name": "Modular Switch Series",
    "standard_number": "IS 3854:1997",
    "lead_model": "SW-MOD-16A",
    "total_models": 2,
    "cost_saving_percentage": "Estimated 40% reduction in laboratory testing fees via family grouping.",
    "variants_breakdown": [
      {
        "model_number": "SW-MOD-16A",
        "variant_name": "16A Switch",
        "rating_or_spec": "16A 250V",
        "is_lead_model": true,
        "testing_protocol": "Full Statutory Type Testing (Lead Specimen)"
      },
      {
        "model_number": "SW-MOD-6A",
        "variant_name": "6A Switch",
        "rating_or_spec": "6A 250V",
        "is_lead_model": false,
        "testing_protocol": "Differential Safety Check Only (Evidence Shared from Lead Model)"
      }
    ],
    "timestamp": "2026-09-12T15:04:00Z"
  }
}
```

---

## 3. Directory Structure
```
c/C28_product_family___variant_manager/
├── __init__.py
├── engine.py
└── README.md
```
