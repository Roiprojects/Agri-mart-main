'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  CalendarDays,
  Wrench,
  AlertTriangle,
  TrendingUp,
  Plus,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCustomers: number;
  pendingRentals: number;
  activeRentals: number;
  pendingServices: number;
  lowStockItems: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  orderStatusBreakdown: Record<string, number>;
  recentOrders: RecentOrder[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_COLOURS: Record<string, string> = {
  PLACED: 'bg-blue-50 text-blue-700 border border-blue-200',
  CONFIRMED: 'bg-sky-50 text-sky-700 border border-sky-200',
  PACKED: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  DISPATCHED: 'bg-purple-50 text-purple-700 border border-purple-200',
  OUT_FOR_DELIVERY: 'bg-amber-50 text-amber-700 border border-amber-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border border-rose-200',
  RETURNED: 'bg-orange-50 text-orange-700 border border-orange-200',
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-9 w-9 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-8 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t border-slate-100 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-slate-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message ?? 'Failed to load dashboard');
        setData(json.data as DashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xs">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={40} />
          <p className="text-red-900 font-bold text-lg mb-1">Dashboard failed to load</p>
          <p className="text-slate-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const breakdown = data?.orderStatusBreakdown ?? {};
  const recentOrders = data?.recentOrders ?? [];

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Real-time operations, dark warehouse allocations, and agronomy order metrics for AGRI MART MEGA.
        </p>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Core Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatsCard
                title="Total Products"
                value={stats?.totalProducts ?? 0}
                icon={Package}
                subtitle={`${stats?.publishedProducts ?? 0} published on shop`}
              />
              <StatsCard
                title="Total Orders"
                value={stats?.totalOrders ?? 0}
                icon={ShoppingCart}
                subtitle="All time bookings"
              />
              <StatsCard
                title="Total Revenue"
                value={formatCurrency(stats?.totalRevenue ?? 0)}
                icon={DollarSign}
                subtitle="Fulfilled deliveries"
              />
              <StatsCard
                title="Monthly Revenue"
                value={formatCurrency(stats?.monthlyRevenue ?? 0)}
                icon={TrendingUp}
                subtitle="Current billing cycle"
              />
              <StatsCard
                title="Total Customers"
                value={stats?.totalCustomers ?? 0}
                icon={Users}
                subtitle="Registered farmers"
              />
              <StatsCard
                title="Pending Rentals"
                value={stats?.pendingRentals ?? 0}
                icon={CalendarDays}
                subtitle={`${stats?.activeRentals ?? 0} active rentals`}
              />
              <StatsCard
                title="Pending Services"
                value={stats?.pendingServices ?? 0}
                icon={Wrench}
                subtitle="Awaiting technician allocation"
              />
              <StatsCard
                title="Low Stock Alerts"
                value={stats?.lowStockItems ?? 0}
                icon={AlertTriangle}
                subtitle="Items below safety limit"
                iconColor={stats?.lowStockItems && stats.lowStockItems > 0 ? 'text-red-600' : 'text-slate-500'}
                iconBg={stats?.lowStockItems && stats.lowStockItems > 0 ? 'bg-red-50 border border-red-200' : 'bg-slate-100'}
              />
            </>
          )}
        </div>
      </section>

      {/* ── Order Status Breakdown ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Order Pipeline Status
        </h2>
        {loading ? (
          <div className="flex flex-wrap gap-2.5 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-slate-200 rounded-lg" />
            ))}
          </div>
        ) : Object.keys(breakdown).length === 0 ? (
          <p className="text-slate-500 text-sm">No order pipeline data available.</p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(breakdown).map(([status, count]) => (
              <span
                key={status}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-2xs ${
                  STATUS_COLOURS[status] ?? 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{status.replace(/_/g, ' ')}</span>
                <span className="font-bold text-slate-900 bg-white/70 px-1.5 py-0.5 rounded text-[11px] border border-black/5">
                  {count}
                </span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent Orders Table ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            View all orders <ExternalLink size={13} />
          </Link>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Fulfillment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-emerald-700">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">{order.customerName}</td>
                      <td className="px-4 py-3 text-right text-slate-900 font-semibold font-mono text-xs">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.paymentStatus} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/catalogue/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Plus size={16} />
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <ShoppingCart size={16} />
            View Orders
          </Link>
          <Link
            href="/admin/promotions/coupons"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Tag size={16} />
            Manage Coupons
          </Link>
        </div>
      </section>
    </div>
  );
}
