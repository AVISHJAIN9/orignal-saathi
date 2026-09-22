# C32: Importer Compliance Mode & Customs Port Clearance Router

- **Priority Tier**: High (A-Tier Customs Clearance Core)
- **Journey Stage**: Import / Export & Customs Gateway
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Manages Bill of Entry compliance, customs clearance NOC verification, and port sample testing workflows for importers.

---

## 1. Overview & Capabilities
The **Importer Compliance Mode** verifies whether imported consignments of goods notified under mandatory Quality Control Orders (QCOs) carry a valid BIS license (under FMCS Scheme-IV or CRS) held by the foreign manufacturer, ensuring smooth ICEGATE Single Window (SWIFT) clearance.

### Key Capabilities
1. **Foreign OEM License Verification**: Validates whether the overseas factory holds an active CM/L or CRS registration.
2. **Port Hold Warning**: Warns importers of mandatory seizure or re-export under BIS Act Section 29 if goods lack certification.
3. **Customs Documentation Checklist**: Provides required filing items for ICEGATE.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/importer/check`

### Request Payload
```json
{
  "importer_ie_code": "0388019283",
  "product_hs_code": "25232900",
  "foreign_oem_name": "Siam City Cement Public Co. Ltd.",
  "foreign_oem_cml_license": "CML-9100823451",
  "country_of_origin": "Thailand",
  "consignment_invoice_value_usd": 125000.0
}
```

### Response Payload
```json
{
  "customs_clearance_status": "CLEARED_FOR_ICEGATE_SUBMISSION",
  "importer_ie_code": "0388019283",
  "foreign_oem": "Siam City Cement Public Co. Ltd.",
  "oem_cml_license": "CML-9100823451",
  "port_sampling_required": true,
  "customs_documentation_checklist": [
    "Bill of Entry with foreign OEM CM/L number declared",
    "Certificate of Conformity from Overseas Plant",
    "BIS Manakonline Out-of-Charge (OOC) Clearance Undertaking"
  ],
  "port_procedure": "Customs officer will draw 1 random container test sample; consignment released under provisional bond.",
  "message": "Foreign OEM holds valid BIS license. Import is legally compliant with active QCO."
}
```

---

## 3. Directory Structure
```
c/C32_importer_compliance_mode/
├── __init__.py
├── engine.py
└── README.md
```
