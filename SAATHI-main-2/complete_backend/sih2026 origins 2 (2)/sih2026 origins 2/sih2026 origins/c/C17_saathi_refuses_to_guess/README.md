# C17: SAATHI Refuses to Guess (Uncertainty Calibration & Guardrails Engine)

- **Priority Tier**: High (A-Tier Guardrail Core)
- **Journey Stage**: Safety & Trust Calibration
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Detects out-of-scope, ambiguous, or dangerous queries and produces a calibrated refusal with appropriate redirect to authorized BIS technical committees or officers.

---

## 1. Overview & Capabilities
The **SAATHI Refuses to Guess** engine is a deterministic guardrail layer that prevents legal liability, hallucinated specifications, and illicit advice.

### Refusal Categories
1. **`FINANCIAL_SPECULATION`**: Crypto, stock tips, forex, get-rich schemes.
2. **`MEDICAL_ADVICE`**: Prescription drugs, medical cures (redirects to CDSCO/DCGI).
3. **`ILLEGAL_CIRCUMVENTION`**: Bribes, fake hallmark markings, circumventing BIS act.
4. **`UNDERSPECIFIED_QUERY`**: Single-word or ambiguous queries without product context.
5. **`SECTIONAL_COMMITTEE_ESCALATION`**: Novel composite materials or technical disputes requiring formal Sectional Committee review (C18).

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/safety/evaluate`

### Request Payload
```json
{
  "query_text": "Can you tell me how to bypass customs without BIS certificate?",
  "context_provided": null
}
```

### Response Payload
```json
{
  "is_refused": true,
  "refusal_type": "PROHIBITED_DOMAIN",
  "category": "ILLEGAL_CIRCUMVENTION",
  "confidence": 0.99,
  "message": "SAATHI refuses to guess or provide advice on ILLEGAL_CIRCUMVENTION. SAATHI strictly enforces the Bureau of Indian Standards Act, 2016 and cannot assist in statutory circumvention or criminal offences.",
  "suggested_redirect": "Please ask a question related to BIS Indian Standards (IS), QCO orders, or laboratory test procedures.",
  "escalate_to_officer": false,
  "timestamp": "2026-09-12T14:42:00Z"
}
```

---

## 3. Directory Structure
```
c/C17_saathi_refuses_to_guess/
├── __init__.py
├── engine.py
└── README.md
```
