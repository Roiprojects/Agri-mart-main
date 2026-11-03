import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const order = devDb.getOrderWithDetails(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const orders = (devDb as any).data?.orders || [];
    const order = orders.find((o: any) => o.id === id || o.orderNumber === id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    if (body.status) order.status = body.status;
    if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
    if (body.trackingNumber !== undefined) order.trackingNumber = body.trackingNumber;
    if (body.courierName !== undefined) order.courierName = body.courierName;
    if (body.assignedWarehouseId) order.assignedWarehouseId = body.assignedWarehouseId;
    order.updatedAt = new Date().toISOString();
    
    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, data: order, message: 'Order updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
