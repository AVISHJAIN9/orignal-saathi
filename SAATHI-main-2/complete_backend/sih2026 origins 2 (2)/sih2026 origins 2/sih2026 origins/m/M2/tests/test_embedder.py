import pytest
from m2.embedder import EmbeddingGenerator


@pytest.mark.asyncio
async def test_deterministic_embedding_fallback():
    embedder = EmbeddingGenerator(provider="local")
    texts = [
        "Permissible limit of TDS in drinking water is 500 mg/l under IS 10500.",
        "Testing procedure for structural steel tensile strength under IS 2062.",
    ]

    embeddings = await embedder.generate_embeddings(texts)
    assert len(embeddings) == 2
    assert len(embeddings[0]) == 1536
    assert len(embeddings[1]) == 1536

    # Verify vector is L2 normalized
    norm = sum(x * x for x in embeddings[0]) ** 0.5
    assert abs(norm - 1.0) < 1e-4
