# C5: Intelligent Scheme Selector

- **Priority Tier**: S-Tier
- **Journey Stage**: Compliance Intelligence (Pre-Application Scheme Determination)
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Implementation Module**: [engine.py](file:///Users/avishjain/Desktop/sih2026%20origins/c/C5_intelligent_scheme_selector/engine.py)
- **API Gateway Exposure**: [server.py](file:///Users/avishjain/Desktop/sih2026%20origins/server.py)

---

## 1. Executive Summary & Purpose
The Bureau of Indian Standards operates multiple distinct certification schemes under the **BIS (Conformity Assessment) Regulations, 2018**. Selecting the wrong certification scheme leads to immediate application rejection, forfeited fees, and severe project delays.

The **C5 Intelligent Scheme Selector** evaluates manufacturer location, product category, hardware architecture, and green claims to automatically route applicants to the exact statutory pathway:
1. **Scheme-I (Standard / ISI Mark)**: Domestic manufacturing of mandatory civil, steel, chemicals, toys, cookware, cables, and mechanical products requiring physical factory audit.
2. **Scheme-II (CRS - Compulsory Registration Scheme)**: Electronics, IT goods, laptops, LED lighting, solar inverters, and lithium-ion batteries under MeitY/MNRE notifications (lab report registration without mandatory prior factory audit).
3. **FMCS (Foreign Manufacturers Certification Scheme - Scheme I)**: Foreign manufacturing facilities exporting to India, requiring an Authorized Indian Representative (AIR), physical overseas audit, and Performance Bank Guarantee (PBG).
4. **Scheme-IV (Hallmarking)**: Precious metals (Gold and Silver jewellery/artefacts) requiring 6-digit laser inscribed HUID registration.
5. **ECO Mark Scheme**: Environmental sustainability labelling for products complying with specific eco-friendly criteria alongside base BIS standards.

---

## 2. REST API Specification
- **Endpoint**: `POST /api/v1/compliance/scheme-selector`
- **Request Body**:
  ```json
  {
    "product_category": "electronics powerbank battery",
    "manufacturing_origin": "domestic",
    "has_in_house_factory": true,
    "is_precious_metal": false,
    "is_software_or_it_hardware": true,
    "wants_green_eco_label": false
  }
  ```
- **Response**:
  ```json
  {
    "scheme_code": "SCHEME_CRS",
    "scheme_name": "Compulsory Registration Scheme (CRS) - Scheme-II",
    "governing_standard": "IS 16046 (Part 2):2018 / IEC 62133-2",
    "applicable_law": "MeitY CRO Orders / BIS Act 2016",
    "assessment_type": "Self-Declaration of Conformity (SDoC) based on NABL Lab Test Report.",
    "factory_audit_required": false,
    "portal": "BIS CRS Portal",
    "timeline_days": "15 to 20 working days",
    "validity_years": 2,
    "confidence": 0.98
  }
  ```
