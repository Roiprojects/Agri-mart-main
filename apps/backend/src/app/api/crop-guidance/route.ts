import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';
import {
  DEFAULT_CROP_GUIDANCE_PAGE_CONTENT,
  DEFAULT_CROP_GUIDANCE_STAGES,
  DEFAULT_CROP_MASTER_GUIDES,
} from '@/lib/crop-guidance-defaults';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get('crop');

    let db = readDb();
    let changed = false;

    if (!db.cropGuidance || db.cropGuidance.length === 0) {
      db.cropGuidance = JSON.parse(JSON.stringify(DEFAULT_CROP_GUIDANCE_STAGES));
      changed = true;
    }
    if (!db.cropGuidanceMasterGuides || db.cropGuidanceMasterGuides.length === 0) {
      db.cropGuidanceMasterGuides = JSON.parse(JSON.stringify(DEFAULT_CROP_MASTER_GUIDES));
      changed = true;
    }
    if (!db.cropGuidancePageContent) {
      db.cropGuidancePageContent = JSON.parse(JSON.stringify(DEFAULT_CROP_GUIDANCE_PAGE_CONTENT));
      changed = true;
    }

    if (changed) {
      writeDb(db);
    }

    let items = (db.cropGuidance || []).filter((i: any) => i.isActive !== false);

    if (crop && crop !== 'All' && crop !== 'ALL') {
      items = items.filter(
        (i: any) =>
          !i.crop || i.crop === 'All Crops' || i.crop.toLowerCase() === crop.toLowerCase()
      );
    }

    items.sort((a: any, b: any) => {
      const orderA = a.stageNumber ?? a.displayOrder ?? 0;
      const orderB = b.stageNumber ?? b.displayOrder ?? 0;
      return orderA - orderB;
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
      stages: items,
      masterGuides: db.cropGuidanceMasterGuides || DEFAULT_CROP_MASTER_GUIDES,
      pageContent: {
        ...DEFAULT_CROP_GUIDANCE_PAGE_CONTENT,
        ...(db.cropGuidancePageContent || {}),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch crop guidance' },
      { status: 500 }
    );
  }
}
