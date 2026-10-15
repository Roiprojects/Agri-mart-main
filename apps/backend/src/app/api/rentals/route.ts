import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  if (slug) {
    const item = devDb.getRentalProductBySlug(slug);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Rental product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  }

  if (id) {
    const item = devDb.getRentalProductById(id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Rental product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  }

  const items = devDb.getRentalProducts();
  return NextResponse.json({ success: true, count: items.length, data: items });
}
