'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CalendarDays,
  Clock,
  Activity,
  IndianRupee,
  RefreshCw,
  X,
  AlertTriangle,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RentalBooking {
  id: string;
  bookingNumber: string;
  productTitle: string;
  customerName: string;
  customerMobile: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  rentAmount: number;
  securityDeposit: number;
  totalPaid: number;
  status: string;
  paymentStatus: string;
  depositRefundStatus: string;
  createdAt: string;
}

interface ReturnForm {
  actualReturnDate: string;
  condition: 'ON_TIME' | 'LATE' | 'DAMAGED';
  damageNotes: string;
  damageCharge: number;
}

const STATUS_TABS = [
  'All',
  'PENDING_APPROVAL',
  'APPROVED',
  'ACTIVE',
  'RETURNED_ON_TIME',
  'RETURNED_LATE',
  'RETURNED_DAMAGED',
  'CANCELLED',
] as const;

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Return Modal ─────────────────────────────────────────────────────────────

interface ReturnModalProps {
  booking: RentalBooking;
  onClose: () => void;
  onSuccess: () => void;
}

function ReturnModal({ booking, onClose, onSuccess }: ReturnModalProps) {
  const [form, setForm] = useState<ReturnForm>({
    actualReturnDate: new Date().toISOString().split('T')[0],
    condition: 'ON_TIME',
    damageNotes: '',
    damageCharge: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rentals/admin/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, ...form }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Return processing failed');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Process Equipment Return</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {booking.bookingNumber} · {booking.productTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Actual Return Date
            </label>
            <input
              type="date"
              required
              value={form.actualReturnDate}
              onChange={(e) => setForm((f) => ({ ...f, actualReturnDate: e.target.value }))}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Return Condition
            </label>
            <select
              value={form.condition}
              onChange={(e) =>
                setForm((f) => ({ ...f, condition: e.target.value as ReturnForm['condition'] }))
              }
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            >
              <option value="ON_TIME">Returned On Time — Good Condition</option>
              <option value="LATE">Returned Late</option>
              <option value="DAMAGED">Returned Damaged</option>
            </select>
          </div>

          {(form.condition === 'LATE' || form.condition === 'DAMAGED') && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Damage / Late Notes
                </label>
                <textarea
                  rows={3}
                  value={form.damageNotes}
                  onChange={(e) => setForm((f) => ({ ...f, damageNotes: e.target.value }))}
                  placeholder="Describe the condition..."
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Charge (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.damageCharge}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, damageCharge: Number(e.target.value) }))
                  }
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs font-mono"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
            >
              {loading ? 'Processing…' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RentalsAdminPage() {
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [returnBooking, setReturnBooking] = useState<RentalBooking | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/rentals/admin');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Failed to load rentals');
      setBookings(json.data.bookings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch('/api/rentals/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Action failed');
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'PENDING_APPROVAL').length;
  const active = bookings.filter((b) => b.status === 'ACTIVE').length;
  const revenue = bookings
    .filter((b) => !['CANCELLED', 'PENDING_APPROVAL'].includes(b.status))
    .reduce((sum, b) => sum + b.totalPaid, 0);

  // Filtered
  const filtered =
    activeTab === 'All' ? bookings : bookings.filter((b) => b.status === activeTab);

  // Columns
  const columns: Column<RentalBooking>[] = [
    {
      key: 'bookingNumber',
      header: 'Booking #',
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-emerald-700">{r.bookingNumber}</span>
      ),
    },
    {
      key: 'productTitle',
      header: 'Equipment',
      sortable: true,
      render: (r) => (
        <span className="font-semibold text-slate-900 max-w-[160px] block truncate">
          {r.productTitle}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (r) => <span className="text-slate-800 font-medium">{r.customerName}</span>,
    },
    {
      key: 'customerMobile',
      header: 'Mobile',
      render: (r) => <span className="font-mono text-slate-500 text-xs">{r.customerMobile}</span>,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      render: (r) => <span className="text-slate-700 text-xs">{fmtDate(r.startDate)}</span>,
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (r) => <span className="text-slate-700 text-xs">{fmtDate(r.endDate)}</span>,
    },
    {
      key: 'totalDays',
      header: 'Days',
      render: (r) => <span className="text-slate-700">{r.totalDays}d</span>,
    },
    {
      key: 'totalPaid',
      header: 'Amount (₹)',
      sortable: true,
      render: (r) => (
        <span className="font-bold text-slate-900">{fmt(r.totalPaid)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={40} />
          <p className="text-red-800 font-semibold text-lg mb-1">Failed to load rentals</p>
          <p className="text-slate-600 text-sm mb-5">{error}</p>
          <button
            onClick={fetchData}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-xs transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Return Modal */}
      {returnBooking && (
        <ReturnModal
          booking={returnBooking}
          onClose={() => setReturnBooking(null)}
          onSuccess={fetchData}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rentals Management</h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage heavy field equipment bookings, security deposit refunds, and returned condition inspections.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value={total}
          icon={CalendarDays}
          iconColor="text-blue-700"
          iconBg="bg-blue-50 border border-blue-100"
        />
        <StatsCard
          title="Pending Approval"
          value={pending}
          icon={Clock}
          iconColor="text-amber-700"
          iconBg="bg-amber-50 border border-amber-100"
        />
        <StatsCard
          title="Active Rentals"
          value={active}
          icon={Activity}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-100"
        />
        <StatsCard
          title="Rental Revenue"
          value={fmt(revenue)}
          icon={IndianRupee}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-100"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-200">
        {STATUS_TABS.map((tab) => {
          const count =
            tab === 'All' ? bookings.length : bookings.filter((b) => b.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab === 'All' ? 'All' : tab.replace(/_/g, ' ')}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-xs">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-sm">Loading rental bookings...</p>
        </div>
      ) : (
        <DataTable<RentalBooking>
          data={filtered}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search bookings…"
          searchKeys={['bookingNumber', 'productTitle', 'customerName', 'customerMobile']}
          emptyMessage="No rental bookings found."
          actions={(r) => {
            const busy = actionLoading === r.id;
            if (r.status === 'PENDING_APPROVAL') {
              return (
                <button
                  disabled={busy}
                  onClick={() => handleStatusChange(r.id, 'APPROVED')}
                  className="px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
                >
                  {busy ? '…' : 'Approve'}
                </button>
              );
            }
            if (r.status === 'APPROVED') {
              return (
                <button
                  disabled={busy}
                  onClick={() => handleStatusChange(r.id, 'ACTIVE')}
                  className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
                >
                  {busy ? '…' : 'Activate'}
                </button>
              );
            }
            if (r.status === 'ACTIVE') {
              return (
                <button
                  disabled={busy}
                  onClick={() => setReturnBooking(r)}
                  className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition shadow-2xs"
                >
                  Process Return
                </button>
              );
            }
            return null;
          }}
        />
      )}
    </div>
  );
}
