"""
SAATHI - Module M2: Chunking & Embedding Pipeline
=================================================
Responsible for:
1. Structure & clause-aware text chunking with overlap tuning.
2. Near-duplicate chunk deduplication.
3. Multi-provider embeddings (OpenAI text-embedding-3-small, Gemini, and Local SentenceTransformers fallback).
4. pgvector storage with HNSW index construction and disaster-recovery index rebuilding.
"""

__version__ = "1.0.0"
