import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

interface PickupPointProviderItem {
  id: string;
  friendlyName: string;
  systemName: string;
  displayOrder: number;
  isActive: boolean;
  config?: Record<string, any>;
}

interface PickupPointItem {
  id: string;
  providerId: string;
  name: string;
  description: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  zipPostalCode: string;
  openingHours: string;
  pickupFee: number;
}

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for pickup points:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for pickup points:', err);
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const providerId = searchParams.get('providerId');

    const db = readDb();

    // If requesting specific pickup point locations
    if (type === 'locations' || type === 'points') {
      let points: PickupPointItem[] = db.pickupPoints || [];
      if (providerId) {
        points = points.filter((p) => String(p.providerId) === String(providerId));
      }
      return NextResponse.json({
        success: true,
        data: points,
        total: points.length,
      });
    }

    // Default: return pickup point providers
    const providers: PickupPointProviderItem[] = (db.pickupPointProviders || []).sort(
      (a: PickupPointProviderItem, b: PickupPointProviderItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );

    // Attach points count to each provider
    const allPoints: PickupPointItem[] = db.pickupPoints || [];
    const providersWithPoints = providers.map((prov) => ({
      ...prov,
      pointsCount: allPoints.filter((pt) => String(pt.providerId) === String(prov.id)).length,
    }));

    return NextResponse.json({
      success: true,
      data: providersWithPoints,
      total: providers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch pickup point providers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    let providers: PickupPointProviderItem[] = db.pickupPointProviders || [];
    let points: PickupPointItem[] = db.pickupPoints || [];

    // Action: Save configuration
    if (body.action === 'saveConfig') {
      const { id, config } = body;
      const index = providers.findIndex((p) => String(p.id) === String(id));
      if (index === -1) {
        return NextResponse.json(
          { success: false, message: 'Provider not found' },
          { status: 404 }
        );
      }
      providers[index].config = {
        ...(providers[index].config || {}),
        ...config,
      };
      db.pickupPointProviders = providers;
      writeDb(db);

      return NextResponse.json({
        success: true,
        message: 'Provider configuration updated successfully.',
        data: providers[index],
      });
    }

    // Action: Add new pickup point location
    if (body.action === 'addLocation') {
      const { providerId, name, description, address1, city, state, country, zipPostalCode, openingHours, pickupFee } = body;
      if (!name || !name.trim()) {
        return NextResponse.json({ success: false, message: 'Location name is required' }, { status: 400 });
      }

      const newPoint: PickupPointItem = {
        id: `pt-${Date.now()}`,
        providerId: String(providerId || '1'),
        name: name.trim(),
        description: description?.trim() || '',
        address1: address1?.trim() || '',
        city: city?.trim() || 'Hubballi',
        state: state?.trim() || 'Karnataka',
        country: country?.trim() || 'India',
        zipPostalCode: zipPostalCode?.trim() || '580020',
        openingHours: openingHours?.trim() || 'Mon-Sat 8:00 AM - 8:00 PM',
        pickupFee: parseFloat(String(pickupFee)) || 0,
      };

      points.push(newPoint);
      db.pickupPoints = points;
      writeDb(db);

      return NextResponse.json({
        success: true,
        message: 'New pickup point added successfully.',
        data: newPoint,
      });
    }

    // Action: Delete a pickup point location
    if (body.action === 'deleteLocation') {
      const { pointId } = body;
      points = points.filter((p) => String(p.id) !== String(pointId));
      db.pickupPoints = points;
      writeDb(db);

      return NextResponse.json({
        success: true,
        message: 'Pickup point deleted successfully.',
      });
    }

    // Fallback: Create provider
    const { friendlyName, systemName, displayOrder, isActive, config } = body;
    if (!friendlyName || !systemName) {
      return NextResponse.json(
        { success: false, message: 'Friendly name and system name are required' },
        { status: 400 }
      );
    }

    const newProvider: PickupPointProviderItem = {
      id: String(Date.now()),
      friendlyName: friendlyName.trim(),
      systemName: systemName.trim(),
      displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0,
      isActive: Boolean(isActive),
      config: config || {},
    };

    providers.push(newProvider);
    db.pickupPointProviders = providers;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'New pickup point provider added successfully.',
      data: newProvider,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, displayOrder, isActive, friendlyName, systemName } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Provider ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const providers: PickupPointProviderItem[] = db.pickupPointProviders || [];
    const index = providers.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Provider not found' },
        { status: 404 }
      );
    }

    if (displayOrder !== undefined) {
      providers[index].displayOrder = typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0;
    }
    if (isActive !== undefined) {
      providers[index].isActive = Boolean(isActive);
    }
    if (friendlyName !== undefined) {
      providers[index].friendlyName = friendlyName.trim();
    }
    if (systemName !== undefined) {
      providers[index].systemName = systemName.trim();
    }

    db.pickupPointProviders = providers;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Pickup point provider updated successfully.',
      data: providers[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update provider' },
      { status: 500 }
    );
  }
}
