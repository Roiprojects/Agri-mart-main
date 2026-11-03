import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const requests = (devDb as any).data?.serviceRequests || [];
    const requestItem = requests.find((s: any) => s.id === id || s.requestNumber === id);
    if (!requestItem) {
      return NextResponse.json({ success: false, error: 'Service request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: requestItem });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const requests = (devDb as any).data?.serviceRequests || [];
    const requestItem = requests.find((s: any) => s.id === id || s.requestNumber === id);
    if (!requestItem) {
      return NextResponse.json({ success: false, error: 'Service request not found' }, { status: 404 });
    }

    Object.assign(requestItem, body, { updatedAt: new Date().toISOString() });
    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({
      success: true,
      data: requestItem,
      message: 'Service request updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
