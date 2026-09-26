import unittest
import json
from unittest.mock import AsyncMock, patch

from m5.generator import RAGGenerator
from m5.schemas import (
    Citation,
    GenerationRequest,
    RetrievedChunk,
    StructuredAnswer,
)
from m5.prompts import (
    DEFAULT_DECLINE_MESSAGE,
    get_system_prompt,
    MSME_X11_SYSTEM_PROMPT,
    STANDARD_QA_SYSTEM_PROMPT,
    format_chunks_for_llm,
)


class TestRAGGenerator(unittest.IsolatedAsyncioTestCase):
    """Test suite for RAG Generation and Cite-or-Decline Guardrails."""

    def setUp(self):
        self.generator = RAGGenerator()
        self.sample_chunk = RetrievedChunk(
            id="c-10500-table2",
            document_id="IS 10500:2012",
            standard_number="IS 10500:2012",
            section_title="Table 2 Toxic Substances",
            section_number="Clause 4.2",
            content="Arsenic (as As) mg/l Max Acceptable Limit: 0.01 mg/l.",
            source_url="https://bis.gov.in/standards/IS10500.pdf",
        )

    async def test_cite_or_decline_empty_chunks(self):
        """Verify engine declines to answer when context is empty."""
        req = GenerationRequest(
            query="What is the limit of Arsenic?",
            session_id="test-sess-1",
            retrieved_chunks=[],
        )
        answer = await self.generator.generate_answer(req)
        self.assertTrue(answer.is_declined)
        self.assertEqual(answer.confidence, 0.0)
        self.assertEqual(len(answer.citations), 0)
        self.assertEqual(answer.answer, DEFAULT_DECLINE_MESSAGE)

    async def test_low_confidence_override(self):
        """Verify engine overrides answer to declined if confidence is below threshold."""
        req = GenerationRequest(
            query="What is the limit of Arsenic?",
            session_id="test-sess-2",
            retrieved_chunks=[self.sample_chunk],
        )

        mock_answer = StructuredAnswer(
            answer="Arsenic limit might be around 0.01 mg/l.",
            citations=[
                Citation(
                    claim="Arsenic limit might be 0.01",
                    source_chunk_id="c-10500-table2",
                    document_id="IS 10500:2012",
                    section_title="Table 2 Toxic Substances",
                )
            ],
            confidence=0.50,  # Below threshold 0.70
            is_declined=False,
            explanation="Uncertain match.",
        )

        with patch.object(self.generator, "_structured_llm", AsyncMock(ainvoke=AsyncMock(return_value=mock_answer))):
            answer = await self.generator.generate_answer(req)
            self.assertTrue(answer.is_declined)
            self.assertEqual(answer.answer, DEFAULT_DECLINE_MESSAGE)
            self.assertEqual(len(answer.citations), 0)

    async def test_grounded_generation_success(self):
        """Verify successful grounded answer synthesis and citation linking."""
        req = GenerationRequest(
            query="What is the limit of Arsenic in drinking water?",
            session_id="test-sess-3",
            retrieved_chunks=[self.sample_chunk],
        )

        mock_answer = StructuredAnswer(
            answer="According to IS 10500:2012, the maximum acceptable limit for Arsenic is 0.01 mg/l.",
            citations=[
                Citation(
                    claim="The maximum acceptable limit for Arsenic is 0.01 mg/l",
                    source_chunk_id="c-10500-table2",
                    document_id="IS 10500:2012",
                    section_title="Table 2 Toxic Substances",
                    source_url="https://bis.gov.in/standards/IS10500.pdf",
                )
            ],
            confidence=0.95,
            is_declined=False,
            explanation="Directly specified in Table 2.",
        )

        with patch.object(self.generator, "_structured_llm", AsyncMock(ainvoke=AsyncMock(return_value=mock_answer))):
            answer = await self.generator.generate_answer(req)
            self.assertFalse(answer.is_declined)
            self.assertEqual(answer.confidence, 0.95)
            self.assertEqual(len(answer.citations), 1)
            self.assertEqual(answer.citations[0].source_chunk_id, "c-10500-table2")
            self.assertEqual(answer.citations[0].document_id, "IS 10500:2012")

    async def test_stream_answer_events(self):
        """Verify stream_answer yields token events and structured_answer event."""
        req = GenerationRequest(
            query="What is the limit of Arsenic?",
            session_id="test-sess-4",
            retrieved_chunks=[self.sample_chunk],
        )

        events = []
        async for event in self.generator.stream_answer(req):
            events.append(event)

        event_types = [e["event"] for e in events]
        self.assertIn("token", event_types)
        self.assertIn("structured_answer", event_types)
        self.assertIn("done", event_types)

        # Check structured_answer event payload
        struct_event = next(e for e in events if e["event"] == "structured_answer")
        data = json.loads(struct_event["data"])
        self.assertIn("answer", data)
        self.assertIn("citations", data)
        self.assertIn("confidence", data)


class TestPromptsAndFormatting(unittest.TestCase):
    """Test suite for prompt templates and chunk formatting."""

    def test_get_system_prompt(self):
        self.assertEqual(get_system_prompt("standard_qa"), STANDARD_QA_SYSTEM_PROMPT)
        self.assertEqual(get_system_prompt("msme_x11"), MSME_X11_SYSTEM_PROMPT)
        # Default fallback
        self.assertEqual(get_system_prompt("unknown"), STANDARD_QA_SYSTEM_PROMPT)

    def test_format_chunks_for_llm(self):
        chunk = RetrievedChunk(
            id="c-456-clause5",
            document_id="IS 456:2000",
            section_title="Concrete Mix Specifications",
            content="M20 grade concrete minimum cement content is 300 kg/m3.",
        )
        formatted = format_chunks_for_llm([chunk])
        self.assertIn("CHUNK_ID: c-456-clause5", formatted)
        self.assertIn("DOCUMENT_ID: IS 456:2000", formatted)
        self.assertIn("SECTION: Concrete Mix Specifications", formatted)
        self.assertIn("M20 grade concrete", formatted)


if __name__ == "__main__":
    unittest.main()
