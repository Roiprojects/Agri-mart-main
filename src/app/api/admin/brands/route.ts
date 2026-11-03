import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const brands = devDb.getBrands();
    return NextResponse.json({ success: true, data: brands });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, message: 'Brand name is required' }, { status: 400 });
    }
    const data = (devDb as any).data;
    if (!data.brands) data.brands = [];
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const isPub = body.published !== undefined ? body.published : (body.isPublished !== undefined ? body.isPublished : true);
    const displayOrder = body.displayOrder !== undefined ? Number(body.displayOrder) : 0;

    const existingIndex = data.brands.findIndex((b: any) => b.id === body.id || b.slug === slug);
    if (existingIndex >= 0) {
      data.brands[existingIndex] = {
        ...data.brands[existingIndex],
        ...body,
        slug,
        displayOrder,
        published: isPub,
        isPublished: isPub,
        updatedAt: now,
      };
      try { (devDb as any).save?.(); } catch {}
      return NextResponse.json({ success: true, data: data.brands[existingIndex] });
    } else {
      const newBrand = {
        id: body.id || `br-${Date.now()}`,
        name: body.name,
        slug,
        logoUrl: body.logoUrl || '',
        description: body.description || '',
        website: body.website || '',
        displayOrder,
        published: isPub,
        isPublished: isPub,
        createdAt: now,
        updatedAt: now,
      };
      data.brands.push(newBrand);
      try { (devDb as any).save?.(); } catch {}
      return NextResponse.json({ success: true, data: newBrand });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    if (!id && !ids) {
      return NextResponse.json({ success: false, message: 'Brand ID or IDs required' }, { status: 400 });
    }
    const data = (devDb as any).data;
    if (ids) {
      const idList = ids.split(',').map((s) => s.trim());
      data.brands = (data.brands || []).filter((b: any) => !idList.includes(b.id));
    } else if (id) {
      data.brands = (data.brands || []).filter((b: any) => b.id !== id);
    }
    try { (devDb as any).save?.(); } catch {}
    return NextResponse.json({ success: true, message: 'Manufacturer/Brand deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
