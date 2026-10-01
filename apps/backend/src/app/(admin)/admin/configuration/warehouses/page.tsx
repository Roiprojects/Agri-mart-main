'use client';

import { useState, useEffect } from 'react';
import { Warehouse, Plus, Edit2, RefreshCw, X } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  servicedPincodes: string;
  address: string;
  managerName: string;
  contactNumber: string;
  isActive: boolean;
}

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<WarehouseData | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    code: '',
    serviceRadiusKm: 75,
    servicedPincodes: '',
    address: '',
    managerName: '',
    contactNumber: '',
    isActive: true,
  });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/warehouses');
      const json = await res.json();
      if (json.success) {
        setWarehouses(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const openCreate = () => {
    setEditingWh(null);
    setForm({
      name: '',
      code: '',
      serviceRadiusKm: 75,
      servicedPincodes: '580020, 580021, 580023, 580024',
      address: 'Agri Logistics Zone, Karnataka',
      managerName: 'Operations Lead',
      contactNumber: '9480188000',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (wh: WarehouseData) => {
    setEditingWh(wh);
    setForm({
      name: wh.name,
      code: wh.code,
      serviceRadiusKm: wh.serviceRadiusKm || 75,
      servicedPincodes: wh.servicedPincodes || '',
      address: wh.address || '',
      managerName: wh.managerName || '',
      contactNumber: wh.contactNumber || '',
      isActive: wh.isActive !== undefined ? wh.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingWh?.id,
          ...form,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        fetchWarehouses();
      } else {
        alert(json.message || 'Error saving warehouse');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<WarehouseData>[] = [
    {
      key: 'name',
      header: 'Hub Name & Code',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-emerald-700 font-mono font-semibold">CODE: {row.code}</div>
        </div>
      ),
    },
    {
      key: 'managerName',
      header: 'Manager & Contact',
      render: (row) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800">{row.managerName}</div>
          <div className="text-slate-500 font-mono">{row.contactNumber}</div>
        </div>
      ),
    },
    {
      key: 'serviceRadiusKm',
      header: 'Delivery Radius',
      sortable: true,
      render: (row) => (
        <span className="px-2.5 py-1 rounded bg-slate-100 text-xs font-mono text-slate-700">
          {row.serviceRadiusKm} km coverage
        </span>
      ),
    },
    {
      key: 'servicedPincodes',
      header: 'Serviced Pincodes',
      render: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-xs font-mono">
          {row.servicedPincodes}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            row.isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${row.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {row.isActive ? 'Online & Active' : 'Offline'}
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
              <Warehouse className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dark Fulfillment Hubs</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {warehouses.length} Nodes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure regional dark warehouses for GPS proximity auto-dispatch and pincode coverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchWarehouses}
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
          >
            <Plus className="h-4 w-4" /> Add Fulfillment Hub
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
        <DataTable
          data={warehouses}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search hubs by name, code..."
          searchKeys={['name', 'code', 'managerName']}
          actions={(row) => (
            <button
              onClick={() => openEdit(row)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              <Edit2 className="h-3 w-3" /> Edit Hub
            </button>
          )}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingWh ? 'Edit Warehouse Hub' : 'Add Fulfillment Hub'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Hub Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Hubballi Central Dark Hub"
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Hub Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="WH-HBL-01"
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={form.managerName}
                    onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Contact Mobile
                  </label>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Delivery Service Radius (km)
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={form.serviceRadiusKm}
                  onChange={(e) => setForm({ ...form, serviceRadiusKm: parseInt(e.target.value) || 75 })}
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Serviced Pincodes (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={form.servicedPincodes}
                  onChange={(e) => setForm({ ...form, servicedPincodes: e.target.value })}
                  placeholder="580020, 580021, 580023..."
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address Location</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-800">Active Node (Receives Proximity Allocations)</span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
