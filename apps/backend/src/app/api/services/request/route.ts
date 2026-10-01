import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { getServiceById } from '@/lib/services-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr-farmer-01';
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
      userId = 'usr-farmer-01',
      customerName,
      customerMobile,
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
      advancePaid = 0,
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

    const serviceDef = getServiceById(serviceId);
    const serviceName = serviceDef ? serviceDef.name : serviceId;

    // Calculate estimated cost
    let estimatedCost = 0;
    if (serviceDef) {
      if (jobWorkId) {
        const jw = serviceDef.jobWorkTypes.find((j) => j.id === jobWorkId);
        if (jw) {
          estimatedCost = jw.rate * Number(farmAcreage);
        } else {
          estimatedCost = serviceDef.baseRatePerAcre * Number(farmAcreage);
        }
      } else {
        estimatedCost = serviceDef.baseRatePerAcre * Number(farmAcreage);
      }
    }

    const created = devDb.createServiceRequest({
      userId,
      customerName,
      customerMobile,
      serviceId,
      serviceName,
      jobWorkId,
      jobWorkName,
      farmAcreage: Number(farmAcreage),
      cropType,
      district,
      taluk,
      village,
      address,
      pincode,
      gpsLatitude: Number(gpsLatitude),
      gpsLongitude: Number(gpsLongitude),
      preferredDate,
      preferredTime,
      notes,
      photoUrl,
      estimatedCost,
      advancePaid: Number(advancePaid) || 0,
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
