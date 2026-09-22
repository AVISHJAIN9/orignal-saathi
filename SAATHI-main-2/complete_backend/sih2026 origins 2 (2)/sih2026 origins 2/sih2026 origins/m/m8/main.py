import logging

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from m8.config import get_settings
from m8.schemas import ConfidenceRequest, ConfidenceResult
from m8.pipeline import evaluate_confidence

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("m8.main")

settings = get_settings()

app = FastAPI(
    title="SAATHI BIS Assistant - Module M8: Confidence & Uncertainty Estimation",
    description=(
        "Estimates confidence from M3's retrieval scores and decides whether to proceed with "
        "generation or decline and redirect to the BIS helpdesk. Threshold tuned conservatively for demo day."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "current_threshold": settings.CONFIDENCE_THRESHOLD,
    }


@app.post(
    f"{settings.API_V1_PREFIX}/evaluate",
    response_model=ConfidenceResult,
    summary="Compute confidence from retrieval scores and decide whether to proceed or decline",
    tags=["Confidence"],
)
async def evaluate_endpoint(payload: ConfidenceRequest):
    try:
        scores = [s.rrf_score for s in payload.scores]
        return evaluate_confidence(scores, threshold=payload.threshold)
    except Exception as exc:
        logger.exception("Error evaluating confidence: %s", exc)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("m8.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
