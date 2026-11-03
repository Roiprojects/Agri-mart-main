import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface MediaSettingsData {
  // Common
  pictureStorageTarget: string;
  maximumImageSize: number;
  multipleThumbDirectories: boolean;
  defaultImageQuality: number;
  importProductImagesUsingHash: boolean;
  pictureZoom: boolean;
  allowSvgUploadsInAdminArea: boolean;

  // Product
  productDetailImageSize: number;
  productThumbnailImageSizeCatalog: number;
  productThumbnailImageSizeProductPage: number;
  associatedProductImageSize: number;
  defaultImageUrl: string;

  // Other pages
  categoryThumbnailImageSize: number;
  manufacturerThumbnailImageSize: number;
  vendorThumbnailImageSize: number;
  cartWishlistThumbnailImageSize: number;
  orderThumbnailImageSize: number;
  miniShoppingCartThumbnailImageSize: number;
  avatarImageSize: number;

  // Mode
  isAdvanced: boolean;
}

const DEFAULT_MEDIA_SETTINGS: MediaSettingsData = {
  pictureStorageTarget: 'database',
  maximumImageSize: 1920,
  multipleThumbDirectories: false,
  defaultImageQuality: 80,
  importProductImagesUsingHash: true,
  pictureZoom: false,
  allowSvgUploadsInAdminArea: false,

  productDetailImageSize: 750,
  productThumbnailImageSizeCatalog: 400,
  productThumbnailImageSizeProductPage: 750,
  associatedProductImageSize: 350,
  defaultImageUrl: '',

  categoryThumbnailImageSize: 600,
  manufacturerThumbnailImageSize: 300,
  vendorThumbnailImageSize: 300,
  cartWishlistThumbnailImageSize: 90,
  orderThumbnailImageSize: 80,
  miniShoppingCartThumbnailImageSize: 70,
  avatarImageSize: 120,

  isAdvanced: true,
};

export async function GET() {
  try {
    const db = readDb();
    const mediaSettings = db.mediaSettings || DEFAULT_MEDIA_SETTINGS;
    return NextResponse.json({
      success: true,
      data: { ...DEFAULT_MEDIA_SETTINGS, ...mediaSettings },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch media settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    const current = db.mediaSettings || DEFAULT_MEDIA_SETTINGS;
    const updated = {
      ...current,
      ...body,
    };
    db.mediaSettings = updated;
    const success = writeDb(db);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to write media settings to database' },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Media settings saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to save media settings' },
      { status: 500 }
    );
  }
}
