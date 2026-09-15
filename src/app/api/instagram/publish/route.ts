import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username = 'demo_creator', post, business } = body;

    // Shared Demo Instagram API simulation (Meta Graph API for Instagram Reels)
    const publishedAt = new Date().toISOString();
    const mockReelId = `ig_reel_${Date.now()}`;
    const sharedAccount = '@business_marketing_engine';

    console.log(`[Instagram Demo API] User "${username}" published reel "${post?.hook?.slice(0, 40)}..." to shared account ${sharedAccount}`);

    return NextResponse.json({
      success: true,
      platform: 'Instagram Reels',
      shared_account: sharedAccount,
      account_id: 'act_shipaton2026_shared_sandbox',
      published_by: username,
      brand_name: business?.companyName || 'Marketing Engine',
      reel_id: mockReelId,
      video_url: post?.videoUrl,
      hook: post?.hook,
      caption: post?.caption,
      hashtags: post?.hashtags || [],
      published_at: publishedAt,
      permalink: `https://instagram.com/reels/${mockReelId}`,
      message: `Successfully posted to shared demo Instagram account ${sharedAccount}!`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to publish to Instagram';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
