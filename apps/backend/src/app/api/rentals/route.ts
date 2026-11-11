import { NextResponse } from 'next/server';
import { devDb, readDb, writeDb, DbRentalProduct } from '@/lib/dev-db';
import { SEED_RENTAL_PRODUCTS } from '@/lib/seed-data';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const db = readDb();
    if (!db.rentalProducts || !Array.isArray(db.rentalProducts) || db.rentalProducts.length === 0) {
      db.rentalProducts = JSON.parse(JSON.stringify(SEED_RENTAL_PRODUCTS));
      writeDb(db);
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (slug) {
      const item = devDb.getRentalProductBySlug(slug);
      if (!item) {
        return NextResponse.json({ success: false, message: 'Rental product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: item, equipment: item });
    }

    if (id) {
      const item = devDb.getRentalProductById(id);
      if (!item) {
        return NextResponse.json({ success: false, message: 'Rental product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: item, equipment: item });
    }

    let items: DbRentalProduct[] = devDb.getRentalProducts();

    if (category && category !== 'All') {
      items = items.filter((r) => (r.category || '').toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          (r.title || '').toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (r.category || '').toLowerCase().includes(q) ||
          (r.powerRating || '').toLowerCase().includes(q) ||
          (r.suitableFor || '').toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      total: items.length,
      data: items,
      equipment: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch rental equipment' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = readDb();
    if (!db.rentalProducts || !Array.isArray(db.rentalProducts)) {
      db.rentalProducts = JSON.parse(JSON.stringify(SEED_RENTAL_PRODUCTS));
    }

    const body = await request.json();
    const title = (body.title || body.name || 'New Rent Equipment').trim();
    const slug =
      (body.slug || '').trim() ||
      title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const primaryImage =
      body.imageUrl ||
      body.image ||
      (Array.isArray(body.images) && body.images[0]) ||
      '/images/gallery/01-hero-tractor-sunrise.jpg';

    const images: string[] =
      Array.isArray(body.images) && body.images.length > 0
        ? body.images.filter(Boolean)
        : [primaryImage];

    const totalUnits = Math.max(1, Number(body.totalUnits) || 1);
    const availableUnits =
      body.availableUnits !== undefined && body.availableUnits !== ''
        ? Math.min(totalUnits, Math.max(0, Number(body.availableUnits)))
        : totalUnits;

    const dailyRate = Number(body.dailyRate) || 1200;
    const hourlyRate = Number(body.hourlyRate) || Math.round(dailyRate / 6);
    const weeklyRate = Number(body.weeklyRate) || dailyRate * 6;
    const monthlyRate = Number(body.monthlyRate) || dailyRate * 22;
    const securityDeposit = Number(body.securityDeposit) || 3000;

    const newEquipment: DbRentalProduct = {
      id: body.id || `rnt-${Date.now()}`,
      title,
      slug,
      category: body.category || 'Power Equipment',
      description: body.description || '',
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
      securityDeposit,
      images,
      powerRating: body.powerRating || '7 HP (4-Stroke)',
      suitableFor: body.suitableFor || 'All Field & Inter-Cultivation Crops',
      fuelType: body.fuelType || 'Petrol / Diesel',
      weightKg: Number(body.weightKg) || 85,
      totalUnits,
      availableUnits,
      specifications:
        body.specifications && typeof body.specifications === 'object'
          ? body.specifications
          : {
              'Engine / Power': body.powerRating || '7 HP (4-Stroke)',
              'Fuel Type': body.fuelType || 'Petrol / Diesel',
              'Suitable Crops': body.suitableFor || 'All Field & Inter-Cultivation Crops',
              'Machine Weight': `${Number(body.weightKg) || 85} kg`,
            },
      createdAt: body.createdAt || new Date().toISOString(),
    };

    db.rentalProducts.push(newEquipment);
    writeDb(db);
    try {
      await revalidateFrontendPath('/rentals');
      await revalidateFrontendPath(`/rentals/${newEquipment.slug}`);
      await revalidateFrontendPath('/');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Rent equipment created successfully',
      data: newEquipment,
      equipment: newEquipment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create rent equipment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const db = readDb();
    if (!db.rentalProducts || !Array.isArray(db.rentalProducts)) {
      db.rentalProducts = JSON.parse(JSON.stringify(SEED_RENTAL_PRODUCTS));
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    const index = db.rentalProducts.findIndex((r: DbRentalProduct) => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Rent equipment not found' },
        { status: 404 }
      );
    }

    const current = db.rentalProducts[index];
    const primaryImage =
      updates.imageUrl ||
      updates.image ||
      (Array.isArray(updates.images) && updates.images[0]) ||
      current.images?.[0] ||
      '/images/gallery/01-hero-tractor-sunrise.jpg';

    const images: string[] =
      Array.isArray(updates.images) && updates.images.length > 0
        ? updates.images.filter(Boolean)
        : [primaryImage];

    const updatedEquipment: DbRentalProduct = {
      ...current,
      ...updates,
      title: updates.title !== undefined ? updates.title : current.title,
      slug: updates.slug !== undefined ? updates.slug : current.slug,
      category: updates.category !== undefined ? updates.category : current.category,
      description: updates.description !== undefined ? updates.description : current.description,
      hourlyRate:
        updates.hourlyRate !== undefined ? Number(updates.hourlyRate) : current.hourlyRate,
      dailyRate: updates.dailyRate !== undefined ? Number(updates.dailyRate) : current.dailyRate,
      weeklyRate:
        updates.weeklyRate !== undefined ? Number(updates.weeklyRate) : current.weeklyRate,
      monthlyRate:
        updates.monthlyRate !== undefined ? Number(updates.monthlyRate) : current.monthlyRate,
      securityDeposit:
        updates.securityDeposit !== undefined
          ? Number(updates.securityDeposit)
          : current.securityDeposit,
      images,
      powerRating:
        updates.powerRating !== undefined ? updates.powerRating : current.powerRating,
      suitableFor:
        updates.suitableFor !== undefined ? updates.suitableFor : current.suitableFor,
      fuelType: updates.fuelType !== undefined ? updates.fuelType : current.fuelType,
      weightKg: updates.weightKg !== undefined ? Number(updates.weightKg) : current.weightKg,
      totalUnits:
        updates.totalUnits !== undefined ? Number(updates.totalUnits) : current.totalUnits,
      availableUnits:
        updates.availableUnits !== undefined
          ? Number(updates.availableUnits)
          : current.availableUnits,
      specifications:
        updates.specifications && typeof updates.specifications === 'object'
          ? updates.specifications
          : current.specifications,
    };

    db.rentalProducts[index] = updatedEquipment;
    writeDb(db);
    try {
      await revalidateFrontendPath('/rentals');
      await revalidateFrontendPath(`/rentals/${updatedEquipment.slug}`);
      await revalidateFrontendPath('/');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Rent equipment updated successfully',
      data: updatedEquipment,
      equipment: updatedEquipment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update rent equipment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = readDb();
    if (!db.rentalProducts || !Array.isArray(db.rentalProducts)) {
      db.rentalProducts = JSON.parse(JSON.stringify(SEED_RENTAL_PRODUCTS));
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    const initialLen = db.rentalProducts.length;
    db.rentalProducts = db.rentalProducts.filter((r: DbRentalProduct) => r.id !== id);

    if (db.rentalProducts.length === initialLen) {
      return NextResponse.json(
        { success: false, message: 'Rent equipment not found' },
        { status: 404 }
      );
    }

    writeDb(db);
    try {
      await revalidateFrontendPath('/rentals');
      await revalidateFrontendPath('/');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Rent equipment deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete rent equipment' },
      { status: 500 }
    );
  }
}
