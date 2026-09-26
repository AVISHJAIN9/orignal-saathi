from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class RetrievalScoreInput(BaseModel):
    """
    One retrieved chunk's scores, mirroring m3.schemas.ChunkResult's score
    fields. Only rrf_score is actually used by the scoring formula today;
    the others are accepted for forward compatibility / future use.
    """

    model_config = ConfigDict(extra="ignore")

    chunk_id: Optional[str] = None
    rrf_score: float
    cosine_similarity: Optional[float] = None
    bm25_score: Optional[float] = None


class ConfidenceRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    scores: List[RetrievalScoreInput] = Field(
        default_factory=list,
        description="Retrieved chunks' scores, in the order M3 returned them (highest rrf_score first).",
    )
    threshold: Optional[float] = Field(
        default=None, description="Override the configured default threshold for this request only."
    )


class ConfidenceResult(BaseModel):
    model_config = ConfigDict(extra="ignore")

    confidence: float = Field(..., ge=0.0, le=1.0)
    should_proceed: bool
    threshold_used: float
    decline_message: Optional[str] = Field(
        default=None, description="Set only when should_proceed is False — the message to show the user."
    )
