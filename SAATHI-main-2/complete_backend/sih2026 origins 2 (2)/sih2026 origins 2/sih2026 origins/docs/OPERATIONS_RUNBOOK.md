# SAATHI Operations & SRE Runbook (Phase 6.10)
**Version:** 1.0.0 · **Classification:** SRE / Production Operations · **Last Updated:** 2026-09-13

---

## 1. Scope & Architecture Overview

SAATHI is a Bureau of Indian Standards (BIS) compliance-intelligence platform composed of:
- **D1 API Gateway & Chat Orchestrator** (`d/D1`) — NestJS TypeScript proxy, auth verification, and circuit breaker.
- **M5 RAG Pipeline Core** (`m/m5`) — FastAPI Python RAG engine with single-flight cache and TTL jitter.
- **P1 Authentication Engine** (`p/p1`) — Express/PostgreSQL JWT and role-based access controller.
- **G-Series Microservices** (`g/`) — G5 Transactional Email Engine with BullMQ + DLQ.
- **D-Series Microservices** (`d/`) — D5 Admin Document Ingestion with BullMQ + DLQ.
- **PostgreSQL 16 + pgvector** — Authoritative statutory metadata and dense vector storage.
- **Redis 7.2** — BullMQ queues, distributed locks, session memory, and semantic caching.

---

## 2. Secret Rotation Playbook

### 2.1 P1 JWT Secret Rotation
**Frequency:** Every 90 days or immediately upon key compromise alert.  
**Impact:** Zero-downtime rolling update. Existing valid tokens supported during a 15-minute grace window.

1. **Generate New Secret:**
   ```bash
   NEW_JWT_SECRET=$(openssl rand -base64 48)
   echo "New Secret: $NEW_JWT_SECRET"
   ```
2. **Update Environment Variables:**
   - Set `JWT_SECRET_PREVIOUS` to current `JWT_SECRET`.
   - Set `JWT_SECRET` to `$NEW_JWT_SECRET`.
3. **Deploy Rolling Restart:**
   ```bash
   kubectl rollout restart deployment/p1-auth -n saathi
   kubectl rollout restart deployment/d1-chat -n saathi
   ```
4. **Validation:**
   - Authenticate new user via `POST /auth/login` → verify token validates on `GET /chat/sessions`.
   - Verify previous token issued within grace window is accepted by `P1JwtAuthGuard`.
5. **Retire Old Secret:**
   After 24 hours, remove `JWT_SECRET_PREVIOUS` and restart pods.

### 2.2 PostgreSQL Database Password Rotation
**Impact:** Database connection poolers (PgBouncer) will reload credentials without dropping active transactions.

1. **Update Password in PostgreSQL:**
   ```sql
   ALTER USER saathi_app WITH PASSWORD '<NEW_STRONG_PASSWORD>';
   ```
2. **Update PgBouncer `userlist.txt`:**
   ```bash
   echo '"saathi_app" "<NEW_STRONG_PASSWORD>"' > /etc/pgbouncer/userlist.txt
   pgbouncer -R /etc/pgbouncer/pgbouncer.ini
   ```
3. **Update Kubernetes Secret:**
   ```bash
   kubectl create secret generic postgres-credentials \
     --from-literal=DB_PASSWORD='<NEW_STRONG_PASSWORD>' \
     -n saathi --dry-run=client -o yaml | kubectl apply -f -
   ```

### 2.3 LLM / Provider API Key Rotation
**Target:** `OPENAI_API_KEY`, `GROQ_API_KEY`, `HUGGINGFACE_API_KEY`.

1. **Verify New Key:**
   ```bash
   curl https://api.openai.com/v1/models -H "Authorization: Bearer $NEW_OPENAI_KEY"
   ```
2. **Patch M5 Deployment:**
   ```bash
   kubectl set env deployment/m5-rag OPENAI_API_KEY="$NEW_OPENAI_KEY" -n saathi
   kubectl rollout status deployment/m5-rag -n saathi
   ```
3. **Audit Log:** Record rotation in `docs/security-audit.log` with timestamp and operator ID.

---

## 3. Cache Purge & Queue Re-drive Procedures

### 3.1 Redis Semantic Cache Purge (M5 RAG)
When standard definitions or QCO orders are amended by the BIS, cached RAG answers must be invalidated immediately.

```bash
# Connect to Redis CLI in the Saathi cluster
kubectl exec -it deployment/redis -n saathi -- redis-cli

# Option A: Invalidate RAG query answer cache only
redis-cli KEYS "rag:cache:*" | xargs redis-cli DEL

# Option B: Invalidate specific standard's cached chunks (e.g., IS 269:2015)
redis-cli KEYS "*IS_269*" | xargs redis-cli DEL

# Option C: Flush distributed locks (if a deadlock occurs)
redis-cli KEYS "lock:*" | xargs redis-cli DEL
```

