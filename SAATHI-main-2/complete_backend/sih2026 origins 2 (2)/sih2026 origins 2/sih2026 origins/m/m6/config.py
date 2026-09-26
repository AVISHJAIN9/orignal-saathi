import os
from functools import lru_cache

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
            case_sensitive=False,
        )

        APP_NAME: str = "SAATHI-M6-Grounding-Citation-Enforcement"
        APP_ENV: str = "development"
        DEBUG: bool = True
        PORT: int = 8006
        HOST: str = "0.0.0.0"
        API_V1_PREFIX: str = "/api/v1/grounding"

        DEFAULT_CITATION_STYLE: str = "footnote"  # footnote | inline | markdown_list

except ImportError:
    from pydantic import BaseModel, Field

    class Settings(BaseModel):
        APP_NAME: str = Field(default_factory=lambda: os.getenv("APP_NAME", "SAATHI-M6-Grounding-Citation-Enforcement"))
        APP_ENV: str = Field(default_factory=lambda: os.getenv("APP_ENV", "development"))
        DEBUG: bool = Field(default_factory=lambda: os.getenv("DEBUG", "True").lower() in ("true", "1", "yes"))
        PORT: int = Field(default_factory=lambda: int(os.getenv("PORT", "8006")))
        HOST: str = Field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))
        API_V1_PREFIX: str = Field(default_factory=lambda: os.getenv("API_V1_PREFIX", "/api/v1/grounding"))
        DEFAULT_CITATION_STYLE: str = Field(default_factory=lambda: os.getenv("DEFAULT_CITATION_STYLE", "footnote"))


@lru_cache()
def get_settings() -> Settings:
    return Settings()
