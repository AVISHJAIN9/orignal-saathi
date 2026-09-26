import time
import logging
from contextlib import asynccontextmanager
from typing import Any, Optional
from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

try:
    import asyncpg
except ImportError:
    asyncpg = None  # type: ignore

from m3.config import get_settings
from m3.database import (
    init_db_pool,
    close_db_pool,
    get_db_connection,
    check_db_health,
    init_db_schema,
)
from m3.schemas import (
    HybridSearchRequest,
    HybridSearchResponse,
    ISLookupResponse,
    HealthResponse,
)
from m3.retrieval import (
    execute_hybrid_retrieval,
    execute_is_lookup,
    extract_is_numbers,
    normalize_is_number,
)

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("m3.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown events."""
    settings = get_settings()
    logger.info("Starting up %s (Env: %s)...", settings.APP_NAME, settings.APP_ENV)
    
    # Initialize DB connection pool
    try:
        await init_db_pool()
        logger.info("Database connection pool initialized.")
    except Exception as exc:
        logger.error("Database connection could not be established at startup: %s", exc)

    yield

    # Teardown DB connection pool
    logger.info("Shutting down %s...", settings.APP_NAME)
    await close_db_pool()


settings = get_settings()

app = FastAPI(
    title="SAATHI BIS Assistant - Module M3: Vector Search & Semantic Retrieval",
    description=(
        "Production-grade Vector Search & Semantic Retrieval module for Bureau of Indian Standards (BIS).\n\n"
        "Features:\n"
        "- **Regex IS-Number Detector**: Identifies and standardizes exact standard references (e.g. `IS 10500:2012`).\n"
        "- **Hybrid Retrieval**: Dense search (pgvector `<=>` cosine distance) + Sparse search (tsvector `ts_rank_cd`).\n"
        "- **Reciprocal Rank Fusion (RRF)**: Merges dense and sparse search rankings using `sum(1 / (60 + rank))`.\n"
        "- **Metadata Filtering**: Dynamic multi-criteria filtering by `doc_type`, `category`, and `date`."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================================================================
# API Endpoints
# ==============================================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
@app.get(f"{settings.API_V1_PREFIX}/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check module and database health status."""
    db_health = await check_db_health()
    return HealthResponse(
        status="healthy" if db_health.get("connected") else "degraded",
        database_connected=bool(db_health.get("connected")),
        pgvector_enabled=bool(db_health.get("pgvector_enabled")),
        pgvector_version=db_health.get("pgvector_version"),
        app_version="1.0.0",
    )


@app.post(
    f"{settings.API_V1_PREFIX}/hybrid",
    response_model=HybridSearchResponse,
    summary="Execute Hybrid Dense-Sparse Vector Retrieval",
    tags=["Retrieval"],
)
async def hybrid_search(
    payload: HybridSearchRequest,
    conn: Any = Depends(get_db_connection),
):
    """
    Search BIS standard chunks using Dense (pgvector) + Sparse (tsvector) with Reciprocal Rank Fusion (RRF).
    
    - **Dense Retrieval**: pgvector `<=>` cosine distance.
    - **Sparse Retrieval**: PostgreSQL Full-Text Search with `ts_rank_cd`.
    - **RRF Formula**: `sum(1 / (60 + rank_m(d)))`.
    - **IS Boosting**: Automatically detects IS standard numbers in query and boosts exact matches.
    """
    start_time = time.perf_counter()

    try:
        results, detected_standards = await execute_hybrid_retrieval(
            conn=conn,
            request=payload,
        )

        exec_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return HybridSearchResponse(
            query=payload.query,
            detected_is_standards=detected_standards,
            total_results=len(results),
            results=results,
            execution_time_ms=exec_ms,
        )
    except Exception as exc:
        logger.exception("Error executing hybrid search: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval engine error: {str(exc)}",
        )


@app.get(
    f"{settings.API_V1_PREFIX}/is-lookup",
    response_model=ISLookupResponse,
    summary="Fast Exact Lookup for Indian Standard (IS) Number",
    tags=["Retrieval"],
)
async def is_standard_lookup(
    standard_number: str = Query(
        ...,
        min_length=1,
        description="Indian Standard number (e.g., 'IS 10500:2012', 'IS 456', 'IS/ISO 9001')",
        openapi_examples={
            "standard_example": {
                "summary": "Standard example",
                "value": "IS 10500:2012",
            }
        },
    ),
    top_k: int = Query(
        default=10,
        ge=1,
        le=50,
        description="Number of chunks to return",
    ),
    conn: Any = Depends(get_db_connection),
):
    """
    Direct exact-match lookup for standard clauses by standard number or document ID.
    """
    start_time = time.perf_counter()

    try:
        results, normalized_standard = await execute_is_lookup(
            conn=conn,
            raw_standard_query=standard_number,
            top_k=top_k,
        )

        exec_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return ISLookupResponse(
            query_standard=standard_number,
            normalized_standard=normalized_standard,
            total_results=len(results),
            results=results,
            execution_time_ms=exec_ms,
        )
    except Exception as exc:
        logger.exception("Error executing IS standard lookup: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lookup error: {str(exc)}",
        )


from fastapi import Header

@app.post(
    f"{settings.API_V1_PREFIX}/init-schema",
    summary="Initialize DB Schema and pgvector / tsvector Indexes",
    tags=["Admin"],
)
async def initialize_schema(
    x_internal_api_key: Optional[str] = Header(None, alias="X-Internal-API-Key"),
):
    """
    Admin endpoint to create pgvector extension, `document_chunks` table,
    and HNSW / GIN indexes. Secured with X-Internal-API-Key header.
    """
    if settings.APP_ENV != "development" and not x_internal_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Schema initialization is disabled in non-development environments without credentials.",
        )

    if x_internal_api_key and x_internal_api_key != settings.INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid X-Internal-API-Key header.",
        )

    try:
        await init_db_schema()
        return {
            "status": "success",
            "message": "Database schema and indexes initialized successfully.",
        }
    except Exception as exc:
        logger.exception("Error initializing database schema: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Schema initialization error: {str(exc)}",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "m3.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
