"""
Pure citation formatting.

Every function in this file follows the same rule: same input always
produces the same output, no I/O, no randomness, no hidden state, no
mutation of arguments. That's what makes them trivially unit-testable —
you can assert on a fixed input/output pair forever and it'll never flake.

Do not add logging, DB calls, network calls, or `datetime.now()`-style
non-determinism to this file. If a future version needs any of that,
put it in pipeline.py and keep calling into these pure functions from
there — don't let side effects leak into the formatting layer.
"""

from typing import List, Optional

from m6.schemas import Citation


def format_citation_line(citation: Citation, index: Optional[int] = None) -> str:
    """
    Render a single Citation as one line of text.

    >>> format_citation_line(Citation(standard_number="IS 456", section_number="5", section_title="Materials"))
    'IS 456, Section 5: Materials'
    """
    bits = []
    if citation.standard_number:
        bits.append(citation.standard_number)

    if citation.section_number and citation.section_title:
        bits.append(f"Section {citation.section_number}: {citation.section_title}")
    elif citation.section_number:
        bits.append(f"Section {citation.section_number}")
    elif citation.section_title:
        bits.append(citation.section_title)

    label = ", ".join(bits) if bits else "Source"
    line = f"[{index}] {label}" if index is not None else label

    if citation.source_url:
        line += f" — {citation.source_url}"

    return line


def format_citations_block(citations: List[Citation], style: str = "footnote") -> str:
    """
    Render a list of citations as one block of text, in one of three fixed
    styles. Returns "" for an empty list (caller decides what, if anything,
    to do with that — this function never invents placeholder text).

    style="footnote"      -> numbered list, one citation per line: "[1] IS 456, Section 5 — https://..."
    style="markdown_list" -> "- IS 456, Section 5 — https://..." per line
    style="inline"        -> single line, semicolon-separated
    """
    if not citations:
        return ""

    if style == "markdown_list":
        return "\n".join(f"- {format_citation_line(c)}" for c in citations)

    if style == "inline":
        return "; ".join(format_citation_line(c) for c in citations)

    # default / "footnote"
    return "\n".join(format_citation_line(c, index=i + 1) for i, c in enumerate(citations))


def append_citations_to_answer(answer_text: str, citations: List[Citation], style: str = "footnote") -> str:
    """
    Combine answer text + a formatted citation block into the final display
    string. If there are no citations, returns the answer text unchanged
    (rstripped) — never fabricates a "Sources:" header with nothing under it.
    """
    block = format_citations_block(citations, style=style)
    if not block:
        return answer_text.rstrip()

    if style == "inline":
        return f"{answer_text.rstrip()}\n\nSources: {block}"
    return f"{answer_text.rstrip()}\n\nSources:\n{block}"
