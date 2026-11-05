import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerName = searchParams.get('farmerName');
    const farmerId = searchParams.get('farmerId');
    const mobile = searchParams.get('mobile');

    if (farmerName || farmerId || mobile) {
      const query = farmerId || farmerName || mobile || '';
      const gallery = devDb.getFarmerCropGallery(query);
      if (gallery) {
        return NextResponse.json({ success: true, gallery });
      }
      // If not found, return empty gallery structure for this farmer
      return NextResponse.json({
        success: true,
        gallery: {
          id: `gallery-temp-${Date.now()}`,
          farmerId: farmerId || `farmer-${Date.now()}`,
          farmerName: farmerName || 'Farmer',
          mobileNumber: mobile || '',
          totalAcreage: 0,
          totalCropsCount: 0,
          crops: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const galleries = devDb.getFarmerCropGalleries();
    return NextResponse.json({ success: true, galleries, total: galleries.length });
  } catch (err: any) {
    console.error('[API_FARMER_CROP_GALLERY_GET] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      farmerName,
      farmerId,
      mobileNumber,
      totalAcreage,
      cropId,
      cropName,
      cropAcreage,
      variety,
      cropType,
      sectionId,
      sectionName,
      photo,
      allCropsSummary,
    } = body;

    if (!farmerName && !farmerId) {
      return NextResponse.json(
        { success: false, error: 'farmerName or farmerId is required' },
        { status: 400 }
      );
    }

    if (!photo || !photo.url) {
      return NextResponse.json(
        { success: false, error: 'photo.url is required' },
        { status: 400 }
      );
    }

    const { gallery, savedPhoto } = devDb.saveFarmerCropPhoto({
      farmerName: farmerName || 'Farmer',
      farmerId,
      mobileNumber,
      totalAcreage,
      cropId,
      cropName: cropName || 'General Crop',
      cropAcreage,
      variety,
      cropType,
      sectionId: sectionId || 'farmer-visit-photographs',
      sectionName: sectionName || 'Farmer Visit Photographs',
      photo,
      allCropsSummary,
    });

    // Also synchronize photograph reference into matching popForms in devDb
    try {
      const raw = devDb.getRawData() as any;
      if (Array.isArray(raw.popForms)) {
        const queryName = (farmerName || '').trim().toLowerCase();
        const cleanPhone = (mobileNumber || '').replace(/\D/g, '').slice(-10);

        raw.popForms.forEach((pop: any) => {
          const popName = (pop.name || '').trim().toLowerCase();
          const popPhone = (pop.mobileNumber || '').replace(/\D/g, '').slice(-10);
          const isFarmerMatch =
            (queryName && popName === queryName) ||
            (cleanPhone && popPhone === cleanPhone) ||
            (farmerId && pop.farmerId === farmerId);

          if (isFarmerMatch) {
            const isTargetCrop =
              !cropName ||
              (pop.crop && pop.crop.toLowerCase() === cropName.toLowerCase()) ||
              cropId === 'primary';

            if (isTargetCrop) {
              const targetKey = sectionId === 'pest-disease-tracking' ? 'problemFieldPhotos' : 'visitPhotographs';
              const existingList = String(pop[targetKey] || '')
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean);
              if (!existingList.includes(savedPhoto.fileName)) {
                existingList.unshift(savedPhoto.fileName);
              }
              pop[targetKey] = existingList.slice(0, 5).join(', ');
            }

            // Sync into cropLifecycleMap if present
            if (pop.cropLifecycleMap && cropId) {
              if (!pop.cropLifecycleMap[cropId]) {
                pop.cropLifecycleMap[cropId] = {};
              }
              const targetKey = sectionId === 'pest-disease-tracking' ? 'problemFieldPhotos' : 'visitPhotographs';
              const existingLcP = String(pop.cropLifecycleMap[cropId][targetKey] || '')
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean);
              if (!existingLcP.includes(savedPhoto.fileName)) {
                existingLcP.unshift(savedPhoto.fileName);
              }
              pop.cropLifecycleMap[cropId][targetKey] = existingLcP.slice(0, 5).join(', ');
            }
          }
        });
        devDb.save();
      }
    } catch (popSyncErr) {
      console.warn('[API_FARMER_CROP_GALLERY_POST] POP Form sync notice:', popSyncErr);
    }

    return NextResponse.json({
      success: true,
      gallery,
      savedPhoto,
      message: `Photograph saved successfully in database under ${gallery.farmerName} > ${cropName} > ${sectionName || 'Section'}`,
    });
  } catch (err: any) {
    console.error('[API_FARMER_CROP_GALLERY_POST] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save photograph' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerIdOrName = searchParams.get('farmerId') || searchParams.get('farmerName') || '';
    const cropId = searchParams.get('cropId') || '';
    const sectionId = searchParams.get('sectionId') || '';
    const photoId = searchParams.get('photoId') || '';

    if (!farmerIdOrName || !cropId || !sectionId || !photoId) {
      return NextResponse.json(
        { success: false, error: 'farmerId, cropId, sectionId, and photoId are required' },
        { status: 400 }
      );
    }

    const deleted = devDb.deleteFarmerCropPhoto(farmerIdOrName, cropId, sectionId, photoId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Photograph not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Photograph deleted from database successfully' });
  } catch (err: any) {
    console.error('[API_FARMER_CROP_GALLERY_DELETE] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete photograph' },
      { status: 500 }
    );
  }
}
