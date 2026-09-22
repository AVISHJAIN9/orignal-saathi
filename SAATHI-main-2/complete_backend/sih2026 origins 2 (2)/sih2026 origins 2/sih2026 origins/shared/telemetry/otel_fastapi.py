"""
SAATHI OpenTelemetry Instrumentation — FastAPI / Python Services

Provides distributed tracing and metrics for m5-rag, m3-retrieval, M2-embedder.

Usage:
    # In your FastAPI app entrypoint (before any other imports):
    from shared.telemetry.otel_fastapi import setup_telemetry, get_tracer
    setup_telemetry()

    from fastapi import FastAPI
    app = FastAPI()

Required env vars:
    OTEL_SERVICE_NAME             - e.g. 'm5-rag', 'm3-retrieval'
    OTEL_EXPORTER_OTLP_ENDPOINT  - e.g. 'http://jaeger:4318'
    OTEL_ENVIRONMENT              - 'production' | 'staging' | 'development'
"""

import logging
import os
from functools import lru_cache
from typing import Optional

logger = logging.getLogger("saathi.telemetry")


def setup_telemetry(service_name: Optional[str] = None) -> None:
    """
    Configure and start OpenTelemetry SDK for a FastAPI service.

    This must be called before creating the FastAPI app instance so that
    auto-instrumentation can patch the correct modules.

    Args:
        service_name: Override OTEL_SERVICE_NAME env var.
    """
    svc = service_name or os.environ.get("OTEL_SERVICE_NAME", "saathi-python-unknown")
    endpoint = os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT")
    environment = os.environ.get("OTEL_ENVIRONMENT", os.environ.get("ENVIRONMENT", "development"))
    is_production = environment == "production"

    try:
        from opentelemetry import trace
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
        from opentelemetry.sdk.resources import Resource, SERVICE_NAME, SERVICE_VERSION
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
        from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor
        from opentelemetry.instrumentation.asyncpg import AsyncPGInstrumentor
    except ImportError as e:
        logger.warning(
            "OpenTelemetry packages not installed (%s). Tracing disabled. "
            "Install with: pip install opentelemetry-sdk opentelemetry-instrumentation-fastapi "
            "opentelemetry-instrumentation-httpx opentelemetry-instrumentation-psycopg2 "
            "opentelemetry-instrumentation-asyncpg opentelemetry-exporter-otlp-proto-http",
            e,
        )
        return

    resource = Resource.create({
        SERVICE_NAME: svc,
        SERVICE_VERSION: os.environ.get("SERVICE_VERSION", "1.0.0"),
        "deployment.environment": environment,
        "saathi.component": svc.split("-")[0],
    })

    provider = TracerProvider(resource=resource)

    # Exporter: OTLP → Jaeger if endpoint configured, console otherwise
    if endpoint:
        try:
            from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
            exporter = OTLPSpanExporter(endpoint=f"{endpoint}/v1/traces")
            provider.add_span_processor(BatchSpanProcessor(exporter))
            logger.info("📡 OTel → Jaeger at %s for service: %s", endpoint, svc)
        except Exception as ex:
            logger.error("Failed to create OTLP exporter: %s. Falling back to console.", ex)
            provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
    else:
        if is_production:
            logger.error(
                "⚠️  OTEL_EXPORTER_OTLP_ENDPOINT not set in production for %s. "
                "Set OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318",
                svc,
            )
        provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
        logger.info("📡 OTel → console for service: %s", svc)

    trace.set_tracer_provider(provider)

    # Auto-instrument libraries
    FastAPIInstrumentor().instrument()
    HTTPXClientInstrumentor().instrument()  # Instruments httpx (used by M2, M5 for API calls)

    try:
        Psycopg2Instrumentor().instrument(enable_commenter=True, commenter_options={})
    except Exception:
        pass  # Not all services use psycopg2

    try:
        AsyncPGInstrumentor().instrument()
    except Exception:
        pass  # Not all services use asyncpg

    logger.info("✅ OpenTelemetry instrumentation active for %s", svc)


@lru_cache(maxsize=None)
def get_tracer(name: str = "saathi"):
    """Get a named tracer for manual span creation."""
    from opentelemetry import trace
    return trace.get_tracer(name)


def create_span_context(operation_name: str, attributes: dict = None):
    """Context manager for manual span creation in RAG pipeline steps."""
    from opentelemetry import trace
    tracer = get_tracer("saathi.rag")
    return tracer.start_as_current_span(operation_name, attributes=attributes or {})
