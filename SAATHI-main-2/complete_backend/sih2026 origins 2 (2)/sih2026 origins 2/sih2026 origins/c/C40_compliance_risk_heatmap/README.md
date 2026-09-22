# C40: Compliance Risk Heatmap & GRC Risk Register

- **Priority Tier**: High (A-Tier 5x5 Matrix GRC Dashboard)
- **Journey Stage**: Executive Oversight & Continuous Monitoring
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Aggregates risk vectors across overdue surveillance audits, expiring lab test reports, upcoming mandatory QCO deadlines, and factory non-conformance signals into a composite 5x5 risk matrix.

---

## 1. Overview & Capabilities
The **Compliance Risk Heatmap Engine** calculates composite likelihood × impact risk factors across all active compliance vectors to visualize vulnerabilities on a 5x5 GRC risk grid.

---

## 2. API Reference

### Endpoint
`GET /api/v1/compliance/risk-heatmap`

### Response Payload
```json
{
  "license_id": "CML-8400192831",
  "composite_risk_score": 48,
  "overall_status": "MODERATE_RISK",
  "critical_risks_count": 1,
  "high_risks_count": 1,
  "total_tracked_risks": 4,
  "heatmap_grid_5x5": [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0]
  ],
  "risk_items": [
    {
      "risk_id": "RISK-01",
      "category": "CALIBRATION_EXPIRY",
      "title": "UTM Compressive Tester Calibration Due in 14 Days",
      "impact_score": 4,
      "likelihood_score": 5,
      "risk_level": "CRITICAL",
      "clause_affected": "IS 269:2015 Clause 6.1",
      "mitigation_task": "Schedule NABL calibration technician before annual surveillance audit."
    }
  ],
  "summary": "Entity has 1 critical and 1 high compliance risk factors requiring proactive resolution."
}
```

---

## 3. Directory Structure
```
c/C40_compliance_risk_heatmap/
├── __init__.py
├── engine.py
└── README.md
```
