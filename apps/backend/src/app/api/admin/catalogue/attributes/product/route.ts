import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_PRODUCT_ATTRIBUTES = [
  { id: 'pa-color', name: 'Color', description: 'Product color variants (blue, green, yellow, etc.)', displayOrder: 1 },
  { id: 'pa-frame-color', name: 'Frame Color', description: 'Chassis or frame finish colors', displayOrder: 2 },
  { id: 'pa-pattern', name: 'Pattern', description: 'Surface or structural pattern options', displayOrder: 3 },
  { id: 'pa-sprayer', name: 'Sprayer Tank Capacity (L)', description: 'Volume capacity for liquid sprays', displayOrder: 4 },
  { id: 'pa-blade', name: 'Blade Type & Material', description: 'Hardened carbon steel or standard heat-treated blades', displayOrder: 5 },
  { id: 'pa-package', name: 'Packaging Size (5kg, 10kg, 25kg)', description: 'Bulk bag and granule SKU size', displayOrder: 6 },
];

function ensureSeedData() {
  if (!devDb.data.productAttributes || devDb.data.productAttributes.length === 0) {
    devDb.data.productAttributes = [...SEED_PRODUCT_ATTRIBUTES];
    try { devDb.save?.(); } catch {}
  } else {
    const hasColor = devDb.data.productAttributes.some((a: any) => a.name === 'Color');
    if (!hasColor) {
      devDb.data.productAttributes = [...SEED_PRODUCT_ATTRIBUTES, ...devDb.data.productAttributes];
      try { devDb.save?.(); } catch {}
    }
  }
}

export async function GET(request: Request) {
  try {
    ensureSeedData();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    let attrs = devDb.getProductAttributes ? devDb.getProductAttributes() : devDb.data.productAttributes || [];

    if (id) {
      const single = attrs.find((a: any) => a.id === id);
      return NextResponse.json({ success: !!single, data: single });
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      attrs = attrs.filter((a: any) => a.name.toLowerCase().includes(q));
    }

    return NextResponse.json({ success: true, count: attrs.length, data: attrs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureSeedData();
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    let item: any;
    if (typeof (devDb as any).saveProductAttribute === 'function') {
      item = (devDb as any).saveProductAttribute(body);
    } else {
      if (!(devDb as any).data.productAttributes) (devDb as any).data.productAttributes = [];
      item = {
        id: body.id || `pa-${Date.now()}`,
        name: body.name.trim(),
        description: body.description || '',
        displayOrder: body.displayOrder || (devDb as any).data.productAttributes.length + 1,
        createdAt: new Date().toISOString(),
      };
      (devDb as any).data.productAttributes.push(item);
      try { (devDb as any).save?.(); } catch {}
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    ensureSeedData();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    let item: any;
    if (typeof (devDb as any).saveProductAttribute === 'function') {
      item = (devDb as any).saveProductAttribute(body);
    } else {
      const list = (devDb as any).data?.productAttributes || [];
      const idx = list.findIndex((a: any) => a.id === body.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...body };
        item = list[idx];
        try { (devDb as any).save?.(); } catch {}
      } else {
        item = body;
      }
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    ensureSeedData();
    const url = new URL(request.url);
    const queryIds = url.searchParams.get('ids');
    const singleId = url.searchParams.get('id');

    let targetIds: string[] = [];
    if (queryIds) targetIds = queryIds.split(',').map((s) => s.trim()).filter(Boolean);
    else if (singleId) targetIds = [singleId.trim()];
    else {
      try {
        const body = await request.json();
        if (Array.isArray(body.ids)) targetIds = body.ids;
        else if (body.id) targetIds = [body.id];
      } catch {}
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    if (devDb.deleteProductAttributes) {
      devDb.deleteProductAttributes(targetIds);
    } else {
      devDb.data.productAttributes = (devDb.data.productAttributes || []).filter((a: any) => !targetIds.includes(a.id));
      try { devDb.save?.(); } catch {}
    }

    return NextResponse.json({ success: true, message: `Deleted ${targetIds.length} item(s)` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
