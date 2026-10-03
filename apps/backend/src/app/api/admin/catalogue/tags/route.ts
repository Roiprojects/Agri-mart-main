import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_TAGS = [
  { id: 'tag-1', name: 'awesome', taggedProductsCount: 17, createdAt: '2022-01-01T00:00:00.000Z' },
  { id: 'tag-2', name: 'cool', taggedProductsCount: 17, createdAt: '2022-01-02T00:00:00.000Z' },
  { id: 'tag-3', name: 'computer', taggedProductsCount: 14, createdAt: '2022-01-03T00:00:00.000Z' },
  { id: 'tag-4', name: 'apparel', taggedProductsCount: 9, createdAt: '2022-01-04T00:00:00.000Z' },
  { id: 'tag-5', name: 'compact', taggedProductsCount: 7, createdAt: '2022-01-05T00:00:00.000Z' },
  { id: 'tag-6', name: 'organic', taggedProductsCount: 8, createdAt: '2022-01-06T00:00:00.000Z' },
  { id: 'tag-7', name: 'power-weeder', taggedProductsCount: 6, createdAt: '2022-01-07T00:00:00.000Z' },
  { id: 'tag-8', name: 'seeds', taggedProductsCount: 12, createdAt: '2022-01-08T00:00:00.000Z' },
  { id: 'tag-9', name: 'fertilizer', taggedProductsCount: 5, createdAt: '2022-01-09T00:00:00.000Z' },
];

function ensureSeedTags() {
  if (!devDb.data.productTags || devDb.data.productTags.length === 0) {
    devDb.data.productTags = [...SEED_TAGS];
    try { devDb.save?.(); } catch {}
  } else {
    const hasAwesome = devDb.data.productTags.some((t: any) => t.name === 'awesome');
    if (!hasAwesome) {
      devDb.data.productTags = [...SEED_TAGS, ...devDb.data.productTags];
      try { devDb.save?.(); } catch {}
    }
  }
}

export async function GET(request: Request) {
  try {
    ensureSeedTags();
    const { searchParams } = new URL(request.url);
    const searchParam = searchParams.get('search');

    let tags = devDb.getProductTags ? devDb.getProductTags() : (devDb as any).data?.productTags || [];

    if (searchParam && searchParam.trim()) {
      const q = searchParam.toLowerCase().trim();
      tags = tags.filter((t: any) => t.name.toLowerCase().includes(q));
    }

    return NextResponse.json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureSeedTags();
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Tag name is required' }, { status: 400 });
    }

    const newTag = devDb.saveProductTag ? devDb.saveProductTag(body) : body;
    return NextResponse.json({ success: true, data: newTag });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    ensureSeedTags();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Tag ID is required' }, { status: 400 });
    }

    const updated = devDb.saveProductTag ? devDb.saveProductTag(body) : body;
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    ensureSeedTags();
    const url = new URL(request.url);
    const queryIds = url.searchParams.get('ids');
    const singleId = url.searchParams.get('id');

    let targetIds: string[] = [];
    if (queryIds) {
      targetIds = queryIds.split(',').map((id) => id.trim()).filter(Boolean);
    } else if (singleId) {
      targetIds = [singleId.trim()];
    } else {
      try {
        const body = await request.json();
        if (Array.isArray(body.ids)) targetIds = body.ids;
        else if (body.id) targetIds = [body.id];
      } catch {}
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided for deletion' }, { status: 400 });
    }

    if (devDb.deleteProductTags) {
      devDb.deleteProductTags(targetIds);
    } else {
      (devDb as any).data.productTags = ((devDb as any).data?.productTags || []).filter(
        (t: any) => !targetIds.includes(t.id)
      );
      try { devDb.save?.(); } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${targetIds.length} tag(s) successfully`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
