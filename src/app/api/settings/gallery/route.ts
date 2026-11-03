import { NextResponse } from 'next/server';
import { readDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const db = readDb();
    const settings = db.gallerySettings || {
      enabled: true,
      pageSize: 12,
      allowLightbox: true,
      showPhotographer: true,
      showLocation: true,
      showLicense: true,
      enableCategories: true,
    };
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
