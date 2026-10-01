import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  const items = devDb.getGalleryItems().filter((item) => item.isPublished);
  return NextResponse.json({
    success: true,
    count: items.length,
    data: items,
  });
}
