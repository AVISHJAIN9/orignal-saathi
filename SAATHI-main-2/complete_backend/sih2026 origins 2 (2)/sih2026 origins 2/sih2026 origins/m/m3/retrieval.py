import re
import time
import math
import hashlib
import logging
from datetime import date
from typing import Any, Dict, List, Optional, Tuple, Union

try:
    from tenacity import retry, stop_after_attempt, wait_random_exponential
except ImportError:
    def retry(*args, **kwargs):
        def decorator(f):
            return f
        return decorator

try:
    import asyncpg
except ImportError:
    asyncpg = None  # type: ignore

from m3.config import get_settings
from m3.schemas import ChunkResult, HybridSearchRequest, RetrievalFilter

logger = logging.getLogger("m3.retrieval")

# ==============================================================================
# 1. Regex IS-Number Detector & Normalizer
# ==============================================================================

IS_PATTERN = re.compile(
    r"\b(?P<prefix>IS(?:[\/\\](?:ISO|IEC|IEEE))?|IS)[\s:\-\.]*"
    r"(?P<num>\d+(?:[\-\/]\d+)?)"
    r"(?P<part>\s*\((?:Part|Pt\.?)\s*\d+(?:\s*[\/\-]\s*Sec\.?\s*\d+)?\))?"
    r"(?P<year>\s*:\s*\d{4})?\b",
    re.IGNORECASE,
)


def normalize_is_number(raw_str: str) -> str:
    """
    Normalize an Indian Standard string into canonical format:
    e.g., 'is 10500 : 2012' -> 'IS 10500:2012'
    e.g., 'is/iso  9001:2015' -> 'IS/ISO 9001:2015'
    e.g., 'IS-456' -> 'IS 456'
    """
    if not raw_str:
        return ""
    
    match = IS_PATTERN.search(raw_str.strip())
    if not match:
        clean = re.sub(r"\s+", " ", raw_str.strip().upper())
        return clean

    prefix = match.group("prefix").upper().replace("\\", "/")
    num = match.group("num").strip()
    part = match.group("part")
    year = match.group("year")

    canonical = f"{prefix} {num}"
    if part:
        clean_part = re.sub(r"\s+", " ", part.strip())
        canonical += f" {clean_part}"
    if year:
        clean_year = re.sub(r"\s*:\s*", ":", year.strip())
        canonical += clean_year

    return canonical


def extract_is_numbers(query: str) -> List[str]:
    """
    Extract and return unique normalized Indian Standard numbers found in the text.
    """
    if not query:
        return []

    found = []
    for match in IS_PATTERN.finditer(query):
        matched_str = match.group(0)
        norm = normalize_is_number(matched_str)
        if norm and norm not in found:
            found.append(norm)

    return found


# ==============================================================================
# 2. Embedding Utilities & Token Counter
# ==============================================================================

def _fake_embedding_dev_only_do_not_use_in_production(text: str, dim: int = 1536) -> List[float]:
    """
    Hash-based fake embedding — LOCAL DEV ONLY.

    This function is intentionally named to be impossible to use accidentally
    in production code review. It produces semantically meaningless vectors.

    It is ONLY reachable when:
      - LOCAL_DEV=true is set in the environment AND
      - ENABLE_LOCAL_EMBEDDING_FALLBACK=true is set AND
      - NODE_ENV/ENVIRONMENT is NOT 'production'

    Renamed from generate_local_fallback_embedding on 2026-09-13 as part of
    production hardening. The old name made it sound like a legitimate fallback.
    """
    import os
    is_production = os.environ.get("ENVIRONMENT") == "production" or os.environ.get("NODE_ENV") == "production"
    is_local_dev = os.environ.get("LOCAL_DEV", "").lower() == "true"
    if is_production or not is_local_dev:
        raise RuntimeError(
            "_fake_embedding_dev_only_do_not_use_in_production called outside LOCAL_DEV mode. "
            "This is a production-blocking bug. Set ENABLE_LOCAL_EMBEDDING_FALLBACK=false "
            "and provide a real embedding provider (OPENAI_API_KEY or GEMINI_API_KEY)."
        )
    vec = [0.0] * dim
    words = text.lower().split()
    if not words:
        return vec
    for w_idx, word in enumerate(words):
        h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
        pos1 = h % dim
        pos2 = (h >> 16) % dim
        pos3 = (h >> 32) % dim
        weight = 1.0 / (1.0 + math.log(w_idx + 1))
        vec[pos1] += weight * 1.0
        vec[pos2] += weight * 0.5
        vec[pos3] -= weight * 0.25
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [x / norm for x in vec]
    return vec


