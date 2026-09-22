# C31: Supplier & Sub-Component Compliance Checker

- **Priority Tier**: High (A-Tier Supply Chain Validator)
- **Journey Stage**: Supply Chain & Factory Quality Assurance
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Verifies raw material test certificates (MTC), supplier ISI marks, and sub-component conformity against mandatory Indian Standards.

---

## 1. Overview & Capabilities
Under BIS Scheme-I factory audits, all critical incoming raw materials (e.g. clinker, gypsum, copper conductor rods, flame-retardant polymers) must carry verified supplier batch test certificates or supplier ISI licenses.

### Key Capabilities
1. Evaluates incoming raw material bills and NABL mill test certificates.
2. Identifies uncertified supply chain risks before preliminary factory visits.
3. Flags supply chain non-conformities and remediation steps.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/suppliers/check`

### Request Payload
```json
{
  "finished_product_standard": "IS 1293:2019",
  "components_list": [
    {
      "component_name": "Polycarbonate Enclosure Granules",
      "supplier_name": "Sabic Innovative Plastics",
      "supplier_cml_or_nabl_cert": "NABL-TEST-POLY-2024-9912",
      "has_test_certificate": true
    },
    {
      "component_name": "Brass Pin Extrusion",
      "supplier_name": "Apex Non-Ferrous Metals",
      "supplier_cml_or_nabl_cert": "CML-7192834",
      "has_test_certificate": true
    }
  ]
}
```

### Response Payload
```json
{
  "finished_product_standard": "IS 1293:2019",
  "overall_supply_chain_status": "COMPLIANT",
  "total_components_checked": 2,
  "conforming_components_count": 2,
  "component_verdicts": [
    {
      "component": "Polycarbonate Enclosure Granules",
      "supplier": "Sabic Innovative Plastics",
      "certificate_reference": "NABL-TEST-POLY-2024-9912",
      "compliance_status": "CONFORMING_VERIFIED",
      "audit_readiness": "Ready for factory verification"
    },
    {
      "component": "Brass Pin Extrusion",
      "supplier": "Apex Non-Ferrous Metals",
      "certificate_reference": "CML-7192834",
      "compliance_status": "CONFORMING_VERIFIED",
      "audit_readiness": "Ready for factory verification"
    }
  ],
  "statutory_rule": "BIS Scheme-I requires all critical raw materials to carry incoming batch test reports or supplier ISI marks."
}
```

---

## 3. Directory Structure
```
c/C31_supplier_compliance_checker/
├── __init__.py
├── engine.py
└── README.md
```
