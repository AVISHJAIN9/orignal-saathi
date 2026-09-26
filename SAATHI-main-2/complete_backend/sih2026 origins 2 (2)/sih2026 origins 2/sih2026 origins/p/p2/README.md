# Module P2: Data Retention & Privacy Controls

The **P2** module implements automated background data retention and privacy controls for the **SAATHI BIS Assistant** platform. It runs a configurable cron job that purges `Conversation` and `Message` records from the shared PostgreSQL database (`bis_db`) once they exceed the configured retention window.

> **Important**: `synchronize: false` is hard-coded so this module never alters the existing M9 database schema.

---

## 🚀 Key Features

1. **Configurable Retention Policy** via environment variables:
   - `RETENTION_DAYS` (default: `90`) — Age threshold for purging records
   - `CRON_SCHEDULE` (default: `0 0 * * *`) — Standard 5-field cron expression for scheduled execution

2. **Transactional Purge** (`RetentionService`):
   - Opens a TypeORM `QueryRunner` transaction
   - Deletes expired `messages` **before** deleting `conversations` to respect FK constraints
   - Rolls back the full transaction on any error; structured logs report success / failure / counts

3. **Manual Trigger API** (`RetentionController`):
   - `POST /api/v1/retention/trigger` — Fires an immediate purge with optional `retentionDays` override
   - `GET  /api/v1/retention/status`  — Returns current policy settings and live expired record count

4. **Shared Entity Stubs** mirroring M9 schema:
   - [`conversation.entity.ts`](src/modules/retention/entities/conversation.entity.ts) → `conversations` table
   - [`message.entity.ts`](src/modules/retention/entities/message.entity.ts) → `messages` table

---

## 📁 Directory Structure

```
p2/
├── src/
│   ├── config/
│   │   └── retention.config.ts        ← Typed config factory
│   ├── modules/
│   │   └── retention/
│   │       ├── dto/
│   │       │   └── trigger-purge.dto.ts
│   │       ├── entities/
│   │       │   ├── conversation.entity.ts
│   │       │   └── message.entity.ts
│   │       ├── retention.controller.ts
│   │       ├── retention.module.ts
│   │       └── retention.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── retention.service.spec.ts
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 🛠️ Setup & Usage

```bash
cd p2

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit RETENTION_DAYS, CRON_SCHEDULE, DATABASE_URL to match your deployment

# Run unit tests
npm test

# Start in development mode
npm run start:dev
```

---

## 🔒 API Endpoints

| Method | Endpoint | Description | Auth Recommended |
|---|---|---|---|
| `POST` | `/api/v1/retention/trigger` | Immediate manual purge (optional `retentionDays` body) | Admin JWT (via p1 `JwtAuthGuard` + `@Roles(admin)`) |
| `GET` | `/api/v1/retention/status` | Policy config + live expired record count | Admin JWT |
| `GET` | `/api/v1/retention/health` | Service health ping | Public |

### Example: Manual Trigger with Override

```bash
curl -X POST http://localhost:8002/api/v1/retention/trigger \
  -H "Content-Type: application/json" \
  -d '{"retentionDays": 30}'
```

### Example Response (SUCCESS)

```json
{
  "message": "Purge completed: 47 conversations and 312 messages deleted.",
  "result": {
    "status": "SUCCESS",
    "deletedConversations": 47,
    "deletedMessages": 312,
    "retentionDays": 30,
    "cutoffDate": "2026-08-01T17:00:00.000Z",
    "durationMs": 143,
    "executedAt": "2026-08-31T17:00:00.000Z"
  }
}
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `RETENTION_DAYS` | `90` | Days after which conversations are purged |
| `CRON_SCHEDULE` | `0 0 * * *` | Cron expression for the automated job |
| `RETENTION_CRON_ENABLED` | `true` | Toggle automatic cron execution |
| `DATABASE_URL` | — | Full PostgreSQL connection URI (takes priority over individual vars) |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_DATABASE` | `bis_db` | Database name (must match M9's database) |
| `PORT` | `8002` | Service listening port |
