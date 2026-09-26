# C15: Compliance Calendar & Statutory Event Generator

- **Priority Tier**: High (A-Tier Core Statutory Schedule Engine)
- **Journey Stage**: License Operations & Audit Readiness
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Generates full annual calendar schedules for testing runs, calibration renewals, surveillance audits, quarterly returns, and marking fee deadlines.

---

## 1. Overview & Capabilities
The **Compliance Calendar Service** automates statutory scheduling for manufacturers holding or applying for BIS licenses.

### Event Categories Covered
1. **`CALIBRATION_DUE`**: Annual/periodic calibration deadlines for factory testing instruments (e.g. UTM machines, chemical balances, pressure gauges).
2. **`LAB_TEST_SAMPLE`**: Routine independent sample testing requirements at BIS recognized NABL laboratories.
3. **`SURVEILLANCE_AUDIT`**: Annual on-site factory verification visits by BIS inspecting officers.
4. **`QUARTERLY_RETURN_DUE`**: Quarterly production and dispatch return filings on Manakonline.
5. **`FEE_RENEWAL`**: Annual marking fee (AMF) and license renewal deadlines.

### Key Capabilities
- Chronological scheduling with priority indicators (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
- Month and Category filtering.
- Dynamic creation of custom calendar milestone events.
- Synchronization feed via standard `.ics` (iCalendar) format.

---

## 2. API Reference

### Endpoints
1. `GET /api/v1/compliance/calendar/{license_id}`
2. `POST /api/v1/compliance/calendar/events`

### Request Parameters (`GET /api/v1/compliance/calendar/{license_id}`)
- `license_id`: Path parameter (e.g. `CML-8400192831`)
- `category` (optional): Query filter e.g. `CALIBRATION_DUE`, `LAB_TEST_SAMPLE`, `SURVEILLANCE_AUDIT`
- `month` (optional): Query filter in `YYYY-MM` format

### Response Payload
```json
{
  "license_id": "CML-8400192831",
  "total_events_scheduled": 5,
  "critical_priority_count": 3,
  "high_priority_count": 1,
  "upcoming_events": [
    {
      "event_id": "EVT-02",
      "license_id": "CML-8400192831",
      "title": "Q3 Independent Heavy Metals NABL Test Sample Drawing",
      "category": "LAB_TEST_SAMPLE",
      "scheduled_date": "2026-09-30",
      "status": "UPCOMING",
      "priority": "CRITICAL",
      "action": "Draw 3 sealed sample bags and dispatch to BIS Recognized Lab for compressive strength testing."
    },
    {
      "event_id": "EVT-04",
      "license_id": "CML-8400192831",
      "title": "Quarterly Production & Marking Fee Return Filing (Q2)",
      "category": "QUARTERLY_RETURN_DUE",
      "scheduled_date": "2026-10-15",
      "status": "UPCOMING",
      "priority": "MEDIUM",
      "action": "Submit quarterly dispatch figures and calculate cumulative production value on Manakonline."
    },
    {
      "event_id": "EVT-03",
      "license_id": "CML-8400192831",
      "title": "Annual Factory Surveillance Visit (Officer Er. Sharma)",
      "category": "SURVEILLANCE_AUDIT",
      "scheduled_date": "2026-10-25",
      "status": "SCHEDULED",
      "priority": "CRITICAL",
      "action": "Keep in-house lab registers, raw material test certs, and QA staff ready for physical scrutiny."
    },
    {
      "event_id": "EVT-01",
      "license_id": "CML-8400192831",
      "title": "UTM Machine Annual NABL Calibration Due",
      "category": "CALIBRATION_DUE",
      "scheduled_date": "2026-11-09",
      "status": "UPCOMING",
      "priority": "HIGH",
      "action": "Ensure calibration technician validates 1000 kN load cell with NABL traceable master gauge."
    },
    {
      "event_id": "EVT-05",
      "license_id": "CML-8400192831",
      "title": "Annual License Renewal & Marking Fee Payment Deadline",
      "category": "FEE_RENEWAL",
      "scheduled_date": "2026-12-31",
      "status": "UPCOMING",
      "priority": "CRITICAL",
      "action": "File annual Form-VII renewal statement with audited CA production return and pay AMF."
    }
  ],
  "calendar_feed_url": "https://calendar.saathi.gov.in/feed/CML-8400192831.ics",
  "summary": "License CML-8400192831 has 5 statutory compliance milestones scheduled across the next 12 months."
}
```

---

## 3. Directory Structure
```
c/C15_compliance_calendar/
├── __init__.py
├── engine.py
└── README.md
```
