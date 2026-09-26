/**
 * SAATHI OpenTelemetry Instrumentation — NestJS Shared Module
 *
 * Provides distributed tracing and metrics for all NestJS services.
 * Must be imported FIRST in main.ts — before any other imports — because
 * OpenTelemetry instruments modules at require() time.
 *
 * Usage in main.ts:
 *   // ⚠️ This MUST be the first import in main.ts
 *   import './telemetry/otel';
 *   import { NestFactory } from '@nestjs/core';
 *   ...
 *
 * Exports to Jaeger via OTLP HTTP (OTEL_EXPORTER_OTLP_ENDPOINT env var).
 * Falls back to console export in LOCAL_DEV if Jaeger is unreachable.
 *
 * Required env vars:
 *   OTEL_SERVICE_NAME     - e.g. 'd1-chat', 'm5-rag', 'p1-auth'
 *   OTEL_EXPORTER_OTLP_ENDPOINT - e.g. 'http://jaeger:4318'
 *   OTEL_ENVIRONMENT      - 'production' | 'staging' | 'development'
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'saathi-unknown-service';
const OTEL_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const ENVIRONMENT = process.env.OTEL_ENVIRONMENT || process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENVIRONMENT === 'production';

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: ENVIRONMENT,
    'saathi.component': SERVICE_NAME.split('-')[0],
  }),
);

// Trace exporter: OTLP → Jaeger in production, console fallback in dev
let traceExporter;
if (OTEL_ENDPOINT) {
  traceExporter = new OTLPTraceExporter({
    url: `${OTEL_ENDPOINT}/v1/traces`,
    headers: {},
  });
} else {
  if (IS_PRODUCTION) {
    // Production with no OTLP endpoint: warn loudly but don't crash
    console.error(
      `⚠️  OTEL_EXPORTER_OTLP_ENDPOINT not set in production for service ${SERVICE_NAME}. ` +
      'Traces will not be exported. Set OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318',
    );
  }
  // Dev fallback: console exporter (visible in stdout)
  traceExporter = new ConsoleSpanExporter();
}

// Metrics exporter
let metricReader;
if (OTEL_ENDPOINT) {
  metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${OTEL_ENDPOINT}/v1/metrics`,
    }),
    exportIntervalMillis: 15000, // Match Prometheus scrape interval
  });
}

const spanProcessor = OTEL_ENDPOINT
  ? new BatchSpanProcessor(traceExporter)
  : new SimpleSpanProcessor(traceExporter);

const sdk = new NodeSDK({
  resource,
  spanProcessor,
  ...(metricReader ? { metricReader } : {}),
  instrumentations: [
    getNodeAutoInstrumentations({
      // HTTP: trace all inbound/outbound HTTP (NestJS routes + axios calls)
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) => {
          // Don't trace health checks — they generate too many spans
          return req.url === '/health' || req.url === '/metrics';
        },
      },
      // pg: trace all database queries
      '@opentelemetry/instrumentation-pg': {
        enhancedDatabaseReporting: !IS_PRODUCTION, // Don't log query params in production (PII risk)
      },
      // Redis: trace cache operations
      '@opentelemetry/instrumentation-ioredis': {},
      // Express/NestJS routing
      '@opentelemetry/instrumentation-express': {},
      // Disable noisy instrumentations
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});

// Start SDK synchronously (must complete before any other require())
sdk.start();
console.log(`📡 OpenTelemetry started for service: ${SERVICE_NAME} → ${OTEL_ENDPOINT || 'console'}`);

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log(`📡 OTel SDK shut down for ${SERVICE_NAME}`))
    .catch((err) => console.error('OTel shutdown error:', err));
});
