# SAATHI — Disaster Recovery Runbook

> [!CAUTION]
> This runbook describes procedures that modify or restore production systems.
> Always follow the **two-person rule**: no DR action is performed by a single engineer alone.
> All actions must be recorded in the incident Slack channel with timestamps.

**Last updated:** 2026-09-13  
**RTO target:** 4 hours | **RPO target:** 15 minutes

---

## 1. Incident Severity Classification

| Level | Definition | Response Time | Who Is Notified |
|---|---|---|---|
| P0 — Total Outage | All SAATHI services unreachable | Immediate (< 5 min) | On-call engineer + Engineering lead + Legal (if data breach) |
| P1 — Major Degradation | Core RAG chat failing; > 10% error rate | < 15 min | On-call engineer + Engineering lead |
| P2 — Partial Degradation | Single non-critical service down | < 1 hour | On-call engineer |
| P3 — Monitoring Alert | Alert firing but users not impacted | Next business day | Assigned engineer |

---

## 2. On-Call Contacts

```
Primary on-call:    Rotate via PagerDuty / on-call schedule
Engineering Lead:   [fill in]
DPO contact:        [fill in — required for any data breach per DPDP Act S.8(6)]
CERT-In:            incident@cert-in.org.in | +91-1800-11-4949
```

---

## 3. First-Responder Checklist (P0/P1)

Run these checks in order. Stop at the first positive finding and follow the recovery procedure.

```bash
# 1. Are all K8s pods running?
kubectl get pods -n saathi-prod

# 2. Is PostgreSQL reachable?
kubectl exec -n saathi-prod deploy/d1-chat -- \
  node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT NOW()').then(r=>console.log('DB OK:',r.rows[0].now)).catch(e=>{console.error('DB FAIL:',e.message);process.exit(1)})"

# 3. Is Redis reachable?
kubectl exec -n saathi-prod deploy/d1-chat -- \
  node -e "const r=require('ioredis');const c=new r(process.env.REDIS_URL);c.ping().then(()=>{console.log('Redis OK');c.quit()}).catch(e=>{console.error('Redis FAIL:',e.message);process.exit(1)})"

# 4. Is D1 Chat responding?
curl -f https://api.saathi.bis.gov.in/health || echo "HEALTH CHECK FAILED"

# 5. Check recent error logs
kubectl logs -n saathi-prod deploy/d1-chat --tail=100 | grep -E "FATAL|ERROR|FatalDatabaseError"

# 6. Check Grafana dashboards
# Grafana: http://grafana.saathi-internal:3100
# Jaeger:  http://jaeger.saathi-internal:16686
```

---

## 4. Recovery Procedures

### 4.1 PostgreSQL Failure

**Symptoms:** `FatalDatabaseError` in logs; all services returning 500; DB health check fails.

```bash
# Step 1: Check RDS/Cloud SQL console for maintenance events
# AWS: aws rds describe-events --source-identifier saathi-prod-postgres --region ap-south-1
# GCP: gcloud sql operations list --instance=saathi-prod

# Step 2: If primary DB is truly down, promote read replica
# AWS RDS:
aws rds promote-read-replica \
  --db-instance-identifier saathi-prod-postgres-replica \
  --region ap-south-1
# Wait 2-5 minutes for promotion

# Step 3: Update DATABASE_URL in K8s secret
kubectl create secret generic saathi-db-secret \
  --from-literal=DATABASE_URL=postgresql://saathi_service:<password>@<new-primary-endpoint>:5432/saathi_prod \
  --namespace saathi-prod \
  --dry-run=client -o yaml | kubectl apply -f -

# Step 4: Rolling restart all services to pick up new secret
kubectl rollout restart deployment -n saathi-prod

# Step 5: Verify DB connectivity
kubectl get pods -n saathi-prod   # All pods should reach Running state
```

**RPO:** PostgreSQL automated backups every 15 minutes (RDS) / continuous (Cloud SQL with PITR).

### 4.2 Redis Failure

**Symptoms:** BullMQ jobs not processing; rate limiting not enforced; session state failures.

