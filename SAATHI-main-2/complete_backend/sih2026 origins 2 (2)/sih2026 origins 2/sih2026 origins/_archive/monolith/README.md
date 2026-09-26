# Monolith Archive

Archived 2026-09-13 during Phase 1 architecture consolidation.

## Why archived
server.js was a second Express gateway parallel to the NestJS microservices.
It routed /api/v1/compliance, /lifecycle, /international, /platform but called
p/index.js (stub) for auth rather than the real p/p1 NestJS service.
Replaced by D1 NestJS gateway which now handles all routing.

## Contents
- server.js — root Express gateway
- controllers/ — complianceController, lifecycleController, internationalController, platformController
- routes/ — complianceRoutes, lifecycleRoutes, internationalRoutes, platformRoutes
- models/ — Application, AuditLog, EvidenceRecord, License, RecallItem (Postgres models)

## Recovery
git log --all to find original commits. All logic still lives in c/, s/, i/ modules.
