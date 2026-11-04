import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';
import { SERVICES_CATALOGUE, ServiceDefinition, SERVICE_DEFAULT_IMAGES } from '@/lib/services-data';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const db = readDb();
    if (!db.services || !Array.isArray(db.services) || db.services.length === 0) {
      db.services = JSON.parse(JSON.stringify(SERVICES_CATALOGUE));
      writeDb(db);
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let services: ServiceDefinition[] = db.services.map((s: ServiceDefinition) => ({
      ...s,
      image: s.image || s.imageUrl || SERVICE_DEFAULT_IMAGES[s.id] || '/images/gallery/03-tractor-soil.jpg',
      imageUrl: s.imageUrl || s.image || SERVICE_DEFAULT_IMAGES[s.id] || '/images/gallery/03-tractor-soil.jpg',
    }));

    if (slug) {
      const found = services.find((s) => s.slug === slug);
      if (!found) {
        return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, service: found });
    }

    if (category && category !== 'All') {
      services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      services,
      total: services.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = readDb();
    if (!db.services) {
      db.services = JSON.parse(JSON.stringify(SERVICES_CATALOGUE));
    }

    const body = await request.json();
    const newService: ServiceDefinition = {
      id: body.id || `srv-${Date.now()}`,
      slug: body.slug || (body.name || 'new-service').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: body.name || 'New Service',
      nameKn: body.nameKn || '',
      category: body.category || 'Agricultural Mechanization',
      badge: body.badge || 'New',
      iconName: body.iconName || 'Wrench',
      image: body.image || body.imageUrl || '/images/gallery/03-tractor-soil.jpg',
      imageUrl: body.imageUrl || body.image || '/images/gallery/03-tractor-soil.jpg',
      baseRatePerAcre: Number(body.baseRatePerAcre) || 1000,
      equipmentUsed: body.equipmentUsed || 'Standard Machinery',
      timeEstimate: body.timeEstimate || '1.0 to 2.0 hours / acre',
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      jobWorkTypes: body.jobWorkTypes || [],
      faq: body.faq || [],
    };

    db.services.push(newService);
    writeDb(db);
    try { await revalidateFrontendPath('/services'); await revalidateFrontendPath('/'); } catch {}

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      service: newService,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create service' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const db = readDb();
    if (!db.services) {
      db.services = JSON.parse(JSON.stringify(SERVICES_CATALOGUE));
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
    }

    const index = db.services.findIndex((s: ServiceDefinition) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    db.services[index] = {
      ...db.services[index],
      ...updates,
    };

    writeDb(db);
    try { await revalidateFrontendPath('/services'); await revalidateFrontendPath('/'); } catch {}

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      service: db.services[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = readDb();
    if (!db.services) {
      db.services = JSON.parse(JSON.stringify(SERVICES_CATALOGUE));
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
    }

    const initialLen = db.services.length;
    db.services = db.services.filter((s: ServiceDefinition) => s.id !== id);

    if (db.services.length === initialLen) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    writeDb(db);
    try { await revalidateFrontendPath('/services'); await revalidateFrontendPath('/'); } catch {}

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete service' },
      { status: 500 }
    );
  }
}
