# C10: Technical File Generator

- **Priority Tier**: S-Tier
- **Journey Stage**: Compliance Intelligence (Dossier Assembly & TCF Generation)
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Implementation Module**: [engine.py](file:///Users/avishjain/Desktop/sih2026%20origins/c/C10_technical_file_generator/engine.py)
- **API Gateway Exposure**: [server.py](file:///Users/avishjain/Desktop/sih2026%20origins/server.py)

---

## 1. Executive Summary & Purpose
Before submitting an application to BIS, manufacturers must assemble an exhaustive **Technical Construction File (TCF)** containing manufacturing flowcharts, QAP manuals, calibration logs, and equipment layouts.

The **C10 Technical File Generator**:
1. Automates the generation of standardized, multi-section TCF dossiers.
2. Formulates factory layout, machinery schedule, and laboratory staffing sections.
3. Outputs structured JSON / PDF-ready dossier packages conforming to BIS Form-V.

---

## 2. REST API Specification
- **Endpoint**: `POST /api/v1/compliance/technical-file`
- **Request Body**:
  ```json
  {
    "manufacturer_name": "Bharat Polymer Ltd",
    "factory_address": "Plot 42, MIDC, Pune, MH",
    "product_name": "PVC Pipe",
    "standard_number": "IS 4985:2021",
    "brand_names": ["BharatFlow"],
    "qc_incharge_name": "Dr. R. Sharma",
    "installed_daily_capacity": "50 Metric Tonnes"
  }
  ```
