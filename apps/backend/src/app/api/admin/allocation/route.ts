import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const order = devDb.getOrderWithDetails(orderId);
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        order,
        auditLogs: order.assignmentAuditLogs || [],
        rejectionHistory: order.rejectionHistory || [],
        splitShipments: order.splitShipments || [],
      });
    }

    // Return all orders requiring allocation attention (held or unallocated)
    const all = devDb.getOrders();
    const allocationQueue = all.map((o) => devDb.getOrderWithDetails(o.id));
    return NextResponse.json({ success: true, count: allocationQueue.length, queue: allocationQueue });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, orderId, newWarehouseId, splitPlan, isHold, reason, changedBy } = body;

    if (!orderId || !action) {
      return NextResponse.json({ success: false, error: 'orderId and action are required' }, { status: 400 });
    }

    if (action === 'REASSIGN') {
      if (!newWarehouseId) {
        return NextResponse.json({ success: false, error: 'newWarehouseId is required for REASSIGN' }, { status: 400 });
      }
      const result = devDb.reassignWarehouse(
        orderId,
        newWarehouseId,
        reason || 'Super Admin manual routing override',
        changedBy || 'Super Admin'
      );
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'SPLIT_ORDER') {
      if (!splitPlan || !Array.isArray(splitPlan) || splitPlan.length < 2) {
        return NextResponse.json({ success: false, error: 'splitPlan with at least 2 destinations is required' }, { status: 400 });
      }
      const result = devDb.splitOrderAcrossWarehouses(
        orderId,
        splitPlan,
        changedBy || 'Super Admin'
      );
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'HOLD') {
      const result = devDb.setOrderAllocationHold(
        orderId,
        isHold ?? true,
        reason || 'Admin review pending',
        changedBy || 'Super Admin'
      );
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
