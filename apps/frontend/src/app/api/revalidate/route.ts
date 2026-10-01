import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths, tags, event } = body;

    const expectedSecret = process.env.REVALIDATION_SECRET || 'agrimart_secret_reval_2026';
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid revalidation secret token' },
        { status: 401 }
      );
    }

    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];

    // Revalidate paths
    if (Array.isArray(paths)) {
      for (const p of paths) {
        if (typeof p === 'string' && p.startsWith('/')) {
          try {
            revalidatePath(p);
            revalidatedPaths.push(p);
          } catch (err) {
            console.error(`Error revalidating path ${p}:`, err);
          }
        }
      }
    }

    // Revalidate cache tags
    if (Array.isArray(tags)) {
      for (const t of tags) {
        if (typeof t === 'string' && t.trim().length > 0) {
          try {
            // @ts-ignore Next.js 15 tag revalidation
            revalidateTag(t);
            revalidatedTags.push(t);
          } catch (err) {
            console.error(`Error revalidating tag ${t}:`, err);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      event: event || 'MANUAL_REVALIDATE',
      paths: revalidatedPaths,
      tags: revalidatedTags,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to revalidate cache' },
      { status: 500 }
    );
  }
}
