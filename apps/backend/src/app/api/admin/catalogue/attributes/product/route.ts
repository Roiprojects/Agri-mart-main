import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_PRODUCT_ATTRIBUTES = [
  { id: 'pa-1', name: 'Sprayer Tank Capacity (L)', description: 'Volume capacity for liquid sprays', displayOrder: 1 },
  { id: 'pa-2', name: 'Blade Type & Material', description: 'Hardened carbon steel or standard heat-treated blades', displayOrder: 2 },
  { id: 'pa-3', name: 'Color / Finish', description: 'Equipment chassis protective coat', displayOrder: 3 },
  { id: 'pa-4', name: 'Power Source (Battery / Petrol / Diesel)', description: 'Primary engine or electric propulsion', displayOrder: 4 },
  { id: 'pa-5', name: 'Packaging Size (5kg, 10kg, 25kg)', description: 'Bulk bag and granule SKU size', displayOrder: 5 },
];

function ensureSeedData() {
  if (!devDb.data.productAttributes || devDb.data.productAttributes.length === 0) {
    devDb.data.productAttributes = [...SEED_PRODUCT_ATTRIBUTES];
    try { devDb.save?.(); } catch {}
  }
}

export async function GET() {
  try {
    ensureSeedData();
    const attrs = devDb.getProductAttributes ? devDb.getProductAttributes() : devDb.data.productAttributes || [];
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
    const item = devDb.saveProductAttribute ? devDb.saveProductAttribute(body) : body;
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
    const item = devDb.saveProductAttribute ? devDb.saveProductAttribute(body) : body;
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
