import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const requests = devDb.getServiceRequests();
    const stats = {
      total: requests.length,
      requested: requests.filter((r) => r.status === 'REQUESTED').length,
      assigned: requests.filter((r) => r.status === 'ASSIGNED').length,
      inProgress: requests.filter((r) => r.status === 'IN_PROGRESS').length,
      completed: requests.filter((r) => r.status === 'COMPLETED').length,
      cancelled: requests.filter((r) => r.status === 'CANCELLED').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        requests,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching admin services.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, error: 'Request ID and new status are required.' },
        { status: 400 }
      );
    }

    const updated = devDb.updateServiceRequestStatus(requestId, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Service request not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Request #${updated.requestNumber} transitioned to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating service status.' },
      { status: 500 }
    );
  }
}
