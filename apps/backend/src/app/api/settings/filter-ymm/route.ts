import { NextResponse } from 'next/server';
import { readDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

const DEFAULT_FILTER_YMM_SETTINGS = {
  filterLevelEnabled: true,
  displayOnHomePage: true,
  displayOnProductDetailsPage: true,
  isAdvanced: true,
  levels: [
    { id: 'lvl-1', name: 'Year', enabled: true, displayOrder: 1 },
    { id: 'lvl-2', name: 'Make', enabled: true, displayOrder: 2 },
    { id: 'lvl-3', name: 'Model', enabled: true, displayOrder: 3 },
  ],
};

export async function GET() {
  try {
    const db = readDb();
    const settings = {
      ...DEFAULT_FILTER_YMM_SETTINGS,
      ...(db.filterYmmSettings || {}),
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      data: DEFAULT_FILTER_YMM_SETTINGS,
    });
  }
}
