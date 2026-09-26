# Module X1: Clause/Section-Level Deep Linking Engine

## Overview
Module X1 provides deep linking, granular citation parsing, and reverse clause analytics for the SAATHI (SIH26107) AI Assistant.

## Key Capabilities
- **Multi-Citation & Compound Parsing**: Extracts individual, compound, table, annexure, and figure references.
- **Deep Link Generation & Bidirectional Resolution**: Generates `/standards/view/:docId?chunkId=...#clause-...` URLs and parses them back safely with error guards.
- **Reverse Indexing**: Maps standard clauses to citizen queries to surface most demanded clauses for X8 Gap Analytics.
- **NestJS Architecture**: Fully injectable service, controller, and module.

## Endpoints
- `POST /standards/citations/parse`
- `POST /standards/citations/extract-all`
- `POST /standards/citations/build-link`
- `GET /standards/citations/resolve-link`
- `GET /standards/citations/most-cited`
