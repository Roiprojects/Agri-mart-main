import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const orderId = searchParams.get('id');

  if (orderId) {
    const details = devDb.getOrderWithDetails(orderId);
    if (!details) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: details });
  }

  const orders = devDb.getOrders(userId || undefined);
  const fullOrders = orders.map((o) => devDb.getOrderWithDetails(o.id));
  return NextResponse.json({ success: true, count: fullOrders.length, data: fullOrders });
}
