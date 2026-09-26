import pytest
from m2.chunker import ClauseAwareTextSplitter
from m2.embedder import EmbeddingGenerator
from m2.schemas import RawDocumentInput


@pytest.mark.asyncio
async def test_end_to_end_m2_chunk_and_embed():
    doc = RawDocumentInput(
        document_id="IS 10500:2012",
        standard_number="IS 10500:2012",
        title="Drinking Water — Specification",
        content="""
Clause 4.1: Essential Quality Requirements
The pH value of drinking water shall be between 6.5 and 8.5 without relaxation.
The acceptable limit for Total Dissolved Solids is 500 mg/l, permissible up to 2000 mg/l in the absence of alternate source.

Clause 4.2: Bacteriological Parameters
All water intended for drinking shall be free from E. coli or thermotolerant coliform bacteria in any 100 ml sample.
Testing shall be carried out in accordance with IS 1622.
        """,
    )

    # 1. Chunking
    splitter = ClauseAwareTextSplitter(chunk_size=50, chunk_overlap=10)
    chunks, dups = splitter.split_document(doc)

    assert len(chunks) >= 2
    assert dups == 0

    # 2. Embedding
    embedder = EmbeddingGenerator(provider="local")
    texts = [c.content for c in chunks]
    embeddings = await embedder.generate_embeddings(texts)

    assert len(embeddings) == len(chunks)
    for emb in embeddings:
        assert len(emb) == 1536
        norm = sum(x * x for x in emb) ** 0.5
        assert abs(norm - 1.0) < 1e-4
