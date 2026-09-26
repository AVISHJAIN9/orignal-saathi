# C8: Regulatory Change Alerts

- **Priority Tier**: S-Tier
- **Journey Stage**: Compliance Intelligence (Regulatory Change Feeds & Subscriptions)
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Implementation Module**: [engine.py](file:///Users/avishjain/Desktop/sih2026%20origins/c/C8_regulatory_change_alerts/engine.py)
- **API Gateway Exposure**: [server.py](file:///Users/avishjain/Desktop/sih2026%20origins/server.py)

---

## 1. Executive Summary & Purpose
The **C8 Regulatory Change Alerts** system continuously tracks:
1. New Gazetted Quality Control Orders (QCOs) under Section 16 of the BIS Act.
2. Draft WTO Technical Barriers to Trade (TBT) notifications.
3. Gazette deadline extensions and corrigenda.
4. Standard amendments and revision issuances.

---

## 2. REST API Specification
- **Endpoint**: `GET /api/v1/compliance/alerts`
- **Optional Query Parameters**:
  - `standard` (e.g. `IS 10500`)
  - `impact` (e.g. `CRITICAL`, `HIGH`)
