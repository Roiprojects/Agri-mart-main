import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { getServiceById } from '@/lib/services-data';
import { validatePhoneNumber, validateEmailOptional, validatePinCode } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const status = searchParams.get('status') || undefined;

    const requests = devDb.getServiceRequests({ userId, status });
    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching service requests.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      jobWorkId,
      jobWorkName,
      userId,
      customerName,
      customerMobile,
      customerEmail,
      bookingBasis = 'ACRE',
      bookingHours = 2,
      farmAcreage = 1,
      cropType = 'General Crops',
      district = 'Mandya',
      taluk = 'Mandya',
      village = 'Kothathi',
      address,
      pincode = '571401',
      gpsLatitude = 12.5218,
      gpsLongitude = 76.8951,
      preferredDate,
      preferredTime = '08:00 AM - 12:00 PM',
      notes = '',
      photoUrl = '',
      paymentMethod = 'UPI',
    } = body;

    if (!serviceId || !customerName || !customerMobile || !address || !preferredDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing mandatory fields: serviceId, customerName, customerMobile, address, preferredDate.',
        },
        { status: 400 }
      );
    }

    const existingServiceMobiles = devDb
      .getServiceRequests()
      .map((s) => s.customerMobile || '')
      .filter(Boolean);

    const phoneValidation = validatePhoneNumber(customerMobile, existingServiceMobiles);
    if (!phoneValidation.valid) {
      return NextResponse.json({ success: false, error: phoneValidation.error }, { status: 400 });
    }

    const emailValidation = validateEmailOptional(customerEmail);
    if (!emailValidation.valid) {
      return NextResponse.json({ success: false, error: emailValidation.error }, { status: 400 });
    }

    const pinValidation = validatePinCode(pincode);
    if (!pinValidation.valid) {
      return NextResponse.json({ success: false, error: pinValidation.error }, { status: 400 });
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

    const serviceDef = getServiceById(serviceId);
    const serviceName = serviceDef ? serviceDef.name : serviceId;

    // Calculate estimated cost (Hourly Basis or Acre/Unit Basis)
    let estimatedCost = 0;
    const isHourly = bookingBasis === 'HOURLY';
    const resolvedHours = Math.max(1, Number(bookingHours) || 1);
    if (serviceDef) {
      let baseRate = serviceDef.baseRatePerAcre;
      if (jobWorkId) {
        const jw = serviceDef.jobWorkTypes.find((j) => j.id === jobWorkId);
        if (jw) baseRate = jw.rate;
      }
      if (isHourly) {
        const hourlyRate = Math.max(200, Math.round(baseRate * 0.65));
        estimatedCost = hourlyRate * resolvedHours;
      } else {
        estimatedCost = baseRate * Number(farmAcreage);
      }
    }

    const isCod = paymentMethod === 'COD';
    const created = devDb.createServiceRequest({
      userId: resolvedUserId,
      customerName: String(customerName).trim(),
      customerMobile: cleanMobile,
      serviceId,
      serviceName,
      jobWorkId,
      jobWorkName,
      bookingBasis: isHourly ? 'HOURLY' : 'ACRE',
      bookingHours: isHourly ? resolvedHours : undefined,
      farmAcreage: Number(farmAcreage),
      cropType,
      district,
      taluk,
      village,
      address: String(address).trim(),
      pincode: pinValidation.cleaned!,
      gpsLatitude: Number(gpsLatitude),
      gpsLongitude: Number(gpsLongitude),
      preferredDate,
      preferredTime,
      notes,
      photoUrl,
      estimatedCost,
      advancePaid: isCod ? 0 : estimatedCost,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: isCod ? 'PENDING' : 'PAID',
      status: 'REQUESTED',
    });

    return NextResponse.json(
      {
        success: true,
        message: `Service request #${created.requestNumber} forwarded to Super Admin Portal with GPS coordinates (${gpsLatitude}, ${gpsLongitude}).`,
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API_SERVICE_REQUEST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error creating service request.' },
      { status: 500 }
    );
  }
}
