import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      actualReturnDate = new Date().toISOString().split('T')[0],
      condition = 'ON_TIME', // ON_TIME | LATE | DAMAGED
      damageNotes = '',
      damageCharge = 0,
    } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required.' },
        { status: 400 }
      );
    }

    const booking = devDb.getRentalBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Rental booking not found.' },
        { status: 404 }
      );
    }

    const updated = devDb.processRentalReturn(booking.id, {
      actualReturnDate,
      condition,
      damageNotes,
      damageCharge: Number(damageCharge) || 0,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to process machine return.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rental equipment return processed successfully!',
      data: updated,
    });
  } catch (error: any) {
    console.error('[API_RENTAL_RETURN] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing return.' },
      { status: 500 }
    );
  }
}
