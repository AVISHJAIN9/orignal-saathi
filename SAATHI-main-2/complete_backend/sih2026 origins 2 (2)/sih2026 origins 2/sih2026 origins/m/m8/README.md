# M8 — Confidence & Uncertainty Estimation

Takes M3's retrieval scores, computes a single confidence value via pure
functions, and decides whether the pipeline should proceed to generation
or decline and redirect to the BIS helpdesk instead of guessing.

No LLM calls, no DB, no network — synchronous post-processing over numbers
you already have. All 20 tests pass.

## The one function you call

```python
from m8.pipeline import evaluate_confidence, scores_from_m3_chunk_results

# from real m3.schemas.ChunkResult objects (M3 already returns them ranked):
scores = scores_from_m3_chunk_results(m3_response.results)
result = evaluate_confidence(scores)

if result.should_proceed:
    # continue to M5 generation as normal
    ...
else:
    # DO NOT call the LLM -- show result.decline_message directly and stop
    return result.decline_message
```

`result` also carries `result.confidence` and `result.threshold_used`, in
case you want to log or display them (e.g. a small "confidence: 0.81"
indicator in a demo UI).

## Where this fits in the pipeline

```
User query -> M4 (intent) -> M3 (retrieval) -> M8 (confidence check) -> M5 (generation) -> M6 (citations)
                                                      |
                                                      v
                                          below threshold? stop here,
                                          return decline_message,
                                          never call the LLM at all
```

M8 sits **between M3 and M5**, not after M5. The whole point is to avoid
spending an LLM call (and Groq quota) generating an answer you're then
going to discard — if retrieval was weak, decline before generation, not
after. If you're using M5's `/ask` convenience endpoint (M4→M3→M5
chained), you'd add the M8 check right after the M3 call inside that
endpoint, before calling `generate_answer()`.

## How confidence is actually computed — and why it's calibrated to real numbers, not guessed

RRF (Reciprocal Rank Fusion) scores aren't probabilities. With M3's
`RRF_K=60`, a chunk ranked #1 in *both* the dense and sparse rankings
scores `1/(60+1) + 1/(60+1) ≈ 0.0328` — and that's already the practical
ceiling. I verified this against M3's actual config before writing the
formula, not after.

`compute_confidence()` blends three signals:
- **Strength (55%)** — how close the top score is to that real ceiling. A
  weak top match caps confidence low no matter what else is true.
- **Margin (30%)** — how much better the top result is than the runner-up.
  A near-tie means the system can't confidently say *this* is the right
  chunk, even if it scored decently.
- **Support (15%)** — how many of the top-3 results are still within half
  the top score. Broad agreement is a mild positive signal; one isolated
  spike is treated as slightly less trustworthy.

## Tuning for demo day (the important part)

Default threshold is **0.55**. This wasn't picked arbitrarily — I ran real
retrieval-score scenarios through the formula before choosing it:

| Scenario | Confidence | Decision |
|---|---|---|
| Strong, unambiguous top match | 0.81 | proceed |
| Two strong near-tied candidates | 0.62 | proceed |
| Moderate top match, decent margin | **0.51** | **decline** |
| Single weak match only | 0.53 | decline |
| Weak, ambiguous cluster | 0.35 | decline |
| No retrieval results at all | 0.00 | decline |

The row that matters most: a **moderate, not-bad match still declines**
under this threshold. That's deliberate — per your risk register, the
failure mode you want on demo day is "politely redirects to the helpdesk"
far more often than "confidently states something uncertain in front of
judges." 0.55 leans conservative on purpose; it will decline some
queries a more lenient system would answer. That's the intended trade,
not a bug.

**If it declines too often during rehearsal** and you want to loosen it
slightly, lower `CONFIDENCE_THRESHOLD` in small steps (e.g. `0.55 -> 0.45`)
via env var and re-run the scenarios above to see what changes — don't
guess, test it the same way I did. **Do not go below ~0.35** — that's
roughly where the "weak, ambiguous cluster" scenario sits, and answering
confidently on that kind of match is exactly the risk the whole module
exists to prevent.

```
CONFIDENCE_THRESHOLD=0.45   # example override, if 0.55 declines too often in rehearsal
```

## Before demo day — one thing you must fill in

`BIS_HELPDESK_PHONE` is `None` by default and `BIS_HELPDESK_URL` defaults
to the generic `https://www.bis.gov.in` — I did not fabricate a specific
phone number or contact page, since showing users a wrong contact would be
worse than showing none. **Set the real one** before demo day:

```
BIS_HELPDESK_URL=<the actual URL your team wants to redirect to>
BIS_HELPDESK_PHONE=<the actual number, if you have one>
```

## Files

```
m8/
  config.py        Settings — CONFIDENCE_THRESHOLD (conservative default), RRF_K, helpdesk contact
  schemas.py         RetrievalScoreInput, ConfidenceRequest/Result
  scoring.py          PURE — compute_confidence(), score_margin(), theoretical_max_rrf_score()
  threshold.py        PURE — should_proceed(), build_decline_message()
  pipeline.py          evaluate_confidence() — the actual entry point
  main.py              Thin FastAPI wrapper: POST /api/v1/confidence/evaluate
  tests/test_m8.py     20 tests — pure function tests + the calibration scenarios above
```

## Running it

```bash
pip install -r m8/requirements.txt
pytest m8/tests/test_m8.py -v
python -m m8.main      # optional standalone service, port 8008
```
