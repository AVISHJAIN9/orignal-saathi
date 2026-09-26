# C1: QCO (Quality Control Order) Applicability Engine

- **Priority Tier**: S-Tier (Critical Foundational Intelligence)
- **Journey Stage**: Compliance Intelligence (Pre-Application Discovery)
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Implementation Module**: [c1_qco_engine.py](file:///Users/avishjain/Desktop/sih2026%20origins/c/c1_qco_engine.py)
- **API Gateway Exposure**: [server.py](file:///Users/avishjain/Desktop/sih2026%20origins/server.py)

---

## 1. Executive Summary & Purpose
Under **Section 16 of the Bureau of Indian Standards Act, 2016**, the Central Government notifies mandatory **Quality Control Orders (QCOs)** across various Ministries to safeguard public health, environment, safety, and national security.

The **SAATHI C1 QCO Applicability Engine** is a high-precision regulatory classification engine that:
1. Determines whether an applicant's product is subject to a mandatory QCO.
2. Identifies the issuing ministry (DPIIT, Steel, MeitY, MoHFW, Chemicals & Petrochemicals, Heavy Industries, Textiles, Consumer Affairs, Mines, MoPNG).
3. Evaluates statutory exemption qualifications (100% Export, R&D sample imports, MSME grace periods, turnover thresholds).
4. Matches applicable Indian Standards (`IS 269`, `IS 10500`, `IS 2062`, `IS 1293`, `IS 9873`, `IS 16046`, `IS 1417`, etc.).
5. Determines the required certification scheme (Scheme-I ISI Mark, Scheme-II CRS, Scheme-IV Hallmarking, or FMCS for foreign manufacturers).
6. Computes legal risk profiles and statutory penalty exposures under Section 29 of the BIS Act, 2016.

---

## 2. Ministries & Sectors Covered
- **DPIIT (Dept. for Promotion of Industry & Internal Trade)**: Toys, Footwear, Helmets, Plywood, Pressure Cookers, Fire Extinguishers, Hand Tools, Plugs & Sockets, Cement.
- **Ministry of Steel**: Structural Steel, TMT bars, Galvanized sheets, Stainless Steel Pipes & Tubes.
- **MeitY**: Electronics & IT Goods (Laptops, Tablets, Smart TVs, CCTV, LED luminaires), Lithium-ion Batteries & Cells.
- **Ministry of Chemicals & Petrochemicals (DCPC)**: Caustic Soda, Polyethylene (HDPE/LDPE/LLDPE), PVC Resin, PTA, Ortho Phosphoric Acid.
- **Ministry of Heavy Industries**: Distribution & Power Transformers, Induction Motors, Submersible Pumpsets.
- **Ministry of Textiles**: Viscose Staple Fibres, Polyester Fibres, Geotextiles.
- **Ministry of Consumer Affairs & MoHFW**: Gold & Silver Hallmarking (6-digit HUID), Packaged Drinking Water, Compounded Cattle Feeds.
- **Ministry of Mines**: Aluminium and Aluminium Alloys, Copper and Copper Alloys.
- **Ministry of Petroleum & Natural Gas (MoPNG / PESO)**: LPG Cylinders, Regulators, and Valves.

---

## 3. REST API Specification

### A. Evaluator Endpoints
- `GET /api/v1/compliance/qco/check?product=...&hs_code=...&country_of_origin=...`
- `POST /api/v1/compliance/qco/check`
  ```json
  {
    "product_name": "Leather Safety Boots",
    "hs_code": "64039990",
    "country_of_origin": "IN",
    "enterprise_type": "SMALL",
    "annual_turnover_inr": 15000000.0,
    "is_for_export": false,
    "is_for_rnd": false
  }
  ```

### B. Search & Filtering
- `GET /api/v1/compliance/qco/search?q=steel&ministry=Steel&status=MANDATORY_ENFORCED`
- `GET /api/v1/compliance/qco/list`
- `GET /api/v1/compliance/qco/details/{qco_id}`

### C. Exemption Verification & Penalties
- `POST /api/v1/compliance/qco/exemption-check`
  ```json
  {
    "qco_id": "QCO-GOLD-HUID-2021",
    "annual_turnover_inr": 2500000.0,
    "is_export": false
  }
  ```
- `POST /api/v1/compliance/qco/penalties`
  ```json
  {
    "qco_id": "QCO-DPIIT-TOYS-2020",
    "consignment_value_inr": 2500000.0,
    "offence_count": 1
  }
  ```
- `GET /api/v1/compliance/qco/stats`
