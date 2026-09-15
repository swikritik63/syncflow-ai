import os
import glob
import json
from typing import List, Dict, Any
from pydantic import BaseModel
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma

CHROMA_DIR = "./video_rag/chroma_db"
SCRIPTS_DIR = "./scripts"
COLLECTION_NAME = "bme_viral_memes"

class BusinessProfileInput(BaseModel):
    name: str = "Swikriti"
    companyName: str = "business-marketing_engine"
    productService: str
    audience: str
    problemSolved: str
    keyBenefits: str
    tonePositioning: str = "Witty, relatable"
    thingsToAvoid: str = "Corporate speak"
    businessModel: str = "B2B"
    categories: List[str] = []

def build_or_load_vectorstore():
    """
    Builds or loads persistent Chroma vectorstore using local embeddings.
    Zero external API keys required.
    """
    json_files = sorted(glob.glob(os.path.join(SCRIPTS_DIR, "*.json")))
    print(f"[LangChain RAG] Found {len(json_files)} meme scripts to index.")

    docs: List[Document] = []
    ids: List[str] = []

    for fpath in json_files:
        with open(fpath, "r", encoding="utf-8") as fp:
            data = json.load(fp)

        vid_id = data.get("video_id", "")
        meme_id = os.path.basename(fpath).replace(".json", "")
        actions = ", ".join(data.get("actions", []))
        keywords = ", ".join(data.get("search_keywords", []))
        category = data.get("category", "")
        mood = data.get("mood_and_vibe", "")
        desc = data.get("detailed_description", "")

        # Rich page content optimized for semantic search
        content = (
            f"Category: {category}\n"
            f"Mood and Tone: {mood}\n"
            f"Actions & Physical Gestures: {actions}\n"
            f"Keywords: {keywords}\n"
            f"Visual Narrative: {desc}"
        )

        metadata = {
            "id": meme_id,
            "video_id": vid_id,
            "video_url": f"/videos/{vid_id}",
            "is_carousel": bool(vid_id.endswith(".jpg") or vid_id.endswith(".png")),
            "category": category,
            "duration": data.get("duration", "12s"),
            "mood_and_vibe": mood,
            "actions": json.dumps(data.get("actions", [])),
            "search_keywords": json.dumps(data.get("search_keywords", [])),
            "detailed_description": desc,
            "source_url": data.get("source_url", ""),
        }

        docs.append(Document(page_content=content, metadata=metadata))
        ids.append(meme_id)

    # Initialize Chroma locally
    vectorstore = Chroma.from_documents(
        documents=docs,
        persist_directory=CHROMA_DIR,
        collection_name=COLLECTION_NAME,
        ids=ids,
    )
    print(f"[LangChain RAG] Indexed {len(docs)} documents into ChromaDB at {CHROMA_DIR}.")
    return vectorstore

def clean_clause(text: str, max_words: int = 10) -> str:
    if not text:
        return ""
    words = text.strip().rstrip(".,;!?").split()
    if len(words) <= max_words:
        return text.strip().rstrip(".,;!?")
    return " ".join(words[:max_words])

def generate_viral_hooks(meme_meta: Dict[str, Any], profile: Dict[str, Any], index: int = 0):
    brand = profile.get("companyName") or "Marketing Engine"
    audience = clean_clause(profile.get("audience") or "creators", 6)
    problem = clean_clause(profile.get("problemSolved") or "manual video editing", 8)
    benefit = clean_clause(profile.get("keyBenefits") or "automating viral growth", 8)
    avoid = clean_clause(profile.get("thingsToAvoid") or "wasting time", 6)
    mood = meme_meta.get("mood_and_vibe", "energetic")

    # Natural, Breakable TikTok / Reels formulas
    formulas = [
        f"POV: You finally stopped dealing with {problem.lower()} because {brand} exists.",
        f"honestly been struggling with {problem.lower()}\nuntil I found {brand}",
        f"My life before vs after {brand}\nwhen you finally get {benefit.lower()}",
        f"They told {audience.lower()} that {avoid.lower()} was normal.\nThen {brand} dropped.",
        f"That exact feeling when {brand} handles {problem.lower()} in literally 2 minutes.",
        f"Stop dealing with {problem.lower()}.\n{brand} gives you {benefit.lower()} in 1 tap.",
        f"Why did nobody tell {audience.lower()} about {brand} when we were drowning in {problem.lower()}?",
        f"Me explaining to {audience.lower()} how {brand} gives you {benefit.lower()} with zero hassle.",
    ]

    primary = formulas[index % len(formulas)]
    alts = [f for f in formulas if f != primary][:3]

    rationale = (
        f"Visual Dynamic: This template's {mood} pacing directly mirrors your target {audience}'s "
        f"struggle with '{problem}' and delivers {brand}'s key benefit: '{benefit}'."
    )

    hashtags = [
        f"#{brand.lower().replace(' ', '')}",
        f"#{profile.get('categories', ['saas'])[0].lower() if profile.get('categories') else 'growth'}",
        "#viralreels",
        "#growthhacks",
        "#fyp",
    ]

    caption = f"Discover {brand}: {benefit}. Link in bio to start free! 🚀"

    return primary, alts, rationale, caption, hashtags

