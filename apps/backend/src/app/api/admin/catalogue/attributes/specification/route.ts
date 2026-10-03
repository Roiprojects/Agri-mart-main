import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_SPEC_ATTRIBUTES = [
  { id: 'sa-1', name: 'Engine Displacement (cc)', displayOrder: 1 },
  { id: 'sa-2', name: 'Power Rating (HP / kW)', displayOrder: 2 },
  { id: 'sa-3', name: 'Fuel Tank Capacity (L)', displayOrder: 3 },
  { id: 'sa-4', name: 'Starting Mechanism', displayOrder: 4 },
  { id: 'sa-5', name: 'Tilling Width (inches)', displayOrder: 5 },
  { id: 'sa-6', name: 'Operating Pressure (PSI)', displayOrder: 6 },
  { id: 'sa-7', name: 'Target Crop Types', displayOrder: 7 },
  { id: 'sa-8', name: 'Soil Texture Compatibility', displayOrder: 8 },
];

function ensureSeedData() {
  if (!devDb.data.specificationAttributes || devDb.data.specificationAttributes.length === 0) {
    devDb.data.specificationAttributes = [...SEED_SPEC_ATTRIBUTES];
    try { devDb.save?.(); } catch {}
  }
}

export async function GET() {
  try {
    ensureSeedData();
    const attrs = devDb.getSpecificationAttributes ? devDb.getSpecificationAttributes() : devDb.data.specificationAttributes || [];
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
    const item = devDb.saveSpecificationAttribute ? devDb.saveSpecificationAttribute(body) : body;
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
    const item = devDb.saveSpecificationAttribute ? devDb.saveSpecificationAttribute(body) : body;
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

    if (devDb.deleteSpecificationAttributes) {
      devDb.deleteSpecificationAttributes(targetIds);
    } else {
      devDb.data.specificationAttributes = (devDb.data.specificationAttributes || []).filter((a: any) => !targetIds.includes(a.id));
      try { devDb.save?.(); } catch {}
    }

    return NextResponse.json({ success: true, message: `Deleted ${targetIds.length} item(s)` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
