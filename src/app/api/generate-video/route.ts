import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { BusinessProfile } from '@/types';

const execFileAsync = promisify(execFile);

type Mode = 'product' | 'ugc';

function contextOf(b: BusinessProfile) {
  return {
    brand: b.companyName || b.name,
    product: b.productService,
    audience: b.audience || b.targetAudience,
    problem: b.problemSolved || b.painPoint,
    benefit: b.keyBenefits || b.keyBenefit,
    tone: b.tonePositioning,
    avoid: b.thingsToAvoid,
  };
}

async function draftPrompt(business: BusinessProfile, mode: Mode) {
  const key = process.env.OPENROUTER_API_KEY;
  const context = contextOf(business);
  if (!key) throw new Error('OPENROUTER_API_KEY is not configured');
  const instruction = mode === 'product'
    ? 'Write a short product hero ad video prompt for the attached product image. Include a concise spoken or on-screen value proposition, premium camera motion, and a clear product benefit. Keep it one continuous shot, 3–10 seconds, and avoid inventing product facts.'
    : 'Write a concise UGC ad video prompt for the attached avatar image. Use the business context to create natural first-person dialogue about the problem and benefit. Keep it one continuous 3–10 second clip, with generated dialogue audio, no captions, and no unsupported claims.';
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-5.6-terra',
      temperature: 0.7,
      max_tokens: 450,
      messages: [
        { role: 'system', content: 'You are a concise performance-marketing creative director. Return only the final video prompt.' },
        { role: 'user', content: `${instruction}\nBusiness context:\n${JSON.stringify(context)}` },
      ],
    }),
  });
  if (!response.ok) throw new Error(`OpenRouter error ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || instruction;
}

async function adcToken() {
  const { stdout } = await execFileAsync('gcloud', ['auth', 'print-access-token'], { timeout: 15_000 });
  return stdout.trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { business: BusinessProfile; mode: Mode; imageData?: string; mimeType?: string; imageUrl?: string };
    if (!body.business || !['product', 'ugc'].includes(body.mode)) {
      return NextResponse.json({ error: 'business and mode are required' }, { status: 400 });
    }
    const prompt = await draftPrompt(body.business, body.mode);
    const parts: Array<Record<string, string>> = [];
    let imageData = body.imageData?.replace(/^data:[^;]+;base64,/, '');
    let imageMimeType = body.mimeType || 'image/jpeg';
    if (!imageData && body.imageUrl) {
      const imageResponse = await fetch(new URL(body.imageUrl, request.url));
      if (imageResponse.ok) {
        imageMimeType = imageResponse.headers.get('content-type') || imageMimeType;
        imageData = Buffer.from(await imageResponse.arrayBuffer()).toString('base64');
      }
    }
    if (imageData) parts.push({ type: 'image', data: imageData, mime_type: imageMimeType });
    parts.push({ type: 'text', text: prompt });
    const token = await adcToken();
    const project = process.env.GOOGLE_CLOUD_PROJECT || 'myfafa';
    const response = await fetch(`https://aiplatform.googleapis.com/v1beta1/projects/${project}/locations/global/interactions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-omni-1.1-flash-preview',
        input: parts,
        response_format: [{ type: 'video', delivery: 'inline', aspect_ratio: body.mode === 'ugc' ? '9:16' : '16:9', resolution: '360p', duration: '10s' }],
        generation_config: { video_config: { task: body.mode === 'ugc' ? 'image_to_video' : 'image_to_video' } },
        background: false, store: false, stream: false,
      }),
    });
    const result = await response.json();
    if (!response.ok) return NextResponse.json({ error: result.error?.message || `Agent Platform error ${response.status}`, prompt }, { status: response.status });
    const video = result.steps?.flatMap((s: { content?: Array<Record<string, string>> }) => s.content || []).find((c: Record<string, string>) => c.type === 'video' && c.data);
    if (!video?.data) return NextResponse.json({ error: 'Agent Platform returned no video', prompt }, { status: 502 });
    return NextResponse.json({ prompt, videoData: `data:video/mp4;base64,${video.data}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Video generation failed' }, { status: 500 });
  }
}
