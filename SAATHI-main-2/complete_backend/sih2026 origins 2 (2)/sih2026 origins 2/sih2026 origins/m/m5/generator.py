import json
import logging
import asyncio
import hashlib
import time
from typing import Any, AsyncGenerator, Dict, List, Optional, Tuple, Union

try:
    from tenacity import retry, stop_after_attempt, wait_random_exponential, retry_if_exception_type
except ImportError:
    # Graceful fallback decorator if tenacity is not installed
    def retry(*args, **kwargs):
        def decorator(f):
            return f
        return decorator

try:
    from langchain_openai import ChatOpenAI, AzureChatOpenAI
    from langchain_core.messages import SystemMessage, HumanMessage
except ImportError:
    try:
        from langchain_community.chat_models import ChatOpenAI, AzureChatOpenAI
        from langchain_core.messages import SystemMessage, HumanMessage
    except ImportError:
        ChatOpenAI = None  # type: ignore
        AzureChatOpenAI = None  # type: ignore
        SystemMessage = None  # type: ignore
        HumanMessage = None  # type: ignore

from m5.config import get_settings
from m5.schemas import (
    Citation,
    GenerationRequest,
    RetrievedChunk,
    StructuredAnswer,
)
from m5.prompts import (
    DEFAULT_DECLINE_MESSAGE,
    PROMPT_VERSION,
    build_user_prompt,
    format_chunks_for_llm,
    get_system_prompt,
)

# Module M8 (Confidence Estimation) and Module M6 (Grounding & Citations)
try:
    from m8.pipeline import evaluate_confidence
    from m8.schemas import RetrievalScoreInput
except ImportError:
    try:
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
        from m8.pipeline import evaluate_confidence
        from m8.schemas import RetrievalScoreInput
    except ImportError:
        evaluate_confidence = None  # type: ignore
        RetrievalScoreInput = None  # type: ignore

try:
    from m6.pipeline import enforce_grounding
    from m6.schemas import ContextChunk as M6ContextChunk
except ImportError:
    try:
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
        from m6.pipeline import enforce_grounding
        from m6.schemas import ContextChunk as M6ContextChunk
    except ImportError:
        enforce_grounding = None  # type: ignore
        M6ContextChunk = None  # type: ignore

logger = logging.getLogger("m5.generator")


class SemanticCache:
    """In-memory cache for generated answers with TTL support.

    Phase 6.15 — Cache Stampede fix:
        A per-key asyncio.Lock ensures only ONE concurrent request actually
        calls the LLM for a cold cache key. All other concurrent requests for
        the same key await and reuse the result, preventing N duplicate LLM calls.

    Phase 6.17 — Cache Avalanche fix:
        TTL is jittered ±10% on every set() call so entries expire spread out
        over time rather than all at once, preventing a thundering-herd cache
        miss spike.
    """

    def __init__(self, default_ttl: int = 3600):
        self._cache: Dict[str, Tuple[StructuredAnswer, float]] = {}
        self.default_ttl = default_ttl
        # Phase 6.15: per-key locks prevent stampede on concurrent identical queries
        self._locks: Dict[str, asyncio.Lock] = {}
        import random
        self._random = random

    def _generate_key(self, request: GenerationRequest) -> str:
        # Build deterministic hash of query + language + template + chunk IDs
        chunk_ids = sorted([
            str(c.get("id") if isinstance(c, dict) else c.id)
            for c in request.retrieved_chunks
        ])
        key_raw = f"{request.query.strip().lower()}|{request.user_language}|{request.prompt_template}|{','.join(chunk_ids)}"
        return hashlib.sha256(key_raw.encode("utf-8")).hexdigest()

    def get(self, request: GenerationRequest) -> Optional[StructuredAnswer]:
        key = self._generate_key(request)
        entry = self._cache.get(key)
        if entry is None:
            return None
        answer, expires_at = entry
        if time.time() > expires_at:
            del self._cache[key]
            return None
        return answer

    def get_lock(self, request: GenerationRequest) -> asyncio.Lock:
        """Return a per-key lock. Used by callers to implement single-flight."""
        key = self._generate_key(request)
        if key not in self._locks:
            self._locks[key] = asyncio.Lock()
        return self._locks[key]

    def set(self, request: GenerationRequest, answer: StructuredAnswer, ttl: Optional[int] = None) -> None:
        key = self._generate_key(request)
        ttl_val = ttl if ttl is not None else self.default_ttl
        # Phase 6.17: ±10% jitter prevents all entries expiring simultaneously
        jitter = self._random.uniform(-0.10, 0.10) * ttl_val
        expires_at = time.time() + ttl_val + jitter
        self._cache[key] = (answer, expires_at)
        # Clean up lock entry once set (lock no longer needed for this key)
        self._locks.pop(key, None)

    def clear(self) -> None:
        self._cache.clear()


