import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export interface CropGuidanceItem {
  id: string;
  stageNumber: number;
  crop?: string;
  title: string;
  subtitle: string;
  summary: string;
  keyActions: string[];
  recommendedTools: string[];
  recommendedProducts?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const crop = searchParams.get('crop');
    const status = searchParams.get('status'); // 'active' | 'inactive' | 'all'

    let db = readDb();
    if (!db.cropGuidance || db.cropGuidance.length === 0) {
      const { devDb } = await import('@/lib/dev-db');
      devDb.reload();
      db = readDb();
    }
    let items: CropGuidanceItem[] = (db.cropGuidance || []).slice();

    if (search) {
      items = items.filter(
        (i) =>
          i.title?.toLowerCase().includes(search) ||
          i.subtitle?.toLowerCase().includes(search) ||
          i.summary?.toLowerCase().includes(search)
      );
    }

    if (crop && crop !== 'All' && crop !== 'ALL') {
      items = items.filter(
        (i) => !i.crop || i.crop === 'All Crops' || i.crop.toLowerCase() === crop.toLowerCase()
      );
    }

    if (status === 'active') {
      items = items.filter((i) => i.isActive);
    } else if (status === 'inactive') {
      items = items.filter((i) => !i.isActive);
    }

    // Sort by stageNumber, then displayOrder
    items.sort((a, b) => {
      const orderA = a.stageNumber ?? a.displayOrder ?? 0;
      const orderB = b.stageNumber ?? b.displayOrder ?? 0;
      return orderA - orderB;
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch crop guidance items' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      summary,
      stageNumber,
      crop,
      keyActions,
      recommendedTools,
      recommendedProducts,
      displayOrder,
      isActive,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Stage Title is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    if (!db.cropGuidance) {
      db.cropGuidance = [];
    }

    const newItem: CropGuidanceItem = {
      id: body.id || `cg-stage-${Date.now()}`,
      stageNumber: Number(stageNumber) || db.cropGuidance.length + 1,
      crop: crop || 'All Crops',
      title: title.trim(),
      subtitle: (subtitle || '').trim(),
      summary: (summary || '').trim(),
      keyActions: Array.isArray(keyActions)
        ? keyActions.filter((a) => typeof a === 'string' && a.trim().length > 0)
        : [],
      recommendedTools: Array.isArray(recommendedTools)
        ? recommendedTools.filter((t) => typeof t === 'string' && t.trim().length > 0)
        : [],
      recommendedProducts: Array.isArray(recommendedProducts)
        ? recommendedProducts.filter((p) => typeof p === 'string' && p.trim().length > 0)
        : [],
      displayOrder: Number(displayOrder) || db.cropGuidance.length + 1,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.cropGuidance.push(newItem);
    writeDb(db);

    try {
      await revalidateFrontendPath('/crop-guidance');
    } catch {}

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Crop guidance stage created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create crop guidance stage' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    if (!db.cropGuidance) db.cropGuidance = [];

    const index = db.cropGuidance.findIndex((item: CropGuidanceItem) => item.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance item not found' },
        { status: 404 }
      );
    }

    const current = db.cropGuidance[index];
    const updated: CropGuidanceItem = {
      ...current,
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.subtitle !== undefined ? { subtitle: body.subtitle.trim() } : {}),
      ...(body.summary !== undefined ? { summary: body.summary.trim() } : {}),
      ...(body.stageNumber !== undefined ? { stageNumber: Number(body.stageNumber) } : {}),
      ...(body.crop !== undefined ? { crop: body.crop } : {}),
      ...(body.keyActions !== undefined
        ? {
            keyActions: Array.isArray(body.keyActions)
              ? body.keyActions.filter((a: any) => typeof a === 'string' && a.trim().length > 0)
              : [],
          }
        : {}),
      ...(body.recommendedTools !== undefined
        ? {
            recommendedTools: Array.isArray(body.recommendedTools)
              ? body.recommendedTools.filter((t: any) => typeof t === 'string' && t.trim().length > 0)
              : [],
          }
        : {}),
      ...(body.recommendedProducts !== undefined
        ? {
            recommendedProducts: Array.isArray(body.recommendedProducts)
              ? body.recommendedProducts.filter((p: any) => typeof p === 'string' && p.trim().length > 0)
              : [],
          }
        : {}),
      ...(body.displayOrder !== undefined ? { displayOrder: Number(body.displayOrder) } : {}),
      ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
      updatedAt: new Date().toISOString(),
    };

    db.cropGuidance[index] = updated;
    writeDb(db);

    try {
      await revalidateFrontendPath('/crop-guidance');
    } catch {}

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Crop guidance stage updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update crop guidance stage' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    if (!db.cropGuidance) db.cropGuidance = [];

    const initialLen = db.cropGuidance.length;
    db.cropGuidance = db.cropGuidance.filter((i: CropGuidanceItem) => i.id !== id);

    if (db.cropGuidance.length === initialLen) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance stage not found' },
        { status: 404 }
      );
    }

    writeDb(db);

    try {
      await revalidateFrontendPath('/crop-guidance');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Crop guidance stage deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete crop guidance stage' },
      { status: 500 }
    );
  }
}
