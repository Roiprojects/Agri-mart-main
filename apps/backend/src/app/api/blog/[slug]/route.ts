import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  const post = devDb.getBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: post,
  });
}
