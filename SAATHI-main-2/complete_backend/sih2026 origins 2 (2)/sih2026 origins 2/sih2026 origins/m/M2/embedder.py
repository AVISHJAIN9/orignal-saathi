import logging
import os
from typing import List, Optional
from m2.config import get_settings

logger = logging.getLogger("m2.embedder")


class EmbeddingConfigError(RuntimeError):
    """Raised at startup when no real embedding provider is configured.

    This is intentionally a hard failure — SAATHI must never silently
    degrade to hash-based fake embeddings in any environment where
    semantic search results actually matter.

    To fix: set EMBEDDING_PROVIDER + the corresponding API key in your
    environment (OPENAI_API_KEY or GEMINI_API_KEY), or configure a
    self-hosted sentence-transformers endpoint via EMBEDDING_PROVIDER=local
    and EMBEDDING_LOCAL_URL.
    """


class EmbeddingGenerator:
    """
    Multi-provider embedding engine supporting OpenAI, Google Gemini,
    and self-hosted sentence-transformers.

    PRODUCTION BEHAVIOUR:
      - If no provider/key is configured → raises EmbeddingConfigError at
        construction time → service refuses to start → no traffic served.
      - If a provider call fails transiently → raises the upstream exception
        (caller may retry) — never silently substitutes fake vectors.

    LOCAL DEV (LOCAL_DEV=true):
      - Still requires a real provider unless LOCAL_DEV_ALLOW_FAKE_EMBED=true
        is also set. Even then, every call logs a loud [LOCAL-DEV FAKE EMBED]
        warning so it is impossible to accidentally run in production.

    Removed: _generate_deterministic_embedding (hash-based fake vector).
      Git history: see commit before 2026-09-13 production-hardening if you
      need to recover it for benchmarking. It must NOT be used in production.
    """

    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        self.provider = provider or settings.EMBEDDING_PROVIDER
        self.model = model or settings.EMBEDDING_MODEL
        self.dim = settings.EMBEDDING_DIM
        self.openai_key = settings.OPENAI_API_KEY
        self.gemini_key = settings.GEMINI_API_KEY
        self.local_url = getattr(settings, "EMBEDDING_LOCAL_URL", None)

        is_production = os.environ.get("NODE_ENV") == "production" or os.environ.get("ENVIRONMENT") == "production"
        is_local_dev = os.environ.get("LOCAL_DEV", "").lower() == "true"
        allow_fake = os.environ.get("LOCAL_DEV_ALLOW_FAKE_EMBED", "").lower() == "true"

        # Validate provider configuration at construction time
        self._fake_allowed = False
        if self.provider == "openai" and self.openai_key:
            pass  # OK
        elif self.provider == "gemini" and self.gemini_key:
            pass  # OK
        elif self.provider == "local" and self.local_url:
            pass  # OK — self-hosted sentence-transformers
        elif is_local_dev and allow_fake and not is_production:
            logger.warning(
                "[LOCAL-DEV FAKE EMBED] No real embedding provider configured. "
                "Fake hash-based embeddings will be used. "
                "THIS PATH IS DISABLED IN PRODUCTION. "
                "Set OPENAI_API_KEY or GEMINI_API_KEY to use real embeddings."
            )
            self._fake_allowed = True
        else:
            raise EmbeddingConfigError(
                f"No real embedding provider is configured. "
                f"EMBEDDING_PROVIDER='{self.provider}' but the corresponding API key is missing or empty. "
                f"Set OPENAI_API_KEY (for openai), GEMINI_API_KEY (for gemini), or "
                f"EMBEDDING_LOCAL_URL (for local sentence-transformers). "
                f"To allow fake embeddings in LOCAL DEV ONLY, set both LOCAL_DEV=true and "
                f"LOCAL_DEV_ALLOW_FAKE_EMBED=true — these flags are blocked in production."
            )

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate normalized vector embeddings for a list of text strings.

        Raises the upstream provider exception on failure — never silently
        falls back to a hash-based vector.
        """
        if not texts:
            return []

        if self.provider == "openai" and self.openai_key:
            return await self._generate_openai_embeddings(texts)

        if self.provider == "gemini" and self.gemini_key:
            return await self._generate_gemini_embeddings(texts)

        if self.provider == "local" and self.local_url:
            return await self._generate_local_embeddings(texts)

        if self._fake_allowed:
            logger.warning("[LOCAL-DEV FAKE EMBED] Returning fake hash-based embeddings for %d texts.", len(texts))
            return [self._fake_embedding_dev_only(t, self.dim) for t in texts]

        raise EmbeddingConfigError("No embedding provider available. See EmbeddingGenerator docstring.")

    async def _generate_openai_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Call OpenAI text-embedding API in batches."""
        import httpx

        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json",
        }

        embeddings: List[List[float]] = []
        batch_size = 64

        async with httpx.AsyncClient(timeout=30.0) as client:
            for i in range(0, len(texts), batch_size):
                batch = texts[i: i + batch_size]
                clean_batch = [t.replace("\n", " ") for t in batch]

                response = await client.post(
                    "https://api.openai.com/v1/embeddings",
                    headers=headers,
                    json={"input": clean_batch, "model": self.model},
                )
                response.raise_for_status()
                data = response.json()
                for item in data["data"]:
                    embeddings.append(item["embedding"])

        return embeddings

    async def _generate_gemini_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Call Google Gemini embedding API."""
        import httpx

        embeddings: List[List[float]] = []
        async with httpx.AsyncClient(timeout=30.0) as client:
            for text in texts:
                url = (
                    f"https://generativelanguage.googleapis.com/v1beta/models/"
                    f"text-embedding-004:embedContent?key={self.gemini_key}"
                )
                resp = await client.post(
                    url,
                    json={
                        "model": "models/text-embedding-004",
                        "content": {"parts": [{"text": text[:2048]}]},
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                vec = data.get("embedding", {}).get("values", [])
                if len(vec) < self.dim:
                    vec.extend([0.0] * (self.dim - len(vec)))
                embeddings.append(vec[: self.dim])

        return embeddings

    async def _generate_local_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Call a self-hosted sentence-transformers HTTP endpoint."""
        import httpx

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                self.local_url,
                json={"texts": texts},
            )
            resp.raise_for_status()
            data = resp.json()
            return data["embeddings"]

    @staticmethod
    def _fake_embedding_dev_only(text: str, dim: int = 1536) -> List[float]:
        """
        Hash-based fake embedding — LOCAL DEV ONLY.

        IMPORTANT: This method exists ONLY for local offline dev when
        LOCAL_DEV=true AND LOCAL_DEV_ALLOW_FAKE_EMBED=true are both set.
        It produces semantically meaningless vectors and must NEVER be
        called in any environment where retrieval quality matters.

        The method is intentionally private and prefixed _fake_ to make
        accidental production use obvious in code review.
        """
        import math
        import hashlib

        vec = [0.0] * dim
        words = text.lower().split()
        if not words:
            return vec
        for idx, word in enumerate(words):
            h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
            bucket = h % dim
            sign = 1.0 if (h % 2 == 0) else -1.0
            vec[bucket] += sign * (1.0 / math.sqrt(idx + 1))
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec
