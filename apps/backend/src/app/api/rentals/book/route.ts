import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { validatePhoneNumber, validateEmailOptional, validatePinCode } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
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
      rentalBasis = 'DAILY',
      totalHours,
      preferredTimeSlot,
      startDate,
      endDate,
      userId,
      customerName,
      customerMobile,
      customerEmail,
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

    const existingRentalMobiles = devDb
      .getRentalBookings()
      .map((b) => b.customerMobile || '')
      .filter(Boolean);

    const phoneValidation = validatePhoneNumber(customerMobile, existingRentalMobiles);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error },
        { status: 400 }
      );
    }

    const emailValidation = validateEmailOptional(customerEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      );
    }

    const pinValidation = validatePinCode(pincode);
    if (!pinValidation.valid) {
      return NextResponse.json(
        { success: false, error: pinValidation.error },
        { status: 400 }
      );
    }

    const cleanMobile = phoneValidation.cleaned!;
    const savedUser = devDb.saveUser({
      name: String(customerName).trim(),
      mobile: cleanMobile,
      email: emailValidation.cleaned || undefined,
      role: 'CUSTOMER',
      isVerified: true,
    });
    const resolvedUserId = userId || savedUser.id;

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
    const hourlyRate = (product as any).hourlyRate || Math.max(50, Math.round(product.dailyRate / 6));

    // Tiered rate calculation (supports HOURLY as well as DAILY / WEEKLY / MONTHLY)
    let pricingTier: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY';
    let rentAmount = product.dailyRate * totalDays;
    const hoursCount = Math.max(1, Number(totalHours) || 1);

    if (rentalBasis === 'HOURLY') {
      pricingTier = 'HOURLY';
      rentAmount = hourlyRate * hoursCount;
    } else if (totalDays >= 30) {
      pricingTier = 'MONTHLY';
      rentAmount = Math.round(product.monthlyRate * (totalDays / 30));
    } else if (totalDays >= 7) {
      pricingTier = 'WEEKLY';
      rentAmount = Math.round(product.weeklyRate * (totalDays / 7));
    }

    const securityDeposit = product.securityDeposit;
    const totalPaid = rentAmount + securityDeposit;

    // Call atomic reservation & capacity check
    const isCod = paymentMethod === 'COD';
    const bookingResult = devDb.createRentalBooking({
      rentalProductId: product.id,
      productTitle: product.title,
      userId: resolvedUserId,
      customerName: String(customerName).trim(),
      customerMobile: cleanMobile,
      deliveryAddress: deliveryAddress || 'Doorstep Delivery to Farm Parcel',
      pincode: pinValidation.cleaned!,
      warehouseId,
      startDate,
      endDate,
      totalDays: rentalBasis === 'HOURLY' ? 1 : totalDays,
      rentalBasis: rentalBasis === 'HOURLY' ? 'HOURLY' : 'DAILY',
      totalHours: rentalBasis === 'HOURLY' ? hoursCount : undefined,
      hourlyRate: rentalBasis === 'HOURLY' ? hourlyRate : undefined,
      preferredTimeSlot: preferredTimeSlot || undefined,
      pricingTier,
      dailyRate: product.dailyRate,
      rentAmount,
      securityDeposit,
      totalPaid: isCod ? 0 : totalPaid,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: isCod ? 'PENDING' : 'PAID',
      paymentId: isCod ? `cod_rnt_${Date.now()}` : `pay_rnt_sandbox_${Date.now()}`,
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