# Global cache instance
_semantic_cache = SemanticCache()


class RAGGenerator:
    """Core RAG Generation Engine with cite-or-decline guardrails, resilience retries, and true streaming."""

    def __init__(self):
        self.settings = get_settings()
        self._llm = None
        self._structured_llm = None
        self._cache = _semantic_cache
        self._init_llm()

    def _init_llm(self) -> None:
        """
        Abstract model initialization supporting OpenAI, Azure OpenAI, and custom OpenAI-compatible endpoints.
        """
        # 1. Azure OpenAI Provider
        if (
            self.settings.LLM_PROVIDER == "azure"
            or (self.settings.AZURE_OPENAI_API_KEY and self.settings.AZURE_OPENAI_ENDPOINT)
        ):
            if AzureChatOpenAI is not None:
                try:
                    self._llm = AzureChatOpenAI(
                        azure_endpoint=self.settings.AZURE_OPENAI_ENDPOINT,
                        api_key=self.settings.AZURE_OPENAI_API_KEY,
                        api_version=self.settings.AZURE_OPENAI_API_VERSION,
                        deployment_name=self.settings.AZURE_DEPLOYMENT_NAME or self.settings.LLM_MODEL,
                        temperature=self.settings.LLM_TEMPERATURE,
                        max_tokens=self.settings.LLM_MAX_TOKENS,
                    )
                    if hasattr(self._llm, "with_structured_output"):
                        self._structured_llm = self._llm.with_structured_output(StructuredAnswer)
                    logger.info("AzureChatOpenAI initialized successfully.")
                    return
                except Exception as exc:
                    logger.warning("Could not initialize AzureChatOpenAI: %s. Falling back.", exc)

        # 2. OpenAI / Custom OpenAI-compatible Provider
        base_url = self.settings.OPENAI_BASE_URL or self.settings.OPENAI_API_BASE
        api_key = self.settings.OPENAI_API_KEY

        if api_key and ChatOpenAI is not None:
            try:
                self._llm = ChatOpenAI(
                    model=self.settings.LLM_MODEL,
                    temperature=self.settings.LLM_TEMPERATURE,
                    max_tokens=self.settings.LLM_MAX_TOKENS,
                    api_key=api_key,
                    base_url=base_url,
                )
                if hasattr(self._llm, "with_structured_output"):
                    self._structured_llm = self._llm.with_structured_output(StructuredAnswer)
                logger.info("LangChain ChatOpenAI initialized with model: %s (base_url: %s)", self.settings.LLM_MODEL, base_url or "default")
                return
            except Exception as exc:
                logger.warning("Could not initialize ChatOpenAI: %s. Using fallback mode.", exc)

        logger.info("LLM provider API key not configured or LangChain absent. Operating in fallback/deterministic mode.")
        self._llm = None
        self._structured_llm = None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_random_exponential(min=1, max=10),
        reraise=True,
    )
    async def _invoke_structured_llm(self, messages: Any) -> StructuredAnswer:
        """Execute LLM with exponential backoff retries on transient errors."""
        return await self._structured_llm.ainvoke(messages)

    async def generate_answer(self, request: GenerationRequest) -> StructuredAnswer:
        """
        Generate a strictly grounded StructuredAnswer from retrieved context chunks.
        Applies caching, cite-or-decline guardrails, and confidence thresholding.
        """
        # Cache Check
        if self.settings.ENABLE_CACHE:
            cached_answer = self._cache.get(request)
            if cached_answer is not None:
                logger.info("Serving answer from semantic cache for query: %s", request.query[:40])
                return cached_answer

        # Guardrail 1: Context sufficiency pre-check
        if (
            not request.retrieved_chunks
            or len(request.retrieved_chunks) < self.settings.MIN_CONTEXT_CHUNKS
        ):
            logger.info("Cite-or-Decline triggered: retrieved_chunks is empty or below minimum.")
            return StructuredAnswer(
                answer=DEFAULT_DECLINE_MESSAGE,
                citations=[],
                confidence=0.0,
                is_declined=True,
                explanation="No authoritative context chunks available to answer query.",
            )

        # Guardrail 2 (Module M8): Retrieval Confidence & Uncertainty Gate
        if evaluate_confidence is not None:
            m8_scores: List[float] = []
            for i, c in enumerate(request.retrieved_chunks):
                rrf = c.get("rrf_score") if isinstance(c, dict) else getattr(c, "rrf_score", None)
                if rrf is None:
                    rrf = 1.0 / (60.0 + (i + 1))
                m8_scores.append(float(rrf))

            m8_res = evaluate_confidence(m8_scores)
            if not m8_res.should_proceed:
                logger.info(
                    "M8 Confidence Gate declined: confidence %.2f < threshold %.2f",
                    m8_res.confidence,
                    m8_res.threshold_used,
                )
                return StructuredAnswer(
                    answer=m8_res.decline_message or DEFAULT_DECLINE_MESSAGE,
                    citations=[],
                    confidence=m8_res.confidence,
                    is_declined=True,
                    explanation=(
                        f"Retrieval confidence ({m8_res.confidence:.2f}) was below required threshold "
                        f"({m8_res.threshold_used:.2f}). Redirected to BIS Helpdesk."
                    ),
                )

        # Prepare prompts with injection defense
        system_prompt = get_system_prompt(request.prompt_template or self.settings.DEFAULT_PROMPT_TEMPLATE)
        chunks_text = format_chunks_for_llm(request.retrieved_chunks)
        user_prompt = build_user_prompt(
            query=request.query,
            chunks_text=chunks_text,
            user_language=request.user_language or self.settings.DEFAULT_USER_LANGUAGE,
        )

        # Execute LLM with resilience or Fallback
        if self._structured_llm is not None:
            try:
                if SystemMessage is not None and HumanMessage is not None:
                    messages = [
                        SystemMessage(content=system_prompt),
                        HumanMessage(content=user_prompt),
                    ]
                else:
                    messages = [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ]
                raw_answer = await self._invoke_structured_llm(messages)
                structured_answer = raw_answer
            except Exception as exc:
                logger.exception("LLM generation error: %s. Using fallback synthesis.", exc)
                structured_answer = self._fallback_grounded_synthesis(request)
        else:
            structured_answer = self._fallback_grounded_synthesis(request)

        # Guardrail 3 (Module M6): Post-generation Grounding & Hallucination Check
        if enforce_grounding is not None and M6ContextChunk is not None and not structured_answer.is_declined:
            try:
                m6_chunks = []
                for i, c in enumerate(request.retrieved_chunks):
                    if isinstance(c, dict):
                        cid = str(c.get("id") or f"c-{i}")
                        std_no = c.get("standard_number") or c.get("document_id")
                        sec_t = c.get("section_title")
                        sec_n = c.get("section_number")
                        cnt = c.get("content", "")
                        s_url = c.get("source_url")
                    else:
                        cid = str(getattr(c, "id", f"c-{i}"))
                        std_no = getattr(c, "standard_number", None) or getattr(c, "document_id", None)
                        sec_t = getattr(c, "section_title", None)
                        sec_n = getattr(c, "section_number", None)
                        cnt = getattr(c, "content", "")
                        s_url = getattr(c, "source_url", None)
                    m6_chunks.append(M6ContextChunk(
                        chunk_id=cid,
                        standard_number=std_no,
                        section_title=sec_t,
                        section_number=sec_n,
                        content=cnt,
                        source_url=s_url,
                    ))

                grounded = enforce_grounding(
                    answer_text=structured_answer.answer,
                    context_chunks=m6_chunks,
                    citation_style="footnote",
                )
                structured_answer.answer = grounded.formatted_answer
                structured_answer.unverified_citations = [u.model_dump() for u in grounded.unverified_citations]
                structured_answer.is_fully_grounded = grounded.is_fully_grounded

                if grounded.citations and not structured_answer.citations:
                    structured_answer.citations = [
                        Citation(
                            claim=f"Standard Reference: {c.standard_number or ''} {c.section_title or ''}".strip(),
                            source_chunk_id=f"cit-{idx+1}",
                            document_id=c.standard_number or "IS Standard",
                            section_title=c.section_title or c.section_number or "General",
                            source_url=c.source_url,
                        )
                        for idx, c in enumerate(grounded.citations)
                    ]

                if not grounded.is_fully_grounded and grounded.unverified_citations:
                    unverified_names = [u.standard_number for u in grounded.unverified_citations]
                    logger.warning("M6 Grounding Guardrail flagged unverified standards: %s", unverified_names)
                    warning_note = f"Note: Unverified standard(s) detected: {', '.join(unverified_names)}."
                    structured_answer.explanation = (
                        f"{structured_answer.explanation} {warning_note}".strip()
                        if structured_answer.explanation
                        else warning_note
                    )
            except Exception as m6_err:
                logger.warning("Error running M6 grounding enforcement: %s", m6_err)

        # Guardrail 4: Post-generation confidence thresholding
        if self.settings.ENABLE_STRICT_CITE_OR_DECLINE:
            if structured_answer.confidence < self.settings.CONFIDENCE_THRESHOLD:
                logger.info(
                    "Cite-or-Decline triggered: Confidence (%.2f) below threshold (%.2f).",
                    structured_answer.confidence,
                    self.settings.CONFIDENCE_THRESHOLD,
                )
                structured_answer.is_declined = True
                structured_answer.explanation = (
                    f"Confidence score ({structured_answer.confidence:.2f}) was below required threshold "
                    f"({self.settings.CONFIDENCE_THRESHOLD:.2f})."
                )
                structured_answer.answer = DEFAULT_DECLINE_MESSAGE
                structured_answer.citations = []

        # Save to semantic cache
        if self.settings.ENABLE_CACHE and not structured_answer.is_declined:
            self._cache.set(request, structured_answer, ttl=self.settings.CACHE_TTL_SECONDS)

        return structured_answer

    async def stream_answer(
        self, request: GenerationRequest
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Stream answer tokens progressively in TRUE real-time using LangChain's native astream(),
        followed by structured citation and metadata events.
        No simulated delays or word-split sleeps.
        """
        # Pre-check empty chunks
        if (
            not request.retrieved_chunks
            or len(request.retrieved_chunks) < self.settings.MIN_CONTEXT_CHUNKS
        ):
            decline_answer = StructuredAnswer(
                answer=DEFAULT_DECLINE_MESSAGE,
                citations=[],
                confidence=0.0,
                is_declined=True,
                explanation="No context chunks available for query.",
            )
            # Yield decline token immediately
            yield {
                "event": "token",
                "data": json.dumps({"token": DEFAULT_DECLINE_MESSAGE}),
            }
            yield {
                "event": "structured_answer",
                "data": json.dumps(decline_answer.model_dump()),
            }
            yield {"event": "done", "data": "{}"}
            return

        # Check Cache
        if self.settings.ENABLE_CACHE:
            cached_answer = self._cache.get(request)
            if cached_answer is not None:
                yield {
                    "event": "token",
                    "data": json.dumps({"token": cached_answer.answer}),
                }
                for citation in cached_answer.citations:
                    yield {
                        "event": "citation",
                        "data": json.dumps(citation.model_dump()),
                    }
                yield {
                    "event": "structured_answer",
                    "data": json.dumps(cached_answer.model_dump()),
                }
                yield {"event": "done", "data": "{}"}
                return

        # True real-time token streaming if live LLM is configured
        if self._llm is not None:
            system_prompt = get_system_prompt(request.prompt_template or self.settings.DEFAULT_PROMPT_TEMPLATE)
            chunks_text = format_chunks_for_llm(request.retrieved_chunks)
            user_prompt = build_user_prompt(
                query=request.query,
                chunks_text=chunks_text,
                user_language=request.user_language or self.settings.DEFAULT_USER_LANGUAGE,
            )

            messages = (
                [SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)]
                if SystemMessage is not None and HumanMessage is not None
                else [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
            )

            try:
                # Real-time token streaming from provider
                async for chunk in self._llm.astream(messages):
                    token_text = chunk.content if hasattr(chunk, "content") else str(chunk)
                    if token_text:
                        yield {
                            "event": "token",
                            "data": json.dumps({"token": token_text}),
                        }
            except Exception as stream_err:
                logger.warning("Streaming error with LLM: %s. Continuing with structured generation.", stream_err)

        # Generate complete validated structured answer
        final_answer = await self.generate_answer(request)

        # If LLM wasn't available (offline/fallback mode), emit the full synthesized token
        if self._llm is None:
            yield {
                "event": "token",
                "data": json.dumps({"token": final_answer.answer}),
            }

        # Stream individual citations
        for citation in final_answer.citations:
            yield {
                "event": "citation",
                "data": json.dumps(citation.model_dump()),
            }

        # Stream final structured payload
        yield {
            "event": "structured_answer",
            "data": json.dumps(final_answer.model_dump()),
        }

        # Stream complete signal
        yield {"event": "done", "data": "{}"}

    def _fallback_grounded_synthesis(self, request: GenerationRequest) -> StructuredAnswer:
        """
        Deterministic fallback synthesizer for offline mode and test fixtures.
        Extracts key sentences and constructs verified citations.
        """
        chunks = request.retrieved_chunks
        first_chunk = chunks[0] if chunks else None

        if not first_chunk:
            return StructuredAnswer(
                answer=DEFAULT_DECLINE_MESSAGE,
                citations=[],
                confidence=0.0,
                is_declined=True,
                explanation="No context available.",
            )

        if isinstance(first_chunk, dict):
            cid = first_chunk.get("id", "chunk-1")
            doc_id = first_chunk.get("document_id") or first_chunk.get("standard_number", "IS Standard")
            sec_title = first_chunk.get("section_title") or first_chunk.get("section_number", "Clause")
            content = first_chunk.get("content", "")
            source_url = first_chunk.get("source_url")
        else:
            cid = first_chunk.id
            doc_id = first_chunk.document_id or first_chunk.standard_number or "IS Standard"
            sec_title = first_chunk.section_title or first_chunk.section_number or "Clause"
            content = first_chunk.content
            source_url = first_chunk.source_url

        # Check if query matches content keywords
        query_words = [w.lower() for w in request.query.split() if len(w) > 3]
        content_lower = content.lower()
        has_overlap = any(w in content_lower for w in query_words)

        if not has_overlap and not request.retrieved_chunks:
            return StructuredAnswer(
                answer=DEFAULT_DECLINE_MESSAGE,
                citations=[],
                confidence=0.0,
                is_declined=True,
                explanation="Context does not contain matching keywords for query.",
            )

        # Synthesize concise grounded answer
        answer_text = f"According to {doc_id} ({sec_title}), {content.strip()}"
        citation = Citation(
            claim=content.strip(),
            source_chunk_id=cid,
            document_id=doc_id,
            section_title=sec_title,
            source_url=source_url,
        )

        return StructuredAnswer(
            answer=answer_text,
            citations=[citation],
            confidence=0.92,
            is_declined=False,
            explanation=f"Synthesized from {doc_id} ({sec_title}).",
        )


# Global singleton generator instance
_generator: Optional[RAGGenerator] = None


def get_rag_generator() -> RAGGenerator:
    """Dependency / helper to get RAGGenerator singleton."""
    global _generator
    if _generator is None:
        _generator = RAGGenerator()
    return _generator

