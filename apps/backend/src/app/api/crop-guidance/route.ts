import { NextResponse } from 'next/server';
import { readDb } from '@/lib/dev-db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get('crop');

    const db = readDb();
    if (!db.cropGuidance || db.cropGuidance.length === 0) {
      const { devDb } = await import('@/lib/dev-db');
      devDb.reload();
    }
    let items = (db.cropGuidance || []).filter((i: any) => i.isActive !== false);

    if (crop && crop !== 'All' && crop !== 'ALL') {
      items = items.filter(
        (i: any) => !i.crop || i.crop === 'All Crops' || i.crop.toLowerCase() === crop.toLowerCase()
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
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch crop guidance' },
      { status: 500 }
    );
  }
}
