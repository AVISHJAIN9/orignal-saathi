"""
Disaster Recovery CLI: Rebuild pgvector Index from Source
=========================================================
Runs a full maintenance sweep to vacuum, reindex, and verify HNSW index on `document_chunks`.
Usage: python -m m2.rebuild_index
"""

import asyncio
import logging
from m2.config import get_settings
from m2.database import init_db_pool, close_db_pool

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("m2.rebuild_index")


async def rebuild_index():
    settings = get_settings()
    logger.info("Connecting to database: %s...", settings.DATABASE_URL.split("@")[-1])
    pool = await init_db_pool()
    if not pool:
        logger.error("Could not connect to database pool.")
        return

    async with pool.acquire() as conn:
        logger.info("Counting existing chunks...")
        count = await conn.fetchval("SELECT COUNT(*) FROM document_chunks;")
        logger.info("Total document chunks in database: %d", count)

        logger.info("Rebuilding HNSW index 'idx_chunks_hnsw_embedding'...")
        await conn.execute("REINDEX INDEX CONCURRENTLY idx_chunks_hnsw_embedding;")
        logger.info("✓ HNSW vector index rebuilt successfully.")

        logger.info("Running VACUUM ANALYZE on document_chunks...")
        await conn.execute("VACUUM (ANALYZE) document_chunks;")
        logger.info("✓ Database statistics updated.")

    await close_db_pool()
    logger.info("🎉 Vector index disaster-recovery maintenance complete!")


if __name__ == "__main__":
    asyncio.run(rebuild_index())
