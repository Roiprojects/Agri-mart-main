import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'usr-farmer-01';

  const addresses = devDb.getCustomerAddresses(userId);
  return NextResponse.json({ success: true, data: addresses });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = devDb.saveCustomerAddress(body);
    return NextResponse.json({ success: true, data: saved, message: 'Address saved successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId') || 'usr-farmer-01';

    if (!id) {
      return NextResponse.json({ success: false, message: 'Address ID is required.' }, { status: 400 });
    }

    const deleted = devDb.deleteCustomerAddress(id, userId);
    return NextResponse.json({ success: deleted, message: deleted ? 'Address removed.' : 'Address not found.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
