import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for warehouses:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for warehouses:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const warehouses = db.warehouses || [];
    return NextResponse.json({ success: true, data: warehouses });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: 'Warehouse Name is required.' }, { status: 400 });
    }

    const db = readDb();
    if (!db.warehouses) db.warehouses = [];
    const now = new Date().toISOString();

    const code = (body.code || `WH-${body.name.substring(0, 3).toUpperCase()}-01`).toUpperCase().trim();

    const existingIndex = db.warehouses.findIndex(
      (w: any) => (body.id && String(w.id) === String(body.id)) || (w.code && w.code.toUpperCase() === code && (!body.id || String(w.id) === String(body.id)))
    );

    if (existingIndex >= 0) {
      db.warehouses[existingIndex] = {
        ...db.warehouses[existingIndex],
        ...body,
        code,
        updatedAt: now,
      };
      writeDb(db);
      return NextResponse.json({
        success: true,
        message: 'The warehouse has been updated successfully.',
        data: db.warehouses[existingIndex],
      });
    } else {
      const newWh = {
        id: body.id || `wh-${Date.now()}`,
        name: body.name.trim(),
        code,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        email: body.email || '',
        company: body.company || '',
        country: body.country || 'India',
        stateProvince: body.stateProvince || 'Karnataka',
        county: body.county || '',
        city: body.city || 'Hubballi',
        address1: body.address1 || body.address || 'KIADB Industrial Area',
        address2: body.address2 || '',
        zipPostalCode: body.zipPostalCode || '580020',
        phoneNumber: body.phoneNumber || body.contactNumber || '9480188000',
        faxNumber: body.faxNumber || '',
        adminComment: body.adminComment || '',
        managerName: body.managerName || 'Operations Lead',
        contactNumber: body.contactNumber || body.phoneNumber || '9480188000',
        serviceRadiusKm: typeof body.serviceRadiusKm === 'number' ? body.serviceRadiusKm : parseInt(body.serviceRadiusKm, 10) || 75,
        servicedPincodes: body.servicedPincodes || '580020, 580021, 580023, 580024',
        addressLocation: body.addressLocation || body.address || 'Agri Logistics Zone, Karnataka',
        latitude: body.latitude || 15.3647,
        longitude: body.longitude || 75.124,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        createdAt: now,
      };
      db.warehouses.push(newWh);
      writeDb(db);
      return NextResponse.json({
        success: true,
        message: 'The new warehouse has been added successfully.',
        data: newWh,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Warehouse ID is required.' }, { status: 400 });
    }

    const db = readDb();
    const warehouses = db.warehouses || [];
    const filtered = warehouses.filter((w: any) => String(w.id) !== String(id));

    if (filtered.length === warehouses.length) {
      return NextResponse.json({ success: false, message: 'Warehouse not found.' }, { status: 404 });
    }

    db.warehouses = filtered;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'The warehouse has been deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
