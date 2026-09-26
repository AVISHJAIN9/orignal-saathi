# C7: Intelligent Laboratory Matcher

- **Priority Tier**: S-Tier
- **Journey Stage**: Compliance Intelligence (Testing Lab Discovery & Routing)
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Implementation Module**: [engine.py](file:///Users/avishjain/Desktop/sih2026%20origins/c/C7_intelligent_laboratory_matcher/engine.py)
- **API Gateway Exposure**: [server.py](file:///Users/avishjain/Desktop/sih2026%20origins/server.py)

---

## 1. Executive Summary & Purpose
Finding a laboratory that is officially recognized by BIS and possesses specific NABL accreditation for a standard's entire parameter scope is a major bottleneck for manufacturers.

The **C7 Intelligent Laboratory Matcher**:
1. Indexes BIS Central, Regional, Branch, and NABL-accredited third-party laboratories.
2. Filters by exact Indian Standard number (`IS 10500`, `IS 269`, `IS 1293`, `IS 2062`, `IS 16046`, etc.).
3. Performs geographic proximity ranking using state / 6-digit pincode matching.
4. Returns turnaround times, contact details, and NABL certificate numbers.

---

## 2. REST API Specification
- **Endpoint**: `GET /api/v1/compliance/labs?standard=IS+10500:2012&state=Delhi`
- **Query Parameters**:
  - `standard` (e.g. `IS 10500:2012`)
  - `pincode` (e.g. `110007`)
  - `state` (e.g. `Delhi`, `Maharashtra`, `Uttar Pradesh`)
