import { NextResponse } from 'next/server';
import { CatalogueService } from '@/lib/catalogue-service';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  const categories = await CatalogueService.getCategories();
  return NextResponse.json({ success: true, count: categories.length, data: categories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, message: 'Category name and slug are required.' }, { status: 400 });
    }

    const saved = await CatalogueService.saveCategory(body);
    return NextResponse.json({
      success: true,
      data: saved,
      message: `Category "${saved.name}" saved and category pages revalidated.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    if (!id && !ids) {
      return NextResponse.json({ success: false, message: 'Category ID or IDs required' }, { status: 400 });
    }
    const data = (devDb as any).data;
    if (ids) {
      const idList = ids.split(',').map((s) => s.trim());
      data.categories = (data.categories || []).filter((c: any) => !idList.includes(c.id));
    } else if (id) {
      data.categories = (data.categories || []).filter((c: any) => c.id !== id);
    }
    try { (devDb as any).save?.(); } catch {}
    return NextResponse.json({ success: true, message: 'Category/Categories deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
