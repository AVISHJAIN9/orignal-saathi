import unittest
from datetime import date
from m3.retrieval import (
    extract_is_numbers,
    normalize_is_number,
    calculate_rrf_score,
    merge_and_rank_rrf,
    build_filter_clause,
)
from m3.schemas import RetrievalFilter


class TestISNumberDetector(unittest.TestCase):
    """Test suite for Indian Standard (IS) regex extraction and normalization."""

    def test_extract_is_numbers(self):
        cases = [
            ("What is the permissible limit in IS 10500:2012 for arsenic?", ["IS 10500:2012"]),
            ("Check specifications under IS 456:2000 and IS 1786:2008.", ["IS 456:2000", "IS 1786:2008"]),
            ("Quality management system follows IS/ISO 9001:2015 standard.", ["IS/ISO 9001:2015"]),
            ("Medical device electrical safety IS/IEC 60601-1:2005", ["IS/IEC 60601-1:2005"]),
            ("Refer to is-456 for plain and reinforced concrete.", ["IS 456"]),
            ("Hexagon head bolts as per IS 1363 (Part 1): 2002 requirements.", ["IS 1363 (Part 1):2002"]),
            ("General query with no standard numbers included.", []),
        ]
        for query, expected in cases:
            with self.subTest(query=query):
                self.assertEqual(extract_is_numbers(query), expected)

    def test_normalize_is_number(self):
        cases = [
            ("is 10500 : 2012", "IS 10500:2012"),
            ("IS-456", "IS 456"),
            ("is/iso 9001:2015", "IS/ISO 9001:2015"),
            ("IS 1234 (Part 1): 2002", "IS 1234 (Part 1):2002"),
        ]
        for raw, expected in cases:
            with self.subTest(raw=raw):
                self.assertEqual(normalize_is_number(raw), expected)


class TestRRFLogic(unittest.TestCase):
    """Test suite for Reciprocal Rank Fusion calculation and result merging."""

    def test_calculate_rrf_score_basic(self):
        # Dense rank 1, Sparse rank 1, k=60
        # 1/(60+1) + 1/(60+1) = 2/61 = 0.032787
        score = calculate_rrf_score(dense_rank=1, sparse_rank=1, k=60)
        self.assertAlmostEqual(score, 0.032787, places=5)

    def test_calculate_rrf_score_single_retriever(self):
        score_dense = calculate_rrf_score(dense_rank=1, sparse_rank=None, k=60)
        self.assertAlmostEqual(score_dense, 1 / 61, places=5)

        score_sparse = calculate_rrf_score(dense_rank=None, sparse_rank=2, k=60)
        self.assertAlmostEqual(score_sparse, 1 / 62, places=5)

    def test_calculate_rrf_score_with_exact_boost(self):
        score_boosted = calculate_rrf_score(
            dense_rank=1,
            sparse_rank=1,
            k=60,
            is_exact_match=True,
            exact_boost=0.05,
        )
        base_score = calculate_rrf_score(dense_rank=1, sparse_rank=1, k=60)
        self.assertAlmostEqual(score_boosted, base_score + 0.05, places=5)

    def test_merge_and_rank_rrf(self):
        dense_results = [
            {
                "id": "chunk-1",
                "document_id": "IS 10500:2012",
                "standard_number": "IS 10500:2012",
                "content": "Drinking water specifications",
                "cosine_similarity": 0.95,
            },
            {
                "id": "chunk-2",
                "document_id": "IS 456:2000",
                "standard_number": "IS 456:2000",
                "content": "Concrete specifications",
                "cosine_similarity": 0.85,
            },
        ]

        sparse_results = [
            {
                "id": "chunk-3",
                "document_id": "IS 1786:2008",
                "standard_number": "IS 1786:2008",
                "content": "High strength deformed steel bars",
                "bm25_score": 0.75,
            },
            {
                "id": "chunk-1",
                "document_id": "IS 10500:2012",
                "standard_number": "IS 10500:2012",
                "content": "Drinking water specifications",
                "bm25_score": 0.65,
            },
        ]

        ranked = merge_and_rank_rrf(
            dense_results=dense_results,
            sparse_results=sparse_results,
            detected_is_standards=["IS 10500:2012"],
            k=60,
            top_k=5,
            enable_is_boost=True,
            exact_boost=0.05,
        )

        self.assertEqual(len(ranked), 3)
        # chunk-1 should be rank #1
        self.assertEqual(ranked[0].id, "chunk-1")
        self.assertEqual(ranked[0].dense_rank, 1)
        self.assertEqual(ranked[0].sparse_rank, 2)
        self.assertTrue(ranked[0].is_exact_match)
        self.assertEqual(ranked[0].cosine_similarity, 0.95)
        self.assertEqual(ranked[0].bm25_score, 0.65)