def get_recommendations(profile: Dict[str, Any], top_k: int = 15) -> List[Dict[str, Any]]:
    """
    RAG Retrieval Pipeline:
    Embeds composite profile query and returns ranked viral meme cards.
    """
    vectorstore = Chroma(
        persist_directory=CHROMA_DIR,
        collection_name=COLLECTION_NAME,
    )

    query_str = (
        f"{profile.get('productService', '')} "
        f"{profile.get('audience', '')} "
        f"{profile.get('problemSolved', '')} "
        f"{profile.get('keyBenefits', '')} "
        f"{profile.get('businessModel', '')} "
        f"{' '.join(profile.get('categories', []))}"
    )

    # Perform similarity search with score
    results = vectorstore.similarity_search_with_score(query_str, k=top_k)

    recommendations = []
    for idx, (doc, distance) in enumerate(results):
        meta = doc.metadata
        primary_hook, alts, rationale, caption, hashtags = generate_viral_hooks(meta, profile, idx)
        
        # Convert distance to intuitive 80-99 relevance score
        viral_score = max(80, min(99, int(100 - (distance * 15))))

        actions_list = []
        try:
            actions_list = json.loads(meta.get("actions", "[]"))
        except Exception:
            pass

        keywords_list = []
        try:
            keywords_list = json.loads(meta.get("search_keywords", "[]"))
        except Exception:
            pass

        card = {
            "id": meta.get("id"),
            "video_id": meta.get("video_id"),
            "video_url": meta.get("video_url"),
            "is_carousel": bool(meta.get("is_carousel")),
            "duration": meta.get("duration", "12s"),
            "category": meta.get("category", "Viral Meme"),
            "detailed_description": meta.get("detailed_description", ""),
            "objects_and_elements": [],
            "actions": actions_list,
            "mood_and_vibe": meta.get("mood_and_vibe", ""),
            "search_keywords": keywords_list,
            "hook": primary_hook,
            "alternativeHooks": alts,
            "whyRationale": rationale,
            "caption": caption,
            "hashtags": hashtags,
            "viralScore": viral_score,
            "ragDistance": float(round(distance, 4)),
        }
        recommendations.append(card)

    return recommendations

if __name__ == "__main__":
    print("[1/2] Initializing Chroma Vectorstore Index...")
    build_or_load_vectorstore()

    sample_query = {
        "companyName": "business-marketing_engine",
        "productService": "Autonomous AI video generator for SaaS customer acquisition",
        "audience": "SaaS founders and growth teams",
        "problemSolved": "Spending 15 hours editing videos that get zero reach",
        "keyBenefits": "Automated viral meme hooks and 1-click Instagram scheduling",
        "businessModel": "B2B",
        "categories": ["SaaS", "Mobile app"]
    }

    print("\n[2/2] Running LangChain RAG Similarity Query...")
    recs = get_recommendations(sample_query, top_k=3)
    for r in recs:
        print(f"\n★ Matched: {r['id']} (Score: {r['viralScore']}, Dist: {r['ragDistance']})")
        print(f"  Category: {r['category']}")
        print(f"  Hook: {r['hook']}")
        print(f"  Rationale: {r['whyRationale'][:100]}...")
