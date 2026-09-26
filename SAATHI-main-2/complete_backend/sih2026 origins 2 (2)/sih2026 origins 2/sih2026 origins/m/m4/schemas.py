"""
M4: Query Understanding Schemas
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EntityItem(BaseModel):
    entity_type: str = Field(..., description="IS_NUMBER | PRODUCT_CATEGORY | REGULATORY_TERM")
    text: str = Field(..., description="Matched text substring")
    normalized_value: str = Field(..., description="Standardized canonical form")
    confidence: float = Field(default=1.0)


class QueryUnderstandRequest(BaseModel):
    query: str = Field(..., description="User free-text query or prompt")
    session_id: Optional[str] = Field(default=None, description="Optional conversation tracking id")
    user_language: Optional[str] = Field(default="en", description="ISO 639-1 language code")


class QueryUnderstandResponse(BaseModel):
    query: str
    intent: str = Field(..., description="standard_lookup | certification_process | licensing | general_query")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0")
    entities: List[EntityItem] = Field(default_factory=list)
    standard_numbers: List[str] = Field(default_factory=list)
    product_categories: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    suggested_retrieval_boost: Optional[Dict[str, Any]] = None
