import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { assignNearestWarehouse } from '@/lib/warehouse-assignment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerMobile, items, shippingAddress, paymentMethod } = body;

    const warehouseAssignment = assignNearestWarehouse(
      shippingAddress?.gpsLatitude,
      shippingAddress?.gpsLongitude,
      shippingAddress?.pincode
    );

    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const orderNumber = 'AGM-2026-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
      id: 'ord-' + Date.now(),
      orderNumber,
      userId: 'usr-guest',
      customerName,
      customerMobile,
      items,
      totalAmount: subtotal + warehouseAssignment.deliveryFee,
      discountAmount: 0,
      deliveryFee: warehouseAssignment.deliveryFee,
      status: 'CONFIRMED' as const,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: 'PAID' as const,
      assignedWarehouseId: warehouseAssignment.assignedWarehouse.id,
      assignedWarehouseName: warehouseAssignment.assignedWarehouse.name,
      assignmentMode: 'AUTO' as const,
      shippingAddress,
      trackingNumber: 'TRK-AM-' + Math.floor(100000 + Math.random() * 900000),
      courierName: 'AgriMart Rural Express',
      createdAt: new Date().toISOString(),
    };

    dataStore.orders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Order creation failed' },
      { status: 400 }
    );
  }
}
