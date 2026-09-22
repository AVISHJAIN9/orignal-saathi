import unittest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from m3.main import app
from m3.database import get_db_connection
from m3.schemas import ChunkResult


class TestAPIEndpoints(unittest.TestCase):
    """Integration test suite for FastAPI API endpoints."""

    def setUp(self):
        self.mock_db = AsyncMock()

        async def override_db():
            yield self.mock_db

        app.dependency_overrides[get_db_connection] = override_db
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()

    @patch("m3.main.check_db_health")
    def test_health_check_healthy(self, mock_health):
        mock_health.return_value = {
            "connected": True,
            "pgvector_enabled": True,
            "pgvector_version": "0.5.1",
        }
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["database_connected"])
        self.assertTrue(data["pgvector_enabled"])
        self.assertEqual(data["app_version"], "1.0.0")

    @patch("m3.main.check_db_health")
    def test_health_check_degraded(self, mock_health):
        mock_health.return_value = {
            "connected": False,
            "pgvector_enabled": False,
            "error": "Connection refused",
        }
        response = self.client.get("/api/v1/retrieval/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "degraded")
        self.assertFalse(data["database_connected"])

    @patch("m3.main.execute_hybrid_retrieval")
    def test_hybrid_search_success(self, mock_retrieve):
        mock_retrieve.return_value = (
            [
                ChunkResult(
                    id="123e4567-e89b-12d3-a456-426614174000",
                    document_id="IS 10500:2012",
                    standard_number="IS 10500:2012",
                    doc_type="standard",
                    category="Food & Agriculture",
                    section_title="Table 1 Organoleptic and Physical Parameters",
                    section_number="Clause 4.1",
                    content="Drinking water shall be transparent without any turbidity.",
                    source_url="https://bis.gov.in/standards/IS10500.pdf",
                    rrf_score=0.032787,
                    dense_rank=1,
                    sparse_rank=1,
                    cosine_similarity=0.92,
                    bm25_score=0.88,
                    is_exact_match=True,
                )
            ],
            ["IS 10500:2012"],
        )

        payload = {
            "query": "drinking water permissible limit IS 10500",
            "top_k": 5,
            "filters": {
                "doc_type": "standard",
                "category": "Food & Agriculture",
            },
            "enable_is_boost": True,
        }

        response = self.client.post("/api/v1/retrieval/hybrid", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["query"], payload["query"])
        self.assertEqual(data["detected_is_standards"], ["IS 10500:2012"])
        self.assertEqual(data["total_results"], 1)
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["results"][0]["standard_number"], "IS 10500:2012")
        self.assertEqual(data["results"][0]["rrf_score"], 0.032787)
        self.assertGreaterEqual(data["execution_time_ms"], 0)

    def test_hybrid_search_validation_empty_query(self):
        response = self.client.post(
            "/api/v1/retrieval/hybrid",
            json={"query": "", "top_k": 10},
        )
        self.assertEqual(response.status_code, 422)

    def test_hybrid_search_validation_invalid_top_k(self):
        response = self.client.post(
            "/api/v1/retrieval/hybrid",
            json={"query": "test query", "top_k": 500},
        )
        self.assertEqual(response.status_code, 422)

    @patch("m3.main.execute_is_lookup")
    def test_is_lookup_success(self, mock_lookup):
        mock_lookup.return_value = (
            [
                ChunkResult(
                    id="987e6543-e21b-12d3-a456-426614174000",
                    document_id="IS 456:2000",
                    standard_number="IS 456:2000",
                    doc_type="standard",
                    category="Civil Engineering",
                    section_title="Plain and Reinforced Concrete - Code of Practice",
                    section_number="Clause 5.1",
                    content="Cement used shall comply with relevant Indian Standards.",
                    source_url="https://bis.gov.in/standards/IS456.pdf",
                    rrf_score=0.016393,
                    is_exact_match=True,
                )
            ],
            "IS 456:2000",
        )

        response = self.client.get("/api/v1/retrieval/is-lookup?standard_number=is-456&top_k=5")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["query_standard"], "is-456")
        self.assertEqual(data["normalized_standard"], "IS 456:2000")
        self.assertEqual(data["total_results"], 1)
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["results"][0]["standard_number"], "IS 456:2000")

    @patch("m3.main.init_db_schema")
    def test_init_schema_authorized(self, mock_init_schema):
        mock_init_schema.return_value = None
        headers = {"X-Internal-API-Key": "bis-secret-internal-key-2026"}
        response = self.client.post("/api/v1/retrieval/init-schema", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")

    def test_init_schema_invalid_key_rejected(self):
        headers = {"X-Internal-API-Key": "wrong-invalid-key"}
        response = self.client.post("/api/v1/retrieval/init-schema", headers=headers)
        self.assertEqual(response.status_code, 401)


if __name__ == "__main__":
    unittest.main()
