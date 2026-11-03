import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export interface CropGuidanceSettings {
  enabled: boolean;
  defaultCrop: string;
  stagesCount: number;
  showRecommendedProducts: boolean;
  showRecommendedTools: boolean;
  enableAiConsultation: boolean;
  enableMachineryBooking: boolean;
  allowCustomerFeedback: boolean;
}

const DEFAULT_SETTINGS: CropGuidanceSettings = {
  enabled: true,
  defaultCrop: 'All Crops (Karnataka)',
  stagesCount: 7,
  showRecommendedProducts: true,
  showRecommendedTools: true,
  enableAiConsultation: true,
  enableMachineryBooking: true,
  allowCustomerFeedback: true,
};

export async function GET() {
  try {
    const db = readDb();
    const settings = { ...DEFAULT_SETTINGS, ...(db.cropGuidanceSettings || {}) };
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch crop guidance settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    db.cropGuidanceSettings = {
      ...DEFAULT_SETTINGS,
      ...(db.cropGuidanceSettings || {}),
      ...body,
    };
    writeDb(db);

    try {
      await revalidateFrontendPath('/crop-guidance');
    } catch {}

    return NextResponse.json({
      success: true,
      data: db.cropGuidanceSettings,
      message: 'Crop guidance settings updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to save crop guidance settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
