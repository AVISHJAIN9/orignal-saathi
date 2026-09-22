import os
from functools import lru_cache
from typing import Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        """Configuration settings for M5 RAG Generation Module."""

        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
            case_sensitive=False,
        )

        # Application
        APP_NAME: str = "SAATHI-M5-RAG-Generation"
        APP_ENV: str = "development"
        DEBUG: bool = True
        PORT: int = 8000
        HOST: str = "0.0.0.0"
        API_V1_PREFIX: str = "/api/v1/generate"

        # LLM Provider Abstraction ('openai' | 'azure' | 'custom')
        LLM_PROVIDER: str = "openai"
        OPENAI_API_KEY: Optional[str] = None
        OPENAI_BASE_URL: Optional[str] = None
        OPENAI_API_BASE: Optional[str] = None
        LLM_MODEL: str = "gpt-4o-mini"
        LLM_TEMPERATURE: float = 0.0
        LLM_MAX_TOKENS: int = 2000

        # Azure OpenAI Configuration
        AZURE_OPENAI_API_KEY: Optional[str] = None
        AZURE_OPENAI_ENDPOINT: Optional[str] = None
        AZURE_OPENAI_API_VERSION: str = "2024-02-15-preview"
        AZURE_DEPLOYMENT_NAME: Optional[str] = None

        # Caching & Optimization
        ENABLE_CACHE: bool = True
        CACHE_TTL_SECONDS: int = 3600
        REDIS_URL: Optional[str] = None

        # Quality & Guardrail Thresholds
        CONFIDENCE_THRESHOLD: float = 0.70
        MIN_CONTEXT_CHUNKS: int = 1
        ENABLE_STRICT_CITE_OR_DECLINE: bool = True

        # Persona & Language defaults
        DEFAULT_PROMPT_TEMPLATE: str = "standard_qa"
        DEFAULT_USER_LANGUAGE: str = "en"

except ImportError:
    from pydantic import BaseModel, Field

    class Settings(BaseModel):
        """Fallback configuration using standard Pydantic v2 + environment variables."""

        APP_NAME: str = Field(default_factory=lambda: os.getenv("APP_NAME", "SAATHI-M5-RAG-Generation"))
        APP_ENV: str = Field(default_factory=lambda: os.getenv("APP_ENV", "development"))
        DEBUG: bool = Field(default_factory=lambda: os.getenv("DEBUG", "True").lower() in ("true", "1", "yes"))
        PORT: int = Field(default_factory=lambda: int(os.getenv("PORT", "8005")))
        HOST: str = Field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))
        API_V1_PREFIX: str = Field(default_factory=lambda: os.getenv("API_V1_PREFIX", "/api/v1/generate"))

        LLM_PROVIDER: str = Field(default_factory=lambda: os.getenv("LLM_PROVIDER", "openai"))
        OPENAI_API_KEY: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY"))
        OPENAI_BASE_URL: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_BASE_URL") or os.getenv("OPENAI_API_BASE"))
        OPENAI_API_BASE: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_API_BASE"))
        LLM_MODEL: str = Field(default_factory=lambda: os.getenv("LLM_MODEL", "gpt-4o-mini"))
        LLM_TEMPERATURE: float = Field(default_factory=lambda: float(os.getenv("LLM_TEMPERATURE", "0.0")))
        LLM_MAX_TOKENS: int = Field(default_factory=lambda: int(os.getenv("LLM_MAX_TOKENS", "2000")))

        AZURE_OPENAI_API_KEY: Optional[str] = Field(default_factory=lambda: os.getenv("AZURE_OPENAI_API_KEY"))
        AZURE_OPENAI_ENDPOINT: Optional[str] = Field(default_factory=lambda: os.getenv("AZURE_OPENAI_ENDPOINT"))
        AZURE_OPENAI_API_VERSION: str = Field(default_factory=lambda: os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"))
        AZURE_DEPLOYMENT_NAME: Optional[str] = Field(default_factory=lambda: os.getenv("AZURE_DEPLOYMENT_NAME"))

        ENABLE_CACHE: bool = Field(default_factory=lambda: os.getenv("ENABLE_CACHE", "True").lower() in ("true", "1", "yes"))
        CACHE_TTL_SECONDS: int = Field(default_factory=lambda: int(os.getenv("CACHE_TTL_SECONDS", "3600")))
        REDIS_URL: Optional[str] = Field(default_factory=lambda: os.getenv("REDIS_URL"))

        CONFIDENCE_THRESHOLD: float = Field(default_factory=lambda: float(os.getenv("CONFIDENCE_THRESHOLD", "0.70")))
        MIN_CONTEXT_CHUNKS: int = Field(default_factory=lambda: int(os.getenv("MIN_CONTEXT_CHUNKS", "1")))
        ENABLE_STRICT_CITE_OR_DECLINE: bool = Field(
            default_factory=lambda: os.getenv("ENABLE_STRICT_CITE_OR_DECLINE", "True").lower() in ("true", "1", "yes")
        )

        DEFAULT_PROMPT_TEMPLATE: str = Field(default_factory=lambda: os.getenv("DEFAULT_PROMPT_TEMPLATE", "standard_qa"))
        DEFAULT_USER_LANGUAGE: str = Field(default_factory=lambda: os.getenv("DEFAULT_USER_LANGUAGE", "en"))


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
