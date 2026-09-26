"""
M8 entry point: evaluate_confidence().

Synchronous, no I/O — same design philosophy as M6: this is pure
post-processing over numbers you already have (M3's retrieval scores),
not a service that needs to call out anywhere.
"""

from typing import Any, List, Optional

from m8.config import get_settings
from m8.scoring import compute_confidence
from m8.threshold import should_proceed, build_decline_message
from m8.schemas import ConfidenceResult


def evaluate_confidence(scores: List[float], threshold: Optional[float] = None) -> ConfidenceResult:
    """
    Entry point. `scores` should be RRF scores, HIGHEST FIRST (the order
    M3 already returns results in — don't re-sort before passing them in
    unless you have a specific reason to).

    Returns whether the caller should proceed with generation, or decline
    and redirect to the BIS helpdesk instead.
    """
    settings = get_settings()
    threshold = threshold if threshold is not None else settings.CONFIDENCE_THRESHOLD

    confidence = compute_confidence(scores, rrf_k=settings.RRF_K)
    proceed = should_proceed(confidence, threshold)

    decline_message = None
    if not proceed:
        decline_message = build_decline_message(
            confidence=confidence,
            threshold=threshold,
            helpdesk_url=settings.BIS_HELPDESK_URL,
            helpdesk_phone=settings.BIS_HELPDESK_PHONE,
        )

    return ConfidenceResult(
        confidence=confidence,
        should_proceed=proceed,
        threshold_used=threshold,
        decline_message=decline_message,
    )


def scores_from_m3_chunk_results(chunk_results: List[Any]) -> List[float]:
    """
    Extract the rrf_score list from real m3.schemas.ChunkResult objects,
    preserving whatever order M3 already returned them in (M3 returns
    results pre-ranked — no re-sorting happens here).
    """
    return [c.rrf_score for c in chunk_results]
