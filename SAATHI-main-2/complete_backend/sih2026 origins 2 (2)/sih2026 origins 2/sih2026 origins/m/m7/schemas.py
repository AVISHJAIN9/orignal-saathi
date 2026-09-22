"""
M7: Product-to-Standard Recommendation Schemas
Matches the D9 Guided Wizard contract in d/D9/src/classification-client/
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ClassificationMatch(BaseModel):
    id: str = Field(..., description="Canonical standard ID (e.g. 'IS 1293:2019')")
    score: float = Field(..., description="Relevance and confidence score between 0.0 and 1.0")
    title: Optional[str] = Field(default=None, description="Title of the Indian Standard")
    standard_number: Optional[str] = Field(default=None, description="Standard designation")
    category: Optional[str] = Field(default=None, description="Product industry category")
    scheme: Optional[str] = Field(default=None, description="Applicable BIS Scheme (e.g. 'ISI_SCHEME_1', 'CRS')")
    mandatory_qco: bool = Field(default=True, description="Whether QCO is mandatory")


class ClassifyRequest(BaseModel):
    sessionId: Optional[str] = Field(default=None, description="D9 Wizard session identifier")
    locale: Optional[str] = Field(default="en", description="Language locale")
    answers: Optional[Dict[str, Any]] = Field(default_factory=dict, description="D9 Wizard answers dictionary")
    structuredQuery: Optional[Dict[str, Any]] = Field(default_factory=dict, description="D9 Structured query object")
    query: Optional[str] = Field(default=None, description="Free-text product description")
    category: Optional[str] = Field(default=None, description="Product category filter")


class ClassifyResponse(BaseModel):
    matches: List[ClassificationMatch]
    total_matches: int
    taxonomy_node: Optional[str] = None
