import unittest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from m5.main import app
from m5.schemas import Citation, StructuredAnswer


class TestM5APIEndpoints(unittest.TestCase):
    """Integration test suite for M5 FastAPI endpoints."""

    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        """Verify health check endpoint returns 200 and schema."""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["app_version"], "1.0.0")
        self.assertIn("confidence_threshold", data)

        # Prefix route alias
        response_v1 = self.client.get("/api/v1/generate/health")
        self.assertEqual(response_v1.status_code, 200)

    @patch("m5.generator.RAGGenerator.generate_answer")
    def test_generate_answer_endpoint_success(self, mock_gen):
        """Verify POST /api/v1/generate endpoint returns StructuredAnswer."""
        mock_gen.return_value = StructuredAnswer(
            answer="According to IS 10500:2012, pH must be between 6.5 and 8.5.",
            citations=[
                Citation(
                    claim="pH must be between 6.5 and 8.5",
                    source_chunk_id="chunk-10500-table1",
                    document_id="IS 10500:2012",
                    section_title="Table 1",
                )
            ],
            confidence=0.95,
            is_declined=False,
            explanation="Grounded in Table 1.",
        )

        payload = {
            "query": "What is the acceptable pH range in drinking water?",
            "session_id": "test-session-101",
            "retrieved_chunks": [
                {
                    "id": "chunk-10500-table1",
                    "document_id": "IS 10500:2012",
                    "standard_number": "IS 10500:2012",
                    "section_title": "Table 1",
                    "content": "pH value: Acceptable Limit 6.5 to 8.5.",
                }
            ],
            "user_language": "en",
        }

        response = self.client.post("/api/v1/generate", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["answer"], "According to IS 10500:2012, pH must be between 6.5 and 8.5.")
        self.assertEqual(data["confidence"], 0.95)
        self.assertFalse(data["is_declined"])
        self.assertEqual(len(data["citations"]), 1)
        self.assertEqual(data["citations"][0]["document_id"], "IS 10500:2012")

    def test_generate_answer_validation_error(self):
        """Verify invalid payload missing session_id returns HTTP 422."""
        payload = {
            "query": "What is the acceptable pH range in drinking water?",
            # missing session_id
            "retrieved_chunks": [],
        }
        response = self.client.post("/api/v1/generate", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_generate_stream_endpoint(self):
        """Verify POST /api/v1/generate/stream returns text/event-stream with SSE data."""
        payload = {
            "query": "What is the acceptable pH range in drinking water?",
            "session_id": "test-session-102",
            "retrieved_chunks": [
                {
                    "id": "chunk-1",
                    "document_id": "IS 10500:2012",
                    "content": "pH value: 6.5 to 8.5.",
                }
            ],
            "user_language": "en",
        }

        response = self.client.post("/api/v1/generate/stream", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("text/event-stream", response.headers.get("content-type", ""))
        content_text = response.text
        self.assertIn("event: token", content_text)
        self.assertIn("event: structured_answer", content_text)
        self.assertIn("event: done", content_text)


if __name__ == "__main__":
    unittest.main()
