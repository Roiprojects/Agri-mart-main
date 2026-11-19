import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || searchParams.get('slug');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const fallbackTotalUnits = Math.max(1, Number(searchParams.get('totalUnits')) || 3);

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID or slug is required.' },
        { status: 400 }
      );
    }

    const product = devDb.getRentalProductById(productId) || devDb.getRentalProductBySlug(productId);
    if (!product) {
      // Fallback for client-created/synced rental equipment (e.g. stored in localStorage on Vercel)
      const activeBookings = devDb.getRentalBookings().filter(
        (b) =>
          b.rentalProductId === productId &&
          ['PENDING_APPROVAL', 'APPROVED', 'ACTIVE'].includes(b.status)
      );

      if (!startDate || !endDate) {
        return NextResponse.json({
          success: true,
          data: {
            product: { id: productId, totalUnits: fallbackTotalUnits },
            totalUnits: fallbackTotalUnits,
            activeBookings: activeBookings.map((b) => ({
              bookingNumber: b.bookingNumber,
              startDate: b.startDate,
              endDate: b.endDate,
              status: b.status,
            })),
          },
        });
      }

      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();
      const overlapping = activeBookings.filter((b) => {
        const bStart = new Date(b.startDate).getTime();
        const bEnd = new Date(b.endDate).getTime();
        return startMs <= bEnd && endMs >= bStart;
      });
      const remainingUnits = Math.max(0, fallbackTotalUnits - overlapping.length);

      return NextResponse.json({
        success: true,
        data: {
          productTitle: productId,
          startDate,
          endDate,
          isAvailable: remainingUnits > 0,
          remainingUnits,
          totalUnits: fallbackTotalUnits,
          activeBookingsCount: overlapping.length,
        },
      });
    }

    if (!startDate || !endDate) {
      // Just return overall inventory info and existing bookings for calendar rendering
      const bookings = devDb.getRentalBookings().filter(
        (b) => b.rentalProductId === product.id && ['PENDING_APPROVAL', 'APPROVED', 'ACTIVE'].includes(b.status)
      );

      return NextResponse.json({
        success: true,
        data: {
          product,
          totalUnits: product.totalUnits,
          activeBookings: bookings.map((b) => ({
            bookingNumber: b.bookingNumber,
            startDate: b.startDate,
            endDate: b.endDate,
            status: b.status,
          })),
        },
      });
    }

    // Availability conflict check for given date range
    const result = devDb.checkRentalAvailability(product.id, startDate, endDate);

    return NextResponse.json({
      success: true,
      data: {
        productTitle: product.title,
        startDate,
        endDate,
        ...result,
      },
    });
  } catch (error: any) {
    console.error('[API_RENTAL_AVAILABILITY] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error checking availability.' },
      { status: 500 }
    );
  }
}
