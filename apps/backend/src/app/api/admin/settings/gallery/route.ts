import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export interface GallerySettings {
  enabled: boolean;
  pageSize: number;
  allowLightbox: boolean;
  showPhotographer: boolean;
  showLocation: boolean;
  showLicense: boolean;
  enableCategories: boolean;
}

const DEFAULT_SETTINGS: GallerySettings = {
  enabled: true,
  pageSize: 12,
  allowLightbox: true,
  showPhotographer: true,
  showLocation: true,
  showLicense: true,
  enableCategories: true,
};

export async function GET() {
  try {
    const db = readDb();
    const settings = { ...DEFAULT_SETTINGS, ...(db.gallerySettings || {}) };
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch gallery settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    db.gallerySettings = {
      ...DEFAULT_SETTINGS,
      ...(db.gallerySettings || {}),
      ...body,
    };
    writeDb(db);

    try {
      await revalidateFrontendPath('/gallery');
    } catch {}

    return NextResponse.json({
      success: true,
      data: db.gallerySettings,
      message: 'Gallery settings updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to save gallery settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
