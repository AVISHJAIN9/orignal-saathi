"""
M7: Product-to-Standard Recommendation Service Configuration
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PORT: int = 8007
    HOST: str = "0.0.0.0"
    API_V1_PREFIX: str = "/api/v1/recommend"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///:memory:"


_settings = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
