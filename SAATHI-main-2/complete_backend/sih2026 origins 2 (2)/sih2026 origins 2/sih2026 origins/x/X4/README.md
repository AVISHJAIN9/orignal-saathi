# Module X4: Auto-Updating Knowledge Base Crawler & Lifecycle Management

## Overview
Module X4 polls BIS circulars, detects clause-level differences, tracks document lifecycles (`ACTIVE`, `SUPERSEDED`, `WITHDRAWN`), and dispatches cache invalidation signals.

## Key Capabilities
- **Automated Crawler & Ingestion**: Fetches gazette circulars and parses regulatory amendments.
- **SHA-256 Clause Hashing & Markdown Diffs**: Accurately flags modified clauses and generates visual diff reports.
- **Document Lifecycle Manager**: Manages historical standard revisions and superseding chains.
- **Cache Invalidation Signals**: Triggers X9 offline bundle rebuilding and X2 vector re-embedding.

## Endpoints
- `POST /crawler/poll`
- `POST /crawler/ingest-circulars`
- `GET /crawler/standards/:stdNum/active`
- `GET /crawler/standards/:stdNum/history`
