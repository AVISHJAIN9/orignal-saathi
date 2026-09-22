terraform {
  required_version = ">= 1.7"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.20"
    }
  }
  backend "gcs" {
    bucket = "saathi-tfstate-prod"
    prefix = "prod/gke/terraform.tfstate"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ── Variables ───────────────────────────────────────────────────────────────
variable "project_id"      { default = "saathi-bis-prod" }
variable "region"          { default = "asia-south1" }          # Mumbai — India data residency
variable "environment"     { default = "production" }
variable "gke_node_type"   { default = "e2-standard-4" }        # 4 vCPU, 16GB
variable "gke_min_nodes"   { default = 3 }
variable "gke_max_nodes"   { default = 20 }
variable "db_tier"         { default = "db-custom-2-8192" }     # 2 vCPU, 8GB RAM for Cloud SQL

# ── VPC ──────────────────────────────────────────────────────────────────────
resource "google_compute_network" "saathi" {
  name                    = "saathi-prod-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "saathi_nodes" {
  name          = "saathi-prod-nodes"
  ip_cidr_range = "10.0.0.0/20"
  region        = var.region
  network       = google_compute_network.saathi.id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/20"
  }
}

# ── GKE Autopilot Cluster ─────────────────────────────────────────────────────
# Using Autopilot: GCP manages node provisioning and scaling automatically
resource "google_container_cluster" "saathi" {
  provider = google-beta
  name     = "saathi-prod-gke"
  location = var.region

  enable_autopilot = true

  network    = google_compute_network.saathi.id
  subnetwork = google_compute_subnetwork.saathi_nodes.id

  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  # Private cluster (nodes have no public IPs)
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  # Enable Workload Identity (replaces service account key files)
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  resource_labels = {
    environment    = var.environment
    project        = "saathi"
    data-residency = "india"
  }
}

# ── Cloud SQL (PostgreSQL 16 with pgvector) ────────────────────────────────────
resource "google_sql_database_instance" "postgres" {
  name             = "saathi-prod-postgres"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier = var.db_tier

    # HA with automatic failover
    availability_type = "REGIONAL"

    backup_configuration {
      enabled                        = true
      start_time                     = "02:00"       # 2 AM IST
      point_in_time_recovery_enabled = true           # 15-minute RPO
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    ip_configuration {
      ipv4_enabled    = false                         # Private IP only
      private_network = google_compute_network.saathi.id
    }

    database_flags {
      name  = "cloudsql.enable_pgvector"
      value = "on"
    }

    database_flags {
      name  = "max_connections"
      value = "200"
    }

    database_flags {
      name  = "log_min_duration_statement"
      value = "1000"
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 4500
      record_application_tags = true
      record_client_address   = false                 # Privacy: don't log client IPs
    }

    # Encryption
    disk_type       = "PD_SSD"
    disk_size       = 100
    disk_autoresize = true
  }

  deletion_protection = true
}

# Read replica
resource "google_sql_database_instance" "postgres_replica" {
  name                 = "saathi-prod-postgres-replica"
  master_instance_name = google_sql_database_instance.postgres.name
  database_version     = "POSTGRES_16"
  region               = var.region

  settings {
    tier              = var.db_tier
    availability_type = "ZONAL"
    disk_type         = "PD_SSD"
    disk_autoresize   = true
  }

  deletion_protection = false
}

resource "google_sql_database" "saathi_db" {
  name     = "saathi_prod"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "saathi_service" {
  name     = "saathi_service"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

# ── Memorystore Redis ─────────────────────────────────────────────────────────
resource "google_redis_instance" "saathi" {
  name           = "saathi-prod-redis"
  memory_size_gb = 6
  region         = var.region

  # High availability
  tier = "STANDARD_HA"

  authorized_network = google_compute_network.saathi.id

  redis_version    = "REDIS_7_0"
  auth_enabled     = true
  transit_encryption_mode = "SERVER_AUTHENTICATION"  # TLS

  redis_configs = {
    maxmemory-policy = "allkeys-lru"
  }

  labels = { environment = var.environment }
}

# ── Secret Manager ────────────────────────────────────────────────────────────
resource "google_secret_manager_secret" "database_url" {
  secret_id = "saathi-prod-database-url"
  replication {
    user_managed {
      replicas { location = var.region }
    }
  }
}

resource "google_secret_manager_secret" "openai_api_key" {
  secret_id = "saathi-prod-openai-api-key"
  replication {
    user_managed {
      replicas { location = var.region }
    }
  }
}

# ── Variables requiring injection ─────────────────────────────────────────────
variable "db_password" { sensitive = true }

# ── Outputs ───────────────────────────────────────────────────────────────────
output "gke_cluster_name"      { value = google_container_cluster.saathi.name }
output "gke_cluster_endpoint"  { value = google_container_cluster.saathi.endpoint }
output "postgres_ip"           { value = google_sql_database_instance.postgres.private_ip_address }
output "redis_host"            { value = google_redis_instance.saathi.host }
output "redis_port"            { value = google_redis_instance.saathi.port }
