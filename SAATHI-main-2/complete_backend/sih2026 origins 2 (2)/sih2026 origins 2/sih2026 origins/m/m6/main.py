import logging

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from m6.config import get_settings
from m6.schemas import GroundAnswerRequest, GroundedAnswerResponse
from m6.pipeline import enforce_grounding

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("m6.main")

settings = get_settings()

app = FastAPI(
    title="SAATHI BIS Assistant - Module M6: Grounding & Citation Enforcement",
    description=(
        "Attaches every generated answer to the specific standard number, section, and source link "
        "it was drawn from, and flags any cited standard that wasn't actually in the retrieved context."
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
    return {"status": "healthy", "service": settings.APP_NAME}


@app.post(
    f"{settings.API_V1_PREFIX}/ground",
    response_model=GroundedAnswerResponse,
    summary="Attach citations to a generated answer and flag any unverified (hallucinated) standard references",
    tags=["Grounding"],
)
async def ground_endpoint(payload: GroundAnswerRequest):
    try:
        return enforce_grounding(
            answer_text=payload.answer_text,
            context_chunks=payload.context_chunks,
            citation_style=payload.citation_style,
        )
    except Exception as exc:
        logger.exception("Error enforcing grounding: %s", exc)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("m6.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
