# C16: Evidence-Based Answer Builder

- **Priority Tier**: High (A-Tier Grounded Q&A Core)
- **Journey Stage**: Knowledge & Clause Retrieval
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Constructs strictly grounded regulatory answers with verifiable clause anchors, gazette numbers, confidence metrics, and statutory evidence chains.

---

## 1. Overview & Capabilities
The **Evidence-Based Answer Builder** prevents hallucinations by grounding every regulatory response in verbatim Indian Standards clauses, Sectional Committee specifications, and official Gazette notifications.

### Evidence Chain Hierarchy
1. **Statutory Act**: Bureau of Indian Standards Act, 2016 (Section 16 & Section 29).
2. **Standard Specification**: Clause text, table limits, and test methods from official IS documents.
3. **Gazette Notification**: Ministry (DPIIT/MeitY/MoEFCC) Quality Control Orders.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/answer-builder/query`

### Request Payload
```json
{
  "query_text": "What is the compressive strength requirement for 43 grade cement?",
  "target_standard": "IS 269",
  "user_role": "MANUFACTURER"
}
```

### Response Payload
```json
{
  "query": "What is the compressive strength requirement for 43 grade cement?",
  "target_standard": "Ordinary Portland Cement Specification (IS 269:2015)",
  "synthesized_answer": "Under Ordinary Portland Cement Specification (IS 269:2015), Clause 6.2 (Compressive Strength): '28-day compressive strength for 43 Grade shall not be less than 43 MPa and not more than 58 MPa; 53 Grade shall not be less than 53 MPa.'. This requirement is mandatory and enforced under gazette S.O. 1245(E).",
  "confidence_score": 0.98,
  "grounding_status": "STRICTLY_GROUNDED_IN_STANDARD",
  "primary_clause": "Clause 6.2",
  "primary_topic": "Compressive Strength",
  "all_matched_clauses": ["Clause 6.2"],
  "evidence_chain": [
    {
      "level": "STATUTORY_ACT",
      "authority": "Bureau of Indian Standards Act, 2016 (Section 16 & Section 29)",
      "legal_weight": "MANDATORY_CENTRAL_LAW"
    },
    {
      "level": "STANDARD_SPECIFICATION",
      "standard": "Ordinary Portland Cement Specification (IS 269:2015)",
      "clause_number": "Clause 6.2",
      "clause_text": "28-day compressive strength for 43 Grade shall not be less than 43 MPa and not more than 58 MPa; 53 Grade shall not be less than 53 MPa."
    },
    {
      "level": "GAZETTE_NOTIFICATION",
      "gazette_id": "S.O. 1245(E)",
      "issuing_authority": "Ministry of Commerce and Industry (DPIIT) / MeitY / BIS"
    }
  ],
  "gazette_citation": "S.O. 1245(E)",
  "timestamp": "2026-09-12T14:40:00Z"
}
```

---

## 3. Directory Structure
```
c/C16_evidence_based_answer_builder/
├── __init__.py
├── engine.py
└── README.md
```
