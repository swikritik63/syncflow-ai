import os
import json
import re
import urllib.request
from typing import List, Dict, Any

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def repair_json(raw: str) -> dict:
    """Attempt to parse JSON, repairing common LLM truncation issues."""
    # Strip markdown fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

    # First try direct parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Fix unterminated strings: close any dangling quote
    repaired = raw
    # Remove trailing incomplete key-value pairs
    repaired = re.sub(r',\s*"[^"]*$', '', repaired)
    # Close any unclosed strings
    if repaired.count('"') % 2 == 1:
        repaired += '"'
    # Close unclosed arrays and objects
    open_braces = repaired.count('{') - repaired.count('}')
    open_brackets = repaired.count('[') - repaired.count(']')
    # Remove trailing commas before closing
    repaired = re.sub(r',\s*$', '', repaired.rstrip())
    repaired += ']' * max(0, open_brackets)
    repaired += '}' * max(0, open_braces)

    try:
        return json.loads(repaired)
    except json.JSONDecodeError:
        # Last resort: extract just the results array
        match = re.search(r'"results"\s*:\s*\[', raw)
        if match:
            start = match.start()
            # Find a valid JSON subset
            for end_pos in range(len(raw), start, -1):
                try:
                    subset = '{' + raw[start:end_pos]
                    if subset.count('[') > subset.count(']'):
                        subset += ']'
                    if subset.count('{') > subset.count('}'):
                        subset += '}'
                    return json.loads(subset)
                except json.JSONDecodeError:
                    continue
        raise ValueError(f"Could not repair JSON: {raw[:200]}...")


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
        "max_tokens": 1500,
        "response_format": {"type": "json_object"},
    }

    req = urllib.request.Request(OPENROUTER_URL, data=json.dumps(payload).encode("utf-8"), headers=headers)
    with urllib.request.urlopen(req, timeout=20) as response:
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
        "You are an elite viral Gen-Z short-form video director and ad copywriter for TikTok and Instagram Reels.\n"
        "Your superpower is analyzing simple or shorthand business inputs and turning them into creative, "
        "relatable, high-retention viral hooks and beautifully spaced captions that blow up on the algorithm.\n\n"
        "CREATIVE GEN-Z GUIDELINES:\n"
        "1. DO NOT just mechanically copy-paste user input words. Expand creatively into real-world hyperscale scenarios: "
        "e.g. monetization/side-hustles, gym/workout routines, automating workflows in 5 seconds, late-night study hacks, high-performance routines.\n"
        "2. GRAMMAR MUST BE FLAWLESS: use proper articles ('an AI search engine', 'a workflow tool'), subject-verb agreement ('every creator who struggles', not 'every creators'), and natural English cadence.\n"
        "3. Use viral formats: 'POV', 'my toxic trait was thinking I had to...', 'unpopular opinion:', 'why nobody is talking about this', 'the exact second you stop...'.\n"
        "4. Max 14 words per hook. Breakable lines that match the physical emotion of the meme.\n"
        "5. CAPTIONS MUST HAVE MULTI-LINE SPACING (use \\n\\n between paragraphs!). Format with visual breathing room, emojis, bullet points, and a direct CTA ('Link in bio!'). NEVER output a single cram of text!\n"
        "6. Output MUST be valid JSON with a 'results' array of objects corresponding to each meme ID."
    )

    user_prompt = f"""
BUSINESS QUESTIONNAIRE (Analyze deeply & elevate creatively):
- Brand / Company Name: {profile.get('companyName', profile.get('name', 'Marketing Engine'))}
- Product / Service: {profile.get('productService', profile.get('category', 'AI Tool'))}
- Target Audience: {profile.get('audience', 'creators & students')}
- Problem Solved: {profile.get('problemSolved', profile.get('painPoint', 'wasting hours on manual work'))}
- Key Benefits: {profile.get('keyBenefits', 'saving time in 1 tap')}
- Tone / Positioning: {profile.get('tonePositioning', 'Witty, edgy Gen-Z humor, high-conversion')}
- Things to Avoid: {profile.get('thingsToAvoid', 'Boring corporate jargon, repetitive generic copy, grammatical errors')}
- Business Model: {profile.get('businessModel', 'B2B')}

MATCHED MEME TEMPLATES TO DIRECT:
{json.dumps(simplified_memes, indent=2)}

RETURN FORMAT (JSON):
{{
  "business_analysis": "Brief 1-sentence breakdown of the core psychological Gen-Z hook angle",
  "results": [
    {{
      "id": "<meme_id>",
      "primaryHook": "<Grammatically flawless Gen-Z hook under 14 words matching this meme's emotion and a specific real-world scenario>",
      "alternativeHooks": ["<Creative alt 1>", "<Creative alt 2>", "<Creative alt 3>"],
      "whyRationale": "<Why this visual meme's physical energy hooks this audience and converts them>",
      "caption": "<Multi-line spaced Instagram caption with \\n\\n between paragraphs, bullet points, and clear CTA>",
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
        print(f"[OpenRouter] Raw response length: {len(raw_response)} chars")
        parsed = repair_json(raw_response)
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

        print(f"[OpenRouter] Successfully enriched {sum(1 for m in enriched_memes if m.get('aiEnriched'))} / {len(enriched_memes)} memes")
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
