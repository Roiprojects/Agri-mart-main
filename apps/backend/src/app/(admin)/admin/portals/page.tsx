'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Warehouse,
  Leaf,
  Users,
  Wrench,
  Coins,
  Globe,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  X,
  Sliders,
  Building2,
  UserCheck,
  Phone,
  Search,
} from 'lucide-react';

function formatINR(n: number): string {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

function PortalsControlContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'portals';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [portalConfigs, setPortalConfigs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [portalData, setPortalData] = useState<any>({
    warehouses: [],
    warehouseStocks: [],
    orders: [],
    farmerProfiles: [],
    followUps: [],
    usageLogs: [],
    salesLeads: [],
    salesVisits: [],
    salesTargets: [],
    jobCards: [],
    spareParts: [],
    labourCatalogue: [],
    warrantyClaims: [],
    dealers: [],
    commissionTargets: [],
    payoutRecords: [],
  });

  // Universal Modal Editor State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPanel, setModalPanel] = useState('');
  const [modalAction, setModalAction] = useState('');
  const [modalFields, setModalFields] = useState<
    { key: string; label: string; type?: 'text' | 'number' | 'select' | 'textarea'; options?: string[] }[]
  >([]);
  const [modalForm, setModalForm] = useState<Record<string, any>>({});

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllPortals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/portals');
      const json = await res.json();
      if (json.success) {
        setPortalConfigs(json.portalConfigs || []);
        setSummary(json.summary || {});
        setPortalData(json.data || {});
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load portal data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPortals();
  }, []);

  const openEditor = (
    title: string,
    panel: string,
    action: string,
    fields: { key: string; label: string; type?: 'text' | 'number' | 'select' | 'textarea'; options?: string[] }[],
    initialValues: Record<string, any>
  ) => {
    setModalTitle(title);
    setModalPanel(panel);
    setModalAction(action);
    setModalFields(fields);
    setModalForm({ ...initialValues });
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panel: modalPanel,
          action: modalAction,
          payload: modalForm,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'Saved successfully!');
        setModalOpen(false);
        fetchAllPortals();
      } else {
        showToast(json.error || 'Failed to save changes', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (panel: string, action: string, id: string, label: string) => {
    try {
      const res = await fetch('/api/admin/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panel,
          action,
          payload: { id },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`${label} deleted.`);
        fetchAllPortals();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const TABS = [
    { id: 'portals', label: 'All Portals Overview & Config', icon: Sliders },
    { id: 'warehouse', label: 'Dark Warehouse & Stock', icon: Warehouse },
    { id: 'procurement', label: 'Procurement & Agronomy', icon: Leaf },
    { id: 'sales', label: 'Field Sales CRM', icon: Users },
    { id: 'repairs', label: 'Workshop & Repairs', icon: Wrench },
    { id: 'finance', label: 'Finance & Dealers', icon: Coins },
  ];

  const q = searchTerm.trim().toLowerCase();

  return (
    <div className="space-y-6 pb-16">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-xs font-semibold flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin Master Control
            </span>
            <span className="text-xs text-slate-400">All 6 Panels Connected & Editable</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Enterprise Portals Command & Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centrally configure, monitor, and edit every operational portal (Warehouse, Procurement, Sales CRM, Repairs Workshop, Finance, and Storefront).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter records across portals..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 outline-none w-56"
            />
          </div>
          <button
            type="button"
            onClick={fetchAllPortals}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync All</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                active
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ALL PORTALS OVERVIEW & CONFIG */}
      {activeTab === 'portals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portalConfigs.map((p) => {
            const stats = summary[p.id] || {};
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-400 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {p.badge}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : p.status === 'MAINTENANCE'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.subtitle}</p>

                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{p.activeHub}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.managerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.managerPhone}</span>
                    </div>
                  </div>

                  {/* Live Portal Metrics */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(stats).map(([k, v]) => (
                      <span
                        key={k}
                        className="text-[11px] px-2 py-1 rounded bg-emerald-50/70 text-emerald-900 border border-emerald-200/60 font-medium"
                      >
                        {k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}:{' '}
                        <strong>
                          {k.toLowerCase().includes('payout') ? formatINR(Number(v)) : String(v)}
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openEditor(
                        `Edit Portal Settings: ${p.title}`,
                        'PORTAL_CONFIG',
                        'SAVE',
                        [
                          { key: 'title', label: 'Portal Title' },
                          { key: 'subtitle', label: 'Subtitle / Description', type: 'textarea' },
                          { key: 'badge', label: 'Badge Label' },
                          {
                            key: 'status',
                            label: 'Operational Status',
                            type: 'select',
                            options: ['ACTIVE', 'READ_ONLY', 'MAINTENANCE'],
                          },
                          { key: 'activeHub', label: 'Active Hub / Location' },
                          { key: 'managerName', label: 'Portal Manager Name' },
                          { key: 'managerPhone', label: 'Manager Contact Phone' },
                          { key: 'announcementBanner', label: 'Live Announcement Banner', type: 'textarea' },
                        ],
                        p
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit Config</span>
                  </button>

                  {p.id !== 'storefront' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold cursor-pointer"
                      >
                        Edit Data
                      </button>
                      <Link
                        href={p.href}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Link
                        href="/admin/catalogue/products"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                      >
                        Edit Catalogue
                      </Link>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <span>Storefront</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: DARK WAREHOUSE & STOCK CONTROL */}
      {activeTab === 'warehouse' && (
        <div className="space-y-6">
          {/* Warehouses List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Dark Warehouse Fulfillment Hubs</h2>
                <p className="text-xs text-slate-500">Add, edit, or toggle active dark warehouse hubs and service radiuses.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditor(
                      'Add New Dark Warehouse Hub',
                      'WAREHOUSE',
                      'SAVE_WAREHOUSE',
                      [
                        { key: 'name', label: 'Warehouse Hub Name' },
                        { key: 'code', label: 'Hub Code (e.g. DWH-HBX-01)' },
                        { key: 'address', label: 'Location / Industrial Address' },
                        { key: 'managerName', label: 'Hub Manager Name' },
                        { key: 'contactNumber', label: 'Contact Number' },
                        { key: 'serviceRadiusKm', label: 'Service Radius (KM)', type: 'number' },
                        { key: 'servicedPincodes', label: 'Serviced Pincodes (comma separated)' },
                      ],
                      {
                        name: '',
                        code: 'DWH-KA-06',
                        address: '',
                        managerName: '',
                        contactNumber: '+91 98450 00000',
                        serviceRadiusKm: 120,
                        servicedPincodes: '580001, 580020',
                        isActive: true,
                      }
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Warehouse Hub</span>
                </button>
                <Link
                  href="/warehouse"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                >
                  <span>Open Warehouse Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Hub Name & Code</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Manager & Contact</th>
                    <th className="px-4 py-3">Radius</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.warehouses || [])
                    .filter((w: any) => !q || w.name?.toLowerCase().includes(q) || w.code?.toLowerCase().includes(q))
                    .map((w: any) => (
                      <tr key={w.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <div>{w.name}</div>
                          <div className="text-[11px] font-mono text-emerald-700">{w.code}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{w.address}</td>
                        <td className="px-4 py-3 text-slate-700">
                          <div className="font-medium">{w.managerName}</div>
                          <div className="text-slate-500">{w.contactNumber}</div>
                        </td>
                        <td className="px-4 py-3 font-mono">{w.serviceRadiusKm} km</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              w.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {w.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditor(
                                `Edit Warehouse Hub: ${w.name}`,
                                'WAREHOUSE',
                                'SAVE_WAREHOUSE',
                                [
                                  { key: 'name', label: 'Warehouse Hub Name' },
                                  { key: 'code', label: 'Hub Code' },
                                  { key: 'address', label: 'Location / Address' },
                                  { key: 'managerName', label: 'Hub Manager Name' },
                                  { key: 'contactNumber', label: 'Contact Number' },
                                  { key: 'serviceRadiusKm', label: 'Service Radius (KM)', type: 'number' },
                                  { key: 'servicedPincodes', label: 'Serviced Pincodes' },
                                ],
                                w
                              )
                            }
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord('WAREHOUSE', 'DELETE_WAREHOUSE', w.id, w.name)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warehouse Orders Control */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">Warehouse Fulfillment Orders Control</h2>
              <p className="text-xs text-slate-500">Reassign warehouse hubs, update fulfillment status, or edit courier tracking details.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Assigned Hub</th>
                    <th className="px-4 py-3">Total (INR)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Courier & Tracking</th>
                    <th className="px-4 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.orders || []).slice(0, 15).map((o: any) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-slate-700">{o.assignedWarehouseName || o.assignedWarehouseId || 'Hubballi Hub'}</td>
                      <td className="px-4 py-3 font-semibold">{formatINR(o.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">{o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {o.courierName ? `${o.courierName} (${o.trackingNumber || 'N/A'})` : 'Not Dispatched'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openEditor(
                              `Edit Order Fulfillment: ${o.orderNumber}`,
                              'WAREHOUSE',
                              'UPDATE_ORDER',
                              [
                                {
                                  key: 'status',
                                  label: 'Order Fulfillment Status',
                                  type: 'select',
                                  options: ['PLACED', 'CONFIRMED', 'PACKED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
                                },
                                {
                                  key: 'paymentStatus',
                                  label: 'Payment Status',
                                  type: 'select',
                                  options: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'],
                                },
                                {
                                  key: 'assignedWarehouseId',
                                  label: 'Assigned Warehouse ID',
                                  type: 'select',
                                  options: (portalData.warehouses || []).map((w: any) => w.id),
                                },
                                { key: 'courierName', label: 'Courier Partner Name' },
                                { key: 'trackingNumber', label: 'AWB / Tracking Number' },
                              ],
                              {
                                orderId: o.id,
                                status: o.status,
                                paymentStatus: o.paymentStatus,
                                assignedWarehouseId: o.assignedWarehouseId || 'wh-hubballi',
                                courierName: o.courierName || '',
                                trackingNumber: o.trackingNumber || '',
                              }
                            )
                          }
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                        >
                          Edit Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROCUREMENT & AGRONOMY CONTROL */}
      {activeTab === 'procurement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Farmer Crop Profiles & Agronomy Registry</h2>
                <p className="text-xs text-slate-500">Add, edit, or update farmer crop stages, acreage, soil types, and assigned agronomists.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditor(
                      'Add New Farmer Profile',
                      'PROCUREMENT',
                      'SAVE_FARMER',
                      [
                        { key: 'farmerName', label: 'Farmer Full Name' },
                        { key: 'mobile', label: 'Mobile Number' },
                        { key: 'village', label: 'Village' },
                        { key: 'taluk', label: 'Taluk' },
                        { key: 'district', label: 'District' },
                        { key: 'totalAcreage', label: 'Total Acreage (Acres)', type: 'number' },
                        { key: 'soilType', label: 'Soil Type' },
                        { key: 'primaryCrops', label: 'Primary Crops (comma separated)' },
                        {
                          key: 'currentCropStage',
                          label: 'Current Crop Stage',
                          type: 'select',
                          options: ['LAND_PREPARATION', 'GERMINATION', 'TILLERING_VEGETATIVE', 'FLOWERING', 'GRAIN_FORMATION', 'HARVEST_READY'],
                        },
                        { key: 'assignedAgronomist', label: 'Assigned Agronomist' },
                        { key: 'totalSpend', label: 'Total Spend (INR)', type: 'number' },
                        { key: 'notes', label: 'Agronomy Notes', type: 'textarea' },
                      ],
                      {
                        farmerName: '',
                        mobile: '+91 98450 00000',
                        village: 'Kundgol',
                        taluk: 'Kundgol',
                        district: 'Dharwad',
                        totalAcreage: 8,
                        soilType: 'Black Cotton Soil',
                        primaryCrops: 'Cotton, Chilli',
                        currentCropStage: 'GERMINATION',
                        assignedAgronomist: 'Dr. Anand Nadagouda',
                        totalSpend: 18500,
                        notes: '',
                      }
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Farmer Profile</span>
                </button>
                <Link
                  href="/procurement"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                >
                  <span>Open Procurement Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Farmer & Mobile</th>
                    <th className="px-4 py-3">Village / District</th>
                    <th className="px-4 py-3">Acreage & Soil</th>
                    <th className="px-4 py-3">Crops & Stage</th>
                    <th className="px-4 py-3">Total Spend</th>
                    <th className="px-4 py-3">Agronomist</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.farmerProfiles || [])
                    .filter((f: any) => !q || f.farmerName?.toLowerCase().includes(q) || f.village?.toLowerCase().includes(q))
                    .map((f: any) => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <div>{f.farmerName}</div>
                          <div className="text-slate-500 font-normal">{f.mobile}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {f.village}, {f.taluk}, {f.district}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div>{f.totalAcreage} Acres</div>
                          <div className="text-[11px] text-slate-500">{f.soilType}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">
                            {Array.isArray(f.primaryCrops) ? f.primaryCrops.join(', ') : f.primaryCrops}
                          </div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {f.currentCropStage}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold">{formatINR(f.totalSpend)}</td>
                        <td className="px-4 py-3 text-slate-600">{f.assignedAgronomist || 'Dr. Anand Nadagouda'}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditor(
                                `Edit Farmer Profile: ${f.farmerName}`,
                                'PROCUREMENT',
                                'SAVE_FARMER',
                                [
                                  { key: 'farmerName', label: 'Farmer Full Name' },
                                  { key: 'mobile', label: 'Mobile Number' },
                                  { key: 'village', label: 'Village' },
                                  { key: 'taluk', label: 'Taluk' },
                                  { key: 'district', label: 'District' },
                                  { key: 'totalAcreage', label: 'Total Acreage (Acres)', type: 'number' },
                                  { key: 'soilType', label: 'Soil Type' },
                                  { key: 'primaryCrops', label: 'Primary Crops (comma separated)' },
                                  {
                                    key: 'currentCropStage',
                                    label: 'Current Crop Stage',
                                    type: 'select',
                                    options: [
                                      'LAND_PREPARATION',
                                      'GERMINATION',
                                      'TILLERING_VEGETATIVE',
                                      'FLOWERING',
                                      'GRAIN_FORMATION',
                                      'HARVEST_READY',
                                    ],
                                  },
                                  { key: 'assignedAgronomist', label: 'Assigned Agronomist' },
                                  { key: 'totalSpend', label: 'Total Spend (INR)', type: 'number' },
                                  { key: 'notes', label: 'Agronomy Notes', type: 'textarea' },
                                ],
                                {
                                  ...f,
                                  primaryCrops: Array.isArray(f.primaryCrops) ? f.primaryCrops.join(', ') : f.primaryCrops,
                                }
                              )
                            }
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord('PROCUREMENT', 'DELETE_FARMER', f.id, f.farmerName)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agronomy Follow-Up Calls */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Scheduled Agronomy Advisory Calls</h2>
                <p className="text-xs text-slate-500">Schedule or edit agronomist follow-up calls and advisory notes.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  openEditor(
                    'Schedule New Agronomy Call',
                    'PROCUREMENT',
                    'SAVE_FOLLOWUP',
                    [
                      { key: 'farmerName', label: 'Farmer Name' },
                      { key: 'mobile', label: 'Mobile Number' },
                      { key: 'crop', label: 'Crop' },
                      { key: 'cropStage', label: 'Crop Stage' },
                      { key: 'scheduledDate', label: 'Scheduled Date (YYYY-MM-DD)' },
                      { key: 'purpose', label: 'Advisory Purpose' },
                      {
                        key: 'status',
                        label: 'Call Status',
                        type: 'select',
                        options: ['SCHEDULED', 'COMPLETED', 'OVERDUE', 'CANCELLED'],
                      },
                      { key: 'assignedAgronomist', label: 'Assigned Agronomist' },
                      { key: 'agronomistNotes', label: 'Agronomist Notes', type: 'textarea' },
                    ],
                    {
                      farmerName: portalData.farmerProfiles?.[0]?.farmerName || 'Ramesh Patil',
                      mobile: '+91 98450 12345',
                      crop: 'Paddy',
                      cropStage: 'TILLERING_VEGETATIVE',
                      scheduledDate: new Date().toISOString().split('T')[0],
                      purpose: 'Foliar micronutrient spray advisory',
                      status: 'SCHEDULED',
                      assignedAgronomist: 'Dr. Anand Nadagouda',
                      agronomistNotes: '',
                    }
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Follow-Up Call</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Farmer</th>
                    <th className="px-4 py-3">Crop & Stage</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.followUps || []).map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div>{c.farmerName}</div>
                        <div className="text-slate-500 font-normal">{c.mobile}</div>
                      </td>
                      <td className="px-4 py-3">
                        {c.crop} ({c.cropStage})
                      </td>
                      <td className="px-4 py-3 text-slate-700">{c.purpose}</td>
                      <td className="px-4 py-3 font-mono">{c.scheduledDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditor(
                              `Edit Follow-Up Call: ${c.farmerName}`,
                              'PROCUREMENT',
                              'SAVE_FOLLOWUP',
                              [
                                { key: 'farmerName', label: 'Farmer Name' },
                                { key: 'mobile', label: 'Mobile Number' },
                                { key: 'crop', label: 'Crop' },
                                { key: 'cropStage', label: 'Crop Stage' },
                                { key: 'scheduledDate', label: 'Scheduled Date' },
                                { key: 'purpose', label: 'Purpose' },
                                {
                                  key: 'status',
                                  label: 'Call Status',
                                  type: 'select',
                                  options: ['SCHEDULED', 'COMPLETED', 'OVERDUE', 'CANCELLED'],
                                },
                                { key: 'assignedAgronomist', label: 'Assigned Agronomist' },
                                { key: 'agronomistNotes', label: 'Agronomist Notes', type: 'textarea' },
                              ],
                              c
                            )
                          }
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord('PROCUREMENT', 'DELETE_FOLLOWUP', c.id, c.farmerName)}
                          className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FIELD SALES CRM CONTROL */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Sales Leads */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Field Sales CRM Leads Pipeline</h2>
                <p className="text-xs text-slate-500">Add, edit, or reassign sales leads, estimated values (INR), and pipeline stages.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditor(
                      'Add New Sales Lead',
                      'SALES',
                      'SAVE_LEAD',
                      [
                        { key: 'customerName', label: 'Farmer / Customer Name' },
                        { key: 'mobile', label: 'Mobile Number' },
                        { key: 'village', label: 'Village' },
                        { key: 'district', label: 'District' },
                        { key: 'interestedProductTitle', label: 'Interested Product / Machinery' },
                        { key: 'estimatedValue', label: 'Estimated Deal Value (INR)', type: 'number' },
                        {
                          key: 'stage',
                          label: 'Pipeline Stage',
                          type: 'select',
                          options: ['NEW', 'ASSIGNED', 'CONTACTED', 'INTERESTED', 'FOLLOW_UP', 'QUOTATION_SENT', 'CONVERTED', 'CLOSED'],
                        },
                        { key: 'assignedExecutiveName', label: 'Assigned Field Executive' },
                        { key: 'remarks', label: 'Remarks', type: 'textarea' },
                      ],
                      {
                        customerName: '',
                        mobile: '+91 98450 00000',
                        village: 'Mandya',
                        district: 'Mandya',
                        interestedProductTitle: 'AgriPro 7HP Power Weeder',
                        estimatedValue: 42000,
                        stage: 'NEW',
                        assignedExecutiveName: 'Sunil Kumar (Mandya Belt)',
                        remarks: '',
                      }
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sales Lead</span>
                </button>
                <Link
                  href="/sales"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                >
                  <span>Open Sales CRM Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Lead # & Customer</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Interested Product</th>
                    <th className="px-4 py-3">Est. Value (INR)</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Executive</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.salesLeads || [])
                    .filter((l: any) => !q || l.customerName?.toLowerCase().includes(q) || l.leadNumber?.toLowerCase().includes(q))
                    .map((l: any) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <div className="font-mono text-emerald-700 text-[11px]">{l.leadNumber}</div>
                          <div>{l.customerName}</div>
                          <div className="text-slate-500 font-normal">{l.mobile}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {l.village}, {l.district}
                        </td>
                        <td className="px-4 py-3 text-slate-800">{l.interestedProductTitle || l.interestedCategory || 'Machinery'}</td>
                        <td className="px-4 py-3 font-semibold">{formatINR(l.estimatedValue)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold text-[10px]">
                            {l.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{l.assignedExecutiveName}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditor(
                                `Edit Sales Lead: ${l.leadNumber}`,
                                'SALES',
                                'SAVE_LEAD',
                                [
                                  { key: 'customerName', label: 'Customer Name' },
                                  { key: 'mobile', label: 'Mobile Number' },
                                  { key: 'village', label: 'Village' },
                                  { key: 'district', label: 'District' },
                                  { key: 'interestedProductTitle', label: 'Interested Product' },
                                  { key: 'estimatedValue', label: 'Estimated Value (INR)', type: 'number' },
                                  {
                                    key: 'stage',
                                    label: 'Pipeline Stage',
                                    type: 'select',
                                    options: [
                                      'NEW',
                                      'ASSIGNED',
                                      'CONTACTED',
                                      'INTERESTED',
                                      'FOLLOW_UP',
                                      'QUOTATION_SENT',
                                      'CONVERTED',
                                      'CLOSED',
                                    ],
                                  },
                                  { key: 'assignedExecutiveName', label: 'Assigned Executive Name' },
                                  { key: 'remarks', label: 'Remarks', type: 'textarea' },
                                ],
                                l
                              )
                            }
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord('SALES', 'DELETE_LEAD', l.id, l.leadNumber)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Executive Sales Targets */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">Executive Monthly Sales Targets & Quotas</h2>
              <p className="text-xs text-slate-500">Edit monthly target amounts (INR) and achieved numbers for field sales executives.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Executive</th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Target Amount (INR)</th>
                    <th className="px-4 py-3">Achieved (INR)</th>
                    <th className="px-4 py-3">Leads Quota / Converted</th>
                    <th className="px-4 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.salesTargets || []).map((t: any) => (
                    <tr key={t.executiveId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{t.executiveName}</td>
                      <td className="px-4 py-3 font-mono">{t.month}</td>
                      <td className="px-4 py-3 font-semibold">{formatINR(t.targetAmount)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">{formatINR(t.achievedAmount)}</td>
                      <td className="px-4 py-3">
                        {t.leadsConverted} / {t.leadsTarget} leads
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openEditor(
                              `Edit Sales Target: ${t.executiveName}`,
                              'SALES',
                              'SAVE_TARGET',
                              [
                                { key: 'executiveName', label: 'Executive Name' },
                                { key: 'month', label: 'Month' },
                                { key: 'targetAmount', label: 'Monthly Target Amount (INR)', type: 'number' },
                                { key: 'achievedAmount', label: 'Achieved Amount (INR)', type: 'number' },
                                { key: 'leadsTarget', label: 'Leads Quota Target', type: 'number' },
                                { key: 'leadsConverted', label: 'Leads Converted', type: 'number' },
                              ],
                              t
                            )
                          }
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                        >
                          Edit Target
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORKSHOP & REPAIRS CONTROL */}
      {activeTab === 'repairs' && (
        <div className="space-y-6">
          {/* Job Cards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Workshop Job Cards Control</h2>
                <p className="text-xs text-slate-500">Create, edit, or override job card stages, technician assignments, and warranty status.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditor(
                      'Create New Workshop Job Card',
                      'REPAIRS',
                      'SAVE_JOB_CARD',
                      [
                        { key: 'customerName', label: 'Customer Name' },
                        { key: 'customerMobile', label: 'Customer Mobile' },
                        { key: 'customerVillage', label: 'Village / Town' },
                        { key: 'equipmentModel', label: 'Equipment Model' },
                        { key: 'serialNumber', label: 'Serial Number' },
                        { key: 'category', label: 'Equipment Category' },
                        {
                          key: 'warrantyStatus',
                          label: 'Warranty Status',
                          type: 'select',
                          options: ['IN_WARRANTY', 'OUT_OF_WARRANTY', 'EXTENDED_WARRANTY'],
                        },
                        { key: 'complaintText', label: 'Customer Complaint', type: 'textarea' },
                      ],
                      {
                        customerName: '',
                        customerMobile: '+91 98450 00000',
                        customerVillage: 'Hubballi',
                        equipmentModel: 'AgriPro 7HP Power Weeder',
                        serialNumber: `SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                        category: 'Power Weeder',
                        warrantyStatus: 'IN_WARRANTY',
                        complaintText: 'Engine vibration and carburetor tuning required',
                      }
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Job Card</span>
                </button>
                <Link
                  href="/repairs"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                >
                  <span>Open Workshop Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Job Card #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Equipment & Serial</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Technician & Bay</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.jobCards || [])
                    .filter((j: any) => !q || j.jobCardNumber?.toLowerCase().includes(q) || j.customerName?.toLowerCase().includes(q))
                    .map((j: any) => (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-rose-700">{j.jobCardNumber}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <div>{j.customerName}</div>
                          <div className="text-slate-500 font-normal">{j.customerMobile}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{j.equipmentModel}</div>
                          <div className="text-[11px] font-mono text-slate-500">{j.serialNumber}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold text-[10px]">
                            {j.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {j.assignedTechnicianName ? `${j.assignedTechnicianName} (${j.assignedBay || 'Bay 1'})` : 'Unassigned'}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditor(
                                `Edit Job Card: ${j.jobCardNumber}`,
                                'REPAIRS',
                                'SAVE_JOB_CARD',
                                [
                                  { key: 'customerName', label: 'Customer Name' },
                                  { key: 'customerMobile', label: 'Customer Mobile' },
                                  { key: 'customerVillage', label: 'Customer Village' },
                                  { key: 'equipmentModel', label: 'Equipment Model' },
                                  { key: 'serialNumber', label: 'Serial Number' },
                                  {
                                    key: 'status',
                                    label: 'Repair Stage / Status',
                                    type: 'select',
                                    options: [
                                      'REGISTERED',
                                      'INSPECTION_DIAGNOSIS',
                                      'ESTIMATE_APPROVAL',
                                      'BAY_ALLOCATION',
                                      'REPAIR_IN_PROGRESS',
                                      'SPARE_PARTS_ISSUED',
                                      'QUALITY_CHECK',
                                      'BILLING_INVOICE',
                                      'DELIVERED',
                                    ],
                                  },
                                  { key: 'assignedTechnicianName', label: 'Assigned Technician' },
                                  { key: 'assignedBay', label: 'Service Bay' },
                                  { key: 'complaintText', label: 'Complaint Text', type: 'textarea' },
                                  { key: 'diagnosisNotes', label: 'Diagnosis Notes', type: 'textarea' },
                                ],
                                j
                              )
                            }
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord('REPAIRS', 'DELETE_JOB_CARD', j.id, j.jobCardNumber)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spare Parts Catalogue & Stock */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Workshop Spare Parts Inventory & Pricing (INR)</h2>
                <p className="text-xs text-slate-500">Edit spare part prices, stock quantities, and reorder levels.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  openEditor(
                    'Add New Spare Part',
                    'REPAIRS',
                    'SAVE_SPARE_PART',
                    [
                      { key: 'partNumber', label: 'Part Number / SKU' },
                      { key: 'name', label: 'Spare Part Name' },
                      { key: 'category', label: 'Category' },
                      { key: 'unitPrice', label: 'Unit Price (INR)', type: 'number' },
                      { key: 'stockQuantity', label: 'Stock Quantity', type: 'number' },
                      { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
                      { key: 'locationRack', label: 'Workshop Rack Location' },
                    ],
                    {
                      partNumber: `SP-${Math.floor(1000 + Math.random() * 9000)}`,
                      name: '',
                      category: 'Engine & Fuel',
                      unitPrice: 650,
                      stockQuantity: 25,
                      reorderLevel: 5,
                      locationRack: 'Rack B-2',
                    }
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spare Part</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Part # & Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Unit Price (INR)</th>
                    <th className="px-4 py-3">Stock Qty</th>
                    <th className="px-4 py-3">Rack</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.spareParts || []).map((sp: any) => (
                    <tr key={sp.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="font-mono text-[11px] text-slate-500">{sp.partNumber}</div>
                        <div>{sp.name}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{sp.category}</td>
                      <td className="px-4 py-3 font-semibold">{formatINR(sp.unitPrice)}</td>
                      <td className="px-4 py-3 font-mono font-bold">{sp.stockQuantity}</td>
                      <td className="px-4 py-3 text-slate-500">{sp.locationRack || 'Main Store'}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditor(
                              `Edit Spare Part: ${sp.name}`,
                              'REPAIRS',
                              'SAVE_SPARE_PART',
                              [
                                { key: 'partNumber', label: 'Part Number' },
                                { key: 'name', label: 'Part Name' },
                                { key: 'category', label: 'Category' },
                                { key: 'unitPrice', label: 'Unit Price (INR)', type: 'number' },
                                { key: 'stockQuantity', label: 'Stock Quantity', type: 'number' },
                                { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
                                { key: 'locationRack', label: 'Location Rack' },
                              ],
                              sp
                            )
                          }
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord('REPAIRS', 'DELETE_SPARE_PART', sp.id, sp.name)}
                          className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FINANCE & DEALERS CONTROL */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Dealer Network, Commission Tiers & Targets (INR)</h2>
                <p className="text-xs text-slate-500">Add or edit dealers, commission rates, monthly targets, delivered sales, and payout balances.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditor(
                      'Add New Authorized Dealer',
                      'FINANCE',
                      'SAVE_DEALER',
                      [
                        { key: 'dealerCode', label: 'Dealer Code' },
                        { key: 'businessName', label: 'Dealer Business Name' },
                        { key: 'contactPerson', label: 'Principal Contact Person' },
                        { key: 'mobile', label: 'Mobile Number' },
                        { key: 'district', label: 'District' },
                        {
                          key: 'tier',
                          label: 'Commission Tier',
                          type: 'select',
                          options: ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'],
                        },
                        { key: 'baseCommissionRate', label: 'Base Commission Rate (%)', type: 'number' },
                        { key: 'targetBonusRate', label: 'Target Bonus Rate (%)', type: 'number' },
                        { key: 'monthlyTarget', label: 'Monthly Sales Target (INR)', type: 'number' },
                        { key: 'mtdDeliveredSales', label: 'MTD Delivered Sales (INR)', type: 'number' },
                        { key: 'pendingPayoutBalance', label: 'Pending Payout Balance (INR)', type: 'number' },
                      ],
                      {
                        dealerCode: `DLR-KA-${Math.floor(100 + Math.random() * 900)}`,
                        businessName: '',
                        contactPerson: '',
                        mobile: '+91 98450 00000',
                        district: 'Belagavi',
                        tier: 'GOLD',
                        baseCommissionRate: 8,
                        targetBonusRate: 2,
                        monthlyTarget: 500000,
                        mtdDeliveredSales: 350000,
                        pendingPayoutBalance: 28000,
                      }
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dealer</span>
                </button>
                <Link
                  href="/finance"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                >
                  <span>Open Finance Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Dealer & Code</th>
                    <th className="px-4 py-3">Tier & Rates</th>
                    <th className="px-4 py-3">Monthly Target (INR)</th>
                    <th className="px-4 py-3">MTD Delivered (INR)</th>
                    <th className="px-4 py-3">Pending Payout (INR)</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.dealers || [])
                    .filter((d: any) => !q || d.businessName?.toLowerCase().includes(q) || d.dealerCode?.toLowerCase().includes(q))
                    .map((d: any) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <div className="font-mono text-[11px] text-teal-700">{d.dealerCode}</div>
                          <div>{d.businessName}</div>
                          <div className="text-slate-500 font-normal">
                            {d.contactPerson} · {d.district}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                            {d.tier}
                          </span>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Base: {d.baseCommissionRate}% + Bonus: {d.targetBonusRate}%
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold">{formatINR(d.monthlyTarget)}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-700">{formatINR(d.mtdDeliveredSales)}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{formatINR(d.pendingPayoutBalance)}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditor(
                                `Edit Dealer: ${d.businessName}`,
                                'FINANCE',
                                'SAVE_DEALER',
                                [
                                  { key: 'dealerCode', label: 'Dealer Code' },
                                  { key: 'businessName', label: 'Business Name' },
                                  { key: 'contactPerson', label: 'Contact Person' },
                                  { key: 'mobile', label: 'Mobile Number' },
                                  { key: 'district', label: 'District' },
                                  {
                                    key: 'tier',
                                    label: 'Commission Tier',
                                    type: 'select',
                                    options: ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'],
                                  },
                                  { key: 'baseCommissionRate', label: 'Base Commission Rate (%)', type: 'number' },
                                  { key: 'targetBonusRate', label: 'Target Bonus Rate (%)', type: 'number' },
                                  { key: 'monthlyTarget', label: 'Monthly Target (INR)', type: 'number' },
                                  { key: 'mtdGrossSales', label: 'MTD Gross Sales (INR)', type: 'number' },
                                  { key: 'mtdDeliveredSales', label: 'MTD Delivered Sales (INR)', type: 'number' },
                                  { key: 'pendingPayoutBalance', label: 'Pending Payout Balance (INR)', type: 'number' },
                                ],
                                d
                              )
                            }
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord('FINANCE', 'DELETE_DEALER', d.id, d.businessName)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout Vouchers */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">Disbursement & Payout Vouchers Control</h2>
              <p className="text-xs text-slate-500">Edit voucher amounts, approval status, or NEFT/RTGS bank batch references.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">Voucher #</th>
                    <th className="px-4 py-3">Dealer</th>
                    <th className="px-4 py-3">Period</th>
                    <th className="px-4 py-3">Amount (INR)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(portalData.payoutRecords || []).map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-teal-700">{v.voucherNumber}</td>
                      <td className="px-4 py-3 font-semibold">{v.businessName}</td>
                      <td className="px-4 py-3">{v.period}</td>
                      <td className="px-4 py-3 font-bold">{formatINR(v.amount)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-[10px]">
                          {v.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openEditor(
                              `Edit Payout Voucher: ${v.voucherNumber}`,
                              'FINANCE',
                              'SAVE_PAYOUT',
                              [
                                { key: 'period', label: 'Incentive Period' },
                                { key: 'amount', label: 'Voucher Amount (INR)', type: 'number' },
                                {
                                  key: 'status',
                                  label: 'Disbursement Status',
                                  type: 'select',
                                  options: ['RECORDED_FOR_DISBURSEMENT', 'FINANCE_APPROVED', 'EXTERNALLY_SETTLED'],
                                },
                                { key: 'bankBatchReference', label: 'NEFT/RTGS Bank Batch Reference' },
                              ],
                              v
                            )
                          }
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                        >
                          Edit Voucher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">{modalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs overflow-y-auto">
              {modalFields.map((field) => (
                <div key={field.key}>
                  <label className="block font-semibold text-slate-700 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={modalForm[field.key] ?? ''}
                      onChange={(e) => setModalForm({ ...modalForm, [field.key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                    >
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={modalForm[field.key] ?? ''}
                      onChange={(e) => setModalForm({ ...modalForm, [field.key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      step={field.type === 'number' ? 'any' : undefined}
                      value={modalForm[field.key] ?? ''}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          [field.key]: field.type === 'number' ? e.target.value : e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPortalsControlPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-500">Loading Master Portal Control Center...</div>}>
      <PortalsControlContent />
    </Suspense>
  );
}
