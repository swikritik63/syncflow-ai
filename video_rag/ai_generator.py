import os
import json
import urllib.request
from typing import List, Dict, Any

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def call_openrouter_llm(messages: List[Dict[str, str]], model: str = OPENROUTER_MODEL, temperature: float = 0.7) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/business-marketing_engine",
        "X-Title": "business-marketing_engine ReelCat",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 800,
        "response_format": {"type": "json_object"},
    }

    req = urllib.request.Request(OPENROUTER_URL, data=json.dumps(payload).encode("utf-8"), headers=headers)
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        return res_data["choices"][0]["message"]["content"]

def enrich_memes_with_llm(profile: Dict[str, Any], memes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Uses OpenAI gpt-4o-mini via OpenRouter to analyze the business profile
    and write punchy kinetic hooks, subtitles, captions, and rationales for each matched meme.
    """
    # Select up to top 4 memes to process in a single fast, token-efficient batch
    batch_memes = memes[:4]

    simplified_memes = [
        {
            "id": m["id"],
            "category": m.get("category", ""),
            "actions": m.get("actions", []),
            "mood": m.get("mood_and_vibe", ""),
            "duration": m.get("duration", "12s"),
        }
        for m in batch_memes
    ]

    system_prompt = (
        "You are an elite viral short-form video director and copywriter for TikTok and Instagram Reels.\n"
        "Your task is to analyze a business questionnaire and write punchy, high-retention video hooks, subtitles, "
        "and captions for matched meme templates.\n\n"
        "STRICT HOOK RULES:\n"
        "1. Max 14 words per primary hook. Must trigger curiosity, pattern interruption, or deep relatability within 1.5 seconds.\n"
        "2. Directly incorporate the brand name, audience struggle, and core benefit.\n"
        "3. Strictly adhere to the brand's 'tonePositioning' and avoid anything listed in 'thingsToAvoid'.\n"
        "4. Output MUST be valid JSON with a 'results' array of objects corresponding to each meme ID."
    )

    user_prompt = f"""
BUSINESS QUESTIONNAIRE:
- Company Name: {profile.get('companyName', 'Marketing Engine')}
- Product/Service: {profile.get('productService', '')}
- Target Audience: {profile.get('audience', '')}
- Problem Solved: {profile.get('problemSolved', '')}
- Key Benefits: {profile.get('keyBenefits', '')}
- Tone / Positioning: {profile.get('tonePositioning', 'Witty, relatable')}
- Things to Avoid: {profile.get('thingsToAvoid', 'Corporate jargon')}
- Business Model: {profile.get('businessModel', 'B2B')}
- Categories: {', '.join(profile.get('categories', []))}

MATCHED MEME TEMPLATES TO ENRICH:
{json.dumps(simplified_memes, indent=2)}

RETURN FORMAT (JSON):
{{
  "business_analysis": "Brief 1-sentence breakdown of the core psychological buying trigger",
  "results": [
    {{
      "id": "<meme_id>",
      "primaryHook": "<Punchy headline hook text under 14 words>",
      "alternativeHooks": ["<Alternative hook 1>", "<Alternative hook 2>", "<Alternative hook 3>"],
      "whyRationale": "<2 sentences explaining why this visual meme's mood and physical action hooks this specific audience and solves their problem>",
      "caption": "<High-converting Instagram Reel caption ending with link in bio CTA>",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }}
  ]
}}
"""

    try:
        raw_response = call_openrouter_llm(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            model=OPENROUTER_MODEL,
        )
        parsed = json.loads(raw_response)
        results_map = {r["id"]: r for r in parsed.get("results", []) if "id" in r}

        enriched_memes = []
        for m in memes:
            if m["id"] in results_map:
                res = results_map[m["id"]]
                m["hook"] = res.get("primaryHook", m.get("hook", ""))
                m["alternativeHooks"] = res.get("alternativeHooks", m.get("alternativeHooks", []))
                m["whyRationale"] = res.get("whyRationale", m.get("whyRationale", ""))
                m["caption"] = res.get("caption", m.get("caption", ""))
                m["hashtags"] = res.get("hashtags", m.get("hashtags", []))
                m["aiEnriched"] = True
                m["aiModel"] = OPENROUTER_MODEL
            enriched_memes.append(m)

        return enriched_memes
    except Exception as e:
        print(f"[OpenRouter LLM Error] {e}. Falling back to deterministic Hermes rules.")
        return memes

if __name__ == "__main__":
    test_profile = {
        "companyName": "business-marketing_engine",
        "productService": "Autonomous AI video generator for SaaS customer acquisition",
        "audience": "SaaS founders and growth teams",
        "problemSolved": "Spending 15 hours editing videos that get zero reach",
        "keyBenefits": "Automated viral meme hooks and 1-click Instagram scheduling",
        "tonePositioning": "Witty, edgy tech humor",
        "thingsToAvoid": "Boring stock footage, corporate jargon",
        "businessModel": "B2B",
        "categories": ["SaaS", "Mobile app"]
    }

    test_memes = [
        {
            "id": "video_001_ibai_whiteboard_explaining",
            "category": "Explaining & Pitching Memes",
            "actions": ["drawing on whiteboard", "explaining frantically"],
            "mood_and_vibe": "hyperactive, passionate, frantic explanation",
            "duration": "17s"
        }
    ]

    print(f"Testing OpenRouter with model: {OPENROUTER_MODEL}...")
    enriched = enrich_memes_with_llm(test_profile, test_memes)
    print("\n--- LLM Enriched Result ---")
    print("Primary Hook:", enriched[0]["hook"])
    print("Why Rationale:", enriched[0]["whyRationale"])
    print("Caption:", enriched[0]["caption"])
    print("Hashtags:", enriched[0]["hashtags"])
