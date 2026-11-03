import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const allUsers = (devDb as any).data?.users || [];
    const orders = devDb.getOrders();

    const customers = allUsers
      .filter((u: any) => u.role !== 'ADMIN')
      .map((u: any) => {
        const userOrders = orders.filter((o: any) => o.userId === u.id);
        const totalSpent = userOrders
          .filter((o: any) => o.status === 'DELIVERED')
          .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
        return {
          id: u.id,
          name: u.name,
          mobile: u.mobile,
          email: u.email || '',
          role: u.role,
          isVerified: u.isVerified,
          createdAt: u.createdAt,
          orderCount: userOrders.length,
          totalSpent,
          lastOrderDate: userOrders[0]?.createdAt || null,
        };
      })
      .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({ success: true, data: customers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
