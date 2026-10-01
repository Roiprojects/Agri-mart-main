'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerMobile: string;
  totalAmount: number;
  itemCount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

const STATUS_TABS = [
  'ALL',
  'PLACED',
  'CONFIRMED',
  'PACKED',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchOrders = async (statusFilter = selectedStatus) => {
    try {
      setLoading(true);
      setError(null);
      const url = statusFilter === 'ALL' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?status=${statusFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
      } else {
        setError(json.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedStatus);
  }, [selectedStatus]);

  const columns: Column<OrderRow>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      sortable: true,
      render: (row) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="font-semibold text-xs font-mono text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.customerName}</div>
          <div className="text-xs text-slate-500 font-mono">{row.customerMobile || '—'}</div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-slate-900 font-mono text-xs">
          ₹{row.totalAmount?.toLocaleString('en-IN') ?? 0}
        </span>
      ),
    },
    {
      key: 'itemCount',
      header: 'Items',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 text-xs">
          {row.itemCount} {row.itemCount === 1 ? 'item' : 'items'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Fulfillment',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <StatusBadge status={row.paymentStatus} size="sm" />
          <span className="text-[10px] text-slate-500 font-semibold uppercase">{row.paymentMethod}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Management</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {orders.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer orders, allocations, tracking, and fulfillment updates.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(selectedStatus)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 flex-shrink-0" />
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedStatus(tab)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedStatus === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-xs">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-sm">Loading orders pipeline...</p>
        </div>
      ) : (
        <DataTable
          data={orders}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search order #, customer, mobile..."
          searchKeys={['orderNumber', 'customerName', 'customerMobile']}
          pageSize={15}
          actions={(row) => (
            <Link
              href={`/admin/orders/${row.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
            >
              <Eye className="h-3 w-3" />
              View
            </Link>
          )}
        />
      )}
    </div>
  );
}
