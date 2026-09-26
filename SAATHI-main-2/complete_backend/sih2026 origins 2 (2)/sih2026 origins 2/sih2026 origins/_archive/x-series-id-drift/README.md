# X-Series ID Drift Archive

This archive contains the legacy plain `index.js` glue files from `x/X1` through `x/X10` that were identified during Phase 0 reconciliation as mislabelled duplicates/mismatches with the Master Feature Tracker.

## Reconciliation Map

| ID | Authoritative Tracker Definition (`src/` tree) | Legacy Mismatched `index.js` (Archived Here) |
|---|---|---|
| **X1** | Clause/Section-Level Deep Linking & Citation Resolution | `X1_UserDashboardService.js` |
| **X2** | Cite-or-Decline Groundedness & Hallucination Guardrail | `X2_ComplianceFeedbackService.js` |
| **X3** | Officer Escalation & Expert Helpdesk Routing | `X3_NotificationPreferencesService.js` |
| **X4** | Regulatory Change & Circular Crawler | `X4_MultilingualPreferencesService.js` |
| **X5** | Dynamic Compliance Checklist & Gap Verification Engine | `X5_ApplicationDraftsService.js` |
| **X6** | WhatsApp Compliance Assistant & Meta Webhook Engine | `X6_ExportReportingService.js` |
| **X7** | Voice Query & Multilingual STT Normalizer (Bhashini/Groq) | `X7_TeamCollaborationService.js` |
| **X8** | Compliance Gap & Drop-Off Telemetry Analytics | `X8_DocumentPreviewAnnotationService.js` |
| **X9** | Offline Compliance Pack & PWA Sync Builder | `X9_SearchHistoryService.js` |
| **X10** | Enterprise API Keys, Rate Limiting & Developer Portal | `X10_ComplianceTaggingService.js` |

All `x/X1`–`x/X10` folders now authoritatively export their real tracker implementations from `src/`.
