# BIS Standards RAG Assistant

AI-powered Retrieval-Augmented Generation (RAG) system for querying BIS standards.

## Current Standard

IS 17423:2021 — Medical Textiles — Bio-Protective Coveralls — Specification.

The included BIS source document is the official BIS Medical Textiles handout used during development.

## Architecture

User Question
    ↓
Smart Router
    ↓
    ├── Structured BIS Requirement Lookup
    │       ↓
    │   Exact requirement / level / test method
    │
    └── Semantic RAG
            ↓
        Sentence Transformer
            ↓
        FAISS Vector Search
            ↓
        Relevant BIS Context
            ↓
        Qwen2.5-3B-Instruct
            ↓
        Grounded Answer + Sources

## Main Components

### Embedding Model

sentence-transformers/all-MiniLM-L6-v2

Embedding dimension: 384

### Vector Database

FAISS IndexFlatL2

Current vectors: 32

### Language Model

Qwen/Qwen2.5-3B-Instruct

### Interface

Gradio

## Structured BIS Requirements

The system contains structured data for six requirements from BIS Page 16:

1. Synthetic blood penetration resistance
2. Resistance to viral penetration
3. Breathability
4. Tensile strength
5. Seam strength
6. Bursting strength

Each requirement contains Level 1–4 values, test methods, conditions, and source page.

## Hallucination Protection

The system uses two safeguards:

1. Deterministic lookup for known structured requirements.
2. Retrieval confidence threshold for general questions.

If the document does not contain sufficiently relevant information, the system refuses to invent an answer.

## Project Files

- `bis_rag_backend.py` — reusable RAG backend
- `bis_index_final.faiss` — FAISS vector index
- `bis_metadata_final.pkl` — chunks and structured BIS metadata
- `Handouts-II-Medical-Textiles_compressed.pdf` — source document
- `requirements.txt` — Python dependencies

## Running the Backend

Install dependencies:

    pip install -r requirements.txt

Place these files in the same directory:

    bis_rag_backend.py
    bis_index_final.faiss
    bis_metadata_final.pkl

Then import:

    from bis_rag_backend import smart_bis_answer

Example:

    answer, source = smart_bis_answer(
        "What is the minimum bursting strength required for Level 3?"
    )

## Important

The included vector index and metadata were created from the BIS source material used in this project.

For production deployment, verify that the version of every BIS standard used by the application is current and that its use/distribution complies with BIS licensing and copyright requirements.
