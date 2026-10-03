import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const bookings = (devDb as any).data?.rentalBookings || [];
    const rental = bookings.find((b: any) => b.id === id || b.bookingNumber === id);
    if (!rental) {
      return NextResponse.json({ success: false, error: 'Rental booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rental });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const bookings = (devDb as any).data?.rentalBookings || [];
    const booking = bookings.find((b: any) => b.id === id || b.bookingNumber === id);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Rental booking not found' }, { status: 404 });
    }

    Object.assign(booking, body, { updatedAt: new Date().toISOString() });
    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Rental booking updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
