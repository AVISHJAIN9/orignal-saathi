"""
Run with: pytest m6/tests/test_m6.py -v
"""

import pytest

from m6.schemas import Citation, ContextChunk
from m6.citation_formatter import format_citation_line, format_citations_block, append_citations_to_answer
from m6.grounding import find_unverified_citations
from m6.pipeline import enforce_grounding, citations_from_chunks


# --- Pure formatter tests: fixed input -> fixed output, no setup needed ---

def test_format_citation_line_full():
    c = Citation(standard_number="IS 456", section_number="5", section_title="Materials", source_url="https://bis.gov.in/is456")
    assert format_citation_line(c) == "IS 456, Section 5: Materials — https://bis.gov.in/is456"


def test_format_citation_line_minimal():
    c = Citation(standard_number="IS 456")
    assert format_citation_line(c) == "IS 456"


def test_format_citation_line_no_fields_at_all():
    c = Citation()
    assert format_citation_line(c) == "Source"


def test_format_citation_line_with_index():
    c = Citation(standard_number="IS 456")
    assert format_citation_line(c, index=1) == "[1] IS 456"


def test_format_citations_block_empty_list():
    assert format_citations_block([]) == ""


def test_format_citations_block_footnote_style():
    citations = [Citation(standard_number="IS 456"), Citation(standard_number="IS 1489")]
    block = format_citations_block(citations, style="footnote")
    assert block == "[1] IS 456\n[2] IS 1489"


def test_format_citations_block_markdown_style():
    citations = [Citation(standard_number="IS 456")]
    assert format_citations_block(citations, style="markdown_list") == "- IS 456"


def test_format_citations_block_inline_style():
    citations = [Citation(standard_number="IS 456"), Citation(standard_number="IS 1489")]
    assert format_citations_block(citations, style="inline") == "IS 456; IS 1489"


def test_append_citations_to_answer_with_citations():
    result = append_citations_to_answer("The cement must meet strength requirements.", [Citation(standard_number="IS 456")])
    assert result == "The cement must meet strength requirements.\n\nSources:\n[1] IS 456"


def test_append_citations_to_answer_no_citations_returns_answer_unchanged():
    result = append_citations_to_answer("No sources here.", [])
    assert result == "No sources here."


def test_formatter_is_deterministic():
    """Same input, called twice, must produce byte-identical output — this
    is the whole point of keeping it a pure function."""
    citations = [Citation(standard_number="IS 456", section_number="5")]
    a = format_citations_block(citations, style="footnote")
    b = format_citations_block(citations, style="footnote")
    assert a == b


# --- Grounding / hallucination detection tests ---

def test_no_hallucination_when_all_cited_standards_are_grounded():
    chunks = [ContextChunk(chunk_id="1", standard_number="IS 456", content="...")]
    answer = "As per IS 456, the material must meet strength requirements."
    unverified = find_unverified_citations(answer, chunks)
    assert unverified == []


def test_hallucination_detected_for_uncited_standard():
    """The core case this module exists for: the LLM answer mentions a
    standard that was never actually retrieved."""
    chunks = [ContextChunk(chunk_id="1", standard_number="IS 456", content="...")]
    answer = "As per IS 456 and also IS 9999, this product must be certified."
    unverified = find_unverified_citations(answer, chunks)
    assert len(unverified) == 1
    assert unverified[0].standard_number.replace(" ", "").upper() == "IS9999".replace(" ", "")


def test_no_citations_mentioned_means_no_unverified_citations():
    chunks = [ContextChunk(chunk_id="1", standard_number="IS 456", content="...")]
    answer = "This is a general answer with no standard numbers mentioned."
    assert find_unverified_citations(answer, chunks) == []


def test_empty_context_flags_any_mentioned_standard():
    answer = "As per IS 456, requirements apply."
    unverified = find_unverified_citations(answer, [])
    assert len(unverified) == 1


# --- Full pipeline tests ---

def test_citations_from_chunks_dedupes_by_standard_and_section():
    chunks = [
        ContextChunk(chunk_id="1", standard_number="IS 456", section_number="5", content="a"),
        ContextChunk(chunk_id="2", standard_number="IS 456", section_number="5", content="duplicate section"),
        ContextChunk(chunk_id="3", standard_number="IS 1489", section_number="1", content="b"),
    ]
    citations = citations_from_chunks(chunks)
    assert len(citations) == 2


def test_enforce_grounding_fully_grounded_case():
    chunks = [ContextChunk(chunk_id="1", standard_number="IS 456", section_number="5", section_title="Materials", content="...")]
    answer = "As per IS 456, the materials must meet strength requirements."
    result = enforce_grounding(answer, chunks)
    assert result.is_fully_grounded is True
    assert len(result.citations) == 1
    assert result.unverified_citations == []
    assert "Sources:" in result.formatted_answer


def test_enforce_grounding_hallucination_case_not_fully_grounded():
    chunks = [ContextChunk(chunk_id="1", standard_number="IS 456", content="...")]
    answer = "As per IS 456 and IS 9999, this applies."
    result = enforce_grounding(answer, chunks)
    assert result.is_fully_grounded is False
    assert len(result.unverified_citations) == 1


def test_enforce_grounding_zero_citations_not_considered_grounded():
    result = enforce_grounding("A general answer with nothing cited.", [])
    assert result.is_fully_grounded is False
    assert result.citations == []
    assert result.unverified_citations == []


def test_enforce_grounding_answer_text_field_is_unmodified():
    chunks = [ContextChunk(chunk_id="1", standard_number="IS 456", content="...")]
    original = "As per IS 456, ..."
    result = enforce_grounding(original, chunks)
    assert result.answer_text == original  # unmodified, unlike formatted_answer
