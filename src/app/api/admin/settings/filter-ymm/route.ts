import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface FilterLevelItem {
  id: string;
  name: string;
  enabled: boolean;
  displayOrder: number;
}

export interface FilterYmmSettingsData {
  filterLevelEnabled: boolean;
  displayOnHomePage: boolean;
  displayOnProductDetailsPage: boolean;
  isAdvanced: boolean;
  levels: FilterLevelItem[];
}

const DEFAULT_FILTER_YMM_SETTINGS: FilterYmmSettingsData = {
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
    const settings: FilterYmmSettingsData = {
      ...DEFAULT_FILTER_YMM_SETTINGS,
      ...(db.filterYmmSettings || {}),
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch filter YMM settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const db = readDb();

    const currentSettings = db.filterYmmSettings || DEFAULT_FILTER_YMM_SETTINGS;
    const updatedSettings: FilterYmmSettingsData = {
      ...DEFAULT_FILTER_YMM_SETTINGS,
      ...currentSettings,
      ...body,
      levels: body.levels !== undefined ? body.levels : (currentSettings.levels || DEFAULT_FILTER_YMM_SETTINGS.levels),
    };

    db.filterYmmSettings = updatedSettings;

    const ok = writeDb(db);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to write filter YMM settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'The filter (YMM) settings have been updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating filter YMM settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update filter YMM settings' },
      { status: 500 }
    );
  }
}
