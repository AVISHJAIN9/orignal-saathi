# C39: Regulatory Knowledge Diff Engine

- **Priority Tier**: High (A-Tier Semantic Diff Core)
- **Journey Stage**: Regulatory Analysis & Gazette Reconciliations
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Extracts technical differences and legal reconciliations between conflicting gazette circulars, enforcement orders, and statutory standards.

---

## 1. Overview & Capabilities
The **Regulatory Knowledge Diff Engine** compares amendments, corrigendums, and transition extensions against primary Quality Control Orders to determine which legal mandate takes precedence.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/regulatory-diff`

### Request Payload
```json
{
  "document_a_title": "DPIIT Gazette S.O. 1245(E)",
  "document_a_text": "Mandatory enforcement date: September 15, 2024 for all cement grades.",
  "document_b_title": "DPIIT Corrigendum S.O. 1890(E)",
  "document_b_text": "Mandatory enforcement date extended: March 15, 2025 for Micro & Small units."
}
```

### Response Payload
```json
{
  "document_a": "DPIIT Gazette S.O. 1245(E)",
  "document_b": "DPIIT Corrigendum S.O. 1890(E)",
  "similarity_score": 0.65,
  "reconciliation_verdict": "AMENDMENT_EXTENSION_IDENTIFIED",
  "key_variance_identified": "Document B extends statutory compliance timeline for specific enterprise classes (MSME extension).",
  "prevailing_legal_order": "DPIIT Corrigendum S.O. 1890(E)",
  "timestamp": "2026-09-12T15:21:00Z"
}
```

---

## 3. Directory Structure
```
c/C39_regulatory_knowledge_diff/
├── __init__.py
├── engine.py
└── README.md
```
