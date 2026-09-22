import json
import logging
from typing import List, Tuple, Optional, Any
from m2.config import get_settings
from m2.schemas import ChunkItem

logger = logging.getLogger("m2.database")

try:
    import asyncpg
except ImportError:
    asyncpg = None  # type: ignore

_db_pool: Optional[Any] = None


async def init_db_pool():
    """Initialize asyncpg connection pool."""
    global _db_pool
    if asyncpg is None:
        logger.warn("asyncpg not installed. Database writes will be mocked.")
        return None

    settings = get_settings()
    if _db_pool is None:
        try:
            _db_pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=settings.DB_POOL_MIN_SIZE,
                max_size=settings.DB_POOL_MAX_SIZE,
                command_timeout=30.0,
            )
            logger.info("M2 Database pool connected to %s", settings.DATABASE_URL.split("@")[-1])
            await setup_pgvector_schema()
        except Exception as e:
            logger.error("Failed to connect to PostgreSQL: %s", e)
    return _db_pool


async def close_db_pool():
    global _db_pool
    if _db_pool is not None:
        await _db_pool.close()
        _db_pool = None


async def setup_pgvector_schema():
    """Ensure pgvector extension and document_chunks table with HNSW index exist."""
    if _db_pool is None:
        return

    settings = get_settings()
    dim = settings.EMBEDDING_DIM
    m = settings.HNSW_M
    ef = settings.HNSW_EF_CONSTRUCTION

    async with _db_pool.acquire() as conn:
        # Enable vector extension
        try:
            await conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            await conn.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        except Exception as e:
            logger.warn("Could not create vector extension (may already exist or need superuser): %s", e)

        # Create document_chunks table
        await conn.execute(f"""
            CREATE TABLE IF NOT EXISTS document_chunks (
                id VARCHAR(128) PRIMARY KEY,
                document_id VARCHAR(128) NOT NULL,
                standard_number VARCHAR(128),
                doc_type VARCHAR(64) DEFAULT 'standard',
                category VARCHAR(128),
                section_title TEXT,
                section_number VARCHAR(64),
                content TEXT NOT NULL,
                source_url TEXT,
                publication_date VARCHAR(64),
                metadata JSONB DEFAULT '{{}}'::jsonb,
                checksum VARCHAR(64) NOT NULL,
                embedding vector({dim}),
                tsv_content tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        """)

        # Create HNSW Index for ultra-fast vector retrieval
        try:
            await conn.execute(f"""
                CREATE INDEX IF NOT EXISTS idx_chunks_hnsw_embedding
                ON document_chunks
                USING hnsw (embedding vector_cosine_ops)
                WITH (m = {m}, ef_construction = {ef});
            """)
        except Exception as e:
            logger.warn("HNSW index creation note: %s", e)

        # Create Full-Text & Filter Indexes
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_chunks_standard_num ON document_chunks(standard_number);
            CREATE INDEX IF NOT EXISTS idx_chunks_doc_id ON document_chunks(document_id);
            CREATE INDEX IF NOT EXISTS idx_chunks_tsv ON document_chunks USING gin(tsv_content);
        """)
        logger.info("pgvector schema and HNSW indexes verified.")


async def batch_upsert_chunks(
    chunks: List[ChunkItem], embeddings: List[List[float]]
) -> int:
    """Batch upsert chunks and vectors into PostgreSQL."""
    if _db_pool is None:
        logger.info("[Mock DB] Would upsert %d chunks to PostgreSQL.", len(chunks))
        return len(chunks)

    if not chunks:
        return 0

    inserted_count = 0
    async with _db_pool.acquire() as conn:
        async with conn.transaction():
            stmt = await conn.prepare("""
                INSERT INTO document_chunks (
                    id, document_id, standard_number, doc_type, category,
                    section_title, section_number, content, source_url,
                    publication_date, metadata, checksum, embedding, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()
                )
                ON CONFLICT (id) DO UPDATE SET
                    section_title = EXCLUDED.section_title,
                    section_number = EXCLUDED.section_number,
                    content = EXCLUDED.content,
                    source_url = EXCLUDED.source_url,
                    metadata = EXCLUDED.metadata,
                    checksum = EXCLUDED.checksum,
                    embedding = EXCLUDED.embedding,
                    updated_at = NOW();
            """)

            for chunk, emb in zip(chunks, embeddings):
                meta_json = json.dumps(chunk.metadata)
                emb_str = f"[{','.join(str(x) for x in emb)}]"

                await stmt.execute(
                    chunk.chunk_id,
                    chunk.document_id,
                    chunk.standard_number,
                    chunk.doc_type,
                    chunk.category,
                    chunk.section_title,
                    chunk.section_number,
                    chunk.content,
                    chunk.source_url,
                    chunk.publication_date,
                    meta_json,
                    chunk.checksum,
                    emb_str,
                )
                inserted_count += 1

    return inserted_count
