import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const warehouses = devDb.getWarehouses();
    return NextResponse.json({ success: true, data: warehouses });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.code) {
      return NextResponse.json({ success: false, message: 'Name and Code are required.' }, { status: 400 });
    }
    const data = (devDb as any).data;
    if (!data.warehouses) data.warehouses = [];
    const now = new Date().toISOString();

    const existingIndex = data.warehouses.findIndex((w: any) => w.id === body.id || w.code === body.code);
    if (existingIndex >= 0) {
      data.warehouses[existingIndex] = {
        ...data.warehouses[existingIndex],
        ...body,
      };
      try { (devDb as any).save?.(); } catch {}
      return NextResponse.json({ success: true, data: data.warehouses[existingIndex] });
    } else {
      const newWh = {
        id: body.id || `wh-${body.code.toLowerCase()}`,
        name: body.name,
        code: body.code.toUpperCase(),
        latitude: body.latitude || 15.3647,
        longitude: body.longitude || 75.124,
        serviceRadiusKm: body.serviceRadiusKm || 80,
        servicedPincodes: body.servicedPincodes || '580020, 580021, 580023',
        address: body.address || 'Industrial Area, Karnataka',
        managerName: body.managerName || 'Hub Manager',
        contactNumber: body.contactNumber || '9480188000',
        isActive: body.isActive !== undefined ? body.isActive : true,
        createdAt: now,
      };
      data.warehouses.push(newWh);
      try { (devDb as any).save?.(); } catch {}
      return NextResponse.json({ success: true, data: newWh });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
