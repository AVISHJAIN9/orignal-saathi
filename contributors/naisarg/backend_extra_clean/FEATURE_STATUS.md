# SAATHI Backend ("backend extra") — Feature Status Matrix (34 Features)

This document tracks all 34 features across Tier 1, Tier 2, and Tier 3 as mandated by SIH26107.

> **Database Storage Layer Note**:  
> `DatabaseService` (in `src/database/database.service.ts`) currently uses an in-memory storage layer seeded from `all_entities.ts` pending the database team's integration of `TypeOrmModule.forRoot` / `Repository<T>`. All Redis, BullMQ, OCR, QR, ML/RAG, and HTTP layer integrations are fully wired to real live services.

---

| Feature ID | Feature Name | Tier | Endpoint(s) | Status | Data Source | Blocked | Blocker Reason / Notes |
|:---|:---|:---:|:---|:---:|:---:|:---:|:---|
| **T1-02** | Clause-level standard diff engine | Tier 1 | `POST /api/v1/standards/diff` | COMPLETED | Real | N | Uses corpus_chunks clause text + difflib sequence matching, cached in standard_diffs |
| **T1-03** | Certificate/test-report OCR validator | Tier 1 | `POST /api/v1/certificates/validate`<br>`GET /api/v1/jobs/:id` | COMPLETED | Real | N | Fully wired with real BullMQ queue on Redis (port 6379), cert-worker, PDF-parse & Tesseract.js OCR, standard limit rule evaluation |
| **T1-04** | Datasheet/spec-sheet compliance scanner | Tier 1 | `POST /api/v1/datasheets/scan` | COMPLETED | Real | N | Real Tesseract.js OCR and PDF text extraction with clause-by-clause compliance extraction |
| **T1-05** | ISI mark / HUID authenticity verifier | Tier 1 | `POST /api/v1/authenticity/verify` | COMPLETED | Real | N | Real sharp raw pixel decoding + jsQR barcode/QR parsing with CML license regex verification and genuine confidence scoring |
| **T1-09** | GeM tender compliance matcher | Tier 1 | `POST /api/v1/tenders/match` | COMPLETED | Real | N | PDF parsing + regex/NER extraction of IS numbers, cross-checks declared certs |
| **T1-10** | "What-if" regulatory sandbox simulator | Tier 1 | `POST /api/v1/sandbox/simulate` | COMPLETED | Real | N | Stateless rules evaluation against standard_requirements; p95 < 200ms |
| **T1-15** | Certification-path cost/time optimizer | Tier 1 | `GET /api/v1/certification/paths` | COMPLETED | Real | N | Queries certification_paths table by category; pure lookup + sort |
| **T1-16** | Standard genealogy/version graph explorer | Tier 1 | `GET /api/v1/standards/:id/genealogy` | COMPLETED | Real | N | Recursive standard_supersessions traversal into nodes/edges graph |
| **T1-17** | Auto-drafted appeal/reapplication letter | Tier 1 | `POST /api/v1/letters/appeal` | COMPLETED | Real | N | Wired via real HTTP to FastAPI service (ml_services/main.py on port 8001); generates statutory citations and .docx binary export |
| **T1-18** | Reading-level adaptive explanation toggle | Tier 1 | `POST /api/v1/explain` | COMPLETED | Real | N | Wired to FastAPI ML service with real 24h Redis SETEX caching (port 6379) |
| **T1-13/20**| License renewal dashboard + pre-filled draft | Tier 1 | `GET /api/v1/licenses/:id/renewal-status`<br>`POST /api/v1/licenses/:id/renewal-draft` | COMPLETED | Real | N | Computes daysToExpiry + tier; pre-fills renewal application draft |
| **T1-20** | Live production-parameter monitoring hook | Tier 1 | `WS /api/v1/monitoring/stream/:productId` | COMPLETED | Synthetic | N | Real NestJS WebSocketGateway streaming simulated sensor telemetry every 2s with threshold breach alert events, plus HTTP polling fallback |
| **T1-21** | Label/marking compliance checker via photo | Tier 1 | `POST /api/v1/labels/check` | COMPLETED | Real | N | Real Tesseract.js OCR text extraction evaluated against mandatory statutory label_rules |
| **T1-22** | Bulk import consignment checker | Tier 1 | `POST /api/v1/consignments/bulk-check` | COMPLETED | Real | N | CSV stream parsing + batch rule engine; offloads asynchronously to BullMQ queue for >500 rows |
| **T1-23** | Live Gazette notification parser | Tier 1 | `POST /api/v1/gazette/parse` | COMPLETED | Real | N | Real-time PDF/URL parse, extracts amendments and upserts gazette_notifications |
| **T1-24** | Live regulatory alert ticker | Tier 1 | `GET /api/v1/alerts/feed` | COMPLETED | Real | N | SSE/WS push of new rows from gazette_notifications & regulatory_alerts |
| **T1-25** | Personalized compliance calendar | Tier 1 | `GET /api/v1/calendar/:userId` | COMPLETED | Real | N | Aggregates license renewal deadlines + tracked certs into Gantt JSON |
| **T1-26** | "Cite or decline" trust demo | Tier 1 | `POST /api/v1/qa/strict` | COMPLETED | Real | N | Wired via real HTTP to FastAPI service (ml_services/main.py on port 8001); strict cite-or-decline guardrail verified for in-corpus and out-of-corpus queries |
| **T1-27** | Live WhatsApp bot | Tier 1 | `POST /api/v1/whatsapp/webhook` | BLOCKED | Synthetic | Y | Implemented HMAC-SHA256 signature verification & Meta Graph API sender; blocked on live WhatsApp Business Cloud API credentials |
| **T1-28** | Embeddable "BIS Verified" widget | Tier 1 | `GET /api/v1/widget/verify/:licenseId` | COMPLETED | Real | N | Public endpoint (no auth), CORS open, cached SVG badge + JSON |
| **T1-29** | Self-audit checklist with evidence | Tier 1 | `POST /api/v1/self-audit/:productId/items/:itemId/evidence`<br>`GET /api/v1/self-audit/:productId/readiness` | COMPLETED | Real | N | Stores evidence file, marks checklist item complete, computes readiness % |
| **T2-01** | Predictive QCO forecasting | Tier 2 | `GET /api/v1/forecast/qco` | COMPLETED | Real | N | Wired via real HTTP to FastAPI service (ml_services/main.py on port 8001); executes scikit-learn LogisticRegression model for QCO forecast with honest basis ("historical" \| "seeded") |
| **T2-07** | State/UT regulatory overlay | Tier 2 | `GET /api/v1/standards/:id/state-overlay` | COMPLETED | Real | N | Sourced state_regulations join; uncatalogued states marked explicitly |
| **T2-12** | Complaint-driven insights dashboard | Tier 2 | `GET /api/v1/complaints/insights` | COMPLETED | Synthetic | N | Aggregates consumer_complaints; marked synthetic until NCH live link |
| **T2-14** | Lab wait-time estimator | Tier 2 | `GET /api/v1/labs/:labId/wait-estimate` | COMPLETED | Mixed | N | Backlog queue estimation based on real lab scopes + synthetic backlog count |
| **T2-19** | Cross-ministry conflict checker | Tier 2 | `GET /api/v1/standards/:id/conflicts` | COMPLETED | Real | N | Verified cross_ministry_mappings (FSSAI, BEE, CDSCO, Legal Metrology) |
| **T2-30** | Counterfeit hotspot map | Tier 2 | `GET /api/v1/counterfeit/hotspots` | COMPLETED | Synthetic | N | GeoJSON aggregation of counterfeit_reports; marked synthetic |
| **T2-31** | Peer benchmarking | Tier 2 | `GET /api/v1/benchmark/:userId` | COMPLETED | Mixed | N | Percentile ranking of user's readiness score against seeded industry distribution |
| **T2-32** | Sector risk heatmap | Tier 2 | `GET /api/v1/risk/sector-heatmap` | COMPLETED | Mixed | N | Weighted composite of complaint density, counterfeit reports, and amendment rate |
| **T3-06** | Developer API/webhook platform | Tier 3 | `POST /api/v1/dev/api-keys`<br>`POST /api/v1/dev/webhooks` | COMPLETED | Real | N | Scoped API keys, token bucket rate limiter, HMAC-SHA256 signed webhooks, Swagger |
| **T3-08** | Sub-component supply-chain compliance trace | Tier 3 | `POST /api/v1/supply-chain/trace` | COMPLETED | Real | N | Recursive component_hierarchy graph traversal identifying missing certifications |
| **T3-11** | Clause-level provenance/confidence graph | Tier 3 | `GET /api/v1/clauses/:id/provenance` | COMPLETED | Real | N | Returns retrieval chain (source doc, chunk id, similarity score, methodology) |
| **T3-33** | Human-officer escalation with ticket handoff | Tier 3 | `POST /api/v1/escalations`<br>`GET /api/v1/escalations/:id/status` | COMPLETED | Real | N | Creates support_tickets, enqueues to real BullMQ Redis queue for officer assignment |
| **T3-34** | Dispute/grievance tracker | Tier 3 | `POST /api/v1/grievances`<br>`GET /api/v1/grievances/:id`<br>`PATCH /api/v1/grievances/:id/status` | COMPLETED | Real | N | State machine (filed -> under-review -> resolved/rejected), audit log in grievance_status_history |
