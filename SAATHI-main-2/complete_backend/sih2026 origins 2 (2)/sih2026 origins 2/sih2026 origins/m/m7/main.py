"""
M7: Product-to-Standard Recommendation FastAPI Application
"""
import re
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from m7.config import get_settings
from m7.schemas import ClassifyRequest, ClassifyResponse, ClassificationMatch
from m7.database import TaxonomyRepository

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("m7.main")
settings = get_settings()

repo: TaxonomyRepository = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global repo
    logger.info("Initializing M7 Product Recommendation Service on port %s", settings.PORT)
    repo = TaxonomyRepository()
    yield
    logger.info("Shutting down M7 Product Recommendation Service")


app = FastAPI(
    title="SAATHI M7 Product-to-Standard Recommendation Service",
    description="Matches plain-language products & D9 Wizard inputs to applicable BIS standards",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "M7_PRODUCT_RECOMMENDATION",
        "port": settings.PORT,
        "environment": settings.ENVIRONMENT
    }


@app.post(f"{settings.API_V1_PREFIX}/classify", response_model=ClassifyResponse)
async def classify_product(payload: ClassifyRequest):
    global repo
    if repo is None:
        repo = TaxonomyRepository()

    # Collect search tokens from all possible D9 / direct input fields
    tokens = set()
    category_filter = payload.category

    # 1. Check free-text query
    if payload.query:
        for word in re.findall(r'\w+', payload.query.lower()):
            tokens.add(word)

    # 2. Check D9 structured query & answers
    if payload.structuredQuery:
        for val in payload.structuredQuery.values():
            if isinstance(val, str):
                for word in re.findall(r'\w+', val.lower()):
                    tokens.add(word)

    if payload.answers:
        for key, val in payload.answers.items():
            if "category" in key.lower() and isinstance(val, str):
                category_filter = val
            if isinstance(val, str):
                for word in re.findall(r'\w+', val.lower()):
                    tokens.add(word)

    matched_records = repo.find_matches(list(tokens), category_filter=category_filter)

    matches = [ClassificationMatch(**m) for m in matched_records]
    return ClassifyResponse(
        matches=matches,
        total_matches=len(matches),
        taxonomy_node=category_filter
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("m7.main:app", host=settings.HOST, port=settings.PORT, reload=True)
