import logging
from typing import AsyncGenerator, Optional, Dict, Any

logger = logging.getLogger("m3.database")

try:
    import asyncpg
    from pgvector.asyncpg import register_vector
except ImportError:
    asyncpg = None  # type: ignore
    register_vector = None  # type: ignore

from m3.config import get_settings

# Global connection pool reference
_pool: Optional[Any] = None


async def _init_connection(conn: Any) -> None:
    """Setup hook for each new connection in the asyncpg pool."""
    if register_vector is not None:
        try:
            # Register pgvector codec on connection
            await register_vector(conn)
        except Exception as exc:
            logger.warning("Could not register pgvector codec on connection: %s", exc)


async def init_db_pool() -> Any:
    """Initialize the asyncpg database connection pool."""
    global _pool
    if _pool is not None:
        return _pool

    if asyncpg is None:
        logger.warning("asyncpg is not installed in the current environment.")
        return None

    settings = get_settings()
    logger.info("Initializing asyncpg connection pool to: %s", settings.DATABASE_URL.split("@")[-1])

    try:
        _pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=settings.DB_POOL_MIN_SIZE,
            max_size=settings.DB_POOL_MAX_SIZE,
            command_timeout=settings.DB_TIMEOUT,
            init=_init_connection,
        )
        logger.info("Database connection pool created successfully.")
        return _pool
    except Exception as e:
        logger.error("Failed to initialize database connection pool: %s", e)
        raise


async def close_db_pool() -> None:
    """Close all connections in the pool."""
    global _pool
    if _pool is not None:
        logger.info("Closing asyncpg database connection pool...")
        await _pool.close()
        _pool = None
        logger.info("Database connection pool closed.")


def get_db_pool() -> Optional[Any]:
    """Get the active database connection pool."""
    return _pool


async def get_db_connection() -> AsyncGenerator[Any, None]:
    """FastAPI dependency yielding a connection from the pool."""
    pool = get_db_pool()
    if pool is None:
        raise RuntimeError("Database pool is not initialized. Call init_db_pool() first.")

    async with pool.acquire() as conn:
        yield conn


async def check_db_health() -> Dict[str, Any]:
    """Perform health check on the database connection and extensions."""
    if asyncpg is None:
        return {
            "connected": False,
            "pgvector_enabled": False,
            "error": "asyncpg driver not installed",
        }

    pool = get_db_pool()
    if pool is None:
        return {
            "connected": False,
            "pgvector_enabled": False,
            "error": "Connection pool not initialized",
        }

    try:
        async with pool.acquire() as conn:
            # Check basic query execution
            ping_val = await conn.fetchval("SELECT 1;")
            
            # Check pgvector extension availability
            ext_row = await conn.fetchrow(
                "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';"
            )
            pgvector_enabled = ext_row is not None
            pgvector_version = ext_row["extversion"] if ext_row else None

            return {
                "connected": ping_val == 1,
                "pgvector_enabled": pgvector_enabled,
                "pgvector_version": pgvector_version,
            }
    except Exception as exc:
        logger.warning("Database health check failed: %s", exc)
        return {
            "connected": False,
            "pgvector_enabled": False,
            "error": str(exc),
        }


async def init_db_schema() -> None:
    """
    Idempotently initialize required database extensions, tables, and indexes
    for pgvector dense retrieval and tsvector sparse retrieval.
    """
    pool = get_db_pool()
    if pool is None:
        raise RuntimeError("Database pool is not initialized.")

    settings = get_settings()
    dim = settings.EMBEDDING_DIM

    ddl = f"""
    -- 1. Enable required extensions
    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- 2. Create document chunks table for SAATHI BIS standards
    CREATE TABLE IF NOT EXISTS document_chunks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id TEXT NOT NULL,
        standard_number TEXT,
        doc_type TEXT DEFAULT 'standard',
        category TEXT,
        section_title TEXT,
        section_number TEXT,
        content TEXT NOT NULL,
        source_url TEXT,
        publication_date DATE,
        metadata JSONB DEFAULT '{{}}'::jsonb,
        embedding vector({dim}),
        tsv tsvector GENERATED ALWAYS AS (
            to_tsvector('english', 
                coalesce(standard_number, '') || ' ' || 
                coalesce(section_title, '') || ' ' || 
                coalesce(section_number, '') || ' ' || 
                coalesce(content, '')
            )
        ) STORED,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 3. Create HNSW index for fast approximate cosine distance vector search
    CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw
    ON document_chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

    -- 4. Create GIN index for full-text search over tsvector
    CREATE INDEX IF NOT EXISTS idx_chunks_tsv_gin
    ON document_chunks USING gin (tsv);

    -- 5. Create B-Tree index for exact IS standard number lookups
    CREATE INDEX IF NOT EXISTS idx_chunks_standard_number
    ON document_chunks (standard_number);

    -- 6. Create composite index for metadata filtering (doc_type, category, publication_date)
    CREATE INDEX IF NOT EXISTS idx_chunks_filters
    ON document_chunks (doc_type, category, publication_date);
    """

    async with pool.acquire() as conn:
        logger.info("Executing DDL schema initialization...")
        await conn.execute(ddl)
        logger.info("Schema initialized with pgvector HNSW and tsvector GIN indexes.")