# Keep the old name as an alias so existing imports don't break at import time,
# but it will raise at call time in production.
generate_local_fallback_embedding = _fake_embedding_dev_only_do_not_use_in_production


def count_tokens(text: str) -> int:
    """
    Accurately count tokens using tiktoken (cl100k_base) or fallback approximation.
    """
    try:
        import tiktoken
        enc = tiktoken.get_encoding("cl100k_base")
        return len(enc.encode(text))
    except Exception:
        # Reliable token estimation: ~4 characters per token
        return max(1, len(text.strip()) // 4)


def trim_chunks_to_token_limit(chunks: List[ChunkResult], max_tokens: int = 3500) -> List[ChunkResult]:
    """
    Trim retrieved chunk candidates so the cumulative token count does not exceed prompt context limits.
    """
    trimmed: List[ChunkResult] = []
    current_tokens = 0
    for chunk in chunks:
        chunk_tokens = count_tokens(chunk.content) + count_tokens(chunk.section_title or "") + 20
        if current_tokens + chunk_tokens > max_tokens and len(trimmed) >= 1:
            logger.info("Context trimmed at %d tokens (%d chunks) against max limit %d", current_tokens, len(trimmed), max_tokens)
            break
        trimmed.append(chunk)
        current_tokens += chunk_tokens
    return trimmed


# ==============================================================================
# 3. Reciprocal Rank Fusion (RRF) & Scoring Refinement
# ==============================================================================

def calculate_rrf_score(
    dense_rank: Optional[int],
    sparse_rank: Optional[int],
    k: int = 60,
    is_exact_match: bool = False,
    exact_boost: float = 0.05,
) -> float:
    """
    Compute Reciprocal Rank Fusion score:
    RRF(d) = sum(1 / (k + rank_m(d))) for m in {dense, sparse}
    Optionally adds an exact-match boost if standard number matched query exactly.
    """
    score = 0.0
    if dense_rank is not None and dense_rank > 0:
        score += 1.0 / (k + dense_rank)
    if sparse_rank is not None and sparse_rank > 0:
        score += 1.0 / (k + sparse_rank)
    if is_exact_match:
        score += exact_boost
    return round(score, 6)


def rerank_and_refine_scores(
    results: List[ChunkResult],
    query: str,
    detected_standards: List[str],
) -> List[ChunkResult]:
    """
    Post-RRF reranking step that refines chunk relevance based on:
    1. Exact IS standard number match in standard_number or document_id
    2. Query term overlap in title and content
    3. Section and clause specificity
    """
    query_terms = set(re.findall(r"\w+", query.lower()))
    query_terms.discard("is")

    for chunk in results:
        content_lower = chunk.content.lower()
        title_lower = (chunk.section_title or "").lower()
        
        # Term overlap score
        matched_in_content = sum(1 for t in query_terms if t in content_lower)
        matched_in_title = sum(1 for t in query_terms if t in title_lower)
        overlap_ratio = (matched_in_content + matched_in_title * 2) / max(len(query_terms) * 2, 1)

        # Refinement multiplier
        refinement = 1.0 + (0.25 * min(overlap_ratio, 1.0))
        if chunk.is_exact_match:
            refinement += 0.15
        
        chunk.rrf_score = round(chunk.rrf_score * refinement, 6)

    results.sort(key=lambda x: x.rrf_score, reverse=True)
    return results


def merge_and_rank_rrf(
    dense_results: List[Dict[str, Any]],
    sparse_results: List[Dict[str, Any]],
    detected_is_standards: List[str],
    k: int = 60,
    top_k: int = 10,
    enable_is_boost: bool = True,
    exact_boost: float = 0.05,
) -> List[ChunkResult]:
    """
    Merge dense and sparse search results using Reciprocal Rank Fusion (RRF).
    """
    merged: Dict[str, Dict[str, Any]] = {}

    # 1. Process dense rankings
    for rank, row in enumerate(dense_results, start=1):
        cid = str(row["id"])
        if cid not in merged:
            merged[cid] = dict(row)
            merged[cid]["dense_rank"] = rank
            merged[cid]["sparse_rank"] = None
            merged[cid]["cosine_similarity"] = float(row.get("cosine_similarity", 0.0))
            merged[cid]["bm25_score"] = None
        else:
            merged[cid]["dense_rank"] = rank
            merged[cid]["cosine_similarity"] = float(row.get("cosine_similarity", 0.0))

    # 2. Process sparse rankings
    for rank, row in enumerate(sparse_results, start=1):
        cid = str(row["id"])
        if cid not in merged:
            merged[cid] = dict(row)
            merged[cid]["dense_rank"] = None
            merged[cid]["sparse_rank"] = rank
            merged[cid]["cosine_similarity"] = None
            merged[cid]["bm25_score"] = float(row.get("bm25_score", 0.0))
        else:
            merged[cid]["sparse_rank"] = rank
            merged[cid]["bm25_score"] = float(row.get("bm25_score", 0.0))

    # 3. Check for exact IS match and compute RRF scores
    scored_results: List[ChunkResult] = []
    clean_detected = [s.replace(" ", "").upper() for s in detected_is_standards]

    for cid, data in merged.items():
        standard_no = (data.get("standard_number") or "").replace(" ", "").upper()
        doc_id = (data.get("document_id") or "").replace(" ", "").upper()

        is_exact = False
        if enable_is_boost and clean_detected:
            for det in clean_detected:
                if det in standard_no or det in doc_id:
                    is_exact = True
                    break

        rrf_score = calculate_rrf_score(
            dense_rank=data.get("dense_rank"),
            sparse_rank=data.get("sparse_rank"),
            k=k,
            is_exact_match=is_exact,
            exact_boost=exact_boost if enable_is_boost else 0.0,
        )

        chunk_result = ChunkResult(
            id=str(data["id"]),
            document_id=str(data.get("document_id", "")),
            standard_number=data.get("standard_number"),
            doc_type=data.get("doc_type"),
            category=data.get("category"),
            section_title=data.get("section_title"),
            section_number=data.get("section_number"),
            content=str(data.get("content", "")),
            source_url=data.get("source_url"),
            publication_date=data.get("publication_date"),
            metadata=data.get("metadata") or {},
            rrf_score=rrf_score,
            dense_rank=data.get("dense_rank"),
            sparse_rank=data.get("sparse_rank"),
            cosine_similarity=data.get("cosine_similarity"),
            bm25_score=data.get("bm25_score"),
            is_exact_match=is_exact,
        )
        scored_results.append(chunk_result)

    # 4. Sort descending by RRF score
    scored_results.sort(key=lambda x: x.rrf_score, reverse=True)
    return scored_results[:top_k]


# ==============================================================================
# 4. Dynamic Filter SQL Helper
# ==============================================================================

def build_filter_clause(
    filters: Optional[RetrievalFilter],
    start_param_idx: int = 1,
) -> Tuple[str, List[Any]]:
    """
    Construct parameterized SQL WHERE clause for optional metadata filters.
    Returns (where_sql, params_list).
    """
    conditions = ["1=1"]
    params: List[Any] = []
    idx = start_param_idx

    if not filters:
        return " AND ".join(conditions), params

    if filters.doc_type:
        if isinstance(filters.doc_type, list):
            conditions.append(f"doc_type = ANY(${idx})")
            params.append(filters.doc_type)
        else:
            conditions.append(f"doc_type = ${idx}")
            params.append(filters.doc_type)
        idx += 1

    if filters.category:
        if isinstance(filters.category, list):
            conditions.append(f"category = ANY(${idx})")
            params.append(filters.category)
        else:
            conditions.append(f"category = ${idx}")
            params.append(filters.category)
        idx += 1

    if filters.start_date:
        conditions.append(f"publication_date >= ${idx}")
        params.append(filters.start_date)
        idx += 1

    if filters.end_date:
        conditions.append(f"publication_date <= ${idx}")
        params.append(filters.end_date)
        idx += 1

    if filters.standard_number:
        conditions.append(f"standard_number ILIKE ${idx}")
        params.append(f"%{filters.standard_number}%")
        idx += 1

    return " AND ".join(conditions), params


# ==============================================================================
# 5. Database Retrieval Functions (Dense, Sparse, Hybrid, Exact Lookup)
# ==============================================================================

@retry(
    stop=stop_after_attempt(3),
    wait=wait_random_exponential(min=0.5, max=5),
    reraise=True,
)
async def execute_dense_retrieval(
    conn: Any,
    embedding: List[float],
    top_k: int = 20,
    filters: Optional[RetrievalFilter] = None,
) -> List[Dict[str, Any]]:
    """
    Execute pgvector cosine distance search using the <=> operator with retry on transient errors.
    Cosine similarity = 1 - (embedding <=> query_vector).
    """
    filter_sql, filter_params = build_filter_clause(filters, start_param_idx=3)
    vec_param = list(embedding)

    sql = f"""
    SELECT 
        id, document_id, standard_number, doc_type, category, 
        section_title, section_number, content, source_url, publication_date, metadata,
        1 - (embedding <=> $1::vector) AS cosine_similarity,
        ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS dense_rank
    FROM document_chunks
    WHERE {filter_sql}
      AND embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT $2;
    """

    params = [vec_param, top_k] + filter_params
    rows = await conn.fetch(sql, *params)
    return [dict(row) for row in rows]


@retry(
    stop=stop_after_attempt(3),
    wait=wait_random_exponential(min=0.5, max=5),
    reraise=True,
)
async def execute_sparse_retrieval(
    conn: Any,
    query_str: str,
    top_k: int = 20,
    filters: Optional[RetrievalFilter] = None,
) -> List[Dict[str, Any]]:
    """
    Execute PostgreSQL Full-Text Search (tsvector) using websearch_to_tsquery with retry on transient errors.
    """
    filter_sql, filter_params = build_filter_clause(filters, start_param_idx=3)

    sql = f"""
    WITH query_ts AS (
        SELECT websearch_to_tsquery('english', $1) AS ts_q
    )
    SELECT 
        c.id, c.document_id, c.standard_number, c.doc_type, c.category, 
        c.section_title, c.section_number, c.content, c.source_url, c.publication_date, c.metadata,
        ts_rank_cd(c.tsv, q.ts_q) AS bm25_score,
        ROW_NUMBER() OVER (ORDER BY ts_rank_cd(c.tsv, q.ts_q) DESC) AS sparse_rank
    FROM document_chunks c, query_ts q
    WHERE c.tsv @@ q.ts_q
      AND {filter_sql}
    ORDER BY bm25_score DESC
    LIMIT $2;
    """

    params = [query_str, top_k] + filter_params
    rows = await conn.fetch(sql, *params)
    return [dict(row) for row in rows]


async def execute_hybrid_retrieval(
    conn: Any,
    request: HybridSearchRequest,
) -> Tuple[List[ChunkResult], List[str]]:
    """
    Orchestrate full hybrid search with fault-tolerant fallbacks, post-RRF reranking,
    and context window token trimming.
    """
    settings = get_settings()
    k_constant = request.rrf_k or settings.RRF_K
    top_k = request.top_k or settings.DEFAULT_TOP_K
    candidate_fetch_limit = min(top_k * 3, 100)

    # 1. Detect IS numbers
    detected_standards = extract_is_numbers(request.query)

    # 2. Dense retrieval — embedding must be provided by the caller (from M2 EmbeddingGenerator).
    # PRODUCTION: If no embedding is present, dense retrieval is skipped entirely and only
    # sparse/FTS retrieval runs. The fake local embedding fallback is disabled in production.
    # LOCAL DEV: Set ENABLE_LOCAL_EMBEDDING_FALLBACK=true AND LOCAL_DEV=true to allow the
    # hash-based fake fallback (results will be semantically meaningless).
    import os as _os
    dense_results: List[Dict[str, Any]] = []
    embedding_to_use = request.query_embedding
    _is_production = _os.environ.get("ENVIRONMENT") == "production" or _os.environ.get("NODE_ENV") == "production"
    _is_local_dev = _os.environ.get("LOCAL_DEV", "").lower() == "true"
    if (not embedding_to_use or len(embedding_to_use) == 0):
        if settings.ENABLE_LOCAL_EMBEDDING_FALLBACK and _is_local_dev and not _is_production:
            logger.warning(
                "[LOCAL-DEV ONLY] No query embedding provided. Using hash-based fake embedding. "
                "Retrieval results will be semantically meaningless."
            )
            embedding_to_use = _fake_embedding_dev_only_do_not_use_in_production(
                request.query, dim=settings.EMBEDDING_DIM
            )
        elif not _is_production:
            logger.warning("No query embedding provided. Dense retrieval will be skipped; only sparse FTS will run.")
        else:
            logger.error(
                "No query embedding in production request. Dense retrieval skipped. "
                "Ensure M2 EmbeddingGenerator is correctly configured with a real API key."
            )

    if embedding_to_use is not None and len(embedding_to_use) > 0 and conn is not None:
        try:
            dense_results = await execute_dense_retrieval(
                conn=conn,
                embedding=embedding_to_use,
                top_k=candidate_fetch_limit,
                filters=request.filters,
            )
        except Exception as exc:
            logger.warning("Dense retrieval transient error (falling back to sparse): %s", exc)

    # 3. Sparse retrieval
    sparse_results: List[Dict[str, Any]] = []
    if conn is not None:
        try:
            sparse_results = await execute_sparse_retrieval(
                conn=conn,
                query_str=request.query,
                top_k=candidate_fetch_limit,
                filters=request.filters,
            )
        except Exception as exc:
            logger.warning("Sparse retrieval transient error: %s", exc)

    # 4. Merge via RRF
    fused_results = merge_and_rank_rrf(
        dense_results=dense_results,
        sparse_results=sparse_results,
        detected_is_standards=detected_standards,
        k=k_constant,
        top_k=candidate_fetch_limit,
        enable_is_boost=request.enable_is_boost,
        exact_boost=settings.EXACT_IS_BOOST_SCORE,
    )

    # 5. Post-RRF Scoring Refinement and Reranking
    if settings.ENABLE_RERANKING and fused_results:
        fused_results = rerank_and_refine_scores(
            results=fused_results,
            query=request.query,
            detected_standards=detected_standards,
        )

    # 6. Apply top_k selection
    selected_results = fused_results[:top_k]

    # 7. Accurate Context Window Token Trimming
    final_results = trim_chunks_to_token_limit(
        selected_results,
        max_tokens=settings.MAX_CONTEXT_TOKENS,
    )

    return final_results, detected_standards


@retry(
    stop=stop_after_attempt(3),
    wait=wait_random_exponential(min=0.5, max=5),
    reraise=True,
)
async def execute_is_lookup(
    conn: Any,
    raw_standard_query: str,
    top_k: int = 10,
) -> Tuple[List[ChunkResult], str]:
    """
    Fast direct lookup for standard number clauses/chunks with retry resilience.
    """
    norm_standard = normalize_is_number(raw_standard_query) or raw_standard_query.strip()
    
    sql = """
    SELECT 
        id, document_id, standard_number, doc_type, category, 
        section_title, section_number, content, source_url, publication_date, metadata
    FROM document_chunks
    WHERE standard_number ILIKE $1 
       OR document_id ILIKE $1
       OR standard_number ILIKE $2
    ORDER BY 
        CASE WHEN standard_number ILIKE $1 THEN 1 ELSE 2 END,
        section_number ASC NULLS LAST
    LIMIT $3;
    """

    exact_pattern = norm_standard
    wildcard_pattern = f"%{norm_standard}%"

    rows = await conn.fetch(sql, exact_pattern, wildcard_pattern, top_k)
    
    results = []
    for idx, row in enumerate(rows, start=1):
        data = dict(row)
        res = ChunkResult(
            id=str(data["id"]),
            document_id=str(data.get("document_id", "")),
            standard_number=data.get("standard_number"),
            doc_type=data.get("doc_type"),
            category=data.get("category"),
            section_title=data.get("section_title"),
            section_number=data.get("section_number"),
            content=str(data.get("content", "")),
            source_url=data.get("source_url"),
            publication_date=data.get("publication_date"),
            metadata=data.get("metadata") or {},
            rrf_score=1.0 / (60 + idx),
            dense_rank=None,
            sparse_rank=idx,
            cosine_similarity=None,
            bm25_score=1.0,
            is_exact_match=True,
        )
        results.append(res)

    return results, norm_standard
