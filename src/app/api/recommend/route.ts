import { NextResponse } from 'next/server';
import { generateMemeFeed } from '@/lib/hookEngine';
import { BusinessProfile } from '@/types';

export async function POST(request: Request) {
  try {
    const profile: BusinessProfile = await request.json();

    // 1. Try querying the local Python + LangChain + ChromaDB microservice
    try {
      const pyResponse = await fetch('http://127.0.0.1:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
        signal: AbortSignal.timeout(20000), // 20s timeout for OpenRouter LLM enrichment
      });

      if (pyResponse.ok) {
        const pyData = await pyResponse.json();
        if (pyData?.recommendations?.length > 0) {
          return NextResponse.json({
            source: 'python_langchain_chroma',
            memes: pyData.recommendations,
          });
        }
      } else {
        const errText = await pyResponse.text();
        console.error('Python RAG status:', pyResponse.status, errText);
      }
    } catch (e) {
      console.error('Python RAG fetch exception:', e);
      // Python service offline or timed out, seamlessly fallback to local TypeScript RAG
    }

    // 2. Local-First TypeScript RAG Fallback (Zero external API, guaranteed 100% uptime)
    const memes = generateMemeFeed(profile);
    return NextResponse.json({
      source: 'local_typescript_engine',
      memes,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
