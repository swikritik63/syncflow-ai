from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from video_rag.langchain_rag import get_recommendations, BusinessProfileInput
from video_rag.ai_generator import enrich_memes_with_llm, OPENROUTER_MODEL

app = FastAPI(
    title="business-marketing_engine Multimodal Video RAG Engine",
    description="LangChain + OpenRouter-powered viral meme retrieval & subtitle engine",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "LangChain + ChromaDB + OpenRouter LLM",
        "llm_model": OPENROUTER_MODEL,
        "templates_indexed": 66,
        "external_api_required": False,
    }

@app.post("/api/recommend")
def recommend_viral_memes(profile: BusinessProfileInput, top_k: int = 15):
    try:
        profile_dict = profile.model_dump()
        # 1. Retrieve top candidates using LangChain + ChromaDB vector search
        raw_recs = get_recommendations(profile_dict, top_k=top_k)

        # 2. Enrich with OpenRouter LLM (openai/gpt-4o-mini) for tailored subtitles & hooks
        enriched_recs = enrich_memes_with_llm(profile_dict, raw_recs)

        return {
            "success": True,
            "count": len(enriched_recs),
            "model_used": OPENROUTER_MODEL,
            "recommendations": enriched_recs,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
