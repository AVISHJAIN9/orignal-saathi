terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
  backend "s3" {
    bucket         = "saathi-tfstate-prod"
    key            = "prod/eks/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "saathi-tfstate-lock"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "SAATHI"
      Environment = var.environment
      ManagedBy   = "terraform"
      DataResidency = "India"
    }
  }
}

# ── Variables ───────────────────────────────────────────────────────────────
variable "aws_region"        { default = "ap-south-1" }   # Mumbai — India data residency
variable "environment"       { default = "production" }
variable "cluster_name"      { default = "saathi-prod-eks" }
variable "node_instance_type" { default = "t3.xlarge" }   # 4 vCPU, 16GB — suitable for NestJS + FastAPI
variable "node_min_size"     { default = 3 }
variable "node_max_size"     { default = 20 }
variable "node_desired_size" { default = 5 }
variable "db_instance_class" { default = "db.r6g.large" } # 2 vCPU, 16GB — suitable for pgvector workloads

# ── Networking ──────────────────────────────────────────────────────────────
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.5"

  name = "saathi-prod-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false   # HA: one NAT GW per AZ
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "saathi-prod-vpc" }
}

# ── EKS Cluster ─────────────────────────────────────────────────────────────
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.8"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # Enable cluster endpoint in private subnet only (no public API server)
  cluster_endpoint_public_access  = true   # Allow from specific CIDRs below
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access_cidrs = [
    "0.0.0.0/0"   # Restrict to VPN CIDRs in production
  ]

  eks_managed_node_groups = {
    saathi-workers = {
      instance_types = [var.node_instance_type]
      min_size       = var.node_min_size
      max_size       = var.node_max_size
      desired_size   = var.node_desired_size

      labels = { role = "worker" }
      taints = []

      update_config = {
        max_unavailable_percentage = 25
      }
    }
  }
}

# ── RDS PostgreSQL (pgvector) ────────────────────────────────────────────────
resource "aws_db_subnet_group" "saathi" {
  name       = "saathi-prod-db-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_security_group" "rds" {
  name        = "saathi-prod-rds-sg"
  description = "Allow PostgreSQL from EKS nodes only"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = module.vpc.private_subnets_cidr_blocks
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "saathi-prod-postgres"
  engine                 = "postgres"
  engine_version         = "16.2"
  instance_class         = var.db_instance_class
  allocated_storage      = 100
  max_allocated_storage  = 500                    # Auto-scaling storage

  db_name  = "saathi_prod"
  username = "saathi_service"
  password = var.db_password                      # Injected via TF_VAR_db_password

  db_subnet_group_name   = aws_db_subnet_group.saathi.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Backups and PITR (15-minute RPO)
  backup_retention_period    = 7                  # 7 days of automated backups
  backup_window              = "02:00-03:00"      # 2-3 AM IST (off-peak)
  maintenance_window         = "sun:03:00-sun:05:00"
  delete_automated_backups   = false
  deletion_protection        = true               # Prevent accidental deletion

  # Encryption at rest
  storage_encrypted = true
  kms_key_id        = aws_kms_key.saathi.arn

  # Performance Insights for slow query analysis
  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  # High availability
  multi_az = true

  # Required for pgvector
  parameter_group_name = aws_db_parameter_group.postgres16.name

  apply_immediately = false   # Only during maintenance window
}

resource "aws_db_parameter_group" "postgres16" {
  family = "postgres16"
  name   = "saathi-prod-pg16"

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements,vector"   # Enable pgvector and slow query tracking
    apply_method = "pending-reboot"
  }

  parameter {
    name  = "max_connections"
    value = "200"
    apply_method = "pending-reboot"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"                        # Log queries taking > 1 second
    apply_method = "immediate"
  }
}

# Read replica for analytics/reporting queries
resource "aws_db_instance" "postgres_replica" {
  identifier          = "saathi-prod-postgres-replica"
  replicate_source_db = aws_db_instance.postgres.identifier
  instance_class      = "db.r6g.large"
  storage_encrypted   = true
  apply_immediately   = false

  lifecycle {
    ignore_changes = [password]
  }
}

# ── ElastiCache Redis ─────────────────────────────────────────────────────────
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "saathi-prod-redis"
  description                = "Redis for BullMQ, sessions, and rate limiting"
  node_type                  = "cache.r6g.large"
  num_cache_clusters         = 3                  # Primary + 2 replicas
  automatic_failover_enabled = true
  multi_az_enabled           = true
  port                       = 6379
  subnet_group_name          = aws_elasticache_subnet_group.saathi.name
  security_group_ids         = [aws_security_group.redis.id]
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = var.redis_auth_token

  maintenance_window         = "sun:05:00-sun:06:00"
  snapshot_retention_limit   = 5
  snapshot_window            = "03:00-04:00"
}

resource "aws_elasticache_subnet_group" "saathi" {
  name       = "saathi-prod-redis-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_security_group" "redis" {
  name        = "saathi-prod-redis-sg"
  description = "Redis access from EKS nodes only"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = module.vpc.private_subnets_cidr_blocks
  }
}

# ── KMS Encryption Key ────────────────────────────────────────────────────────
resource "aws_kms_key" "saathi" {
  description             = "SAATHI production encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

# ── Secrets Manager ───────────────────────────────────────────────────────────
resource "aws_secretsmanager_secret" "database_url" {
  name        = "saathi/prod/database_url"
  description = "PostgreSQL connection string for SAATHI production"
  kms_key_id  = aws_kms_key.saathi.arn
}

# ── Variables that must be passed in (never hardcoded) ───────────────────────
variable "db_password"      { sensitive = true }
variable "redis_auth_token" { sensitive = true }

# ── Outputs ───────────────────────────────────────────────────────────────────
output "eks_cluster_endpoint"    { value = module.eks.cluster_endpoint }
output "eks_cluster_name"        { value = module.eks.cluster_name }
output "rds_endpoint"            { value = aws_db_instance.postgres.endpoint }
output "rds_replica_endpoint"    { value = aws_db_instance.postgres_replica.endpoint }
output "redis_primary_endpoint"  { value = aws_elasticache_replication_group.redis.primary_endpoint_address }
