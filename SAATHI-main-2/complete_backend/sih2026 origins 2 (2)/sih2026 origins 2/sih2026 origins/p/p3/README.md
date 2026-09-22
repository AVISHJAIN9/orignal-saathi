# Module P3: LLM Cost & Usage Monitoring

The **P3** module provides centralised LLM telemetry for the **SAATHI BIS Assistant** platform. It ingests token usage events from the M5 RAG Generation Engine, calculates real-time API costs using a configurable pricing table, and exposes aggregated budget metrics to the D6 Admin Dashboard.

---

## 🚀 Key Features

| Feature | Detail |
|---|---|
| **Cost Calculation** | Multi-model pricing table (gpt-4o-mini, gpt-4o, gpt-3.5-turbo, …) with env-var overrides |
| **Cache-Aware Billing** | Cache hits bill zero output tokens — aligned with OpenAI prompt-caching semantics |
| **Aggregated Metrics** | Total cost, total tokens, cache-hit %, average latency, per-model breakdown |
| **Safe Schema Mode** | `synchronize: false` — never alters `bis_db` automatically |
| **D6 Dashboard Ready** | Structured JSON responses designed for direct consumption by the React dashboard |

---

## 📁 Directory Structure

```
p3/
├── src/
│   ├── modules/
│   │   └── telemetry/
│   │       ├── dto/
│   │       │   └── log-usage.dto.ts
│   │       ├── entities/
│   │       │   └── llm-usage.entity.ts
│   │       ├── telemetry.controller.ts
│   │       ├── telemetry.module.ts
│   │       └── telemetry.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── telemetry.service.spec.ts
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 🛠️ Setup

```bash
cd p3
npm install
cp .env.example .env

# Create the llm_usage_logs table before first run (synchronize: false):
psql -U postgres -d bis_db -c "
  CREATE TABLE IF NOT EXISTS llm_usage_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id VARCHAR(255),
    model_name      VARCHAR(120) NOT NULL,
    input_tokens    INT NOT NULL DEFAULT 0,
    output_tokens   INT NOT NULL DEFAULT 0,
    total_tokens    INT NOT NULL DEFAULT 0,
    cost_usd        DECIMAL(10,8) NOT NULL DEFAULT 0,
    is_cache_hit    BOOLEAN NOT NULL DEFAULT FALSE,
    latency_ms      INT,
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS idx_llm_usage_model   ON llm_usage_logs (model_name);
  CREATE INDEX IF NOT EXISTS idx_llm_usage_created ON llm_usage_logs (created_at);
  CREATE INDEX IF NOT EXISTS idx_llm_usage_conv    ON llm_usage_logs (conversation_id);
"

npm test           # Run unit tests
npm run start:dev  # Start in watch mode
```

---

## 🔒 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/telemetry/llm-usage` | M5 ingest — report token usage after each LLM call |
| `GET` | `/api/v1/telemetry/stats` | D6 Admin Dashboard — aggregated cost & usage metrics |
| `GET` | `/api/v1/telemetry/pricing` | Current pricing table loaded in memory |
| `GET` | `/api/v1/telemetry/health` | Health check |

### POST `/api/v1/telemetry/llm-usage` — M5 Ingest Payload

```json
{
  "conversationId": "conv-uuid-123",
  "modelName": "gpt-4o-mini",
  "inputTokens": 1200,
  "outputTokens": 450,
  "isCacheHit": false,
  "latencyMs": 780,
  "metadata": { "promptTemplate": "standard_qa", "userLanguage": "en" }
}
```

### GET `/api/v1/telemetry/stats` — Response Shape

```json
{
  "status": "ok",
  "stats": {
    "period": { "startDate": "2026-08-01T00:00:00.000Z", "endDate": "2026-08-31T23:59:59.999Z" },
    "totalRequests": 1547,
    "totalInputTokens": 2847350,
    "totalOutputTokens": 891420,
    "totalTokens": 3738770,
    "totalCostUsd": 0.961734,
    "cacheHitCount": 212,
    "cacheHitPercent": 13.71,
    "averageLatencyMs": 643.5,
    "averageCostPerRequest": 0.000622,
    "breakdownByModel": [
      {
        "modelName": "gpt-4o-mini",
        "requests": 1320,
        "costUsd": 0.428100,
        "cacheHits": 198,
        "avgLatencyMs": 590.4
      }
    ]
  },
  "generatedAt": "2026-08-31T17:00:00.000Z"
}
```

---

## 💲 Cost Model — Default Pricing

| Model | Input (/ 1M tokens) | Output (/ 1M tokens) |
|---|---|---|
| `gpt-4o-mini` | $0.15 | $0.60 |
| `gpt-4o` | $5.00 | $15.00 |
| `gpt-4o-2024-08-06` | $2.50 | $10.00 |
| `gpt-4-turbo` | $10.00 | $30.00 |
| `gpt-3.5-turbo` | $0.50 | $1.50 |

Override any entry via environment variables (see `.env.example`).
