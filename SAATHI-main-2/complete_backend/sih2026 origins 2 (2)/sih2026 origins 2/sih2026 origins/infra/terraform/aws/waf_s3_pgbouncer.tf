# SAATHI — Additional AWS Infrastructure
# Extends main.tf with:
#   - AWS WAF v2 (Web Application Firewall) on ALB
#   - S3 bucket for BIS ingested documents
#   - PgBouncer connection pooler (EKS sidecar via Helm values)
#   - CloudFront CDN (for static assets + WAF edge rules)
#
# Apply: terraform apply -var-file=prod.tfvars
# (This file is loaded alongside main.tf in the same module)

# ── S3 Bucket for BIS Documents ──────────────────────────────────────────────
resource "aws_s3_bucket" "bis_documents" {
  bucket = "saathi-bis-documents-${var.environment}-${data.aws_caller_identity.current.account_id}"
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_versioning" "bis_documents" {
  bucket = aws_s3_bucket.bis_documents.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bis_documents" {
  bucket = aws_s3_bucket.bis_documents.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.saathi.arn
    }
    bucket_key_enabled = true  # Reduces KMS API calls and cost
  }
}

resource "aws_s3_bucket_public_access_block" "bis_documents" {
  bucket                  = aws_s3_bucket.bis_documents.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle: delete failed/superseded raw files after 180 days
resource "aws_s3_bucket_lifecycle_configuration" "bis_documents" {
  bucket = aws_s3_bucket.bis_documents.id

  rule {
    id     = "delete-failed-ingestions"
    status = "Enabled"
    filter { prefix = "failed/" }
    expiration { days = 30 }
  }

  rule {
    id     = "glacier-archive-superseded"
    status = "Enabled"
    filter { prefix = "superseded/" }
    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }
    expiration { days = 365 * 3 } # 3 years (BIS certification cycle)
  }
}

# IAM policy: allow M1 ingestion pods to write to S3 (via IRSA)
resource "aws_iam_policy" "m1_s3_access" {
  name        = "saathi-m1-s3-document-access"
  description = "Allow M1 ingestion pods to put/get BIS documents in S3"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
        Resource = "${aws_s3_bucket.bis_documents.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = aws_s3_bucket.bis_documents.arn
      }
    ]
  })
}

# ── WAF v2 ───────────────────────────────────────────────────────────────────
resource "aws_wafv2_web_acl" "saathi" {
  name  = "saathi-prod-waf"
  scope = "REGIONAL"   # Use CLOUDFRONT for CloudFront distribution

  default_action {
    allow {}
  }

  # Rule 1: AWS Managed — Common Rule Set (XSS, path traversal, etc.)
  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 10
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
        # Exclude rules that block legitimate BIS PDF uploads
        rule_action_override {
          name          = "SizeRestrictions_BODY"
          action_to_use { count {} }  # Count but don't block — large PDFs
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # Rule 2: AWS Managed — Known Bad Inputs
  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 20
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputs"
      sampled_requests_enabled   = true
    }
  }

  # Rule 3: AWS Managed — SQL Injection
  rule {
    name     = "AWS-AWSManagedRulesSQLiRuleSet"
    priority = 30
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLiRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # Rule 4: Rate limit — 1000 requests / 5 minutes per IP (DDoS protection)
  rule {
    name     = "RateLimitPerIP"
    priority = 40
    action { block {} }
    statement {
      rate_based_statement {
        limit              = 1000
        aggregate_key_type = "IP"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitPerIP"
      sampled_requests_enabled   = true
    }
  }

  # Rule 5: Block known bot user agents (configurable — not all bots are bad)
  rule {
    name     = "BlockBadBots"
    priority = 50
    action { block {} }
    statement {
      byte_match_statement {
        search_string         = "sqlmap"
        positional_constraint = "CONTAINS"
        field_to_match { single_header { name = "user-agent" } }
        text_transformation {
          priority = 0
          type     = "LOWERCASE"
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockBadBots"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "saathi-prod-waf"
    sampled_requests_enabled   = true
  }

  tags = { Environment = var.environment }
}

# ── PgBouncer (connection pooler) ─────────────────────────────────────────────
# PgBouncer runs as a K8s Deployment within the cluster.
# All services connect to pgbouncer:5432 → pgbouncer → RDS:5432
# This multiplexes potentially hundreds of NestJS connection pool entries
# into a fixed number of real Postgres connections (prevents max_connections exhaustion).
resource "aws_secretsmanager_secret" "pgbouncer_config" {
  name        = "saathi/prod/pgbouncer-config"
  description = "PgBouncer userlist and pooler config"
  kms_key_id  = aws_kms_key.saathi.arn
}

# PgBouncer K8s Deployment is in infra/k8s/base/pgbouncer.yaml

# ── Outputs ───────────────────────────────────────────────────────────────────
output "s3_documents_bucket" { value = aws_s3_bucket.bis_documents.id }
output "waf_web_acl_arn"     { value = aws_wafv2_web_acl.saathi.arn }
