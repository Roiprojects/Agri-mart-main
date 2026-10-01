import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    
    const allUsers = (devDb as any).data?.users || [];
    let orders = devDb.getOrders();
    
    if (status && status !== 'ALL') {
      orders = orders.filter((o) => o.status === status);
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      orders = orders.filter((o) => o.paymentStatus === paymentStatus);
    }
    
    const enriched = orders.map((o) => {
      const user = allUsers.find((u: any) => u.id === o.userId);
      const orderItems = (devDb as any).data?.orderItems?.filter((i: any) => i.orderId === o.id) || [];
      return {
        ...o,
        customerName: user?.name || 'Customer',
        customerMobile: user?.mobile || '',
        customerEmail: user?.email || '',
        itemCount: orderItems.length || 1,
      };
    });
    
    return NextResponse.json({ success: true, data: enriched, total: enriched.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
