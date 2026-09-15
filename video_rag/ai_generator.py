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
        "Your superpower is analyzing business inputs and turning them into high-conversion viral hooks "
        "and deeply articulated, beautifully spaced captions based on the 4-Part Viral Hook Architecture:\n\n"
        "THE 4-PART HIGH-CONVERSION VIRAL HOOK FRAMEWORK:\n"
        "1. ESTABLISH AN IMMEDIATE ANCHOR (The Cost / The Friction):\n"
        "   - Lead with the concrete dollar amount or painful time cost of the 'old way' (e.g. 'Fiverr freelancers charge $50', 'Agencies charge $2,500/mo', 'Spending 15 hours cutting dead air').\n"
        "   - Make the viewer immediately feel the financial/time pain before presenting the solution.\n"
        "2. TARGET A SPECIFIC NICHE DELIVERABLE (The Context / 'The What'):\n"
        "   - NEVER use vague phrases like 'paying $50 on Fiverr' without stating the exact deliverable!\n"
        "   - Always state the concrete output: 'for website copy', 'for short-form reel hooks', 'to remove background tourists from vacation photos', 'to synthesize 40 research papers into a progressive overload gym split'.\n"
        "   - This instantly filters the audience and stops target buyers from scrolling.\n"
        "3. EXTREME CONTRAST (Money/Friction vs. Instant Speed):\n"
        "   - Pit the two extremes against each other: The Friction (waiting days + spending $50) vs The Magic Solution (generated in 3 seconds).\n"
        "   - E.g. 'Fiverr freelancers charge $50 for website copy, but this AI does it in 3 seconds.'\n"
        "4. SET UP A VISUAL PAYOFF (Screen Direction / B-Roll Cue):\n"
        "   - Every hook must set up a fast-paced dynamic visual. Describe the exact on-screen B-roll payoff in the rationale and caption (e.g. 'Split-screen: $50 Fiverr invoice vs. AI generating 10 viral hooks in 3s').\n\n"
        "CAPTIONS MUST HAVE REAL DEPTH & VISUAL BREATHING ROOM:\n"
        "- Use double line breaks (\\n\\n) between paragraphs!\n"
        "- Include: (1) Cost anchor breakdown, (2) The friction vs solution contrast, (3) 🎬 Visual Payoff Cue, (4) High-converting CTA ('Link in bio!').\n"
        "- NEVER output a single compressed block of text!\n"
        "- Output MUST be valid JSON with a 'results' array."
    )

    user_prompt = f"""
BUSINESS QUESTIONNAIRE (Analyze deeply & elevate creatively):
- Brand / Company Name: {profile.get('companyName', profile.get('name', 'Marketing Engine'))}
- Product / Service: {profile.get('productService', profile.get('category', 'AI Tool'))}
- Target Audience: {profile.get('audience', 'creators & students')}
- Problem Solved: {profile.get('problemSolved', profile.get('painPoint', 'wasting hours on manual work'))}
- Key Benefits: {profile.get('keyBenefits', 'saving time in 1 tap')}
- Tone / Positioning: {profile.get('tonePositioning', 'Witty, edgy Gen-Z humor, high-conversion')}
- Things to Avoid: {profile.get('thingsToAvoid', 'Vague Fiverr memes without deliverables, generic tropes, ad fatigue tropes')}
- Business Model: {profile.get('businessModel', 'B2B')}

MATCHED MEME TEMPLATES TO DIRECT:
{json.dumps(simplified_memes, indent=2)}

RETURN FORMAT (JSON):
{{
  "business_analysis": "Identify (1) the concrete deliverable, (2) the cost anchor, (3) the extreme contrast, and (4) the visual B-roll payoff",
  "results": [
    {{
      "id": "<meme_id>",
      "primaryHook": "<Cost-anchored hook under 14 words naming the EXACT deliverable: e.g. 'Fiverr freelancers charge $50 for website copy, but this AI does it in 3 seconds.'>",
      "alternativeHooks": [
        "<Agency anchor angle: e.g. 'Agencies charge $2,500/mo for [deliverable], but [Brand] does it in 3 seconds.'>",
        "<Friction vs solution angle: e.g. 'The friction: [painful old way]. The solution: [Brand] in 3 seconds.'>",
        "<Unpopular opinion angle: e.g. 'Unpopular opinion: Paying $50 for [deliverable] in 2026 is self-inflicted pain.'>"
      ],
      "whyRationale": "Viral Anchor Strategy: Explains the cost anchor, the niche deliverable, and describes the 🎬 Visual B-Roll Payoff direction",
      "caption": "<Deep, multi-line spaced Instagram caption (using \\n\\n) with cost breakdown, visual B-roll cue, and clear CTA>",
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
