# Module P4: System Health & Ops API

The **P4** module provides centralized operational health monitoring, uptime tracking, database connectivity verification, vector index freshness tracking, and downstream microservice probing for the **SAATHI BIS Assistant** platform.

---

## 🚀 Key Features

| Feature | Detail |
|---|---|
| **Composite Health Check** | Monitors PostgreSQL and Redis connectivity with latency measurements |
| **Vector Index Freshness** | Queries `document_chunks` table for `MAX(created_at)` to evaluate indexing recency |
| **System Telemetry** | Node.js process uptime, human-readable duration, and RSS / Heap memory metrics |
| **Microservice Probing** | Lightweight health probes for downstream services (`M3 Retrieval`, `M5 Generation`, `M9 Session`) |
| **Readiness & Liveness** | Container readiness probe endpoint (`/ready`) and lightweight uptime endpoint (`/uptime`) |

---

## 📁 Directory Structure

```
p4/
├── src/
│   ├── modules/
│   │   └── health/
│   │       ├── health.controller.ts
│   │       ├── health.module.ts
│   │       └── health.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── health.service.spec.ts
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 🛠️ Setup & Execution

```bash
cd p4

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run unit tests
npm test

# Start service in watch mode
npm run start:dev
```

---

## 🔒 API Endpoints

| Method | Endpoint | Description | Target Consumer |
|---|---|---|---|
| `GET` | `/api/v1/ops/health` | Comprehensive health report (Postgres, Redis, Uptime) | Ops Dashboard / Uptime Monitors |
| `GET` | `/api/v1/ops/ingestion` | Vector index freshness & pipeline status | P4 Ops Page / Admin Dashboard |
| `GET` | `/api/v1/ops/uptime` | Lightweight uptime and memory stats (no DB query) | Kubernetes Liveness Probe |
| `GET` | `/api/v1/ops/ready` | Database readiness check | Kubernetes Readiness Probe |

### Example: GET `/api/v1/ops/health`

```json
{
  "status": "healthy",
  "checkedAt": "2026-08-31T18:00:00.000Z",
  "uptime": {
    "processUptimeSeconds": 86420,
    "processUptimeHuman": "24h 0m 20s",
    "memoryUsageMb": {
      "rss": 54.21,
      "heapUsed": 32.15,
      "heapTotal": 48.00,
      "external": 4.12
    },
    "nodeVersion": "v20.11.0",
    "platform": "win32"
  },
  "components": {
    "postgres": {
      "status": "healthy",
      "latencyMs": 4,
      "detail": "Connection OK"
    },
    "redis": {
      "status": "healthy",
      "latencyMs": 2,
      "detail": "PONG received"
    }
  }
}
```

### Example: GET `/api/v1/ops/ingestion`

```json
{
  "pipeline": "operational",
  "vectorIndex": {
    "lastChunkCreatedAt": "2026-08-31T15:30:00.000Z",
    "ageHours": 2.5,
    "totalChunks": 18450,
    "isStale": false,
    "stalenessThresholdHours": 24,
    "status": "fresh"
  },
  "downstreamServices": {
    "m3Retrieval": { "status": "healthy", "latencyMs": 12, "detail": "HTTP 200" },
    "m5Generation": { "status": "healthy", "latencyMs": 18, "detail": "HTTP 200" },
    "m9Session": { "status": "healthy", "latencyMs": 8, "detail": "HTTP 200" }
  },
  "checkedAt": "2026-08-31T18:00:00.000Z"
}
```