class TestFilterBuilder(unittest.TestCase):
    """Test suite for parameterized SQL WHERE filter builder."""

    def test_empty_filters(self):
        sql, params = build_filter_clause(None)
        self.assertEqual(sql, "1=1")
        self.assertEqual(params, [])

    def test_full_filters(self):
        filt = RetrievalFilter(
            doc_type="standard",
            category=["Civil Engineering", "Structural"],
            start_date=date(2015, 1, 1),
            end_date=date(2023, 12, 31),
            standard_number="IS 456",
        )
        sql, params = build_filter_clause(filt, start_param_idx=1)
        self.assertIn("doc_type = $1", sql)
        self.assertIn("category = ANY($2)", sql)
        self.assertIn("publication_date >= $3", sql)
        self.assertIn("publication_date <= $4", sql)
        self.assertIn("standard_number ILIKE $5", sql)
        self.assertEqual(params[0], "standard")
        self.assertEqual(params[1], ["Civil Engineering", "Structural"])
        self.assertEqual(params[2], date(2015, 1, 1))
        self.assertEqual(params[3], date(2023, 12, 31))
        self.assertEqual(params[4], "%IS 456%")


class TestEmbeddingFallbackAndTokenTrimming(unittest.TestCase):
    """Test suite for fallback embeddings, post-RRF reranking, and token trimming."""

    def test_generate_local_fallback_embedding(self):
        from m3.retrieval import generate_local_fallback_embedding
        vec = generate_local_fallback_embedding("Drinking water IS 10500 specifications", dim=128)
        self.assertEqual(len(vec), 128)
        # Check non-zero
        self.assertTrue(any(x != 0.0 for x in vec))
        # Check L2 unit normalization
        norm = sum(x * x for x in vec) ** 0.5
        self.assertAlmostEqual(norm, 1.0, places=4)

    def test_count_tokens_and_trim_chunks(self):
        from m3.retrieval import count_tokens, trim_chunks_to_token_limit
        from m3.schemas import ChunkResult

        text = "This is a standard technical clause for testing token counting and trimming behavior."
        tokens = count_tokens(text)
        self.assertGreater(tokens, 0)

        chunks = [
            ChunkResult(
                id=f"chunk-{i}",
                document_id="IS 10500:2012",
                standard_number="IS 10500:2012",
                section_title=f"Section {i}",
                content="Standard test content repetition " * 50,
                rrf_score=0.03 - (i * 0.001),
            )
            for i in range(10)
        ]

        trimmed = trim_chunks_to_token_limit(chunks, max_tokens=300)
        self.assertGreaterEqual(len(trimmed), 1)
        self.assertLess(len(trimmed), len(chunks))

    def test_rerank_and_refine_scores(self):
        from m3.retrieval import rerank_and_refine_scores
        from m3.schemas import ChunkResult

        chunk_exact = ChunkResult(
            id="c-1",
            document_id="IS 10500:2012",
            standard_number="IS 10500:2012",
            section_title="Drinking Water Quality",
            content="Arsenic maximum permissible limit is 0.01 mg/l",
            rrf_score=0.02,
            is_exact_match=True,
        )
        chunk_generic = ChunkResult(
            id="c-2",
            document_id="IS 456:2000",
            standard_number="IS 456:2000",
            section_title="Concrete Mix",
            content="General mixing instructions",
            rrf_score=0.02,
            is_exact_match=False,
        )

        results = rerank_and_refine_scores(
            results=[chunk_generic, chunk_exact],
            query="arsenic limit in drinking water IS 10500",
            detected_standards=["IS 10500:2012"],
        )

        self.assertEqual(results[0].id, "c-1")
        self.assertGreater(results[0].rrf_score, results[1].rrf_score)


if __name__ == "__main__":
    unittest.main()
