import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  const posts = devDb.getBlogPosts().filter((p) => p.isPublished);
  return NextResponse.json({
    success: true,
    count: posts.length,
    data: posts,
  });
}
