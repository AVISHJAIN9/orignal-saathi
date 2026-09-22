"""
Pure confidence scoring from retrieval scores.

RRF (Reciprocal Rank Fusion) scores are NOT probabilities and aren't
naturally bounded to [0,1]. With M3's RRF_K=60, a chunk ranked #1 in BOTH
the dense and sparse rankings scores 1/(60+1) + 1/(60+1) ≈ 0.0328 — that's
already the practical ceiling. Everything below is built around that real
ceiling rather than an arbitrary guess, so confidence is actually
calibrated to how M3 scores things, not to a made-up scale.

Every function here is pure: same input -> same output, no I/O, no
randomness, no hidden state.
"""

from typing import List

DEFAULT_RRF_K = 60  # must match m3.config.Settings.RRF_K


def theoretical_max_rrf_score(rrf_k: int = DEFAULT_RRF_K, num_retrievers: int = 2) -> float:
    """RRF score for a chunk ranked #1 in every retrieval method — the
    practical ceiling for RRF scores at a given rrf_k."""
    return num_retrievers * (1.0 / (rrf_k + 1))


def score_margin(scores: List[float]) -> float:
    """
    Normalized gap between the top score and the runner-up, as a fraction
    of the top score. 1.0 = no second result to be ambiguous against (or
    the top score is the sole result); 0.0 = top two results are tied.
    """
    if len(scores) < 2:
        return 1.0
    top, second = scores[0], scores[1]
    if top <= 0:
        return 0.0
    return max(0.0, min(1.0, (top - second) / top))


def compute_confidence(
    scores: List[float],
    rrf_k: int = DEFAULT_RRF_K,
    num_retrievers: int = 2,
    top_k_for_support: int = 3,
    support_floor_ratio: float = 0.5,
) -> float:
    """
    Compute a single confidence value in [0, 1] from a list of retrieval
    scores (RRF scores from M3, HIGHEST FIRST — this function does not
    re-sort, so pass them in the order M3 already returns results in).

    Combines three independently-meaningful signals:
      1. Strength (55% weight): how close the top score is to the
         theoretical ceiling for this rrf_k. A weak top match caps
         confidence low no matter what else is true — this is the
         dominant signal on purpose.
      2. Margin (30% weight): how much better the top result is than the
         runner-up. A near-tie means the system can't confidently say
         THIS is the right chunk, even if it scored reasonably well.
      3. Support (15% weight): how many of the top-k results are still
         within `support_floor_ratio` of the top score. Broad agreement
         across multiple chunks is a mild positive signal; a single spiky
         isolated match is treated as slightly less trustworthy.

    Returns 0.0 for an empty scores list (no retrieval results at all is
    the clearest possible case for declining).
    """
    if not scores:
        return 0.0

    ceiling = theoretical_max_rrf_score(rrf_k, num_retrievers)
    top = scores[0]

    strength = max(0.0, min(1.0, top / ceiling)) if ceiling > 0 else 0.0
    margin = score_margin(scores)

    top_k = scores[:top_k_for_support]
    floor = top * support_floor_ratio
    support_count = sum(1 for s in top_k if s >= floor)
    support = support_count / len(top_k) if top_k else 0.0

    confidence = 0.55 * strength + 0.30 * margin + 0.15 * support
    return round(max(0.0, min(1.0, confidence)), 4)
