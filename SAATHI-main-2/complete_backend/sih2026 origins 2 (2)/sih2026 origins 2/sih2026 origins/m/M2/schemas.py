from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, ConfigDict


class RawDocumentInput(BaseModel):
    """Input payload for raw document chunking and ingestion."""
    model_config = ConfigDict(extra="ignore")

    document_id: str = Field(..., description="Unique document ID (e.g. 'IS 10500:2012' or 'doc-uuid').")
    standard_number: Optional[str] = Field(default=None, description="Canonical Indian Standard number.")
    title: Optional[str] = Field(default=None, description="Document title.")
    doc_type: str = Field(default="standard", description="Document type (standard, circular, manual, faq).")
    category: Optional[str] = Field(default=None, description="BIS Division or Category.")
    source_url: Optional[str] = Field(default=None, description="Direct URL to official source.")
    publication_date: Optional[str] = Field(default=None, description="Publication or revision date.")
    content: str = Field(..., description="Raw text content of the entire document.")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ChunkItem(BaseModel):
    """Structured chunk representation."""
    model_config = ConfigDict(extra="ignore")

    chunk_id: str = Field(..., description="Deterministic or UUID chunk identifier.")
    document_id: str = Field(..., description="Parent document identifier.")
    standard_number: Optional[str] = Field(default=None)
    doc_type: str = Field(default="standard")
    category: Optional[str] = Field(default=None)
    section_title: Optional[str] = Field(default=None, description="Heading, Clause, or Table title.")
    section_number: Optional[str] = Field(default=None, description="Clause numbering (e.g. 'Clause 4.1').")
    content: str = Field(..., description="Text content of this chunk.")
    source_url: Optional[str] = Field(default=None)
    publication_date: Optional[str] = Field(default=None)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    word_count: int = Field(default=0)
    checksum: str = Field(..., description="SHA-256 hash for deduplication.")


class ChunkRequest(BaseModel):
    documents: List[RawDocumentInput]
    chunk_size: Optional[int] = Field(default=None, description="Override default chunk size.")
    chunk_overlap: Optional[int] = Field(default=None, description="Override default chunk overlap.")


class ChunkResponse(BaseModel):
    total_documents: int
    total_chunks_created: int
    duplicates_removed: int
    chunks: List[ChunkItem]


class EmbedRequest(BaseModel):
    texts: List[str] = Field(..., description="List of strings to embed.")
    provider: Optional[str] = Field(default=None, description="openai | gemini | local")


class EmbedResponse(BaseModel):
    provider: str
    model: str
    dimension: int
    count: int
    embeddings: List[List[float]]


class IngestionPipelineRequest(BaseModel):
    documents: List[RawDocumentInput]
    store_in_db: bool = Field(default=True, description="Whether to write chunks and embeddings to pgvector.")
    chunk_size: Optional[int] = Field(default=500)
    chunk_overlap: Optional[int] = Field(default=75)


class IngestionPipelineResponse(BaseModel):
    status: str
    documents_processed: int
    chunks_created: int
    chunks_stored_in_pgvector: int
    duplicates_skipped: int
    elapsed_seconds: float
