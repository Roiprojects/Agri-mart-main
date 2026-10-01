'use client';

import { useEffect, useState } from 'react';
import { Users, ShoppingBag, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';

interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const COLUMNS: Column<Customer>[] = [
  {
    key: 'name',
    header: 'Customer',
    sortable: true,
    render: (row) => (
      <div>
        <div className="font-semibold text-slate-900 text-sm">{row.name}</div>
        <div className="text-[11px] text-slate-500 capitalize">{row.role.toLowerCase()}</div>
      </div>
    ),
  },
  {
    key: 'mobile',
    header: 'Mobile',
    sortable: true,
    render: (row) => (
      <span className="font-mono text-slate-600 text-xs">{row.mobile}</span>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (row) =>
      row.email ? (
        <span className="text-slate-600 text-xs">{row.email}</span>
      ) : (
        <span className="text-slate-400 text-xs">—</span>
      ),
  },
  {
    key: 'orderCount',
    header: 'Orders',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 text-xs">{row.orderCount}</span>
      </div>
    ),
  },
  {
    key: 'totalSpent',
    header: 'Total Spent',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-1">
        <span
          className={
            row.totalSpent > 0
              ? 'font-bold text-emerald-700 font-mono text-xs'
              : 'text-slate-400 font-mono text-xs'
          }
        >
          {row.totalSpent > 0 ? formatINR(row.totalSpent) : '₹0'}
        </span>
      </div>
    ),
  },
  {
    key: 'isVerified',
    header: 'Verified',
    render: (row) =>
      row.isVerified ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3 text-emerald-600" />
          Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3 text-rose-600" />
          Unverified
        </span>
      ),
  },
  {
    key: 'createdAt',
    header: 'Joined',
    sortable: true,
    render: (row) => (
      <span className="text-slate-500 text-xs">{formatDate(row.createdAt)}</span>
    ),
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/admin/customers');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to load customers');
        setCustomers(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const verifiedCount = customers.filter((c) => c.isVerified).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
            <Users className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
              {!loading && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                  {customers.length} total
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registered farmers, order frequency, verification badges, and lifetime spend.
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        {!loading && customers.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-center shadow-2xs">
              <div className="text-lg font-bold text-emerald-700">{verifiedCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Verified</div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-center shadow-2xs">
              <div className="text-lg font-bold text-slate-900">
                {customers.reduce((s, c) => s + c.orderCount, 0)}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Total Orders</div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-center shadow-2xs">
              <div className="text-lg font-bold text-emerald-700">
                {formatINR(customers.reduce((s, c) => s + c.totalSpent, 0))}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">GMV (Delivered)</div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-24 shadow-xs">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            <span className="text-sm text-slate-500">Loading customers directory...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700 shadow-xs">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <DataTable<Customer>
          data={customers}
          columns={COLUMNS}
          rowKey={(row) => row.id}
          searchPlaceholder="Search by name or mobile…"
          searchKeys={['name', 'mobile']}
          pageSize={20}
          emptyMessage="No customers found."
        />
      )}
    </div>
  );
}
