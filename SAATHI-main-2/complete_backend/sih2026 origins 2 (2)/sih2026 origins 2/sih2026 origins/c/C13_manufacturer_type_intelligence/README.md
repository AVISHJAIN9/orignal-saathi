# C13: Manufacturer-Type Intelligence Router

- **Priority Tier**: High (A-Tier Core Entity Profiler)
- **Journey Stage**: Pre-Filing & Route Selection
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Routes applicants to tailored regulatory pathways, concessions, document rules, and legal frameworks based on their business constitution.

---

## 1. Overview & Capabilities
The **Manufacturer-Type Intelligence Router** evaluates the enterprise scale, ownership structure, manufacturing footprint, and legal status of applicants to match them with optimal BIS regulatory schemes, concessions, and fast-track procedures.

### Entity Types Supported
1. **DPIIT-Recognized Startups (`STARTUP_DPIIT`)**:
   - 50% rebate on statutory fees (Application, Inspection, AMF).
   - Fast-track 30-day scrutiny queue.
2. **Micro Enterprises (`MSME_MICRO`)**:
   - 50% concession on Application and Minimum Marking Fees (Udyam Verified).
   - Eligible for Option 2 Simplified Fast-Track.
3. **Small Enterprises (`MSME_SMALL`)**:
   - 20% concession on Application and Minimum Marking Fees.
4. **Medium Enterprises (`MSME_MEDIUM`)**:
   - Digital expedited queue, standard statutory fee schedule.
5. **Foreign Manufacturers (`FOREIGN_MANUFACTURER`)**:
   - FMCS Scheme IV route, Authorized Indian Representative (AIR) requirement, USD 10,000 PBG.
6. **Brand Owners / OEM-ODM (`BRAND_OWNER_OEM`)**:
   - Brand inclusion under OEM factory license, contract manufacturing liability framework.
7. **Importers / Traders (`IMPORTER_TRADER`)**:
   - ICEGATE customs clearance, Foreign OEM FMCS/CRS certificate linkage.
8. **Large Domestic Manufacturers (`LARGE_DOMESTIC`)**:
   - Standard Scheme-I compliance and factory quality system audit.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/manufacturer-types/analyze`

### Request Payload
```json
{
  "entity_type": "MSME_MICRO",
  "annual_turnover_inr_cr": 2.5,
  "investment_in_plant_inr_cr": 0.75,
  "has_own_manufacturing_plant": true,
  "is_dpiit_recognized": false
}
```

### Response Payload
```json
{
  "entity_category": "Micro Enterprise (Udyam Verified)",
  "definition": "Investment in plant & machinery <= Rs. 1 Crore and Annual Turnover <= Rs. 5 Crores.",
  "statutory_concessions": "50% rebate on Application & Minimum Marking Fees under BIS guidelines.",
  "discount_percentage": 50,
  "simplified_procedure_eligible": true,
  "target_timeline": "30 calendar days (Fast-Track)",
  "special_prerequisites": [
    "Valid Udyam Registration Certificate",
    "MSME Udhyam portal self-declaration",
    "CA Net Worth Certificate"
  ],
  "recommended_path": "Option 2: Simplified Procedure with pre-tested NABL reports.",
  "scheme_route": "Scheme-I (ISI Mark) Simplified Option 2",
  "notes": "Inspection scheduled within 10 days of application filing."
}
```

---

## 3. Directory Structure
```
c/C13_manufacturer_type_intelligence/
├── __init__.py
├── engine.py
└── README.md
```
