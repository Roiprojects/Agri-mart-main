import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export async function GET() {
  const items = devDb.getGalleryItems();
  return NextResponse.json({ success: true, count: items.length, data: items });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.image) {
      return NextResponse.json({ success: false, message: 'Title and image are required.' }, { status: 400 });
    }

    const saved = devDb.saveGalleryItem(body);

    try {
      await revalidateFrontendPath('/gallery');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Gallery item saved and /gallery revalidated.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Item ID is required.' }, { status: 400 });
    }

    const data = (devDb as any).data;
    data.galleryItems = (data.galleryItems || []).filter((g: any) => g.id !== id);
    try { (devDb as any).save?.(); } catch {}
    try { await revalidateFrontendPath('/gallery'); } catch {}

    return NextResponse.json({ success: true, message: 'Gallery item removed successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
