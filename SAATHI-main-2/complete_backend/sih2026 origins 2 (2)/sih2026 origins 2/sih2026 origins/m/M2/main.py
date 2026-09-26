import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from m2.config import get_settings
from m2.schemas import (
    ChunkRequest,
    ChunkResponse,
    EmbedRequest,
    EmbedResponse,
    IngestionPipelineRequest,
    IngestionPipelineResponse,
)
from m2.chunker import ClauseAwareTextSplitter
from m2.embedder import EmbeddingGenerator
from m2.database import init_db_pool, close_db_pool, batch_upsert_chunks

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("m2.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Starting up %s...", settings.APP_NAME)
    try:
        await init_db_pool()
    except Exception as e:
        logger.warn("Database initialization deferred: %s", e)
    yield
    logger.info("Shutting down %s...", settings.APP_NAME)
    await close_db_pool()


settings = get_settings()

app = FastAPI(
    title="SAATHI BIS Assistant - Module M2: Chunking & Embedding Pipeline",
    description=(
        "Production-grade Chunking, Embedding, and pgvector Storage engine for Bureau of Indian Standards (BIS).\n\n"
        "Features:\n"
        "- **Clause-Aware Splitter**: Preserves regulatory headings, clauses (e.g. Clause 4.1), and tables.\n"
        "- **Near-Duplicate Deduplication**: Eliminates redundancy across revised circulars.\n"
        "- **Multi-Provider Embeddings**: OpenAI `text-embedding-3-small`, Gemini, and deterministic local fallback.\n"
        "- **pgvector HNSW Indexing**: Sub-50ms cosine distance indexing."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "embedding_provider": settings.EMBEDDING_PROVIDER,
        "embedding_model": settings.EMBEDDING_MODEL,
        "embedding_dim": settings.EMBEDDING_DIM,
        "default_chunk_size": settings.DEFAULT_CHUNK_SIZE,
    }


@app.post(
    f"{settings.API_V1_PREFIX}/chunk",
    response_model=ChunkResponse,
    summary="Chunk raw documents with clause boundary preservation",
    tags=["Chunking"],
)
async def chunk_documents_endpoint(payload: ChunkRequest):
    splitter = ClauseAwareTextSplitter(
        chunk_size=payload.chunk_size,
        chunk_overlap=payload.chunk_overlap,
    )

    all_chunks = []
    total_dups = 0

    for doc in payload.documents:
        chunks, dups = splitter.split_document(doc)
        all_chunks.extend(chunks)
        total_dups += dups

    return ChunkResponse(
        total_documents=len(payload.documents),
        total_chunks_created=len(all_chunks),
        duplicates_removed=total_dups,
        chunks=all_chunks,
    )


@app.post(
    f"{settings.API_V1_PREFIX}/embed",
    response_model=EmbedResponse,
    summary="Generate vector embeddings for texts",
    tags=["Embedding"],
)
async def embed_texts_endpoint(payload: EmbedRequest):
    embedder = EmbeddingGenerator(provider=payload.provider)
    embeddings = await embedder.generate_embeddings(payload.texts)

    return EmbedResponse(
        provider=embedder.provider,
        model=embedder.model,
        dimension=embedder.dim,
        count=len(embeddings),
        embeddings=embeddings,
    )


@app.post(
    f"{settings.API_V1_PREFIX}/pipeline",
    response_model=IngestionPipelineResponse,
    summary="End-to-End Pipeline: Chunk -> Deduplicate -> Embed -> pgvector Store",
    tags=["Pipeline"],
)
async def ingestion_pipeline_endpoint(payload: IngestionPipelineRequest):
    start_time = time.time()

    # 1. Chunk documents
    splitter = ClauseAwareTextSplitter(
        chunk_size=payload.chunk_size,
        chunk_overlap=payload.chunk_overlap,
    )

    all_chunks = []
    total_dups = 0
    for doc in payload.documents:
        chunks, dups = splitter.split_document(doc)
        all_chunks.extend(chunks)
        total_dups += dups

    if not all_chunks:
        return IngestionPipelineResponse(
            status="completed",
            documents_processed=len(payload.documents),
            chunks_created=0,
            chunks_stored_in_pgvector=0,
            duplicates_skipped=total_dups,
            elapsed_seconds=round(time.time() - start_time, 3),
        )

    # 2. Embed chunks
    embedder = EmbeddingGenerator()
    texts = [c.content for c in all_chunks]
    embeddings = await embedder.generate_embeddings(texts)

    # 3. Store in pgvector if requested
    stored_count = 0
    if payload.store_in_db:
        try:
            stored_count = await batch_upsert_chunks(all_chunks, embeddings)
        except Exception as e:
            logger.error("Failed to batch upsert to pgvector: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database storage failed: {str(e)}",
            )

    elapsed = round(time.time() - start_time, 3)
    return IngestionPipelineResponse(
        status="success",
        documents_processed=len(payload.documents),
        chunks_created=len(all_chunks),
        chunks_stored_in_pgvector=stored_count,
        duplicates_skipped=total_dups,
        elapsed_seconds=elapsed,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "m2.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
