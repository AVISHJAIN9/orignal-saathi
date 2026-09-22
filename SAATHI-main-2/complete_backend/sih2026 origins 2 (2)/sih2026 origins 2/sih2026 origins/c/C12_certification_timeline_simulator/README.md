# C12: Certification Timeline Simulator

- **Priority Tier**: High (A-Tier Core Project Management Tool)
- **Journey Stage**: Application Planning & Journey Tracking
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Simulates statutory and operational timeline durations, critical path bottlenecks, and estimated grant-of-license completion dates.

---

## 1. Overview & Capabilities
The **Certification Timeline Simulator** provides applicants with real-time dynamic forecasts of the certification lifecycle, milestone dates, statutory service level agreements (SLAs), and bottleneck risks.

### Key Capabilities
1. **Procedure Pathways**:
   - **Option 2: Simplified Fast-Track Procedure**: Targeted 30-day turnaround for eligible domestic manufacturers and MSMEs.
   - **Option 1: Normal Procedure**: Standard 60–90 day statutory review with sequential sampling and factory inspection.
   - **Scheme IV: FMCS Foreign Procedure**: International inspection scheduling, RBI approvals, visa clearance (90–180 days).
2. **Critical Path & Bottleneck Detection**:
   - Analyzes calibration readiness, in-house lab setup, independent lab queue times, and pre-test report availability.
3. **Milestone Gantt Breakdown**:
   - Document filing & scrutiny
   - Factory lab verification
   - On-site factory audit
   - Independent laboratory sample testing
   - Competent authority approval & license issuance
4. **Actionable Speedup Recommendations**:
   - Strategies to bypass lab queuing by providing pre-test NABL test reports under Simplified Procedure.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/timeline/simulate`

### Request Payload
```json
{
  "product_category": "Cement & Building Materials",
  "standard_number": "IS 269:2015",
  "is_simplified_procedure": true,
  "has_in_house_lab_ready": true,
  "has_nabl_pre_test_reports": true,
  "is_foreign_manufacturer": false,
  "calibration_status_valid": true
}
```

### Response Payload
```json
{
  "procedure_type": "Simplified Fast-Track Procedure (Option 2 - 30 Day Target)",
  "standard_number": "IS 269:2015",
  "product_category": "Cement & Building Materials",
  "start_date": "2026-09-12",
  "total_estimated_days": 25,
  "estimated_license_grant_date": "2026-10-07",
  "is_fast_track_eligible": true,
  "critical_path_bottlenecks": [],
  "timeline_stages": [
    {
      "stage_id": 1,
      "title": "Application Filing & Preliminary Scrutiny",
      "statutory_sla_days": 5,
      "estimated_duration_days": 2,
      "start_date": "2026-09-12",
      "estimated_finish_date": "2026-09-14",
      "is_critical_bottleneck": false,
      "description": "Filing on Manakonline, MSME Udyam verification, document scrutiny, and statutory fee payment.",
      "checklist": ["Form-V Application", "Manufacturing process flowchart", "Plant layout", "Raw material test certificates"]
    },
    {
      "stage_id": 2,
      "title": "In-house Laboratory & Quality Control Verification",
      "statutory_sla_days": 10,
      "estimated_duration_days": 3,
      "start_date": "2026-09-14",
      "estimated_finish_date": "2026-09-17",
      "is_critical_bottleneck": false,
      "description": "Verification of test equipment, calibration validity by NABL lab, and testing personnel competence.",
      "checklist": ["Testing equipment list", "NABL Calibration certificates", "Competent testing staff bio-data", "In-house test registers"]
    },
    {
      "stage_id": 3,
      "title": "On-site Factory Verification Visit",
      "statutory_sla_days": 15,
      "estimated_duration_days": 5,
      "start_date": "2026-09-17",
      "estimated_finish_date": "2026-09-22",
      "is_critical_bottleneck": false,
      "description": "BIS inspecting officer inspects manufacturing process, verifies QC testing in factory lab, and draws sealed verification samples.",
      "checklist": ["Plant audit walkthrough", "Draw counter samples", "Seal and dispatch sample packages"]
    },
    {
      "stage_id": 4,
      "title": "Independent Laboratory Sample Testing & Report Scrutiny",
      "statutory_sla_days": 30,
      "estimated_duration_days": 10,
      "start_date": "2026-09-22",
      "estimated_finish_date": "2026-10-02",
      "is_critical_bottleneck": false,
      "description": "Independent testing at BIS Central Lab or BIS Recognized NABL Accredited Commercial Laboratory.",
      "checklist": ["Chemical & Physical parameters", "Performance durability check", "Form-X test report upload"]
    },
    {
      "stage_id": 5,
      "title": "Competent Authority Scrutiny & License Grant",
      "statutory_sla_days": 7,
      "estimated_duration_days": 5,
      "start_date": "2026-10-02",
      "estimated_finish_date": "2026-10-07",
      "is_critical_bottleneck": false,
      "description": "Regional Branch Head approves comprehensive file, assigns CM/L number, and generates digital certificate.",
      "checklist": ["Annual marking fee clearance", "Form-II grant letter issuance", "Digital certificate download"]
    }
  ],
  "speedup_recommendations": [
    "Submit pre-test reports from NABL accredited labs before inspection to save up to 20 days.",
    "Ensure UTM, dead-weight gauges, and chemical balances have current NABL calibration certificates before inspector visit.",
    "Maintain complete 30-day trial production test records in factory lab registers."
  ]
}
```

---

## 3. Directory Structure
```
c/C12_certification_timeline_simulator/
├── __init__.py
├── engine.py
└── README.md
```