### 3.2 BullMQ Dead-Letter Queue (DLQ) Triage & Re-Drive
When background jobs fail after 3 exponential backoff attempts, they are routed to their respective DLQ (`email-dispatch-dlq` and `ingestion-jobs-dlq`).

1. **Inspect DLQ Backlog:**
   ```bash
   # Count dead-letter email jobs
   kubectl exec -it deployment/redis -n saathi -- redis-cli LLEN "bull:email-dispatch-dlq:wait"
   
   # Count dead-letter ingestion jobs
   kubectl exec -it deployment/redis -n saathi -- redis-cli LLEN "bull:ingestion-jobs-dlq:wait"
   ```

2. **Re-drive DLQ Jobs (Safe Re-injection):**
   ```javascript
   // scripts/redrive-dlq.js
   const { Queue } = require('bullmq');
   const redis = { host: process.env.REDIS_HOST || 'localhost', port: 6379 };
   
   async function redrive() {
     const dlq = new Queue('email-dispatch-dlq', { connection: redis });
     const targetQueue = new Queue('email-dispatch', { connection: redis });
     
     const jobs = await dlq.getJobs(['waiting', 'failed'], 0, 100);
     console.log(`Re-driving ${jobs.length} jobs to active queue...`);
     for (const job of jobs) {
       await targetQueue.add('send', job.data.payload);
       await job.remove();
     }
   }
   redrive();
   ```

---

## 4. Emergency RAG-Down Fallback Procedure

### 4.1 Trigger Conditions
The RAG-Down procedure MUST be initiated when:
- M5 endpoint `/generate` returns HTTP 500/503 for > 3 consecutive queries.
- LLM API rate limits (HTTP 429) persist for > 60 seconds.
- Vector database latency exceeds P99 of 2,500ms.
- Circuit breaker on D1 transitions to `OPEN` state.

### 4.2 Automated Circuit Breaker Behavior
D1's `CircuitBreakerService` (`d/D1/src/common/resilience/circuit-breaker.service.ts`) automatically:
1. Trips `OPEN` after 5 consecutive upstream failures.
2. Diverts incoming chat queries to **Statutory Rule-Based Catalog Fallback**.
3. Re-routes queries to `m/m7/database.py` (authoritative local Indian Standards catalog).
4. Serves standard clause lookups directly from cached SQLite/Postgres tables without LLM synthesis.

### 4.3 Manual Emergency Degraded Mode Override
If automated tripping fails, operators can force degraded fallback:

```bash
# Set circuit breaker force-open flag in D1
kubectl set env deployment/d1-chat RAG_FORCE_DEGRADED_MODE="true" -n saathi
kubectl rollout restart deployment/d1-chat -n saathi
```

**Degraded Mode Response Guarantee:**
- System returns statutory BIS standard number and scope verbatim from the catalog.
- Appends mandatory disclaimer:
  > *"Notice: SAATHI AI Synthesis Engine is currently running in Statutory Offline Mode. Information shown is retrieved directly from official BIS Standard catalogs without automated summarization."*
- **NO HALLUCINATIONS:** System will never guess answers when RAG is down; it strictly cites known standards or declines.

### 4.4 Recovery Checklist
1. Verify LLM API provider status (e.g., status.openai.com).
2. Execute synthetic health check against M5:
   ```bash
   curl -X POST http://localhost:8000/health
   curl -X POST http://localhost:8000/generate -H "Content-Type: application/json" \
     -d '{"query":"IS 269 cement grades","history":[]}'
   ```
3. Disable degraded mode:
   ```bash
   kubectl set env deployment/d1-chat RAG_FORCE_DEGRADED_MODE="false" -n saathi
   ```
4. Run guardrail test: `node scripts/run_adversarial_eval.js` → verify 100% pass rate.
5. Notify on-call team and resolve incident ticket.

---

## 5. Quick Reference & Emergency Contacts

| Service | Port | Health Endpoint | On-Call Metric |
|---|---|---|---|
| **D1 Gateway** | `3000` | `/health` | `http_requests_5xx_total` |
| **P1 Auth** | `8001` | `/health` | `auth_failures_total` |
| **M5 RAG Engine** | `8000` | `/health` | `rag_generation_latency_seconds` |
| **G5 Email Engine** | `3003` | `/health` | `bull_queue_email_dlq_count` |
| **D5 Document Ingestion** | `3005` | `/health` | `bull_queue_ingestion_dlq_count` |
