import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || searchParams.get('slug');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID or slug is required.' },
        { status: 400 }
      );
    }

    const product = devDb.getRentalProductById(productId) || devDb.getRentalProductBySlug(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Rental equipment not found.' },
        { status: 404 }
      );
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
