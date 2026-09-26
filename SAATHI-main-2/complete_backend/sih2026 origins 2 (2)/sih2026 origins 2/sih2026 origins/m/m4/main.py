"""
M4: Query Understanding FastAPI Application
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from m4.config import get_settings
from m4.schemas import QueryUnderstandRequest, QueryUnderstandResponse
from m4.classifier import QueryUnderstandingEngine

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("m4.main")
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing M4 Query Understanding Service on port %s", settings.PORT)
    yield
    logger.info("Shutting down M4 Query Understanding Service")


app = FastAPI(
    title="SAATHI M4 Query Understanding Service",
    description="Intent classification across 4 defined intents & IS entity extraction",
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
        "service": "M4_QUERY_UNDERSTANDING",
        "port": settings.PORT,
        "environment": settings.ENVIRONMENT
    }


@app.post(f"{settings.API_V1_PREFIX}/understand", response_model=QueryUnderstandResponse)
async def understand_query(payload: QueryUnderstandRequest):
    entities, std_numbers, categories = QueryUnderstandingEngine.extract_entities(payload.query)
    intent, confidence = QueryUnderstandingEngine.classify_intent(payload.query, std_numbers)

    # Keywords for retrieval boost
    tokens = [e.text for e in entities]
    retrieval_boost = None
    if std_numbers:
        retrieval_boost = {"boost_standard": std_numbers[0], "weight": 2.5}
    elif categories:
        retrieval_boost = {"boost_category": categories[0], "weight": 1.8}

    return QueryUnderstandResponse(
        query=payload.query,
        intent=intent,
        confidence=confidence,
        entities=entities,
        standard_numbers=std_numbers,
        product_categories=categories,
        keywords=tokens,
        suggested_retrieval_boost=retrieval_boost
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("m4.main:app", host=settings.HOST, port=settings.PORT, reload=True)
