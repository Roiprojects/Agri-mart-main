import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  const allItems = devDb.getGalleryItems();
  const items = allItems.filter((item) => item.isPublished !== false);
  const settings = (devDb as any).getRawData()?.gallerySettings || {
    enabled: true,
    pageSize: 12,
    allowLightbox: true,
    showPhotographer: true,
    showLocation: true,
    showLicense: true,
    enableCategories: true,
    pageTitle: 'Life on the Farm - Visual Agronomy Archive',
    pageSubtitle: 'A visual journey across agricultural rhythms in Karnataka—from fertile seedbed preparation and precision irrigation to mechanized harvesting and dry post-harvest storage.',
    gridColumns: 4,
    allowDownload: true,
    showCaptions: true,
  };

  return NextResponse.json({
    success: true,
    count: items.length,
    data: items,
    settings,
  });
}
