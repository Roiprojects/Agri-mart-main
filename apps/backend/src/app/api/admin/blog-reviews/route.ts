import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const slug = searchParams.get('slug');

  let reviews = devDb.getBlogReviews(slug || undefined);
  if (status) {
    reviews = reviews.filter((r) => r.status === status);
  }

  return NextResponse.json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
}