```bash
# Step 1: Check Redis cluster status
# AWS: aws elasticache describe-replication-groups --replication-group-id saathi-prod-redis
# GCP: gcloud redis instances describe saathi-prod-redis

# Step 2: If primary Redis is down, update REDIS_URL to replica/new primary
kubectl create secret generic saathi-redis-secret \
  --from-literal=REDIS_URL=redis://:<auth-token>@<new-endpoint>:6379 \
  --namespace saathi-prod \
  --dry-run=client -o yaml | kubectl apply -f -

# Step 3: Restart services
kubectl rollout restart deployment/d1-chat deployment/m1-ingestion deployment/p1-auth -n saathi-prod

# Step 4: Re-queue any jobs that were in-flight during Redis failure
# (BullMQ jobs that were in ACTIVE state are automatically re-queued on reconnect)
```

**Note:** If Redis is unavailable for < 2 minutes, BullMQ auto-reconnects and pending jobs resume.

### 4.3 K8s Node Failure

**Symptoms:** Some pods in Pending or Unknown state; node shows NotReady.

```bash
# Step 1: Identify affected node
kubectl get nodes
kubectl describe node <node-name>   # Look for: MemoryPressure, DiskPressure, PIDPressure

# Step 2: Cordon the node (no new pods scheduled on it)
kubectl cordon <node-name>

# Step 3: Drain the node (evict pods gracefully; PDBs enforce min-availability)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --grace-period=60

# Step 4: HPA will automatically schedule pods on healthy nodes
kubectl get pods -n saathi-prod -w  # Watch pods reschedule

# Step 5: Replace the node
# AWS EKS: Node group will auto-replace via ASG
# GCP GKE: Node pool will auto-repair
```

### 4.4 Complete Cluster Failure / Region Failure

**Symptoms:** Entire EKS/GKE cluster unreachable.

```bash
# Restore from Terraform state and redeploy
cd infra/terraform/aws    # or infra/terraform/gcp
terraform apply -var-file=prod.tfvars   # Recreates cluster

# Re-run migrations
node infra/postgres/migrations/run-migrations.js

# Apply K8s manifests
kubectl apply -k infra/k8s/overlays/production/

# Verify all services are up
kubectl get pods -n saathi-prod
curl https://api.saathi.bis.gov.in/health
```

**RTO for full cluster recreation:** ~30 minutes (Terraform) + ~10 minutes (K8s convergence) = ~40 minutes.

### 4.5 Data Breach Response

**If any personal data may have been exposed:**

1. **Immediately isolate** the affected service: `kubectl scale deployment <name> --replicas=0 -n saathi-prod`
2. **Notify DPO** within 30 minutes
3. **Notify CERT-In** within 6 hours: incident@cert-in.org.in
4. **Notify affected users** within 72 hours (DPDP Act S.8(6))
5. **Preserve logs** — do not restart pods until forensic snapshot taken: `kubectl logs -n saathi-prod deploy/<name> > /tmp/breach-logs-$(date +%s).txt`
6. **Rotate all secrets** via Secrets Manager immediately
7. **Document the timeline** in `docs/incidents/YYYY-MM-DD-<slug>.md`

---

## 5. Database Restoration (PITR)

```bash
# AWS RDS Point-in-Time Recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier saathi-prod-postgres \
  --target-db-instance-identifier saathi-prod-postgres-restored \
  --restore-time 2026-09-13T00:00:00Z \
  --db-instance-class db.r6g.large \
  --region ap-south-1

# GCP Cloud SQL PITR
gcloud sql instances clone saathi-prod-postgres saathi-prod-postgres-restored \
  --point-in-time "2026-09-13T00:00:00.000Z"

# After restoration: run migration idempotency check
node infra/postgres/migrations/run-migrations.js
```

---

## 6. DR Drill Schedule

| Drill Type | Frequency | Responsible |
|---|---|---|
| Database failover (promote replica) | Quarterly | Infrastructure team |
| Redis failover | Quarterly | Infrastructure team |
| Full cluster restore from Terraform | Semi-annually | Infrastructure + Engineering lead |
| Data breach response tabletop | Annually | All hands + Legal + DPO |

**Record all drills** in `docs/dr-drills/YYYY-MM-DD-drill-report.md`.

---

## 7. Post-Incident

After every P0/P1 incident, within 48 hours:

1. Write a blameless postmortem in `docs/incidents/YYYY-MM-DD-<slug>.md`
2. Add any new alert rules to `infra/observability/prometheus/alerts.yml`
3. Update this runbook if a recovery step was missing or wrong
4. File a JIRA ticket for systemic fixes identified
