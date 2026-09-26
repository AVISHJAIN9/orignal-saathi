import os
from functools import lru_cache
from typing import Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        """Configuration settings for M2 Chunking & Embedding Module."""

        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
            case_sensitive=False,
        )

        # Application
        APP_NAME: str = "SAATHI-M2-Chunking-Embedding"
        APP_ENV: str = "development"
        DEBUG: bool = True
        PORT: int = 8002
        HOST: str = "0.0.0.0"
        API_V1_PREFIX: str = "/api/v1/embedding"

        # Database (PostgreSQL with pgvector)
        DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/saathi_db"
        DB_POOL_MIN_SIZE: int = 5
        DB_POOL_MAX_SIZE: int = 20

        # Chunking Configuration
        DEFAULT_CHUNK_SIZE: int = 500  # Words / token equivalent
        DEFAULT_CHUNK_OVERLAP: int = 75
        MIN_CHUNK_SIZE: int = 50
        MAX_CHUNK_SIZE: int = 1500
        DEDUPLICATION_SIMILARITY_THRESHOLD: float = 0.95

        # Embedding Configuration
        EMBEDDING_PROVIDER: str = "openai"  # openai | gemini | local
        EMBEDDING_MODEL: str = "text-embedding-3-small"
        EMBEDDING_DIM: int = 1536
        OPENAI_API_KEY: Optional[str] = None
        GEMINI_API_KEY: Optional[str] = None
        BATCH_SIZE: int = 64

        # HNSW Index Parameters
        HNSW_M: int = 16
        HNSW_EF_CONSTRUCTION: int = 64

except ImportError:
    from pydantic import BaseModel, Field

    class Settings(BaseModel):
        APP_NAME: str = Field(default_factory=lambda: os.getenv("APP_NAME", "SAATHI-M2-Chunking-Embedding"))
        APP_ENV: str = Field(default_factory=lambda: os.getenv("APP_ENV", "development"))
        DEBUG: bool = Field(default_factory=lambda: os.getenv("DEBUG", "True").lower() in ("true", "1", "yes"))
        PORT: int = Field(default_factory=lambda: int(os.getenv("PORT", "8002")))
        HOST: str = Field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))
        API_V1_PREFIX: str = Field(default_factory=lambda: os.getenv("API_V1_PREFIX", "/api/v1/embedding"))

        DATABASE_URL: str = Field(
            default_factory=lambda: os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/saathi_db")
        )
        DB_POOL_MIN_SIZE: int = Field(default_factory=lambda: int(os.getenv("DB_POOL_MIN_SIZE", "5")))
        DB_POOL_MAX_SIZE: int = Field(default_factory=lambda: int(os.getenv("DB_POOL_MAX_SIZE", "20")))

        DEFAULT_CHUNK_SIZE: int = Field(default_factory=lambda: int(os.getenv("DEFAULT_CHUNK_SIZE", "500")))
        DEFAULT_CHUNK_OVERLAP: int = Field(default_factory=lambda: int(os.getenv("DEFAULT_CHUNK_OVERLAP", "75")))
        MIN_CHUNK_SIZE: int = Field(default_factory=lambda: int(os.getenv("MIN_CHUNK_SIZE", "50")))
        MAX_CHUNK_SIZE: int = Field(default_factory=lambda: int(os.getenv("MAX_CHUNK_SIZE", "1500")))
        DEDUPLICATION_SIMILARITY_THRESHOLD: float = Field(
            default_factory=lambda: float(os.getenv("DEDUPLICATION_SIMILARITY_THRESHOLD", "0.95"))
        )

        EMBEDDING_PROVIDER: str = Field(default_factory=lambda: os.getenv("EMBEDDING_PROVIDER", "openai"))
        EMBEDDING_MODEL: str = Field(default_factory=lambda: os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"))
        EMBEDDING_DIM: int = Field(default_factory=lambda: int(os.getenv("EMBEDDING_DIM", "1536")))
        OPENAI_API_KEY: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY"))
        GEMINI_API_KEY: Optional[str] = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY"))
        BATCH_SIZE: int = Field(default_factory=lambda: int(os.getenv("BATCH_SIZE", "64")))

        HNSW_M: int = Field(default_factory=lambda: int(os.getenv("HNSW_M", "16")))
        HNSW_EF_CONSTRUCTION: int = Field(default_factory=lambda: int(os.getenv("HNSW_EF_CONSTRUCTION", "64")))


@lru_cache()
def get_settings() -> Settings:
    return Settings()
