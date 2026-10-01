'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  userMobile?: string;
  rating: number;
  title: string;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogue/reviews');
      const json = await res.json();
      if (json.success) {
        setReviews(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/catalogue/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = selectedStatus === 'ALL'
    ? reviews
    : reviews.filter((r) => r.status === selectedStatus);

  const columns: Column<Review>[] = [
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
          {row.productName}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.customerName}</div>
          <div className="text-[11px] text-slate-500 font-mono">{row.userMobile || '—'}</div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-amber-400" />
          <span className="text-xs font-bold text-slate-800">{row.rating} / 5</span>
        </div>
      ),
    },
    {
      key: 'comment',
      header: 'Review Feedback',
      render: (row) => (
        <div className="max-w-md">
          {row.title && <div className="text-xs font-semibold text-slate-900 mb-0.5">{row.title}</div>}
          <p className="text-xs text-slate-600 line-clamp-2">{row.comment}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN') : '—'}
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
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Star className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Reviews</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {reviews.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Moderate verified farmer product ratings, testimonials, and field performance remarks.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
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
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
        <DataTable
          data={filtered}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search reviews by product or customer..."
          searchKeys={['productName', 'customerName', 'comment']}
          actions={(row) => (
            <div className="flex items-center gap-1.5">
              {row.status !== 'APPROVED' && (
                <button
                  onClick={() => handleModerate(row.id, 'APPROVED')}
                  title="Approve Review"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Approve
                </button>
              )}
              {row.status !== 'REJECTED' && (
                <button
                  onClick={() => handleModerate(row.id, 'REJECTED')}
                  title="Reject Review"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
