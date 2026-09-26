from datetime import date
from typing import Any, Dict, List, Optional, Union
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class RetrievalFilter(BaseModel):
    """Metadata filtering criteria for hybrid search."""

    model_config = ConfigDict(extra="ignore")

    doc_type: Optional[Union[str, List[str]]] = Field(
        default=None,
        description="Filter by document type (e.g., 'standard', 'manual', 'amendment', 'guideline').",
    )
    category: Optional[Union[str, List[str]]] = Field(
        default=None,
        description="Filter by BIS category/division (e.g., 'Civil Engineering', 'Food & Agriculture').",
    )
    start_date: Optional[date] = Field(
        default=None,
        description="Filter documents published on or after this date (YYYY-MM-DD).",
    )
    end_date: Optional[date] = Field(
        default=None,
        description="Filter documents published on or before this date (YYYY-MM-DD).",
    )
    standard_number: Optional[str] = Field(
        default=None,
        description="Filter specifically by standard number (e.g., 'IS 10500:2012').",
    )
    custom_filters: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Arbitrary JSON key-value filters matched against metadata JSONB.",
    )


class HybridSearchRequest(BaseModel):
    """Request payload for hybrid dense-sparse vector search."""

    model_config = ConfigDict(
        extra="ignore",
        json_schema_extra={
            "example": {
                "query": "drinking water permissible limits for arsenic and lead IS 10500",
                "top_k": 5,
                "filters": {
                    "doc_type": "standard",
                    "category": "Food & Agriculture",
                    "start_date": "2010-01-01",
                },
                "enable_is_boost": True,
            }
        },
    )

    query: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User search query string.",
    )
    top_k: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of ranked results to return.",
    )
    filters: Optional[RetrievalFilter] = Field(
        default=None,
        description="Optional metadata filters.",
    )
    query_embedding: Optional[List[float]] = Field(
        default=None,
        description="Pre-calculated dense vector embedding for the query. If omitted, dense search falls back gracefully or uses local embedding service.",
    )
    enable_is_boost: bool = Field(
        default=True,
        description="Automatically detect IS numbers in query and boost exact matching standards in RRF.",
    )
    rrf_k: Optional[int] = Field(
        default=60,
        ge=1,
        le=1000,
        description="RRF smoothing constant k (default: 60).",
    )
    include_metadata: bool = Field(
        default=True,
        description="Whether to include full chunk metadata in response.",
    )


class ChunkResult(BaseModel):
    """A single retrieved and ranked document chunk."""

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique chunk identifier (UUID).")
    document_id: str = Field(..., description="Parent document identifier.")
    standard_number: Optional[str] = Field(default=None, description="BIS standard number if applicable.")
    doc_type: Optional[str] = Field(default=None, description="Document type.")
    category: Optional[str] = Field(default=None, description="Standard category / division.")
    section_title: Optional[str] = Field(default=None, description="Title of the section or clause.")
    section_number: Optional[str] = Field(default=None, description="Section or clause numbering.")
    content: str = Field(..., description="Full text content of the chunk.")
    source_url: Optional[str] = Field(default=None, description="Link to source document on BIS portal.")
    publication_date: Optional[date] = Field(default=None, description="Publication or revision date.")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional custom metadata.")
    
    # Ranking metrics
    rrf_score: float = Field(..., description="Reciprocal Rank Fusion score.")
    dense_rank: Optional[int] = Field(default=None, description="Rank from dense (vector) retrieval.")
    sparse_rank: Optional[int] = Field(default=None, description="Rank from sparse (BM25/tsvector) retrieval.")
    cosine_similarity: Optional[float] = Field(default=None, description="Cosine similarity score (1 - cosine distance).")
    bm25_score: Optional[float] = Field(default=None, description="Postgres ts_rank_cd full-text relevance score.")
    is_exact_match: bool = Field(default=False, description="Flag indicating if chunk matched exact IS standard.")


class HybridSearchResponse(BaseModel):
    """Response returned by hybrid search endpoint."""

    query: str
    detected_is_standards: List[str] = Field(
        default_factory=list,
        description="List of detected Indian Standard numbers extracted from query.",
    )
    total_results: int = Field(..., description="Number of results returned.")
    results: List[ChunkResult]
    execution_time_ms: float = Field(..., description="Total execution time in milliseconds.")


class ISLookupResponse(BaseModel):
    """Response returned by exact IS standard lookup endpoint."""

    query_standard: str
    normalized_standard: str
    total_results: int
    results: List[ChunkResult]
    execution_time_ms: float


class HealthResponse(BaseModel):
    """Health check response schema."""

    status: str
    database_connected: bool
    pgvector_enabled: bool
    pgvector_version: Optional[str] = None
    app_version: str
