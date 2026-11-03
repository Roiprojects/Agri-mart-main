import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const products = devDb.getProducts({ onlyPublished: false });
    const categories = devDb.getCategories();
    const orders = devDb.getOrders();
    const warehouseStocks = (devDb as any).data?.warehouseStocks || [];
    const rentals = devDb.getRentalBookings();
    const services = devDb.getServiceRequests();

    // Revenue from delivered orders
    const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Monthly revenue (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthlyOrders = deliveredOrders.filter((o) => o.createdAt >= startOfMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Order status breakdown
    const statusCounts: Record<string, number> = {};
    for (const o of orders) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    }

    // Counts
    const pendingRentals = rentals.filter((r) => r.status === 'PENDING_APPROVAL').length;
    const activeRentals = rentals.filter((r) => r.status === 'ACTIVE').length;
    const pendingServices = services.filter((s) => s.status === 'REQUESTED').length;
    const publishedProducts = products.filter((p) => p.isPublished && !p.isDraft).length;
    const lowStockItems = warehouseStocks.filter((ws: any) => ws.quantity <= ws.reorderThreshold).length;

    // Customers (non-admin users from data)
    const allUsers = (devDb as any).data?.users || [];
    const totalCustomers = allUsers.filter((u: any) => u.role !== 'ADMIN').length;

    // Recent orders (last 10)
    const recentOrders = orders.slice(0, 10).map((o) => {
      const user = allUsers.find((u: any) => u.id === o.userId);
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.shippingAddress?.fullName || user?.name || 'Customer',
        customerMobile: o.shippingAddress?.mobile || user?.mobile || '',
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProducts: products.length,
          publishedProducts,
          totalCategories: categories.length,
          totalOrders: orders.length,
          totalRevenue,
          monthlyRevenue,
          totalCustomers,
          pendingRentals,
          activeRentals,
          pendingServices,
          lowStockItems,
        },
        orderStatusBreakdown: statusCounts,
        recentOrders,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
