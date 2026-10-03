import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_SPEC_GROUPS = [
  { id: 'group-default', name: 'Default group (non-grouped specification attributes)', displayOrder: 0 },
];

const SEED_SPEC_ATTRIBUTES = [
  { id: 'sa-1', name: 'Engine Displacement (cc)', displayOrder: 1, groupId: 'group-default' },
  { id: 'sa-2', name: 'Power Rating (HP / kW)', displayOrder: 2, groupId: 'group-default' },
  { id: 'sa-3', name: 'Fuel Tank Capacity (L)', displayOrder: 3, groupId: 'group-default' },
  { id: 'sa-4', name: 'Starting Mechanism', displayOrder: 4, groupId: 'group-default' },
  { id: 'sa-5', name: 'Tilling Width (inches)', displayOrder: 5, groupId: 'group-default' },
  { id: 'sa-6', name: 'Operating Pressure (PSI)', displayOrder: 6, groupId: 'group-default' },
  { id: 'sa-7', name: 'Target Crop Types', displayOrder: 7, groupId: 'group-default' },
  { id: 'sa-8', name: 'Soil Texture Compatibility', displayOrder: 8, groupId: 'group-default' },
];

function ensureSeedData() {
  if (!(devDb as any).data.specificationAttributeGroups || (devDb as any).data.specificationAttributeGroups.length === 0) {
    (devDb as any).data.specificationAttributeGroups = [...SEED_SPEC_GROUPS];
    try { devDb.save?.(); } catch {}
  }
  if (!devDb.data.specificationAttributes || devDb.data.specificationAttributes.length === 0) {
    devDb.data.specificationAttributes = [...SEED_SPEC_ATTRIBUTES];
    try { devDb.save?.(); } catch {}
  } else {
    // Ensure all existing attributes have a groupId
    devDb.data.specificationAttributes = devDb.data.specificationAttributes.map((a: any) => ({
      ...a,
      groupId: a.groupId || 'group-default',
    }));
  }
}

export async function GET(request: Request) {
  try {
    ensureSeedData();
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId') || searchParams.get('group_id');
    const search = searchParams.get('search')?.toLowerCase().trim();

    const groups = (devDb as any).data.specificationAttributeGroups || [...SEED_SPEC_GROUPS];

    if (groupId) {
      const singleGroup = groups.find((g: any) => g.id === groupId);
      return NextResponse.json({ success: !!singleGroup, data: singleGroup });
    }

    let attrs = devDb.getSpecificationAttributes ? devDb.getSpecificationAttributes() : devDb.data.specificationAttributes || [];

    if (search) {
      attrs = attrs.filter((a: any) => a.name.toLowerCase().includes(search));
    }

    return NextResponse.json({
      success: true,
      count: attrs.length,
      data: attrs,
      groups: groups.sort((a: any, b: any) => a.displayOrder - b.displayOrder),
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

    if (body.isGroup || body.type === 'group') {
      const groups = (devDb as any).data.specificationAttributeGroups || [];
      const newGroup = {
        id: body.id || `group-${Date.now()}`,
        name: body.name.trim(),
        displayOrder: Number(body.displayOrder) || groups.length,
        createdAt: new Date().toISOString(),
      };
      groups.push(newGroup);
      (devDb as any).data.specificationAttributeGroups = groups;
      try { (devDb as any).save?.(); } catch {}
      return NextResponse.json({ success: true, data: newGroup });
    }

    const item = devDb.saveSpecificationAttribute
      ? devDb.saveSpecificationAttribute({
          ...body,
          groupId: body.groupId || 'group-default',
        })
      : {
          id: body.id || `sa-${Date.now()}`,
          name: body.name.trim(),
          displayOrder: Number(body.displayOrder) || 1,
          groupId: body.groupId || 'group-default',
        };
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

    if (body.isGroup || body.type === 'group') {
      const groups = (devDb as any).data.specificationAttributeGroups || [];
      const idx = groups.findIndex((g: any) => g.id === body.id);
      if (idx >= 0) {
        groups[idx] = { ...groups[idx], ...body };
        try { (devDb as any).save?.(); } catch {}
        return NextResponse.json({ success: true, data: groups[idx] });
      }
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
