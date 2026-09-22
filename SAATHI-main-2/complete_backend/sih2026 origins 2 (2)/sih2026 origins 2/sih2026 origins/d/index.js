/**
 * D-Series Service Registry
 *
 * This file is a DOCUMENTATION-ONLY registry listing each D-series module's
 * real NestJS service and its port/endpoint.
 *
 * DO NOT import stub classes from this file. Each D-series module runs as an
 * independent NestJS microservice. Interact with them via HTTP/gRPC, not
 * via require().
 *
 * Historical note: the old version of this file imported fake stub classes
 * (StandardsCatalogPipeline, HsnTariffMappingPipeline, etc.) that returned
 * hardcoded data. Those stubs are archived in d/legacy/ for reference.
 *
 * Resolution date: 2026-09-13 (Phase 0 — Production Hardening)
 */

const SAATHI_D_SERVICES = {
  D1: {
    name: 'SAATHI Chat Gateway (SSE)',
    description: 'Conversational chat interface with real-time Server-Sent Events streaming, RAG integration via m5-rag, rate limiting.',
    implementation: 'd/D1/src/',
    dockerService: 'd1-chat',
    port: 5001,
    healthEndpoint: 'http://localhost:5001/health',
    swaggerDocs: 'http://localhost:5001/api',
    status: 'REAL_NESTJS_SERVICE',
  },
  D4: {
    name: 'Conversation History Store',
    description: 'Persistent conversation history with cursor-based pagination, TypeORM entities, Postgres backend.',
    implementation: 'd/D4/src/',
    dockerService: 'd4-history',
    port: 5004,
    healthEndpoint: 'http://localhost:5004/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  D5: {
    name: 'Admin Document Panel',
    description: 'Admin portal for uploading and managing BIS source documents. JWT auth, role-based access, S3/local storage backend.',
    implementation: 'd/D5/src/',
    dockerService: 'd5-admin',
    port: 5005,
    healthEndpoint: 'http://localhost:5005/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  D6: {
    name: 'Analytics Dashboard',
    description: 'Usage analytics and dashboard service.',
    implementation: 'd/D6/src/',
    dockerService: 'd6-analytics',
    port: 5006,
    healthEndpoint: 'http://localhost:5006/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  D7: {
    name: 'Feedback Service',
    description: 'User feedback collection and routing.',
    implementation: 'd/D7/src/',
    dockerService: 'd7-feedback',
    port: 5007,
    healthEndpoint: 'http://localhost:5007/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  D8: {
    name: 'RAG Vector Storage',
    description: 'pgvector embedding storage and retrieval backend.',
    implementation: 'd/D8/backend/',
    dockerService: 'd8-vectors',
    port: 5008,
    healthEndpoint: 'http://localhost:5008/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  D9: {
    name: 'Session Logging / Audit',
    description: 'Session and audit log archival service. NestJS with classification client integration.',
    implementation: 'd/D9/src/',
    dockerService: 'd9-audit',
    port: 5009,
    healthEndpoint: 'http://localhost:5009/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  D10: {
    name: 'ISO/IEC Global Standards Mapper',
    description: 'Maps BIS Indian Standards to ISO/IEC equivalents for international benchmarking.',
    implementation: 'd/D10/src/',
    dockerService: 'd10-iso',
    port: 5010,
    healthEndpoint: 'http://localhost:5010/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  d2: {
    name: 'Gazette Notification Ingestion',
    description: 'Ingests official Gazette notifications for QCO and standard updates.',
    implementation: 'd/d2/src/',
    dockerService: 'd2-gazette',
    port: 5002,
    healthEndpoint: 'http://localhost:5002/health',
    status: 'REAL_NESTJS_SERVICE',
  },
  d3: {
    name: 'Lab Master Sync',
    description: 'Synchronises BIS-accredited lab directory.',
    implementation: 'd/d3/src/',
    dockerService: 'd3-labs',
    port: 5003,
    healthEndpoint: 'http://localhost:5003/health',
    status: 'REAL_NESTJS_SERVICE',
  },
};

/**
 * Returns the service registry for inspection/documentation tooling.
 * Do NOT use this to instantiate services — call their HTTP endpoints.
 */
function getServiceRegistry() {
  return SAATHI_D_SERVICES;
}

module.exports = { SAATHI_D_SERVICES, getServiceRegistry };
