import os
from functools import lru_cache
from typing import Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        """Configuration settings for M3 Retrieval & Vector Search Module."""

        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
            case_sensitive=False,
        )

        # Application
        APP_NAME: str = "SAATHI-M3-Vector-Retrieval"
        APP_ENV: str = "development"
        DEBUG: bool = True
        PORT: int = 8003
        HOST: str = "0.0.0.0"
        API_V1_PREFIX: str = "/api/v1/retrieval"
        INTERNAL_API_KEY: str = "bis-secret-internal-key-2026"

        # Database
        DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/bis_db"
        DB_POOL_MIN_SIZE: int = 5
        DB_POOL_MAX_SIZE: int = 20
        DB_TIMEOUT: float = 30.0

        # Retrieval, Embedding & Reranking
        EMBEDDING_DIM: int = 1536
        ENABLE_LOCAL_EMBEDDING_FALLBACK: bool = True
        RRF_K: int = 60
        DEFAULT_TOP_K: int = 10
        MAX_TOP_K: int = 100
        EXACT_IS_BOOST_SCORE: float = 0.05
        ENABLE_RERANKING: bool = True
        MAX_CONTEXT_TOKENS: int = 3500

except ImportError:
    from pydantic import BaseModel, Field

    class Settings(BaseModel):
        """Fallback configuration using standard Pydantic v2 + environment variables."""

        APP_NAME: str = Field(default_factory=lambda: os.getenv("APP_NAME", "SAATHI-M3-Vector-Retrieval"))
        APP_ENV: str = Field(default_factory=lambda: os.getenv("APP_ENV", "development"))
        DEBUG: bool = Field(default_factory=lambda: os.getenv("DEBUG", "True").lower() in ("true", "1", "yes"))
        PORT: int = Field(default_factory=lambda: int(os.getenv("PORT", "8003")))
        HOST: str = Field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))
        API_V1_PREFIX: str = Field(default_factory=lambda: os.getenv("API_V1_PREFIX", "/api/v1/retrieval"))
        INTERNAL_API_KEY: str = Field(default_factory=lambda: os.getenv("INTERNAL_API_KEY", "bis-secret-internal-key-2026"))

        DATABASE_URL: str = Field(
            default_factory=lambda: os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/bis_db")
        )
        DB_POOL_MIN_SIZE: int = Field(default_factory=lambda: int(os.getenv("DB_POOL_MIN_SIZE", "5")))
        DB_POOL_MAX_SIZE: int = Field(default_factory=lambda: int(os.getenv("DB_POOL_MAX_SIZE", "20")))
        DB_TIMEOUT: float = Field(default_factory=lambda: float(os.getenv("DB_TIMEOUT", "30.0")))

        EMBEDDING_DIM: int = Field(default_factory=lambda: int(os.getenv("EMBEDDING_DIM", "1536")))
        ENABLE_LOCAL_EMBEDDING_FALLBACK: bool = Field(
            default_factory=lambda: os.getenv("ENABLE_LOCAL_EMBEDDING_FALLBACK", "True").lower() in ("true", "1", "yes")
        )
        RRF_K: int = Field(default_factory=lambda: int(os.getenv("RRF_K", "60")))
        DEFAULT_TOP_K: int = Field(default_factory=lambda: int(os.getenv("DEFAULT_TOP_K", "10")))
        MAX_TOP_K: int = Field(default_factory=lambda: int(os.getenv("MAX_TOP_K", "100")))
        EXACT_IS_BOOST_SCORE: float = Field(
            default_factory=lambda: float(os.getenv("EXACT_IS_BOOST_SCORE", "0.05"))
        )
        ENABLE_RERANKING: bool = Field(
            default_factory=lambda: os.getenv("ENABLE_RERANKING", "True").lower() in ("true", "1", "yes")
        )
        MAX_CONTEXT_TOKENS: int = Field(default_factory=lambda: int(os.getenv("MAX_CONTEXT_TOKENS", "3500")))


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
