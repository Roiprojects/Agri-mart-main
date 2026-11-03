'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  X,
  AlertTriangle,
  RefreshCw,
  Percent,
  IndianRupee,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DataTable, Column } from '@/components/admin/DataTable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
  validFrom: string;
  validTo: string;
}

interface CreateCouponForm {
  code: string;
  description: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  validFrom: string;
  validTo: string;
}

const DEFAULT_FORM: CreateCouponForm = {
  code: '',
  description: '',
  discountType: 'FIXED',
  discountValue: 0,
  minOrderValue: 0,
  usageLimit: 100,
  validFrom: '',
  validTo: '',
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Create Coupon Modal ──────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateCouponModal({ onClose, onSuccess }: CreateModalProps) {
  const [form, setForm] = useState<CreateCouponForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) { setError('Coupon code is required'); return; }
    if (!form.validFrom || !form.validTo) { setError('Valid From and Valid To dates are required'); return; }
    if (new Date(form.validTo) <= new Date(form.validFrom)) {
      setError('Valid To must be after Valid From');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, code: form.code.toUpperCase() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Failed to create coupon');
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-600" />
            Create Coupon
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. SAVE20"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm font-mono font-semibold text-emerald-700 uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this coupon"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Discount Type
              </label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountType: e.target.value as 'FIXED' | 'PERCENTAGE' }))
                }
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="FIXED">Fixed (₹)</option>
                <option value="PERCENTAGE">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Discount Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  {form.discountType === 'PERCENTAGE' ? '%' : '₹'}
                </span>
                <input
                  type="number"
                  min={0}
                  max={form.discountType === 'PERCENTAGE' ? 100 : undefined}
                  value={form.discountValue}
                  onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))}
                  className="w-full rounded-lg bg-white border border-slate-300 pl-7 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Min Order Value (₹)
              </label>
              <input
                type="number"
                min={0}
                value={form.minOrderValue}
                onChange={(e) => setForm((f) => ({ ...f, minOrderValue: Number(e.target.value) }))}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Usage Limit
              </label>
              <input
                type="number"
                min={1}
                value={form.usageLimit}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: Number(e.target.value) }))}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Valid From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.validFrom}
                onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Valid To <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.validTo}
                onChange={(e) => setForm((f) => ({ ...f, validTo: e.target.value }))}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-xs transition"
            >
              <Tag className="h-4 w-4" />
              {loading ? 'Creating…' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/coupons');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Failed to load coupons');
      setCoupons(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons?id=${deleteId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Delete failed');
      setDeleteId(null);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isExpired = (validTo: string) => new Date(validTo) < new Date();

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Code',
      sortable: true,
      render: (c) => (
        <span className="font-mono text-sm font-bold text-emerald-700 tracking-wider">{c.code}</span>
      ),
    },
    {
      key: 'discountType',
      header: 'Type',
      render: (c) => (
        <div className="flex items-center gap-1.5">
          {c.discountType === 'PERCENTAGE' ? (
            <Percent className="h-3.5 w-3.5 text-indigo-600" />
          ) : (
            <IndianRupee className="h-3.5 w-3.5 text-blue-600" />
          )}
          <span className="text-xs text-slate-700 font-medium">{c.discountType}</span>
        </div>
      ),
    },
    {
      key: 'discountValue',
      header: 'Value',
      sortable: true,
      render: (c) => (
        <span className="font-semibold text-slate-900">
          {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}
        </span>
      ),
    },
    {
      key: 'minOrderValue',
      header: 'Min Order (₹)',
      sortable: true,
      render: (c) => (
        <span className="text-slate-700 text-xs">
          {c.minOrderValue > 0 ? `₹${c.minOrderValue.toLocaleString('en-IN')}` : '—'}
        </span>
      ),
    },
    {
      key: 'usageCount',
      header: 'Used/Limit',
      render: (c) => {
        const pct = c.usageLimit > 0 ? (c.usageCount / c.usageLimit) * 100 : 0;
        return (
          <div>
            <span className="text-slate-700 text-xs font-medium">
              {c.usageCount} / {c.usageLimit}
            </span>
            <div className="mt-1 h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct >= 100 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'validTo',
      header: 'Valid Until',
      sortable: true,
      render: (c) => (
        <span className={`text-xs ${isExpired(c.validTo) ? 'text-red-600 font-semibold' : 'text-slate-700'}`}>
          {fmtDate(c.validTo)}
          {isExpired(c.validTo) && ' (Expired)'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Active',
      render: (c) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
            c.isActive && !isExpired(c.validTo)
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {c.isActive && !isExpired(c.validTo) ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const deleteCoupon = coupons.find((c) => c.id === deleteId);

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={40} />
          <p className="text-red-800 font-semibold text-lg mb-1">Failed to load coupons</p>
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
      {showCreate && (
        <CreateCouponModal onClose={() => setShowCreate(false)} onSuccess={fetchData} />
      )}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${deleteCoupon?.code}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
          <p className="text-slate-500 text-sm mt-1">
            Create and manage promotional discount codes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition"
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Summary Pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total', value: coupons.length, color: 'text-slate-800 bg-white border-slate-200' },
          {
            label: 'Active',
            value: coupons.filter((c) => c.isActive && !isExpired(c.validTo)).length,
            color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Expired',
            value: coupons.filter((c) => isExpired(c.validTo)).length,
            color: 'text-red-700 bg-red-50 border-red-200',
          },
          {
            label: 'Inactive',
            value: coupons.filter((c) => !c.isActive && !isExpired(c.validTo)).length,
            color: 'text-slate-600 bg-slate-100 border-slate-200',
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium shadow-xs ${item.color}`}
          >
            <span className="text-xs opacity-70">{item.label}</span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <DataTable<Coupon>
            data={coupons}
            columns={columns}
            rowKey={(c) => c.id}
            searchPlaceholder="Search coupons…"
            searchKeys={['code', 'description']}
            emptyMessage="No coupons yet. Create your first coupon!"
            actions={(c) => (
              <button
                onClick={() => setDeleteId(c.id)}
                className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Delete coupon"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          />
        )}
      </div>
    </div>
  );
}
