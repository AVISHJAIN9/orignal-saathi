# D5 — Admin Document Management Panel (backend)

Backend-only implementation of **D5** from the SAATHI (SIH26107) feature
matrix. No frontend is included by design — this is the NestJS API
surface the D5 admin panel UI would call, plus the internal contract
M1's ingestion service uses to report progress back.

## What D5's spec row asked for, and where it lives

| Spec requirement (Backend Work Required, D5) | Implementation |
|---|---|
| Multipart upload to object storage | `AdminDocumentsController.upload` + `StorageService` (local disk for dev, S3 for prod — `STORAGE_DRIVER` env) |
| Calls M1's ingestion trigger and X4's re-ingestion path | `AdminDocumentsService.triggerIngestion` enqueues via `IngestionQueueService` (BullMQ/Redis); `POST /admin/documents/:id/reingest` is the X4-path equivalent |
| Admin authentication and session management | `admin-auth/` module — JWT login (`POST /admin/auth/login`), `JwtStrategy`, `JwtAuthGuard` |
| Audit logging of admin document changes | `AdminAuditLogService` — append-only, no update/delete methods exposed |
| Admin-only RBAC guard | `RolesGuard` + `@Roles('admin')`, layered after `JwtAuthGuard` on every route |
| Audit-log schema for admin document changes | `AdminAuditLog` entity (`admin_audit_log` table) |
| Ingestion job-status table (doc_id, stage, error_message, timestamps), separate from M1's raw doc storage | `IngestionJob` entity (`ingestion_jobs` table), owned entirely by `IngestionJobsService` |

Also implemented, even though the frontend itself is out of scope here,
because the spec's frontend row for D5 depends on it existing:
- **"per-document ingestion-status tracker"** → `GET /admin/documents/:id/status`
  (latest job) and `GET /admin/documents/:id/jobs` (full history) — this
  is what a frontend would poll.

## What's deliberately stubbed, and why

- **M1's real extraction/chunking pipeline** doesn't exist yet in this
  repo (it's a different person's module). D5's job is only to *enqueue*
  ingestion work and *store* status updates — not to do extraction
  itself. `IngestionMockProcessor` is a dev-only stand-in that simulates
  M1 finishing a job, so the full upload → queue → status-update → poll
  loop is demoable end-to-end before M1 is built. It's gated behind
  `ENABLE_MOCK_INGESTION_WORKER=true` and logs a loud warning when active.
  Delete it once the real M1 worker exists.
- **`internal/ingestion-jobs/:id/status`** is the real contract M1's
  FastAPI service should call in production (protected by a shared
  `X-Internal-Api-Key` header, not admin JWT — it's service-to-service).
  The mock processor calls the exact same `IngestionJobsService` method,
  so it doubles as a working reference for whoever builds M1.
- **P1's full auth system** (SSO, 2FA) is not reimplemented — `admin-auth/`
  is a minimal, self-contained JWT login scoped to what D5 needs, per the
  spec's explicit note that this system has no full SSO requirement.

## Running it

```bash
cp .env.example .env        # then fill in DB/Redis values
npm install
npm run typecheck           # tsc --noEmit
npm test                    # jest unit tests
npm run start:dev           # requires Postgres + Redis reachable
```

Create an admin user (no self-signup by design):

```bash
ADMIN_EMAIL=admin@saathi.gov.in ADMIN_PASSWORD=changeme123 npm run seed:admin
```

API docs: `http://localhost:3001/docs` (Swagger, admin routes require
the bearer token from `/admin/auth/login`).

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/admin/auth/login` | Admin login → JWT |
| POST | `/admin/documents` | Upload a document (multipart) → queues ingestion |
| GET | `/admin/documents` | List documents (filter by status, paginated) |
| GET | `/admin/documents/:id` | Document detail |
| GET | `/admin/documents/:id/status` | Poll latest ingestion status |
| GET | `/admin/documents/:id/jobs` | Full ingestion job history |
| POST | `/admin/documents/:id/reingest` | Manually re-trigger ingestion |
| PATCH | `/admin/documents/:id/retire` | Retire (soft-delete) a document |
| PATCH | `/admin/documents/:id/restore` | Restore a retired document |
| DELETE | `/admin/documents/:id` | Hard delete a document |
| GET | `/admin/audit-log` | Recent admin actions |
| GET | `/admin/audit-log/document/:documentId` | Audit trail for one document |
| PATCH | `/internal/ingestion-jobs/:id/status` | (internal, API-key auth) M1 reports job progress |

All `/admin/*` routes require `Authorization: Bearer <token>` from an
account with `role = 'admin'`.

## Design choices worth knowing about

- **Document metadata lives in D5's own table**, not M1's raw-storage
  table — the spec is explicit that these are separate concerns (D5:
  what the panel displays/acts on; M1: object-storage ref + parsed-
  structure cache). This repo's `Document` entity is the D5-owned record
  created at upload time; M1 would read `storagePath`/`checksumSha256`
  off it to do its own work.
- **Storage is behind an interface** (`StorageService`) so local disk
  (dev/demo, no AWS account needed to run this) and S3 (prod) are a
  one-line env-var swap, not a rewrite.
- **Upload is transactional-ish**: the metadata row is created first (to
  get an id for the storage key), and if the storage write then fails,
  the row is deleted rather than left as an orphaned "UPLOADED but no
  file" record.
- **Audit log is append-only by convention** — `AdminAuditLogService`
  exposes `record`/`findForDocument`/`findRecent` and nothing else.

## Not in scope here (explicitly, per the ask)

No frontend. No M1/M2/M3 (extraction, chunking, retrieval) logic beyond
the queue contract D5 needs to trigger them. No P1 full auth/SSO — D5's
auth is intentionally minimal per the spec.
