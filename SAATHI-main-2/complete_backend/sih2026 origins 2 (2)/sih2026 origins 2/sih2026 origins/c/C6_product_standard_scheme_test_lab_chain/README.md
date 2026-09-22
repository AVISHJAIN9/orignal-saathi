# C6: Product -> Standard -> Scheme -> Test -> Lab Chain Resolver

- **Priority Tier**: S-Tier
- **Journey Stage**: Compliance Intelligence (Full Compliance Graph Resolution)
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Implementation Module**: [engine.py](file:///Users/avishjain/Desktop/sih2026%20origins/c/C6_product_standard_scheme_test_lab_chain/engine.py)
- **API Gateway Exposure**: [server.py](file:///Users/avishjain/Desktop/sih2026%20origins/server.py)

---

## 1. Executive Summary & Purpose
The compliance journey in India involves resolving multiple interdependent government layers.
The **C6 Compliance Chain Resolver** automatically resolves the full end-to-end directed acyclic graph:
$$\text{Product} \longrightarrow \text{Indian Standard (IS)} \longrightarrow \text{Mandatory QCO} \longrightarrow \text{Certification Scheme} \longrightarrow \text{Required Tests (SIT)} \longrightarrow \text{BIS/NABL Recognized Labs}$$

---

## 2. REST API Specification
- **Endpoint**: `GET /api/v1/compliance/chain?product=cement`
- **Query Parameter**: `product` (e.g. `cement`, `water`, `steel`, `gold`, `battery`, `plug`)
- **Response**:
  ```json
  {
    "query": "cement",
    "product_name": "Ordinary Portland Cement (43 / 53 Grade)",
    "hs_code": "25232900",
    "standard": {
      "standard_number": "IS 269:2015",
      "title": "Ordinary Portland Cement — Specification",
      "category": "Civil Engineering & Building Materials"
    },
    "qco": {
      "qco_name": "Cement (Quality Control) Order, 2024",
      "is_mandatory": true,
      "ministry": "DPIIT"
    },
    "scheme": {
      "scheme_name": "Scheme-I (ISI Mark Certification)",
      "portal": "Manakonline",
      "audit_required": true
    },
    "required_tests": [
      {"test_name": "Compressive Strength (3, 7, 28-day)", "frequency": "Daily batch", "clause": "Clause 6.2"},
      {"test_name": "Setting Time (Initial/Final)", "frequency": "Every batch", "clause": "Clause 6.4"},
      {"test_name": "Soundness (Le-Chatelier/Autoclave)", "frequency": "Weekly", "clause": "Clause 6.3"}
    ],
    "recognized_labs": [
      {"name": "National Council for Cement and Building Materials (NCCBM)", "location": "Ballabgarh, Haryana", "type": "Apex Industry Research Lab"},
      {"name": "BIS Central Laboratory", "location": "Sahibabad, UP", "type": "Government Central Lab"}
    ],
    "confidence": 0.99
  }
  ```
