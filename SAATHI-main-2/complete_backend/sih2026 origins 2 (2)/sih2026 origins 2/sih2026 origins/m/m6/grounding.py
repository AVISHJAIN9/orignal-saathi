"""
Grounding enforcement: catches the LLM citing a standard that was never
actually retrieved.

This is a narrow, honest check — it does NOT verify that every factual
claim in the answer is correct (that would need entailment/NLI checking,
out of scope here). What it DOES catch, reliably: the answer explicitly
naming an IS number that doesn't correspond to any chunk actually given to
the model as context. That's the most damaging kind of hallucination for a
standards-lookup system — citing a standard that was simply never there —
and it's cheap and deterministic to check for.

Reuses M3's own IS-number regex (m3.retrieval.extract_is_numbers) rather
than reimplementing it a third time across the project, with the same
lightweight local fallback pattern used in m4/m5 for when m3 isn't
importable in the current environment.
"""

import re
from typing import List, Set

from m6.schemas import ContextChunk, UnverifiedCitation

try:
    from m3.retrieval import extract_is_numbers as _extract_is_numbers
    _HAS_M3 = True
except ImportError:
    _HAS_M3 = False

    _FALLBACK_IS_PATTERN = re.compile(r"IS[\s:\-]?\d+(?:\s*:\s*\d{4})?", re.IGNORECASE)

    def _extract_is_numbers(text: str) -> List[str]:
        if not text:
            return []
        found = []
        for m in _FALLBACK_IS_PATTERN.finditer(text):
            body = re.sub(r"^IS[\s:\-]?", "", m.group(0), flags=re.IGNORECASE)
            body = re.sub(r"\s*:\s*", ":", body.strip())
            norm = f"IS {body}".upper()
            if norm not in found:
                found.append(norm)
        return found


def normalize_standard_number(standard_number: str) -> str:
    return (standard_number or "").strip().upper()


def grounded_standard_numbers(context_chunks: List[ContextChunk]) -> Set[str]:
    """The set of standard numbers actually present in the retrieved context."""
    return {normalize_standard_number(c.standard_number) for c in context_chunks if c.standard_number}


def find_unverified_citations(answer_text: str, context_chunks: List[ContextChunk]) -> List[UnverifiedCitation]:
    """
    Return every IS number the answer text mentions that ISN'T backed by
    any retrieved chunk. Empty list means every standard the model named
    was actually in the context it was given.
    """
    mentioned = _extract_is_numbers(answer_text)
    grounded = grounded_standard_numbers(context_chunks)
    grounded_base = {g.split(":")[0].strip() for g in grounded}

    unverified = []
    seen = set()
    for m in mentioned:
        norm = normalize_standard_number(m)
        norm_base = norm.split(":")[0].strip()
        if norm in grounded or norm_base in grounded_base or norm in seen or norm_base in seen:
            continue
        seen.add(norm)
        seen.add(norm_base)
        unverified.append(UnverifiedCitation(standard_number=m))
    return unverified
