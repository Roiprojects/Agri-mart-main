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
  Sliders,
  Edit3,
  ShieldCheck,
  Building2,
  UserCheck,
  X,
  CheckCircle2,
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
  const [portalConfigs, setPortalConfigs] = useState<any[]>([]);
  const [portalSummary, setPortalSummary] = useState<any>({});
  const [editingPortal, setEditingPortal] = useState<any | null>(null);
  const [savingPortal, setSavingPortal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortals = async () => {
    try {
      const res = await fetch('/api/admin/portals');
      const json = await res.json();
      if (json.success) {
        setPortalConfigs(json.portalConfigs || []);
        setPortalSummary(json.summary || {});
      }
    } catch {}
  };

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const [res] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetchPortals(),
        ]);
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

  const handleSavePortalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortal) return;
    try {
      setSavingPortal(true);
      const res = await fetch('/api/admin/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panel: 'PORTAL_CONFIG',
          action: 'SAVE',
          payload: editingPortal,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setEditingPortal(null);
        fetchPortals();
        setToast(`Updated "${editingPortal.title}" settings!`);
        setTimeout(() => setToast(null), 3500);
      }
    } finally {
      setSavingPortal(false);
    }
  };

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
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time operations, dark warehouse allocations, and agronomy order metrics for AGRI MART MEGA.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/staff"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
          >
            <Users className="w-4 h-4" />
            <span>Staff</span>
          </Link>
          <Link
            href="/admin/portals"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Master Portals Command & Control Center</span>
          </Link>
        </div>
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

      {/* ── Connected Enterprise Portals & Control Center ──────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Connected Enterprise Portals (Controlled by Admin)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All operational panels are connected to the Super Admin panel and fully editable.
            </p>
          </div>
          <Link
            href="/admin/portals"
            className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1"
          >
            Open Full Portals Editor <ExternalLink size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portalConfigs.map((p) => {
            const pStats = portalSummary[p.id] || {};
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {p.badge}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'MAINTENANCE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.subtitle}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{p.activeHub}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.managerName}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {Object.entries(pStats).slice(0, 2).map(([k, v]) => (
                      <span
                        key={k}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium"
                      >
                        {k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}:{' '}
                        <strong>{k.toLowerCase().includes('payout') ? formatCurrency(Number(v)) : String(v)}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPortal({ ...p })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-emerald-600" />
                    <span>Edit Config</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {p.id !== 'storefront' && (
                      <Link
                        href={`/admin/portals?tab=${p.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                      >
                        Edit Data
                      </Link>
                    )}
                    <Link
                      href={p.href}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick Actions ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/staff"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Users size={16} />
            Staff
          </Link>
          <Link
            href="/admin/catalogue/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Plus size={16} />
            Add Product
          </Link>
          <Link
            href="/admin/portals"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Sliders size={16} />
            Control All Portals
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

      {/* Edit Portal Modal on Dashboard */}
      {editingPortal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Edit Portal: {editingPortal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPortal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSavePortalConfig} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portal Title</label>
                <input
                  type="text"
                  value={editingPortal.title || ''}
                  onChange={(e) => setEditingPortal({ ...editingPortal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingPortal.subtitle || ''}
                  onChange={(e) => setEditingPortal({ ...editingPortal, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingPortal.status || 'ACTIVE'}
                    onChange={(e) => setEditingPortal({ ...editingPortal, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="READ_ONLY">READ_ONLY</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active Hub</label>
                  <input
                    type="text"
                    value={editingPortal.activeHub || ''}
                    onChange={(e) => setEditingPortal({ ...editingPortal, activeHub: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={editingPortal.managerName || ''}
                    onChange={(e) => setEditingPortal({ ...editingPortal, managerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editingPortal.managerPhone || ''}
                    onChange={(e) => setEditingPortal({ ...editingPortal, managerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Banner</label>
                <input
                  type="text"
                  value={editingPortal.announcementBanner || ''}
                  onChange={(e) => setEditingPortal({ ...editingPortal, announcementBanner: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPortal(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPortal}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  {savingPortal ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
