# M6 — Grounding & Citation Enforcement

Takes a generated answer + the context it was supposed to be grounded in,
and: (1) attaches proper citations (standard number, section, source link)
for everything actually retrieved, (2) flags any standard the answer
mentions that was NEVER retrieved — a hallucination guard — and (3)
formats the final citation block via pure, independently-tested functions.

No LLM calls, no DB, no network — this is a synchronous post-processing
step. All 20 tests pass, including the core hallucination-detection case,
run against the real `m3.retrieval.extract_is_numbers` regex (not a stand-in).

## The one function you call

```python
from m6.pipeline import enforce_grounding
from m6.schemas import ContextChunk

result = enforce_grounding(
    answer_text=llm_answer_text,      # e.g. from M5
    context_chunks=context_chunks,     # List[ContextChunk] — same shape as M5's
    citation_style="footnote",         # or "inline" / "markdown_list"
)

result.formatted_answer      # answer + appended "Sources:" block, ready to show the user
result.citations             # structured list: [{standard_number, section_title, section_number, source_url}, ...]
result.unverified_citations  # any standard the answer named that wasn't actually retrieved
result.is_fully_grounded     # True only if there's ≥1 real citation AND nothing unverified
```

## Why this is a separate module from M5, not folded into it

M5 already builds a basic citation list from whatever chunks were
retrieved — that part is genuinely duplicated here (`citations_from_chunks`
exists in both, same dedup logic). What M5 does NOT do is check whether
the LLM's own answer text actually stayed within those chunks — it trusts
the model to only mention what it was given. M6 is the check on that
trust: it re-reads the generated text and cross-references every IS number
it finds against what was actually retrieved.

## Integrating into M5 (one-line change, nothing else moves)

In `m5/pipeline.py`, `generate_answer()` currently builds citations itself
via `citations_from_chunks()` right after the LLM call. Swap that block for
a call into M6:

```python
# m5/pipeline.py, inside generate_answer(), after:
#   answer_text, model_used = await llm.complete(messages)

from m6.pipeline import enforce_grounding
from m6.schemas import ContextChunk as M6ContextChunk

grounded = enforce_grounding(
    answer_text=answer_text,
    context_chunks=[M6ContextChunk(**c.model_dump()) for c in context_chunks],  # same shape, direct conversion
    citation_style="footnote",
)

citations = grounded.citations          # replaces M5's own citations_from_chunks(...) call
# optionally also surface grounded.unverified_citations / grounded.is_fully_grounded
# in M5's GenerateAnswerResponse if you want the hallucination flag visible downstream
```

I didn't make this edit to M5 myself, since you're the one who owns that
file now and it's close to your deadline — this is the exact diff if/when
you want it wired in. Until then, M6 works standalone via its own
`POST /api/v1/grounding/ground` endpoint (port 8006) — you can call it as
a separate step after M5 returns, with no code changes to M5 at all.

## Honest scope — what this does and doesn't catch

**Does catch:** the LLM naming a standard number that was never in the
retrieved context at all. This is the most damaging failure mode for a
standards-lookup assistant — confidently citing "IS 9999" when nothing
like it was ever retrieved — and it's cheap and fully deterministic to check.

**Does NOT catch:** a fabricated *clause number or fact* under a
correctly-cited real standard (e.g. citing IS 456 correctly but inventing
a strength value that IS 456 doesn't actually specify). Catching that
needs entailment/fact-checking against the chunk text, not just number
matching — out of scope here given the timeline, and a reasonable thing to
flag as a known limitation rather than pretend is covered.

## Files

```
m6/
  config.py             Settings — port 8006, default citation style
  schemas.py             ContextChunk, Citation, UnverifiedCitation, request/response
  citation_formatter.py  PURE functions — format_citation_line, format_citations_block,
                          append_citations_to_answer. No I/O, no side effects, deterministic.
  grounding.py            find_unverified_citations() — the hallucination check.
                          Reuses m3.retrieval.extract_is_numbers, same fallback pattern as m4/m5.
  pipeline.py             enforce_grounding() — the actual entry point, ties the above together
  main.py                 Thin FastAPI wrapper: POST /api/v1/grounding/ground
  tests/test_m6.py        20 tests — pure formatter tests + hallucination detection tests
```

## Running it

```bash
pip install -r m6/requirements.txt
pytest m6/tests/test_m6.py -v      # 20 tests, all pure/fast, no DB or network needed
python -m m6.main                   # optional standalone service, port 8006
```
