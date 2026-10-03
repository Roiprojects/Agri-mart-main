'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Clock,
  Activity,
  CheckCircle2,
  RefreshCw,
  X,
  AlertTriangle,
  UserCheck,
  Eye,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  customerMobile: string;
  serviceName: string;
  jobWorkName: string;
  farmAcreage: number;
  cropType: string;
  district: string;
  taluk: string;
  village: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  estimatedCost: number;
  assignedProviderName: string | null;
  createdAt: string;
}

interface AssignForm {
  providerName: string;
  operatorMobile: string;
  fleetUnit: string;
}

const STATUS_TABS = ['All', 'REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// ─── Assign Provider Modal ────────────────────────────────────────────────────

interface AssignModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onSuccess: () => void;
}

function AssignProviderModal({ request, onClose, onSuccess }: AssignModalProps) {
  const [form, setForm] = useState<AssignForm>({
    providerName: '',
    operatorMobile: '',
    fleetUnit: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.providerName.trim()) {
      setError('Provider name is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/services/admin/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id, ...form }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Assignment failed');
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
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Assign Service Provider</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {request.requestNumber} · {request.serviceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Request Summary */}
        <div className="mx-6 mt-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Customer</span>
            <p className="text-slate-900 font-semibold">{request.customerName}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">District</span>
            <p className="text-slate-900 font-semibold">{request.district}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Acreage</span>
            <p className="text-slate-900 font-semibold">{request.farmAcreage} acres</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Preferred Date</span>
            <p className="text-slate-900 font-semibold">{fmtDate(request.preferredDate)}</p>
          </div>
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
              Provider Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.providerName}
              onChange={(e) => setForm((f) => ({ ...f, providerName: e.target.value }))}
              placeholder="e.g. Krishna Agri Services"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Operator Mobile
            </label>
            <input
              type="tel"
              value={form.operatorMobile}
              onChange={(e) => setForm((f) => ({ ...f, operatorMobile: e.target.value }))}
              placeholder="+91 9999999999"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fleet / Unit
            </label>
            <input
              type="text"
              value={form.fleetUnit}
              onChange={(e) => setForm((f) => ({ ...f, fleetUnit: e.target.value }))}
              placeholder="e.g. Combine Harvester KA-01 AB 1234"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
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
              <UserCheck className="h-4 w-4" />
              {loading ? 'Assigning…' : 'Assign Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ServicesAdminPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [assignRequest, setAssignRequest] = useState<ServiceRequest | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/services/admin');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Failed to load service requests');
      setRequests(json.data.requests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (requestId: string, status: string) => {
    setActionLoading(requestId);
    try {
      const res = await fetch('/api/services/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
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
  const total = requests.length;
  const requested = requests.filter((r) => r.status === 'REQUESTED').length;
  const inProgress = requests.filter((r) => r.status === 'IN_PROGRESS').length;
  const completed = requests.filter((r) => r.status === 'COMPLETED').length;

  // Filtered
  const filtered =
    activeTab === 'All' ? requests : requests.filter((r) => r.status === activeTab);

  // Columns
  const columns: Column<ServiceRequest>[] = [
    {
      key: 'requestNumber',
      header: 'Request #',
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-emerald-700">{r.requestNumber}</span>
      ),
    },
    {
      key: 'serviceName',
      header: 'Service',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-900 font-semibold text-sm">{r.serviceName}</p>
          {r.jobWorkName && (
            <p className="text-slate-500 text-xs">{r.jobWorkName}</p>
          )}
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-800 font-medium">{r.customerName}</p>
          <p className="text-slate-500 text-xs font-mono">{r.customerMobile}</p>
        </div>
      ),
    },
    {
      key: 'district',
      header: 'District',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-800 font-medium">{r.district}</p>
          <p className="text-slate-500 text-xs">{r.taluk}, {r.village}</p>
        </div>
      ),
    },
    {
      key: 'preferredDate',
      header: 'Date',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-800 text-xs font-medium">{fmtDate(r.preferredDate)}</p>
          <p className="text-slate-500 text-xs">{r.preferredTime}</p>
        </div>
      ),
    },
    {
      key: 'farmAcreage',
      header: 'Acreage',
      render: (r) => (
        <span className="text-slate-700 text-xs font-medium">{r.farmAcreage} ac</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'assignedProviderName',
      header: 'Assigned Provider',
      render: (r) =>
        r.assignedProviderName ? (
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-800 text-xs font-medium">{r.assignedProviderName}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Unassigned</span>
        ),
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={40} />
          <p className="text-red-800 font-semibold text-lg mb-1">Failed to load services</p>
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
      {/* Assign Modal */}
      {assignRequest && (
        <AssignProviderModal
          request={assignRequest}
          onClose={() => setAssignRequest(null)}
          onSuccess={fetchData}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage farm service requests and provider assignments
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-xs transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Requests"
          value={total}
          icon={Wrench}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Requested"
          value={requested}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatsCard
          title="In Progress"
          value={inProgress}
          icon={Activity}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatsCard
          title="Completed"
          value={completed}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const count =
            tab === 'All' ? requests.length : requests.filter((r) => r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab === 'All' ? 'All' : tab.replace(/_/g, ' ')}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <DataTable<ServiceRequest>
            data={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            searchPlaceholder="Search requests…"
            searchKeys={['requestNumber', 'customerName', 'serviceName', 'district']}
            emptyMessage="No service requests found."
            actions={(r) => {
              const busy = actionLoading === r.id;
              return (
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/services/${r.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Link>
                  {r.status === 'REQUESTED' && (
                    <button
                      disabled={busy}
                      onClick={() => setAssignRequest(r)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50"
                    >
                      <UserCheck className="h-3 w-3" />
                      {busy ? '…' : 'Assign'}
                    </button>
                  )}
                  {r.status === 'ASSIGNED' && (
                    <button
                      disabled={busy}
                      onClick={() => handleStatusChange(r.id, 'IN_PROGRESS')}
                      className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition disabled:opacity-50"
                    >
                      {busy ? '…' : 'Start'}
                    </button>
                  )}
                  {r.status === 'IN_PROGRESS' && (
                    <button
                      disabled={busy}
                      onClick={() => handleStatusChange(r.id, 'COMPLETED')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {busy ? '…' : 'Complete'}
                    </button>
                  )}
                </div>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
