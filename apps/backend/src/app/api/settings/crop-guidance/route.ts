import { NextResponse } from 'next/server';
import { readDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const db = readDb();
    const settings = db.cropGuidanceSettings || {
      enabled: true,
      defaultCrop: 'All Crops (Karnataka)',
      stagesCount: 7,
      showRecommendedProducts: true,
      showRecommendedTools: true,
      enableAiConsultation: true,
      enableMachineryBooking: true,
      allowCustomerFeedback: true,
    };
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
