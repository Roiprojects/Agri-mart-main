import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr-farmer-01';
    const status = searchParams.get('status') || undefined;

    const bookings = devDb.getRentalBookings({ userId, status });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching rental bookings.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      rentalProductId,
      startDate,
      endDate,
      userId = 'usr-farmer-01',
      customerName,
      customerMobile,
      deliveryAddress,
      pincode,
      paymentMethod = 'ONLINE_UPI',
      warehouseId = 'wh-hubballi',
    } = body;

    if (!rentalProductId || !startDate || !endDate || !customerName || !customerMobile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required booking fields (equipment, dates, name, mobile).',
        },
        { status: 400 }
      );
    }

    const product = devDb.getRentalProductById(rentalProductId) || devDb.getRentalProductBySlug(rentalProductId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Selected rental equipment not found.' },
        { status: 404 }
      );
    }

    // Calculate duration in days
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    if (endMs < startMs) {
      return NextResponse.json(
        { success: false, error: 'End date cannot be prior to start date.' },
        { status: 400 }
      );
    }

    const totalDays = Math.max(1, Math.round((endMs - startMs) / (1000 * 3600 * 24)) + 1);

    // Tiered rate calculation
    let pricingTier: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY';
    let rentAmount = product.dailyRate * totalDays;

    if (totalDays >= 30) {
      pricingTier = 'MONTHLY';
      rentAmount = Math.round(product.monthlyRate * (totalDays / 30));
    } else if (totalDays >= 7) {
      pricingTier = 'WEEKLY';
      rentAmount = Math.round(product.weeklyRate * (totalDays / 7));
    }

    const securityDeposit = product.securityDeposit;
    const totalPaid = rentAmount + securityDeposit;

    // Call atomic reservation & capacity check
    const bookingResult = devDb.createRentalBooking({
      rentalProductId: product.id,
      productTitle: product.title,
      userId,
      customerName,
      customerMobile,
      deliveryAddress: deliveryAddress || 'Doorstep Delivery to Farm Parcel',
      pincode: pincode || '571401',
      warehouseId,
      startDate,
      endDate,
      totalDays,
      pricingTier,
      dailyRate: product.dailyRate,
      rentAmount,
      securityDeposit,
      totalPaid,
      paymentMethod,
      paymentStatus: 'PAID', // In sandbox development mode
      paymentId: `pay_rnt_sandbox_${Date.now()}`,
      status: 'APPROVED', // Auto-approved for fast test/demo
    });

    if (!bookingResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: bookingResult.error,
          code: 'AVAILABILITY_CONFLICT',
        },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Rental booking reserved successfully!',
        data: bookingResult.booking,
        remainingUnits: bookingResult.remainingUnits,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API_RENTAL_BOOK] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error creating rental booking.' },
      { status: 500 }
    );
  }
}
