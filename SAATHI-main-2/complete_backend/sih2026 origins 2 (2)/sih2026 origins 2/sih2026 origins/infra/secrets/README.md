# SAATHI — Secrets Management Guide

## The Rule: No Plaintext Secrets in Any Committed File. Ever.

All API keys, database passwords, JWT secrets, and other credentials must be:
1. Injected at runtime via environment variables
2. Stored in a secrets manager (AWS Secrets Manager or GCP Secret Manager)
3. Listed only as `CHANGE_ME` placeholders in `.env.example` files

---

## Local Development

Copy the appropriate `.env.example` to `.env` and fill in your values:

```bash
cp d/D1/.env.example d/D1/.env
# Edit d/D1/.env with your actual local credentials
```

**Never commit a `.env` file.** All `.env` files are in `.gitignore`.

To validate your local setup:
```bash
# Verify no real secrets are committed
grep -r "sk_\|AAAA\|eyJ" --include="*.env" --include="*.env.example" . \
  | grep -v node_modules | grep -v CHANGE_ME
# Should return empty output
```

---

## Production Credential Injection

### AWS (ap-south-1 / Mumbai)

```bash
# Store a secret
aws secretsmanager create-secret \
  --name saathi/prod/openai_api_key \
  --secret-string "sk-proj-..." \
  --region ap-south-1

# Fetch at deploy time and inject into K8s secret
aws secretsmanager get-secret-value \
  --secret-id saathi/prod/openai_api_key \
  --query SecretString \
  --output text \
  --region ap-south-1 | \
  kubectl create secret generic saathi-secrets \
    --from-literal=OPENAI_API_KEY=$(cat -) \
    --namespace saathi-prod \
    --dry-run=client -o yaml | kubectl apply -f -
```

### GCP (asia-south1 / Mumbai)

```bash
# Store a secret
echo -n "sk-proj-..." | \
  gcloud secrets create saathi-prod-openai-api-key \
    --data-file=- \
    --replication-policy=user-managed \
    --locations=asia-south1

# Reference in GKE via Workload Identity (preferred) or Secret Manager CSI driver
# See: https://cloud.google.com/secret-manager/docs/using-other-products/gke-workload-identity
```

---

## Required Secrets Reference

The following secrets must be configured in your secrets manager before deploying:

| Secret Name | Used By | Description |
|---|---|---|
| `OPENAI_API_KEY` | m5, M2, m3 | OpenAI LLM + embeddings (primary) |
| `GEMINI_API_KEY` | M2, m5 | Gemini LLM + embeddings (fallback) |
| `SARVAM_API_KEY` | D1 | Sarvam Indic language translation |
| `DATABASE_URL` | All services | PostgreSQL connection string (full URL with credentials) |
| `REDIS_URL` | D1, P1, m9, BullMQ | Redis connection string |
| `JWT_SECRET` | P1, P2 | JWT signing key (min 32 chars, high-entropy random) |
| `JWT_REFRESH_SECRET` | P1 | JWT refresh token signing key (separate from JWT_SECRET) |
| `ADMIN_JWT_SECRET` | D5 | Admin panel JWT signing key |
| `WHATSAPP_VERIFY_TOKEN` | X6 | Meta Cloud API webhook verify token |
| `WHATSAPP_ACCESS_TOKEN` | X6 | Meta Cloud API bearer token |
| `RECAPTCHA_SECRET_KEY` | P1 | hCaptcha/reCAPTCHA server-side key |

Generate high-entropy secrets:
```bash
# Generate a 64-char JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using openssl
openssl rand -hex 32
```

---

## What to Do If a Secret Is Committed

1. **Rotate the secret immediately** — assume it has been read by an adversary.
2. **Remove from git history** (get team approval first — rewrites SHAs):
   ```bash
   # Install: pip install git-filter-repo
   git filter-repo --path <file-with-secret> --invert-paths
   git push --force
   ```
3. **Notify the security team** per your incident response plan.
4. **Update .gitleaks.toml** to detect that pattern in future.

---

## Pre-commit Hook Setup (gitleaks)

```bash
# Install gitleaks
brew install gitleaks

# Install pre-commit
pip install pre-commit

# Add to .pre-commit-config.yaml (already committed):
cat .pre-commit-config.yaml

# Install hooks locally
pre-commit install

# Run manually
gitleaks detect --source . --config .gitleaks.toml
```
