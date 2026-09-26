import os
from functools import lru_cache
from typing import Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        model_config = SettingsConfigDict(
            env_file=".env", env_file_encoding="utf-8", extra="ignore", case_sensitive=False
        )

        APP_NAME: str = "SAATHI-M8-Confidence-Estimation"
        APP_ENV: str = "development"
        DEBUG: bool = True
        PORT: int = 8008
        HOST: str = "0.0.0.0"
        API_V1_PREFIX: str = "/api/v1/confidence"

        # CONSERVATIVE default, deliberately, per the risk register: on demo
        # day, declining and redirecting too often is a much safer failure
        # mode than confidently stating something wrong in front of judges.
        # See m8/README.md "Tuning for demo day" for how this number was
        # chosen and how to adjust it.
        CONFIDENCE_THRESHOLD: float = 0.55

        # Must match m3.config.Settings.RRF_K — the confidence formula is
        # calibrated against RRF's actual score ceiling for this k, so if
        # your team changes M3's RRF_K, update this to match or confidence
        # values will be silently miscalibrated (too harsh or too lenient).
        RRF_K: int = 60

        BIS_HELPDESK_URL: str = "https://www.bis.gov.in"
        BIS_HELPDESK_PHONE: Optional[str] = None  # fill in the team's actual helpdesk number before demo day

except ImportError:
    from pydantic import BaseModel, Field

    class Settings(BaseModel):
        APP_NAME: str = Field(default_factory=lambda: os.getenv("APP_NAME", "SAATHI-M8-Confidence-Estimation"))
        APP_ENV: str = Field(default_factory=lambda: os.getenv("APP_ENV", "development"))
        DEBUG: bool = Field(default_factory=lambda: os.getenv("DEBUG", "True").lower() in ("true", "1", "yes"))
        PORT: int = Field(default_factory=lambda: int(os.getenv("PORT", "8008")))
        HOST: str = Field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))
        API_V1_PREFIX: str = Field(default_factory=lambda: os.getenv("API_V1_PREFIX", "/api/v1/confidence"))
        CONFIDENCE_THRESHOLD: float = Field(default_factory=lambda: float(os.getenv("CONFIDENCE_THRESHOLD", "0.55")))
        RRF_K: int = Field(default_factory=lambda: int(os.getenv("RRF_K", "60")))
        BIS_HELPDESK_URL: str = Field(default_factory=lambda: os.getenv("BIS_HELPDESK_URL", "https://www.bis.gov.in"))
        BIS_HELPDESK_PHONE: Optional[str] = Field(default_factory=lambda: os.getenv("BIS_HELPDESK_PHONE"))


@lru_cache()
def get_settings() -> Settings:
    return Settings()
