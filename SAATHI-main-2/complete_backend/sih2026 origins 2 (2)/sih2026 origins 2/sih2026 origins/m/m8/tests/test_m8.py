"""
Run with: pytest m8/tests/test_m8.py -v
"""

import pytest

from m8.scoring import compute_confidence, score_margin, theoretical_max_rrf_score
from m8.threshold import should_proceed, build_decline_message
from m8.pipeline import evaluate_confidence


# --- Pure scoring function tests ---

def test_empty_scores_is_zero_confidence():
    assert compute_confidence([]) == 0.0


def test_confidence_is_deterministic():
    scores = [0.02, 0.015, 0.005]
    assert compute_confidence(scores) == compute_confidence(scores)


def test_confidence_bounded_between_zero_and_one():
    for scores in [[], [0.001], [0.0328, 0.0328, 0.0328], [1000.0], [0.0, 0.0]]:
        c = compute_confidence(scores)
        assert 0.0 <= c <= 1.0


def test_score_margin_single_result_is_one():
    assert score_margin([0.02]) == 1.0


def test_score_margin_empty_is_one():
    assert score_margin([]) == 1.0


def test_score_margin_tied_scores_is_zero():
    assert score_margin([0.02, 0.02]) == 0.0


def test_score_margin_large_gap_is_close_to_one():
    assert score_margin([0.03, 0.001]) > 0.9


def test_theoretical_max_rrf_score_matches_m3_default():
    # m3.config.Settings.RRF_K == 60 -- if this ever fails, either M3's
    # RRF_K changed (update DEFAULT_RRF_K in scoring.py) or the math broke.
    assert abs(theoretical_max_rrf_score(rrf_k=60, num_retrievers=2) - 0.032787) < 0.0001


def test_strong_unambiguous_match_scores_high():
    """A near-ceiling top score with a big margin over the runner-up
    should score well above the conservative demo-day threshold."""
    confidence = compute_confidence([0.0328, 0.010, 0.008])
    assert confidence > 0.7


def test_weak_ambiguous_cluster_scores_low():
    """Low absolute scores, all close together -- the system shouldn't be
    confident about a cluster of weak, indistinguishable matches."""
    confidence = compute_confidence([0.010, 0.009, 0.008])
    assert confidence < 0.5


# --- Threshold decision tests ---

def test_should_proceed_at_exact_threshold():
    assert should_proceed(0.55, 0.55) is True


def test_should_proceed_below_threshold_is_false():
    assert should_proceed(0.549, 0.55) is False


def test_build_decline_message_includes_helpdesk_url():
    msg = build_decline_message(confidence=0.3, threshold=0.55, helpdesk_url="https://www.bis.gov.in")
    assert "https://www.bis.gov.in" in msg
    assert "0.30" in msg
    assert "0.55" in msg


def test_build_decline_message_includes_phone_when_given():
    msg = build_decline_message(
        confidence=0.3, threshold=0.55, helpdesk_url="https://www.bis.gov.in", helpdesk_phone="1800-XXX-XXXX"
    )
    assert "1800-XXX-XXXX" in msg


def test_decline_message_is_deterministic():
    a = build_decline_message(0.3, 0.55, "https://www.bis.gov.in")
    b = build_decline_message(0.3, 0.55, "https://www.bis.gov.in")
    assert a == b


# --- Full pipeline tests -- these encode the exact conservative-tuning
# scenarios verified manually before writing this file. ---

def test_no_retrieval_results_declines():
    result = evaluate_confidence([])
    assert result.should_proceed is False
    assert result.decline_message is not None


def test_strong_match_proceeds():
    result = evaluate_confidence([0.0328, 0.010, 0.008])
    assert result.should_proceed is True
    assert result.decline_message is None


def test_weak_ambiguous_match_declines():
    result = evaluate_confidence([0.010, 0.009, 0.008])
    assert result.should_proceed is False


def test_moderate_match_declines_under_conservative_default():
    """This is the key demo-day calibration check: a moderately-good (not
    bad, not great) match should still decline under the conservative
    default threshold, per the risk register's instruction to tune
    conservatively rather than risk a wrong answer live."""
    result = evaluate_confidence([0.020, 0.015, 0.005])
    assert result.should_proceed is False
    assert result.confidence < result.threshold_used


def test_custom_threshold_override():
    """Same scores, lower threshold -> now proceeds. Confirms the
    threshold is genuinely configurable per-call, not hardcoded."""
    scores = [0.020, 0.015, 0.005]
    strict = evaluate_confidence(scores, threshold=0.55)
    lenient = evaluate_confidence(scores, threshold=0.3)
    assert strict.should_proceed is False
    assert lenient.should_proceed is True
