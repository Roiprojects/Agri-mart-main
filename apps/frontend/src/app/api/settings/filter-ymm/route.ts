import { NextResponse } from 'next/server';

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
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:3001';

    const res = await fetch(`${backendUrl}/api/admin/settings/filter-ymm`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return NextResponse.json({ success: true, data: json.data });
      }
    }
  } catch (err) {
    console.warn('Frontend proxy failed fetching filter YMM settings from backend:', err);
  }

  return NextResponse.json({
    success: true,
    data: DEFAULT_FILTER_YMM_SETTINGS,
  });
}
