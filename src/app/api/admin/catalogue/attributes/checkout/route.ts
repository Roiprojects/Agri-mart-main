import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_CHECKOUT_ATTRIBUTES = [
  { id: 'ca-1', name: 'Pre-delivery Assembly & Testing', controlType: 'Dropdown', isRequired: false, displayOrder: 1 },
  { id: 'ca-2', name: 'Dark Warehouse Transit Insurance', controlType: 'Checkboxes', isRequired: false, displayOrder: 2 },
  { id: 'ca-3', name: 'Priority Agronomy Advice Call', controlType: 'RadioList', isRequired: false, displayOrder: 3 },
  { id: 'ca-4', name: 'Protective Heavy-Duty Rain Cover', controlType: 'Dropdown', isRequired: false, displayOrder: 4 },
];

function ensureSeedData() {
  if (!devDb.data.checkoutAttributes || devDb.data.checkoutAttributes.length === 0) {
    devDb.data.checkoutAttributes = [...SEED_CHECKOUT_ATTRIBUTES];
    try { devDb.save?.(); } catch {}
  }
}

export async function GET(request: Request) {
  try {
    ensureSeedData();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search')?.toLowerCase().trim();

    let attrs = devDb.getCheckoutAttributes ? devDb.getCheckoutAttributes() : devDb.data.checkoutAttributes || [];

    if (id) {
      const single = attrs.find((a: any) => a.id === id);
      return NextResponse.json({ success: !!single, data: single });
    }

    if (search) {
      attrs = attrs.filter((a: any) => a.name.toLowerCase().includes(search));
    }

    return NextResponse.json({
      success: true,
      count: attrs.length,
      data: attrs.sort((a: any, b: any) => a.displayOrder - b.displayOrder),
    });
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
    const item = devDb.saveCheckoutAttribute ? devDb.saveCheckoutAttribute(body) : body;
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
    const item = devDb.saveCheckoutAttribute ? devDb.saveCheckoutAttribute(body) : body;
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

    if (devDb.deleteCheckoutAttributes) {
      devDb.deleteCheckoutAttributes(targetIds);
    } else {
      devDb.data.checkoutAttributes = (devDb.data.checkoutAttributes || []).filter((a: any) => !targetIds.includes(a.id));
      try { devDb.save?.(); } catch {}
    }

    return NextResponse.json({ success: true, message: `Deleted ${targetIds.length} item(s)` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
