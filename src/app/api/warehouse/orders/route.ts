import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId');
    const allOrders = devDb.getOrders();

    // Data isolation: If warehouseId provided, filter strictly to this hub
    let filtered = allOrders;
    if (warehouseId && warehouseId !== 'all') {
      filtered = allOrders.filter(
        (o) =>
          o.assignedWarehouseId === warehouseId ||
          (o.isSplitOrder && o.splitShipments?.some((s) => s.warehouseId === warehouseId))
      );
    }

    const enriched = filtered.map((ord) => devDb.getOrderWithDetails(ord.id));
    return NextResponse.json({ success: true, count: enriched.length, orders: enriched });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, orderId, warehouseId, operatorName, reason, courierName, trackingNumber, estimatedDeliveryDate } = body;

    if (!orderId || !action) {
      return NextResponse.json({ success: false, error: 'orderId and action are required' }, { status: 400 });
    }

    if (action === 'ACCEPT') {
      const result = devDb.acceptWarehouseOrder(orderId, warehouseId || 'wh-hubballi', operatorName || 'Warehouse Dispatch Desk');
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'REJECT') {
      if (!reason) {
        return NextResponse.json({ success: false, error: 'Rejection reason is required' }, { status: 400 });
      }
      const result = devDb.rejectWarehouseOrder(orderId, warehouseId || 'wh-hubballi', reason);
      return NextResponse.json(result, { status: 200 }); // always return 200 with recovery payload
    }

    if (action === 'DISPATCH') {
      if (!courierName || !trackingNumber) {
        return NextResponse.json({ success: false, error: 'courierName and trackingNumber are required for dispatch' }, { status: 400 });
      }
      const result = devDb.dispatchShipment({
        orderId,
        warehouseId: warehouseId || 'wh-hubballi',
        courierName,
        trackingNumber,
        estimatedDeliveryDate,
      });
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'DELIVER') {
      const result = devDb.updateDeliveryMilestone(orderId, 'DELIVERED', 'Customer Farm Gate', 'Physical delivery verified with customer');
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
