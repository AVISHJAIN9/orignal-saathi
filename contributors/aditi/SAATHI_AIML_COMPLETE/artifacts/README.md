# SAATHI — BIS Navigator
## AIML / RAG Runtime Package

This package contains the runtime knowledge artifacts required by the
SAATHI BIS Navigator retrieval layer.

### Contents

- bis_rag_corpus.jsonl
  - 116,597 RAG documents
  - Standard and BIS relationship evidence

- bis_rag_metadata.json
  - Metadata for all 116,597 RAG documents

- bis_faiss.index
  - FAISS inner-product index
  - 116,597 vectors
  - 384 dimensions

### Embedding Model

BAAI/bge-small-en-v1.5

Embeddings were generated with normalized vectors and indexed using
FAISS IndexFlatIP.

### Corpus Composition

standard_core:          35,119
cross_references:       23,052
indian_references:      30,178
international_references: 8,510
referred_by:             19,738

TOTAL:                  116,597

### Important

The original embedding matrix (`bis_embeddings.npy`) is intentionally
not included because the FAISS index already contains the vectors needed
for similarity retrieval.

The notebook/code containing the retrieval, relationship reasoning,
citation validation, and Gemini inference logic should be packaged
separately from these runtime data artifacts.

Generated:
2026-09-25T15:46:03.471622+00:00