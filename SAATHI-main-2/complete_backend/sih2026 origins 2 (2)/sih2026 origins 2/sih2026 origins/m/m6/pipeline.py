"""
M6 entry point: enforce_grounding().

Deliberately 100% synchronous with no I/O — unlike M5, M6 needs no LLM
call, no DB call, nothing async. It's a pure post-processing step over
text you already have, which is exactly why every piece of it
(citation_formatter.py, grounding.py) is independently unit-testable.
"""

from typing import List

from m6.citation_formatter import append_citations_to_answer
from m6.grounding import find_unverified_citations
from m6.schemas import Citation, ContextChunk, GroundedAnswerResponse


def citations_from_chunks(chunks: List[ContextChunk]) -> List[Citation]:
    """
    Build the citation list from context chunks, deduped by
    (standard_number, section_number) so repeated chunks from the same
    clause don't produce duplicate citations. Same dedup rule M5 uses,
    kept here too so m6 is self-contained and doesn't require m5 to be
    importable.
    """
    seen = set()
    citations = []
    for chunk in chunks:
        key = (chunk.standard_number, chunk.section_number)
        if key in seen:
            continue
        seen.add(key)
        citations.append(
            Citation(
                standard_number=chunk.standard_number,
                section_title=chunk.section_title,
                section_number=chunk.section_number,
                source_url=chunk.source_url,
            )
        )
    return citations


def enforce_grounding(
    answer_text: str,
    context_chunks: List[ContextChunk],
    citation_style: str = "footnote",
) -> GroundedAnswerResponse:
    """
    The M6 entry point. Given a generated answer and the context it was
    (supposed to be) grounded in:
      1. Builds a deduped citation list from the chunks actually retrieved.
      2. Checks the answer text for any cited standard number that ISN'T
         backed by those chunks (hallucination guard).
      3. Formats the final display text: answer + appended citation block.

    `is_fully_grounded` is True only when there's at least one real
    citation AND nothing unverified was found — an answer with zero
    citations is not considered "grounded" just because it also didn't
    hallucinate anything.
    """
    citations = citations_from_chunks(context_chunks)
    unverified = find_unverified_citations(answer_text, context_chunks)
    formatted = append_citations_to_answer(answer_text, citations, style=citation_style)

    return GroundedAnswerResponse(
        answer_text=answer_text,
        formatted_answer=formatted,
        citations=citations,
        unverified_citations=unverified,
        is_fully_grounded=(len(citations) > 0 and len(unverified) == 0),
    )
