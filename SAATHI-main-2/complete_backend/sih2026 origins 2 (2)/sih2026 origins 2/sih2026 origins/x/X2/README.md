# Module X2: Hallucination Guardrail & Golden Q&A Evaluation Harness

## Overview
Module X2 implements the cite-or-decline hallucination guardrail, sentence-level citation evidence attribution, and automated golden dataset evaluation harness.

## Key Capabilities
- **Semantic Groundedness Verification**: Validates claims against retrieved statutory chunks using token similarity and cosine distance.
- **Cite-or-Decline Decision Engine**: Returns `ALLOWED`, `FLAGGED`, or `DECLINED` with standardized refusal messages.
- **Attributed Evidence**: Maps every factual sentence to its exact source chunk, standard number, and evidence snippet.
- **Golden Evaluation Harness**: Evaluates groundedness, decline, and hallucination prevention rates across 26+ benchmark questions.
- **NestJS Architecture**: Fully injectable service, controller, and module with configurable environment variables.

## Endpoints
- `POST /guardrail/evaluate`
- `POST /guardrail/run-eval-suite`
- `GET /guardrail/history`
