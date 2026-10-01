import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      requestId,
      providerId = 'prv-assigned-01',
      providerName,
      operatorMobile,
      fleetUnit = 'Standard Tractor/Equipment Unit',
    } = body;

    if (!requestId || !providerName || !operatorMobile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required assignment fields: requestId, providerName, operatorMobile.',
        },
        { status: 400 }
      );
    }

    const assigned = devDb.assignServiceProvider(requestId, {
      providerId,
      providerName,
      operatorMobile,
      fleetUnit,
    });

    if (!assigned) {
      return NextResponse.json(
        { success: false, error: 'Service request not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Request #${assigned.requestNumber} successfully assigned to ${providerName}!`,
      data: assigned,
    });
  } catch (error: any) {
    console.error('[API_SERVICE_ASSIGN] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error assigning service provider.' },
      { status: 500 }
    );
  }
}
