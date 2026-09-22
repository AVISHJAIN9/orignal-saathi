import json
import logging
from typing import AsyncGenerator
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

try:
    from sse_starlette.sse import EventSourceResponse
except ImportError:
    # Fallback to Starlette StreamingResponse with standard SSE format
    class EventSourceResponse(StreamingResponse):
        def __init__(self, content: AsyncGenerator, **kwargs):
            async def sse_generator():
                async for item in content:
                    event = item.get("event", "message")
                    data = item.get("data", "")
            kwargs.setdefault('media_type', 'text/event-stream')
            super().__init__(sse_generator(), **kwargs)

from m5.config import get_settings
from m5.schemas import (
    GenerationRequest,
    HealthResponse,
    StructuredAnswer,
)
from m5.generator import RAGGenerator, get_rag_generator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("m5.main")

settings = get_settings()

app = FastAPI(
    title="SAATHI BIS Assistant - Module M5: RAG Answer Generation & Quality Engine",
    description=(
        "Production-grade RAG Generation and Hallucination Guardrail module for Bureau of Indian Standards (BIS).\n\n"
        "Features:\n"
        "- **Strict Cite-or-Decline Guardrails**: Verifies factual grounding and confidence thresholds.\n"
        "- **Granular Citations**: Formats and verifies exact clause, table, and standard number citations.\n"
        "- **Real-time SSE Streaming**: Emits incremental token and metadata events for NestJS proxying and React UI.\n"
        "- **Persona Templates**: Standard technical compliance Q&A and MSME Plain-Language Explainer (X11)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration for NestJS gateway (m9) & Frontend (d1)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Lifespan & Graceful Shutdown (Phase 6.3)
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("[Shutdown] Module M5 received shutdown signal — freeing resources and closing generators")

# ==============================================================================
# API Endpoints
# ==============================================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
@app.get(f"{settings.API_V1_PREFIX}/health", response_model=HealthResponse, tags=["Health"])
async def health_check(generator: RAGGenerator = Depends(get_rag_generator)):
    """Check service health and LLM provider configuration status."""
    is_llm_ready = generator._llm is not None or generator.settings.OPENAI_API_KEY is not None
    return HealthResponse(
        status="healthy",
        llm_configured=bool(is_llm_ready),
        model_name=settings.LLM_MODEL,
        confidence_threshold=settings.CONFIDENCE_THRESHOLD,
        app_version="1.0.0",
    )


@app.post(
    settings.API_V1_PREFIX,
    response_model=StructuredAnswer,
    summary="Generate Grounded Answer with Strict Citations",
    tags=["Generation"],
)
async def generate_answer_endpoint(
    payload: GenerationRequest,
    generator: RAGGenerator = Depends(get_rag_generator),
):
    """
    Synchronous blocking endpoint that generates a fully cited, validated `StructuredAnswer`.
    
    - Enforces confidence threshold check (`CONFIDENCE_THRESHOLD`).
    - Enforces cite-or-decline when context is missing or irrelevant.
    """
    try:
        answer = await generator.generate_answer(payload)
        return answer
    except Exception as exc:
        logger.exception("Error during answer generation: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Generation engine error: {str(exc)}",
        )


@app.post(
    f"{settings.API_V1_PREFIX}/stream",
    summary="Stream Answer Tokens and Metadata via Server-Sent Events (SSE)",
    tags=["Generation"],
    response_class=EventSourceResponse,
)
async def generate_stream_endpoint(
    payload: GenerationRequest,
    generator: RAGGenerator = Depends(get_rag_generator),
):
    """
    Real-time Server-Sent Events (SSE) endpoint streaming tokens and metadata.
    
    SSE Events Emitted:
    - `event: token`: Progressive word/token stream for UI typing effect.
    - `event: citation`: Emitted for each validated citation.
    - `event: structured_answer`: Complete final JSON payload (`StructuredAnswer`).
    - `event: done`: Stream termination signal.
    """
    try:
        return EventSourceResponse(
            generator.stream_answer(payload),
            media_type="text/event-stream",
        )
    except Exception as exc:
        logger.exception("Error initiating answer stream: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Streaming engine error: {str(exc)}",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "m5.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
