from datetime import date
from enum import Enum
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, ConfigDict


class RetrievedChunk(BaseModel):
    """Schema for retrieved document chunks passed into the generation engine."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(..., description="Unique chunk ID (UUID or string).")
    document_id: str = Field(..., description="Parent document identifier (e.g. 'IS 10500:2012').")
    standard_number: Optional[str] = Field(default=None, description="Indian Standard number if applicable.")
    doc_type: Optional[str] = Field(default="standard", description="Type of document (standard, manual, etc.).")
    category: Optional[str] = Field(default=None, description="BIS Division / Category.")
    section_title: Optional[str] = Field(default=None, description="Title of the section, table, or clause.")
    section_number: Optional[str] = Field(default=None, description="Clause numbering (e.g. 'Clause 4.2', 'Table 1').")
    content: str = Field(..., description="Extracted text content of the chunk.")
    source_url: Optional[str] = Field(default=None, description="Direct URL to the official standard or portal.")
    publication_date: Optional[Union[str, date]] = Field(default=None, description="Publication or revision date.")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary metadata.")
    rrf_score: Optional[float] = Field(default=None, description="RRF retrieval score.")


class Citation(BaseModel):
    """Granular citation linking a generated factual claim directly to source BIS context."""

    model_config = ConfigDict(
        extra="ignore",
        json_schema_extra={
            "example": {
                "claim": "The acceptable limit for Total Dissolved Solids (TDS) is 500 mg/l, permissible up to 2000 mg/l.",
                "source_chunk_id": "chunk-10500-table1",
                "document_id": "IS 10500:2012",
                "section_title": "Table 1 Organoleptic and Physical Parameters",
                "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS10500.pdf",
            }
        },
    )

    claim: str = Field(
        ...,
        description="The specific factual statement or assertion derived from the context.",
    )
    source_chunk_id: str = Field(
        ...,
        description="The specific chunk ID from which this claim was sourced.",
    )
    document_id: str = Field(
        ...,
        description="The standard number or document identifier (e.g., 'IS 10500:2012').",
    )
    section_title: Optional[str] = Field(
        default=None,
        description="Title of the section, clause, or table.",
    )
    source_url: Optional[str] = Field(
        default=None,
        description="Direct link to official BIS source documentation.",
    )


class StructuredAnswer(BaseModel):
    """Strict Pydantic contract for RAG-generated answers with cite-or-decline guardrails."""

    model_config = ConfigDict(
        extra="ignore",
        json_schema_extra={
            "example": {
                "answer": "According to IS 10500:2012, drinking water must have a pH between 6.5 and 8.5 without relaxation.",
                "citations": [
                    {
                        "claim": "pH must be between 6.5 and 8.5 without relaxation",
                        "source_chunk_id": "chunk-10500-table1",
                        "document_id": "IS 10500:2012",
                        "section_title": "Table 1 Organoleptic and Physical Parameters",
                        "source_url": "https://bis.gov.in/standards/IS10500.pdf",
                    }
                ],
                "confidence": 0.95,
                "is_declined": False,
                "explanation": "Directly grounded in Table 1 of IS 10500:2012.",
            }
        },
    )

    answer: str = Field(
        ...,
        description="The synthesized, grounded response to the user query.",
    )
    citations: List[Citation] = Field(
        default_factory=list,
        description="List of granular citations validating each factual claim.",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Self-assessed grounding confidence score between 0.0 and 1.0.",
    )
    is_declined: bool = Field(
        default=False,
        description="Flag indicating whether answer generation was declined due to insufficient or unverified context.",
    )
    explanation: Optional[str] = Field(
        default=None,
        description="Brief reasoning for confidence assessment or decline explanation.",
    )
    unverified_citations: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="List of standards mentioned in answer text that were not present in context chunks.",
    )
    is_fully_grounded: bool = Field(
        default=True,
        description="Whether all cited standards in the answer are strictly verified against retrieved context.",
    )


class GenerationRequest(BaseModel):
    """Payload for RAG generation requests."""

    model_config = ConfigDict(
        extra="ignore",
        json_schema_extra={
            "example": {
                "query": "What is the permissible limit of Arsenic in drinking water as per IS 10500?",
                "session_id": "sess-user-991",
                "retrieved_chunks": [
                    {
                        "id": "c-10500-table2",
                        "document_id": "IS 10500:2012",
                        "standard_number": "IS 10500:2012",
                        "section_title": "Table 2 Parameters Concerning Toxic Substances",
                        "section_number": "Clause 4.2",
                        "content": "Arsenic (as As) mg/l, Max Acceptable Limit: 0.01, Permissible Limit in the Absence of Alternate Source: 0.05",
                        "source_url": "https://bis.gov.in/standards/IS10500.pdf",
                    }
                ],
                "user_language": "en",
                "prompt_template": "standard_qa",
            }
        },
    )

    query: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="User query or compliance question.",
    )
    session_id: str = Field(
        ...,
        min_length=1,
        description="Conversation session ID for logging, caching, and state tracking.",
    )
    retrieved_chunks: List[Union[RetrievedChunk, Dict[str, Any]]] = Field(
        default_factory=list,
        description="List of retrieved context chunks from Module M3 (Hybrid Search).",
    )
    user_language: Optional[str] = Field(
        default="en",
        description="Language code for the output response (e.g. 'en', 'hi').",
    )
    prompt_template: Optional[str] = Field(
        default="standard_qa",
        description="Prompt template key: 'standard_qa' or 'msme_x11'.",
    )
    custom_instructions: Optional[str] = Field(
        default=None,
        description="Optional additional instructions or business rules.",
    )


class StreamEventType(str, Enum):
    """Types of Server-Sent Events emitted during streaming generation."""

    TOKEN = "token"
    CITATION = "citation"
    STRUCTURED_ANSWER = "structured_answer"
    DECLINED = "declined"
    ERROR = "error"
    DONE = "done"


class HealthResponse(BaseModel):
    """Health check response schema."""

    status: str
    llm_configured: bool
    model_name: str
    confidence_threshold: float
    app_version: str
