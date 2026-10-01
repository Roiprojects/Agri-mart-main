import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const bookings = devDb.getRentalBookings();
    const products = devDb.getRentalProducts();

    const inventoryStats = products.map((prod) => {
      const activeBookings = bookings.filter(
        (b) => b.rentalProductId === prod.id && ['PENDING_APPROVAL', 'APPROVED', 'ACTIVE'].includes(b.status)
      );
      return {
        id: prod.id,
        title: prod.title,
        totalUnits: prod.totalUnits,
        inUseUnits: activeBookings.length,
        availableUnits: Math.max(0, prod.totalUnits - activeBookings.length),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        inventoryStats,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching admin rentals.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and new status are required.' },
        { status: 400 }
      );
    }

    const updated = devDb.updateRentalStatus(bookingId, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Booking not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking #${updated.bookingNumber} transitioned to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating rental status.' },
      { status: 500 }
    );
  }
}
