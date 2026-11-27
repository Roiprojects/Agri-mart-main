'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Warehouse,
  Store,
  Users,
  Package,
  ArrowLeftRight,
  Inbox,
  ShoppingBag,
  Truck,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Printer,
  KeyRound,
  Upload,
  RefreshCw,
  MapPin,
  FileText,
  ShieldCheck,
  Search,
  Send,
  Clock,
} from 'lucide-react';

type TabId =
  | 'locations'
  | 'stock'
  | 'transfers'
  | 'incoming'
  | 'orders'
  | 'deliveries'
  | 'exceptions';

const ALL_ROLES = [
  'CENTRAL_ADMIN',
  'WAREHOUSE_MANAGER',
  'DISPATCH_STAFF',
  'RECEIVING_STAFF',
  'FRANCHISEE_MANAGER',
  'FRANCHISEE_DELIVERY',
] as const;

export default function WarehousePortalPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('locations');

  // Active signed-in staff & location switcher
  const [activeStaffId, setActiveStaffId] = useState<string>('');
  const [activeLocationId, setActiveLocationId] = useState<string>('ALL');

  // Filters
  const [stockLocationFilter, setStockLocationFilter] = useState<string>('');
  const [stockBalanceFilter, setStockBalanceFilter] = useState<'ALL' | 'ON_HAND' | 'RESERVED' | 'AVAILABLE' | 'HELD' | 'INCOMING'>('ALL');
  const [incomingSearch, setIncomingSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals state
  const [whModal, setWhModal] = useState<any>(null);
  const [frModal, setFrModal] = useState<any>(null);
  const [staffModal, setStaffModal] = useState<any>(null);
  const [carrierModal, setCarrierModal] = useState<any>(null);
  const [stockModal, setStockModal] = useState<any>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [challanModal, setChallanModal] = useState<{ transfer: any; group: any } | null>(null);
  const [receiveModal, setReceiveModal] = useState<{ transfer: any; group: any } | null>(null);
  const [routeModal, setRouteModal] = useState<{ order: any; preview: any } | null>(null);
  const [timelineOrder, setTimelineOrder] = useState<any>(null);
  const [carrierDispatchOrder, setCarrierDispatchOrder] = useState<any>(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [deliveryOtpModal, setDeliveryOtpModal] = useState<any>(null);
  const [failedDeliveryModal, setFailedDeliveryModal] = useState<any>(null);
  const [resolveExModal, setResolveExModal] = useState<any>(null);

  // Transfer builder state
  const [trfSourceId, setTrfSourceId] = useState('');
  const [trfNotes, setTrfNotes] = useState('');
  const [trfGroups, setTrfGroups] = useState<any[]>([]);

  // Challan & Pickup OTP form state
  const [vehReg, setVehReg] = useState('');
  const [vehType, setVehType] = useState('');
  const [drvName, setDrvName] = useState('');
  const [drvRef, setDrvRef] = useState('');
  const [drvMobile, setDrvMobile] = useState('');
  const [pickupOtpInput, setPickupOtpInput] = useState('');

  // Receive form state
  const [recvCounts, setRecvCounts] = useState<Record<string, { goodQty: number; damagedQty: number }>>({});
  const [recvNotes, setRecvNotes] = useState('');
  const [recvOtpInput, setRecvOtpInput] = useState('');
  const [recvSignedFile, setRecvSignedFile] = useState('');
  const [reassignStaffId, setReassignStaffId] = useState('');

  // Demo order form state
  const [demoOrderForm, setDemoOrderForm] = useState({
    customerName: '',
    customerMobile: '',
    addressLine: '',
    district: '',
    pincode: '',
    latitude: '15.39',
    longitude: '75.15',
    productId: '',
    variantId: '',
    quantity: 1,
  });

  // Carrier dispatch form state
  const [carIdInput, setCarIdInput] = useState('');
  const [awbInput, setAwbInput] = useState('');
  const [courierOtpInput, setCourierOtpInput] = useState('');

  // Customer OTP & Failed delivery
  const [custOtpInput, setCustOtpInput] = useState('');
  const [failReason, setFailReason] = useState('');
  const [failAction, setFailAction] = useState<'RETRY' | 'RESCHEDULE' | 'RETURN' | 'EXCEPTION'>('RETRY');

  // Exception resolution
  const [exResNote, setExResNote] = useState('');
  const [exRestockLocId, setExRestockLocId] = useState('');

  const notify = (type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  const loadPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/warehouse/portal');
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (!activeStaffId && json.staffUsers?.length > 0) {
          setActiveStaffId(json.staffUsers[0].id);
        }
        if (!stockLocationFilter && json.warehouses?.length > 0) {
          setStockLocationFilter(json.warehouses[0].id);
        }
        if (!trfSourceId && json.warehouses?.length > 0) {
          setTrfSourceId(json.warehouses[0].id);
        }
        if (!carIdInput && json.carriers?.length > 0) {
          setCarIdInput(json.carriers[0].id);
        }
      } else {
        notify('err', json.error || 'Failed to load warehouse portal');
      }
    } catch (err: any) {
      notify('err', err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortal();
  }, []);

  const postAction = async (payload: any) => {
    setBusy(true);
    try {
      const res = await fetch('/api/warehouse/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        notify('err', json.error || 'Action failed');
        return null;
      }
      if (json.message) notify('ok', json.message);
      await loadPortal();
      return json;
    } catch (err: any) {
      notify('err', err.message || 'Request error');
      return null;
    } finally {
      setBusy(false);
    }
  };

  const activeStaff = useMemo(
    () => data?.staffUsers?.find((s: any) => s.id === activeStaffId) || data?.staffUsers?.[0] || null,
    [data, activeStaffId]
  );

  const allLocations = useMemo(() => {
    if (!data) return [];
    return [
      ...(data.warehouses || []).map((w: any) => ({ ...w, kind: 'WAREHOUSE' })),
      ...(data.franchisees || []).map((f: any) => ({ ...f, kind: 'FRANCHISEE' })),
    ];
  }, [data]);

  const computeIncomingQty = (locationId: string, productId: string, variantId: string) => {
    let total = 0;
    for (const t of data?.transfers || []) {
      for (const g of t.groups || []) {
        if (
          g.destinationId === locationId &&
          ['IN_TRANSIT', 'PARTIAL_RECEIPT', 'PENDING_SIGNED_COPY'].includes(g.status)
        ) {
          for (const it of g.items || []) {
            if (it.productId === productId && it.variantId === variantId) {
              total += Math.max(0, it.packedQty - (it.receivedGoodQty + it.receivedDamagedQty));
            }
          }
        }
      }
    }
    return total;
  };

  const openRoutePreview = async (order: any) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/warehouse/portal?routePreviewOrderId=${order.id}`);
      const json = await res.json();
      if (json.success && json.preview) {
        setRouteModal({ order, preview: json.preview });
      } else {
        notify('err', json.error || 'Could not compute route preview');
      }
    } finally {
      setBusy(false);
    }
  };

  const openTransferBuilder = () => {
    const firstDest = data?.warehouses?.[1]?.id || data?.franchisees?.[0]?.id || data?.warehouses?.[0]?.id || '';
    const firstVar = data?.catalogVariants?.[0];
    setTrfSourceId(data?.warehouses?.[0]?.id || '');
    setTrfNotes('');
    setTrfGroups([
      {
        destinationId: firstDest,
        transportMethod: 'OWN_VEHICLE',
        items: firstVar
          ? [
              {
                productId: firstVar.productId,
                variantId: firstVar.variantId,
                productName: firstVar.productName,
                variantName: firstVar.variantName,
                sku: firstVar.sku,
                requestedQty: 1,
                orderId: '',
              },
            ]
          : [],
      },
    ]);
    setTransferModalOpen(true);
  };

  const incomingGroups = useMemo(() => {
    const list: { transfer: any; group: any }[] = [];
    for (const t of data?.transfers || []) {
      for (const g of t.groups || []) {
        if (activeLocationId !== 'ALL' && g.destinationId !== activeLocationId) continue;
        if (['DRAFT', 'PREPARED', 'CANCELLED'].includes(g.status)) continue;
        if (incomingSearch.trim()) {
          const q = incomingSearch.toLowerCase();
          const match =
            t.transferNumber.toLowerCase().includes(q) ||
            (g.challan?.challanNumber || '').toLowerCase().includes(q) ||
            g.items.some(
              (i: any) =>
                (i.packageId || '').toLowerCase().includes(q) ||
                (i.orderNumber || '').toLowerCase().includes(q) ||
                i.productName.toLowerCase().includes(q)
            );
          if (!match) continue;
        }
        list.push({ transfer: t, group: g });
      }
    }
    return list;
  }, [data, activeLocationId, incomingSearch]);

  const deliveryOrders = useMemo(() => {
    return (data?.orders || []).filter((o: any) => {
      if (!o.fulfillment) return false;
      if (!o.fulfillment.franchiseeId) return false;
      if (activeLocationId !== 'ALL' && o.fulfillment.franchiseeId !== activeLocationId) return false;
      return true;
    });
  }, [data, activeLocationId]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Loading Warehouse &amp; Franchisee Fulfillment Portal...</span>
        </div>
      </div>
    );
  }

  const openExceptionsCount = (data?.exceptions || []).filter((e: any) => e.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-5">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg border shadow-xl text-xs font-medium flex items-center gap-2 ${
            toast.type === 'ok'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/95 border-rose-500/50 text-rose-200'
          }`}
        >
          {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header & Staff/Location Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                Dark Warehouse &amp; Franchisee Fulfillment Portal
              </h1>
              <p className="text-xs text-slate-400">
                Stock Transfers, Two-Copy Challans, OTP Handover, Multi-Leg Order Routing &amp; Direct Delivery
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Active Staff Switcher */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Signed-in Staff</label>
            <select
              value={activeStaffId}
              onChange={(e) => setActiveStaffId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              {(data?.staffUsers || []).map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.assignments?.flatMap((a: any) => a.roles).join(', ') || u.status})
                </option>
              ))}
            </select>
          </div>

          {/* Active Location Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Active Location View</label>
            <select
              value={activeLocationId}
              onChange={(e) => setActiveLocationId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Locations (Central View)</option>
              {(data?.warehouses || []).map((w: any) => (
                <option key={w.id} value={w.id}>
                  [{w.tier}] {w.name}
                </option>
              ))}
              {(data?.franchisees || []).map((f: any) => (
                <option key={f.id} value={f.id}>
                  [FRANCHISEE] {f.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => postAction({ action: 'SEED_TEST_SCENARIOS' })}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Seed Test Data (All Categories)</span>
          </button>

          <a
            href="/admin"
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Super Admin</span>
          </a>

          <button
            type="button"
            onClick={loadPortal}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'locations', label: '01. Locations & Access', icon: Users },
          { id: 'stock', label: '02. Stock & Availability', icon: Package },
          { id: 'transfers', label: '03-04. Stock Transfers & Challans', icon: ArrowLeftRight },
          { id: 'incoming', label: `05. Incoming (${incomingGroups.length})`, icon: Inbox },
          { id: 'orders', label: `06-07. Orders → Dispatch (${data?.orders?.length || 0})`, icon: ShoppingBag },
          { id: 'deliveries', label: `08. My Deliveries (${deliveryOrders.length})`, icon: Truck },
          { id: 'exceptions', label: `10. Exceptions & Returns (${openExceptionsCount})`, icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LOCATIONS, FRANCHISEES, STAFF ACCESS & CARRIERS */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          {/* Warehouses */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white">Warehouses (Main &amp; Branches)</h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setWhModal({
                    name: '',
                    code: '',
                    tier: 'BRANCH',
                    address: '',
                    district: '',
                    latitude: 15.3647,
                    longitude: 75.124,
                    serviceRadiusKm: 60,
                    servicedPincodes: '',
                    managerName: '',
                    operatingContact: '',
                    isActive: true,
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Warehouse
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Code / Tier</th>
                    <th className="py-2 px-3">Name &amp; Address</th>
                    <th className="py-2 px-3">District / Radius</th>
                    <th className="py-2 px-3">Manager &amp; Contact</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.warehouses || []).map((w: any) => (
                    <tr key={w.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono">
                        <span className="text-emerald-300 font-semibold">{w.code}</span>
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {w.tier}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-white">{w.name}</div>
                        <div className="text-[11px] text-slate-400">{w.address}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        <div>{w.district}</div>
                        <div className="text-[11px] text-slate-400">{w.serviceRadiusKm} km radius</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        <div>{w.managerName}</div>
                        <div className="text-[11px] text-slate-400">{w.operatingContact || w.contactNumber}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            w.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {w.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setWhModal({ ...w })}
                          className="text-sky-400 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => postAction({ action: 'DELETE_WAREHOUSE', id: w.id })}
                          className="text-rose-400 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Franchisees */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-white">Franchisees &amp; Linked Warehouses</h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFrModal({
                    name: '',
                    code: '',
                    address: '',
                    district: '',
                    latitude: 15.4,
                    longitude: 75.15,
                    contact: '',
                    linkedWarehouseIds: [],
                    isActive: true,
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Franchisee
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Code</th>
                    <th className="py-2 px-3">Name &amp; Address</th>
                    <th className="py-2 px-3">Contact</th>
                    <th className="py-2 px-3">Linked Warehouses</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.franchisees || []).map((f: any) => (
                    <tr key={f.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-amber-300 font-semibold">{f.code}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-white">{f.name}</div>
                        <div className="text-[11px] text-slate-400">{f.address} ({f.district})</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{f.contact}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {(f.linkedWarehouseIds || []).map((wid: string) => {
                            const wh = data?.warehouses?.find((w: any) => w.id === wid);
                            return (
                              <span key={wid} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">
                                {wh ? wh.name : wid}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            f.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {f.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setFrModal({ ...f })}
                          className="text-sky-400 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => postAction({ action: 'DELETE_FRANCHISEE', id: f.id })}
                          className="text-rose-400 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Users and Access */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-white">Users &amp; Access (Staff Profiles &amp; Roles)</h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setStaffModal({
                    name: '',
                    email: '',
                    mobile: '',
                    status: 'ACTIVE',
                    assignments: [
                      {
                        locationId: allLocations[0]?.id || '',
                        locationKind: allLocations[0]?.kind || 'WAREHOUSE',
                        roles: ['RECEIVING_STAFF'],
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Invite Staff User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Staff Name</th>
                    <th className="py-2 px-3">Email / Mobile</th>
                    <th className="py-2 px-3">Location &amp; Role Assignments</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.staffUsers || []).map((u: any) => (
                    <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-medium text-white">{u.name}</td>
                      <td className="py-2.5 px-3 text-slate-300">
                        <div>{u.email}</div>
                        <div className="text-[11px] text-slate-400">{u.mobile}</div>
                      </td>
                      <td className="py-2.5 px-3 space-y-1">
                        {(u.assignments || []).map((a: any, idx: number) => {
                          const loc = allLocations.find((l: any) => l.id === a.locationId);
                          return (
                            <div key={idx} className="text-[11px]">
                              <span className="text-emerald-300 font-medium">{loc?.name || a.locationId}</span>
                              <span className="text-slate-400"> — {a.roles.join(', ')}</span>
                            </div>
                          );
                        })}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : u.status === 'SUSPENDED'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setStaffModal({ ...u })}
                          className="text-sky-400 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => postAction({ action: 'RESEND_INVITE', id: u.id })}
                          className="text-amber-400 hover:underline cursor-pointer"
                        >
                          Resend Invite
                        </button>
                        <button
                          type="button"
                          onClick={() => postAction({ action: 'TOGGLE_STAFF_STATUS', id: u.id })}
                          className="text-slate-300 hover:underline cursor-pointer"
                        >
                          {u.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                        </button>
                        <button
                          type="button"
                          onClick={() => postAction({ action: 'DELETE_STAFF', id: u.id })}
                          className="text-rose-400 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Delivery Channel Partners */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-white">Delivery Channel Partners (Configurable Carriers)</h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCarrierModal({
                    name: '',
                    code: '',
                    mode: 'MANUAL',
                    trackingUrlTemplate: '',
                    contactMobile: '',
                    isActive: true,
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Delivery Partner
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Code</th>
                    <th className="py-2 px-3">Carrier Name</th>
                    <th className="py-2 px-3">Mode</th>
                    <th className="py-2 px-3">Tracking URL Template</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.carriers || []).map((c: any) => (
                    <tr key={c.id} className="border-b border-slate-800/60">
                      <td className="py-2 px-3 font-mono text-purple-300">{c.code}</td>
                      <td className="py-2 px-3 font-medium text-white">{c.name}</td>
                      <td className="py-2 px-3">{c.mode}</td>
                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{c.trackingUrlTemplate}</td>
                      <td className="py-2 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setCarrierModal({ ...c })}
                          className="text-sky-400 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => postAction({ action: 'DELETE_CARRIER', id: c.id })}
                          className="text-rose-400 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: PRODUCT STOCK & AVAILABILITY */}
      {activeTab === 'stock' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-300">Location:</label>
              <select
                value={stockLocationFilter}
                onChange={(e) => setStockLocationFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              >
                {allLocations.map((l: any) => (
                  <option key={l.id} value={l.id}>
                    [{l.kind}] {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 mr-1">Balances:</span>
              {[
                { key: 'ALL', label: 'All', activeClass: 'bg-slate-700 text-white border-slate-500' },
                { key: 'ON_HAND', label: 'On hand', activeClass: 'bg-white text-slate-950 border-white' },
                { key: 'RESERVED', label: 'Reserved', activeClass: 'bg-amber-500/25 text-amber-300 border-amber-400' },
                { key: 'AVAILABLE', label: 'Available', activeClass: 'bg-emerald-500/25 text-emerald-300 border-emerald-400' },
                { key: 'HELD', label: 'Held', activeClass: 'bg-rose-500/25 text-rose-300 border-rose-400' },
                { key: 'INCOMING', label: 'Incoming', activeClass: 'bg-sky-500/25 text-sky-300 border-sky-400' },
              ].map((b) => {
                const isActive = stockBalanceFilter === b.key;
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setStockBalanceFilter(isActive && b.key !== 'ALL' ? 'ALL' : (b.key as any))}
                    className={`px-2.5 py-1 rounded-md border font-semibold transition cursor-pointer ${
                      isActive
                        ? b.activeClass
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Product &amp; Variant</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className={`py-2.5 px-3 text-center ${stockBalanceFilter === 'ON_HAND' ? 'text-white bg-slate-800/60' : ''}`}>On hand</th>
                    <th className={`py-2.5 px-3 text-center ${stockBalanceFilter === 'RESERVED' ? 'text-amber-300 bg-amber-950/40' : ''}`}>Reserved</th>
                    <th className={`py-2.5 px-3 text-center ${stockBalanceFilter === 'AVAILABLE' ? 'text-emerald-300 bg-emerald-950/40' : ''}`}>Available</th>
                    <th className={`py-2.5 px-3 text-center ${stockBalanceFilter === 'HELD' ? 'text-rose-300 bg-rose-950/40' : ''}`}>Held</th>
                    <th className={`py-2.5 px-3 text-center ${stockBalanceFilter === 'INCOMING' ? 'text-sky-300 bg-sky-950/40' : ''}`}>Incoming</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filteredVariants = (data?.catalogVariants || [])
                      .map((cv: any) => {
                        const row = (data?.stocks || []).find(
                          (s: any) =>
                            s.locationId === stockLocationFilter &&
                            s.productId === cv.productId &&
                            s.variantId === cv.variantId
                        );
                        const onHand = row?.onHand || 0;
                        const reserved = row?.reserved || 0;
                        const available = Math.max(0, onHand - reserved);
                        const held = row?.held || 0;
                        const incoming = computeIncomingQty(stockLocationFilter, cv.productId, cv.variantId);
                        return { cv, onHand, reserved, available, held, incoming };
                      })
                      .filter((item: any) => {
                        if (stockBalanceFilter === 'ON_HAND') return item.onHand > 0;
                        if (stockBalanceFilter === 'RESERVED') return item.reserved > 0;
                        if (stockBalanceFilter === 'AVAILABLE') return item.available > 0;
                        if (stockBalanceFilter === 'HELD') return item.held > 0;
                        if (stockBalanceFilter === 'INCOMING') return item.incoming > 0;
                        return true;
                      });

                    if (filteredVariants.length === 0) {
                      return (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            No items with <strong>{stockBalanceFilter.replace('_', ' ')}</strong> balance at this location.{' '}
                            {stockBalanceFilter !== 'ALL' && (
                              <button
                                type="button"
                                onClick={() => setStockBalanceFilter('ALL')}
                                className="text-sky-400 hover:underline ml-1 cursor-pointer"
                              >
                                Show all items
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    }

                    return filteredVariants.map(({ cv, onHand, reserved, available, held, incoming }: any) => {

                    return (
                      <tr key={`${cv.productId}-${cv.variantId}`} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-white">{cv.productName}</div>
                          <div className="text-[11px] text-slate-400">{cv.variantName}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-300">{cv.sku}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-white">{onHand}</td>
                        <td className="py-2.5 px-3 text-center text-amber-300">{reserved}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{available}</td>
                        <td className="py-2.5 px-3 text-center text-rose-400">{held}</td>
                        <td className="py-2.5 px-3 text-center text-sky-400">{incoming}</td>
                        <td className="py-2.5 px-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              setStockModal({
                                mode: 'OPENING',
                                locationId: stockLocationFilter,
                                productId: cv.productId,
                                variantId: cv.variantId,
                                productName: cv.productName,
                                variantName: cv.variantName,
                                quantity: onHand,
                                delta: 0,
                                reason: 'Opening balance',
                              })
                            }
                            className="text-sky-400 hover:underline cursor-pointer"
                          >
                            Opening
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setStockModal({
                                mode: 'ADJUST',
                                locationId: stockLocationFilter,
                                productId: cv.productId,
                                variantId: cv.variantId,
                                productName: cv.productName,
                                variantName: cv.variantName,
                                quantity: onHand,
                                delta: 0,
                                reason: '',
                              })
                            }
                            className="text-amber-400 hover:underline cursor-pointer"
                          >
                            Adjust
                          </button>
                          {held > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                postAction({
                                  action: 'RELEASE_HELD_STOCK',
                                  locationId: stockLocationFilter,
                                  productId: cv.productId,
                                  variantId: cv.variantId,
                                  productName: cv.productName,
                                  variantName: cv.variantName,
                                  qty: held,
                                  toAvailable: true,
                                  performedBy: activeStaff?.name,
                                })
                              }
                              className="text-emerald-400 hover:underline cursor-pointer"
                            >
                              Release Held
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Adjustment Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Stock Ledger</h3>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {(data?.adjustmentLogs || []).length === 0 ? (
                <div className="text-xs text-slate-500">No stock adjustments recorded yet.</div>
              ) : (
                (data?.adjustmentLogs || []).map((log: any) => (
                  <div key={log.id} className="text-xs flex flex-wrap items-center justify-between gap-2 py-1.5 border-b border-slate-800/60">
                    <div>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 mr-2">
                        {log.type}
                      </span>
                      <span className="font-medium text-white">{log.productName}</span>{' '}
                      <span className="text-slate-400">({log.variantName})</span> — {log.reason}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={log.delta >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {log.delta >= 0 ? `+${log.delta}` : log.delta}
                      </span>
                      <span className="text-[11px] text-slate-500">{log.performedBy}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STOCK TRANSFERS & CHALLANS */}
      {activeTab === 'transfers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Prepare single or multi-stop bulk transfers (Replenishment, Order Packages, or Mixed), issue two challan copies, and verify driver Pickup OTP.
            </p>
            <button
              type="button"
              onClick={openTransferBuilder}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Stock Transfer / Bulk Trip
            </button>
          </div>

          {(data?.transfers || []).length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              No stock transfers created yet. Click &quot;New Stock Transfer / Bulk Trip&quot; to begin.
            </div>
          ) : (
            <div className="space-y-4">
              {(data?.transfers || []).map((t: any) => (
                <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="font-mono text-sm font-semibold text-emerald-400">{t.transferNumber}</span>
                      <span className="ml-2 text-xs text-slate-300">From: {t.sourceWarehouseName}</span>
                      {t.isBulkTrip && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                          Multi-Stop Bulk Trip ({t.groups.length} stops)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{t.notes}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {t.groups.map((g: any, gIdx: number) => (
                      <div key={g.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-semibold text-white">Stop {gIdx + 1}: → {g.destinationName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">{g.purpose}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-sky-300">{g.transportMethod}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold">
                              {g.status}
                            </span>
                            {g.challan?.challanNumber && (
                              <span className="font-mono text-[11px] text-amber-300">Challan: {g.challan.challanNumber}</span>
                            )}
                            {g.awbNumber && (
                              <span className="font-mono text-[11px] text-purple-300">AWB: {g.awbNumber}</span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {g.status === 'DRAFT' && (
                              <button
                                type="button"
                                onClick={() => postAction({ action: 'PREPARE_TRANSFER_GROUP', transferId: t.id, groupId: g.id })}
                                className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-[11px] font-semibold text-white cursor-pointer"
                              >
                                Prepare (Reserve Stock)
                              </button>
                            )}
                            {g.status === 'PREPARED' && g.transportMethod === 'OWN_VEHICLE' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setVehReg(g.vehicleRegistration || '');
                                  setVehType(g.vehicleType || '');
                                  setDrvName(g.driverName || '');
                                  setDrvRef(g.driverReference || '');
                                  setDrvMobile(g.driverMobile || '');
                                  setPickupOtpInput('');
                                  setChallanModal({ transfer: t, group: g });
                                }}
                                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-[11px] font-semibold text-white cursor-pointer"
                              >
                                Own Vehicle &amp; 2-Copy Challan
                              </button>
                            )}
                            {g.challan && (
                              <button
                                type="button"
                                onClick={() => {
                                  setVehReg(g.vehicleRegistration || '');
                                  setVehType(g.vehicleType || '');
                                  setDrvName(g.driverName || '');
                                  setDrvRef(g.driverReference || '');
                                  setDrvMobile(g.driverMobile || '');
                                  setPickupOtpInput('');
                                  setChallanModal({ transfer: t, group: g });
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 cursor-pointer"
                              >
                                View Challan Copies
                              </button>
                            )}
                            {g.status === 'PREPARED' && g.transportMethod === 'DELIVERY_PARTNER' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const otp = window.prompt('Enter/Confirm Courier Pickup? Leave blank to generate AWB + Courier OTP first.');
                                  if (!otp) {
                                    postAction({
                                      action: 'DISPATCH_PARTNER_GROUP',
                                      transferId: t.id,
                                      groupId: g.id,
                                      carrierId: data?.carriers?.[0]?.id,
                                      generateCourierOtp: true,
                                    }).then((r) => {
                                      if (r?.courierOtpCode) alert(`Courier OTP: ${r.courierOtpCode} (AWB: ${r.awbNumber})`);
                                    });
                                  } else {
                                    postAction({
                                      action: 'DISPATCH_PARTNER_GROUP',
                                      transferId: t.id,
                                      groupId: g.id,
                                      otpCode: otp,
                                    });
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-[11px] font-semibold text-white cursor-pointer"
                              >
                                {g.courierOtpCode ? `Verify Courier OTP (${g.courierOtpCode})` : 'Book Partner & Gen OTP'}
                              </button>
                            )}
                            {(g.status === 'DRAFT' || g.status === 'PREPARED') && (
                              <button
                                type="button"
                                onClick={() => postAction({ action: 'CANCEL_TRANSFER_GROUP', transferId: t.id, groupId: g.id })}
                                className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-[11px] text-rose-200 cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 space-y-1">
                          {g.items.map((it: any) => (
                            <div key={it.id} className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/70 px-2.5 py-1.5 rounded">
                              <div>
                                <span className="font-mono text-slate-400 mr-2">{it.packageId}</span>
                                <span className="font-medium text-white">{it.productName}</span> ({it.variantName})
                                {it.orderNumber && (
                                  <span className="ml-2 px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px]">
                                    Order #{it.orderNumber}
                                  </span>
                                )}
                              </div>
                              <div>
                                Packed: <strong>{it.packedQty}</strong> | Recv Good: <strong>{it.receivedGoodQty}</strong> | Damaged:{' '}
                                <strong>{it.receivedDamagedQty}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INCOMING & RECEIVING */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={incomingSearch}
              onChange={(e) => setIncomingSearch(e.target.value)}
              placeholder="Search by transfer #, challan #, package ID, order #, or product..."
              className="flex-1 bg-transparent text-xs text-white outline-none"
            />
          </div>

          {incomingGroups.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              No incoming loads for the current location view.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingGroups.map(({ transfer: t, group: g }) => (
                <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs space-x-2">
                      <span className="font-mono font-semibold text-sky-400">{t.transferNumber}</span>
                      <span className="text-slate-300">
                        {t.sourceWarehouseName} → <strong className="text-white">{g.destinationName}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300">{g.status}</span>
                      {g.challan?.challanNumber && (
                        <span className="font-mono text-[11px] text-slate-400">Challan: {g.challan.challanNumber}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {g.status !== 'RECEIVED' && (
                        <button
                          type="button"
                          onClick={() => {
                            const initCounts: Record<string, { goodQty: number; damagedQty: number }> = {};
                            for (const it of g.items) {
                              const rem = Math.max(0, it.packedQty - (it.receivedGoodQty + it.receivedDamagedQty));
                              initCounts[it.id] = { goodQty: rem, damagedQty: 0 };
                            }
                            setRecvCounts(initCounts);
                            setRecvNotes('');
                            setRecvOtpInput('');
                            setRecvSignedFile(g.challan?.signedCopyAttachment || '');
                            setReassignStaffId(activeStaff?.id || '');
                            setReceiveModal({ transfer: t, group: g });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer"
                        >
                          Receive &amp; Post Receipt
                        </button>
                      )}
                      {g.status === 'PENDING_SIGNED_COPY' && (
                        <button
                          type="button"
                          onClick={() =>
                            postAction({
                              action: 'UPLOAD_SIGNED_COPY',
                              transferId: t.id,
                              groupId: g.id,
                              signedCopyAttachment: 'signed-ack-upload.png',
                              signedByName: activeStaff?.name,
                              signedByRole: activeStaff?.assignments?.[0]?.roles?.[0],
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white cursor-pointer"
                        >
                          Upload Signed Copy Now
                        </button>
                      )}
                    </div>
                  </div>

                  {g.receipts?.length > 0 && (
                    <div className="text-[11px] text-slate-400 space-y-1 border-t border-slate-800 pt-2">
                      {g.receipts.map((r: any) => (
                        <div key={r.id}>
                          Receipt <strong className="text-emerald-300">{r.receiptNumber}</strong> ({r.status}) accepted by{' '}
                          <strong className="text-white">{r.receiverName}</strong> ({r.receiverRole}) at {r.locationName}
                          {r.signedCopyAttached ? ' • Signed Copy Attached' : ' • Signed Copy Pending'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ORDERS -> DISPATCH & MULTI-LEG ROUTING */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order # or customer..."
                className="flex-1 bg-transparent text-xs text-white outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const firstVar = data?.catalogVariants?.[0];
                setDemoOrderForm({
                  customerName: '',
                  customerMobile: '',
                  addressLine: '',
                  district: '',
                  pincode: '',
                  latitude: '15.39',
                  longitude: '75.15',
                  productId: firstVar?.productId || '',
                  variantId: firstVar?.variantId || '',
                  quantity: 1,
                });
                setNewOrderModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Order (For Walkthrough)
            </button>
          </div>

          <div className="space-y-3">
            {(data?.orders || [])
              .filter((o: any) => {
                if (!orderSearch.trim()) return true;
                const q = orderSearch.toLowerCase();
                return (
                  o.orderNumber?.toLowerCase().includes(q) ||
                  o.shippingAddress?.fullName?.toLowerCase().includes(q)
                );
              })
              .map((o: any) => {
                const ful = o.fulfillment;
                return (
                  <div key={o.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-sm font-semibold text-white">#{o.orderNumber}</span>
                        <span className="text-slate-300">{o.shippingAddress?.fullName || o.user?.name}</span>
                        <span className="text-slate-400">
                          {o.shippingAddress?.district} ({o.shippingAddress?.pincode})
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-semibold">
                          {ful ? ful.status : o.status}
                        </span>
                        {ful?.routePattern && (
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px]">
                            {ful.routePattern}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {(!ful || ful.status === 'UNALLOCATED' || ful.status === 'ALLOCATION_REVIEW') && (
                          <button
                            type="button"
                            onClick={() => openRoutePreview(o)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white cursor-pointer"
                          >
                            Dispatch (Choose Route)
                          </button>
                        )}
                        {ful?.routePattern === 'CARRIER_DIRECT' && ful.status === 'READY_FOR_DISPATCH' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCarIdInput(ful.carrierId || data?.carriers?.[0]?.id || '');
                              setAwbInput(ful.awbNumber || '');
                              setCourierOtpInput('');
                              setCarrierDispatchOrder(o);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white cursor-pointer"
                          >
                            Dispatch via Delivery Partner
                          </button>
                        )}
                        {ful && (
                          <button
                            type="button"
                            onClick={() => setTimelineOrder(o)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
                          >
                            Custody Timeline
                          </button>
                        )}
                        {o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && (
                          <button
                            type="button"
                            onClick={() => postAction({ action: 'CANCEL_ORDER_FULFILLMENT', orderId: o.id, reason: 'Cancelled by operator' })}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-xs text-rose-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 flex flex-wrap gap-3">
                      {(o.items || []).map((it: any) => (
                        <span key={it.id} className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {it.productName} ({it.variantName || 'Standard'}) × <strong>{it.quantity}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 6: MY DELIVERIES (FRANCHISEE DIRECT DELIVERY) */}
      {activeTab === 'deliveries' && (
        <div className="space-y-3">
          {deliveryOrders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              No franchisee delivery jobs assigned yet. Route an order to a franchisee first.
            </div>
          ) : (
            deliveryOrders.map((o: any) => {
              const ful = o.fulfillment;
              const waiting = ful.status === 'WAITING_FOR_STOCK' || ful.status === 'IN_TRANSIT';
              return (
                <div key={o.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs space-x-2">
                      <span className="font-mono text-sm font-semibold text-white">#{o.orderNumber}</span>
                      <span className="text-slate-300">{o.shippingAddress?.fullName}</span>
                      <span className="text-slate-400">• {o.shippingAddress?.addressLine}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                        {ful.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {waiting && (
                        <span className="text-[11px] text-slate-400">Waiting for incoming warehouse receipt</span>
                      )}
                      {ful.status === 'READY_FOR_DELIVERY' && (
                        <button
                          type="button"
                          onClick={() =>
                            postAction({
                              action: 'MARK_OUT_FOR_DELIVERY',
                              orderId: o.id,
                              staffId: activeStaff?.id,
                              staffName: activeStaff?.name,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white cursor-pointer"
                        >
                          Mark Out for Delivery
                        </button>
                      )}
                      {ful.status === 'OUT_FOR_DELIVERY' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setCustOtpInput('');
                              setDeliveryOtpModal(o);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer"
                          >
                            Verify Customer OTP ({ful.customerOtpCode})
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFailReason('');
                              setFailAction('RETRY');
                              setFailedDeliveryModal(o);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-xs font-semibold text-white cursor-pointer"
                          >
                            Failed Attempt
                          </button>
                        </>
                      )}
                      {ful.status === 'DELIVERED' && (
                        <span className="text-xs text-emerald-400 font-semibold">
                          Delivered • Receipt {ful.deliveryReceiptNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 7: EXCEPTIONS & RETURNS */}
      {activeTab === 'exceptions' && (
        <div className="space-y-3">
          {(data?.exceptions || []).length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              No exceptions or return recovery cases open.
            </div>
          ) : (
            (data?.exceptions || []).map((ex: any) => (
              <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">{ex.type}</span>
                    <span className="font-semibold text-white">{ex.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ex.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {ex.status}
                    </span>
                  </div>
                  <p className="text-slate-300">{ex.description}</p>
                  <div className="text-[11px] text-slate-400">
                    Current Holder: <strong className="text-slate-200">{ex.currentHolder}</strong>
                    {ex.resolutionNote && ` • Resolution: ${ex.resolutionNote}`}
                  </div>
                </div>
                {ex.status !== 'RESOLVED' && (
                  <button
                    type="button"
                    onClick={() => {
                      setExResNote('');
                      setExRestockLocId(data?.warehouses?.[0]?.id || '');
                      setResolveExModal(ex);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    Resolve Case
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* Warehouse Modal */}
      {whModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">{whModal.id ? 'Edit Warehouse' : 'Add Warehouse'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Name" value={whModal.name} onChange={(e) => setWhModal({ ...whModal, name: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Code" value={whModal.code} onChange={(e) => setWhModal({ ...whModal, code: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <select value={whModal.tier} onChange={(e) => setWhModal({ ...whModal, tier: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white">
                <option value="MAIN">MAIN Warehouse</option>
                <option value="BRANCH">BRANCH Warehouse</option>
              </select>
              <input placeholder="District" value={whModal.district} onChange={(e) => setWhModal({ ...whModal, district: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Address" value={whModal.address} onChange={(e) => setWhModal({ ...whModal, address: e.target.value })} className="col-span-2 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Manager Name" value={whModal.managerName} onChange={(e) => setWhModal({ ...whModal, managerName: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Operating Contact" value={whModal.operatingContact} onChange={(e) => setWhModal({ ...whModal, operatingContact: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input type="number" step="0.0001" placeholder="Latitude" value={whModal.latitude} onChange={(e) => setWhModal({ ...whModal, latitude: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input type="number" step="0.0001" placeholder="Longitude" value={whModal.longitude} onChange={(e) => setWhModal({ ...whModal, longitude: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input type="number" placeholder="Service Radius (km)" value={whModal.serviceRadiusKm} onChange={(e) => setWhModal({ ...whModal, serviceRadiusKm: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <label className="flex items-center gap-2 text-slate-300">
                <input type="checkbox" checked={whModal.isActive} onChange={(e) => setWhModal({ ...whModal, isActive: e.target.checked })} /> Active
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setWhModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button type="button" onClick={async () => { const r = await postAction({ action: 'SAVE_WAREHOUSE', ...whModal }); if (r) setWhModal(null); }} className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer">Save Warehouse</button>
            </div>
          </div>
        </div>
      )}

      {/* Franchisee Modal */}
      {frModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">{frModal.id ? 'Edit Franchisee' : 'Add Franchisee'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Franchisee Name" value={frModal.name} onChange={(e) => setFrModal({ ...frModal, name: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Code" value={frModal.code} onChange={(e) => setFrModal({ ...frModal, code: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Address" value={frModal.address} onChange={(e) => setFrModal({ ...frModal, address: e.target.value })} className="col-span-2 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="District" value={frModal.district} onChange={(e) => setFrModal({ ...frModal, district: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Contact" value={frModal.contact} onChange={(e) => setFrModal({ ...frModal, contact: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input type="number" step="0.0001" placeholder="Latitude" value={frModal.latitude} onChange={(e) => setFrModal({ ...frModal, latitude: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input type="number" step="0.0001" placeholder="Longitude" value={frModal.longitude} onChange={(e) => setFrModal({ ...frModal, longitude: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="text-slate-300 font-medium">Linked Warehouses (supply sources):</div>
              <div className="flex flex-wrap gap-2">
                {(data?.warehouses || []).map((w: any) => {
                  const checked = (frModal.linkedWarehouseIds || []).includes(w.id);
                  return (
                    <label key={w.id} className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const list = new Set(frModal.linkedWarehouseIds || []);
                          if (e.target.checked) list.add(w.id);
                          else list.delete(w.id);
                          setFrModal({ ...frModal, linkedWarehouseIds: Array.from(list) });
                        }}
                      />
                      <span>{w.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setFrModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button type="button" onClick={async () => { const r = await postAction({ action: 'SAVE_FRANCHISEE', ...frModal }); if (r) setFrModal(null); }} className="px-3 py-1.5 rounded bg-amber-600 text-white font-semibold cursor-pointer">Save Franchisee</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {staffModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">{staffModal.id ? 'Edit Staff Access' : 'Invite Staff User'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Full Name" value={staffModal.name} onChange={(e) => setStaffModal({ ...staffModal, name: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Email" value={staffModal.email} onChange={(e) => setStaffModal({ ...staffModal, email: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Mobile" value={staffModal.mobile} onChange={(e) => setStaffModal({ ...staffModal, mobile: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <select value={staffModal.status} onChange={(e) => setStaffModal({ ...staffModal, status: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INVITED">INVITED</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="text-slate-300 font-medium">Location &amp; Roles Assignment:</div>
              {(staffModal.assignments || []).map((a: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded space-y-2">
                  <select
                    value={a.locationId}
                    onChange={(e) => {
                      const loc = allLocations.find((l: any) => l.id === e.target.value);
                      const copy = [...staffModal.assignments];
                      copy[idx] = { ...copy[idx], locationId: e.target.value, locationKind: loc?.kind || 'WAREHOUSE' };
                      setStaffModal({ ...staffModal, assignments: copy });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                  >
                    {allLocations.map((l: any) => (
                      <option key={l.id} value={l.id}>
                        [{l.kind}] {l.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((role) => (
                      <label key={role} className="flex items-center gap-1 text-[11px]">
                        <input
                          type="checkbox"
                          checked={a.roles.includes(role)}
                          onChange={(e) => {
                            const copy = [...staffModal.assignments];
                            const set = new Set(copy[idx].roles);
                            if (e.target.checked) set.add(role);
                            else set.delete(role);
                            copy[idx] = { ...copy[idx], roles: Array.from(set) };
                            setStaffModal({ ...staffModal, assignments: copy });
                          }}
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setStaffModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button type="button" onClick={async () => { const r = await postAction({ action: 'SAVE_STAFF', ...staffModal }); if (r) setStaffModal(null); }} className="px-3 py-1.5 rounded bg-sky-600 text-white font-semibold cursor-pointer">Save Staff</button>
            </div>
          </div>
        </div>
      )}

      {/* Carrier Modal */}
      {carrierModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">{carrierModal.id ? 'Edit Delivery Partner' : 'Add Delivery Partner'}</h3>
            <input placeholder="Carrier Name" value={carrierModal.name} onChange={(e) => setCarrierModal({ ...carrierModal, name: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <input placeholder="Code" value={carrierModal.code} onChange={(e) => setCarrierModal({ ...carrierModal, code: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <select value={carrierModal.mode} onChange={(e) => setCarrierModal({ ...carrierModal, mode: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white">
              <option value="MANUAL">MANUAL</option>
              <option value="CONNECTED">CONNECTED</option>
            </select>
            <input placeholder="Tracking URL Template (use {AWB})" value={carrierModal.trackingUrlTemplate} onChange={(e) => setCarrierModal({ ...carrierModal, trackingUrlTemplate: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCarrierModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button type="button" onClick={async () => { const r = await postAction({ action: 'SAVE_CARRIER', ...carrierModal }); if (r) setCarrierModal(null); }} className="px-3 py-1.5 rounded bg-purple-600 text-white font-semibold cursor-pointer">Save Carrier</button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {stockModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">
              {stockModal.mode === 'OPENING' ? 'Set Opening Balance' : 'Adjust Stock'} — {stockModal.productName} ({stockModal.variantName})
            </h3>
            {stockModal.mode === 'OPENING' ? (
              <input type="number" min={0} value={stockModal.quantity} onChange={(e) => setStockModal({ ...stockModal, quantity: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" placeholder="Opening Quantity" />
            ) : (
              <input type="number" value={stockModal.delta} onChange={(e) => setStockModal({ ...stockModal, delta: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" placeholder="Delta (+/- quantity)" />
            )}
            <input placeholder="Reason (required for adjustment)" value={stockModal.reason} onChange={(e) => setStockModal({ ...stockModal, reason: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setStockModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  const r = await postAction({
                    action: stockModal.mode === 'OPENING' ? 'SET_OPENING_STOCK' : 'ADJUST_STOCK',
                    ...stockModal,
                    performedBy: activeStaff?.name,
                  });
                  if (r) setStockModal(null);
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Transfer / Bulk Trip Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-white">New Single or Multi-Stop Bulk Stock Transfer</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Source Warehouse</label>
                <select value={trfSourceId} onChange={(e) => setTrfSourceId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white">
                  {(data?.warehouses || []).map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Trip Notes</label>
                <input value={trfNotes} onChange={(e) => setTrfNotes(e.target.value)} placeholder="e.g. Morning Bulk Trip" className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              </div>
            </div>

            {trfGroups.map((g, gIdx) => (
              <div key={gIdx} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-300">Dispatch Group / Stop #{gIdx + 1}</span>
                  {trfGroups.length > 1 && (
                    <button type="button" onClick={() => setTrfGroups(trfGroups.filter((_, i) => i !== gIdx))} className="text-rose-400 hover:underline cursor-pointer">
                      Remove Stop
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={g.destinationId}
                    onChange={(e) => {
                      const copy = [...trfGroups];
                      copy[gIdx].destinationId = e.target.value;
                      setTrfGroups(copy);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white"
                  >
                    {allLocations.map((l: any) => (
                      <option key={l.id} value={l.id}>[{l.kind}] {l.name}</option>
                    ))}
                  </select>
                  <select
                    value={g.transportMethod}
                    onChange={(e) => {
                      const copy = [...trfGroups];
                      copy[gIdx].transportMethod = e.target.value;
                      setTrfGroups(copy);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white"
                  >
                    <option value="OWN_VEHICLE">Own Vehicle (2-Copy Challan)</option>
                    <option value="DELIVERY_PARTNER">Delivery Channel Partner</option>
                  </select>
                </div>

                {g.items.map((it: any, iIdx: number) => (
                  <div key={iIdx} className="grid grid-cols-12 gap-2 items-center">
                    <select
                      value={`${it.productId}::${it.variantId}`}
                      onChange={(e) => {
                        const [pid, vid] = e.target.value.split('::');
                        const cv = data?.catalogVariants?.find((c: any) => c.productId === pid && c.variantId === vid);
                        if (!cv) return;
                        const copy = [...trfGroups];
                        copy[gIdx].items[iIdx] = {
                          ...copy[gIdx].items[iIdx],
                          productId: cv.productId,
                          variantId: cv.variantId,
                          productName: cv.productName,
                          variantName: cv.variantName,
                          sku: cv.sku,
                        };
                        setTrfGroups(copy);
                      }}
                      className="col-span-6 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    >
                      {(data?.catalogVariants || []).map((cv: any) => (
                        <option key={`${cv.productId}::${cv.variantId}`} value={`${cv.productId}::${cv.variantId}`}>
                          {cv.productName} ({cv.variantName})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={it.requestedQty}
                      onChange={(e) => {
                        const copy = [...trfGroups];
                        copy[gIdx].items[iIdx].requestedQty = Number(e.target.value);
                        setTrfGroups(copy);
                      }}
                      className="col-span-2 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      placeholder="Qty"
                    />
                    <select
                      value={it.orderId || ''}
                      onChange={(e) => {
                        const ord = data?.orders?.find((o: any) => o.id === e.target.value);
                        const copy = [...trfGroups];
                        copy[gIdx].items[iIdx].orderId = ord?.id || '';
                        copy[gIdx].items[iIdx].orderNumber = ord?.orderNumber || '';
                        setTrfGroups(copy);
                      }}
                      className="col-span-4 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    >
                      <option value="">Replenishment Stock</option>
                      {(data?.orders || []).map((o: any) => (
                        <option key={o.id} value={o.id}>Order #{o.orderNumber}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const firstVar = data?.catalogVariants?.[0];
                    if (!firstVar) return;
                    const copy = [...trfGroups];
                    copy[gIdx].items.push({
                      productId: firstVar.productId,
                      variantId: firstVar.variantId,
                      productName: firstVar.productName,
                      variantName: firstVar.variantName,
                      sku: firstVar.sku,
                      requestedQty: 1,
                      orderId: '',
                    });
                    setTrfGroups(copy);
                  }}
                  className="text-sky-400 hover:underline cursor-pointer"
                >
                  + Add Variant Line
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const firstVar = data?.catalogVariants?.[0];
                  setTrfGroups([
                    ...trfGroups,
                    {
                      destinationId: allLocations[0]?.id || '',
                      transportMethod: 'OWN_VEHICLE',
                      items: firstVar
                        ? [{ productId: firstVar.productId, variantId: firstVar.variantId, productName: firstVar.productName, variantName: firstVar.variantName, sku: firstVar.sku, requestedQty: 1, orderId: '' }]
                        : [],
                    },
                  ]);
                }}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                + Add Another Stop (Bulk Trip)
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTransferModalOpen(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button
                  type="button"
                  onClick={async () => {
                    const r = await postAction({
                      action: 'CREATE_TRANSFER',
                      sourceWarehouseId: trfSourceId,
                      notes: trfNotes,
                      groups: trfGroups,
                      createdBy: activeStaff?.name,
                      prepareNow: false,
                    });
                    if (r) setTransferModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded bg-slate-700 text-white font-semibold cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const r = await postAction({
                      action: 'CREATE_TRANSFER',
                      sourceWarehouseId: trfSourceId,
                      notes: trfNotes,
                      groups: trfGroups,
                      createdBy: activeStaff?.name,
                      prepareNow: true,
                    });
                    if (r) setTransferModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
                >
                  Prepare &amp; Reserve Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Own Vehicle & 2-Copy Challan Modal */}
      {challanModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-white">
              Own Vehicle Dispatch &amp; Two-Copy Delivery Challan ({challanModal.transfer.transferNumber})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Vehicle Registration (e.g. KA-25-TR-1042)" value={vehReg} onChange={(e) => setVehReg(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Vehicle Type (e.g. Pickup Van)" value={vehType} onChange={(e) => setVehType(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Driver Name" value={drvName} onChange={(e) => setDrvName(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Driver Reference / License" value={drvRef} onChange={(e) => setDrvRef(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Driver Verified Mobile" value={drvMobile} onChange={(e) => setDrvMobile(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <button
                type="button"
                onClick={async () => {
                  const r = await postAction({
                    action: 'ISSUE_CHALLAN',
                    transferId: challanModal.transfer.id,
                    groupId: challanModal.group.id,
                    vehicleRegistration: vehReg,
                    vehicleType: vehType,
                    driverName: drvName,
                    driverReference: drvRef,
                    driverMobile: drvMobile,
                  });
                  if (r?.challan) {
                    setChallanModal({
                      ...challanModal,
                      group: { ...challanModal.group, challan: r.challan, pickupOtpCode: r.pickupOtpCode },
                    });
                  }
                }}
                className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer"
              >
                Issue 2 Challan Copies &amp; Gen Pickup OTP
              </button>
            </div>

            {challanModal.group.challan && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {['DELIVERY COPY (Kept by Receiver)', 'ACKNOWLEDGMENT COPY (Signed & Returned)'].map((copyTitle) => (
                  <div key={copyTitle} className="bg-white text-slate-900 rounded-lg p-3 space-y-1.5 border border-slate-300">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <span className="font-bold text-[11px]">{challanModal.group.challan.challanNumber}</span>
                      <span className="text-[10px] font-semibold uppercase text-slate-600">{copyTitle}</span>
                    </div>
                    <div className="text-[11px]">
                      <strong>From:</strong> {challanModal.group.challan.sourceName}
                    </div>
                    <div className="text-[11px]">
                      <strong>To:</strong> {challanModal.group.challan.destinationName}
                    </div>
                    <div className="text-[11px]">
                      <strong>Vehicle/Driver:</strong> {challanModal.group.challan.vehicleRegistration} • {challanModal.group.challan.driverName}
                    </div>
                    <div className="border-t border-slate-200 pt-1 text-[10px] space-y-0.5">
                      {challanModal.group.items.map((it: any) => (
                        <div key={it.id}>
                          {it.packageId} — {it.productName} ({it.variantName}) × {it.packedQty}
                          {it.orderNumber ? ` [Order #${it.orderNumber}]` : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {challanModal.group.pickupOtpCode && challanModal.group.status === 'PREPARED' && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs">
                  Driver Pickup OTP: <strong className="font-mono text-emerald-400">{challanModal.group.pickupOtpCode}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Enter Pickup OTP"
                    value={pickupOtpInput}
                    onChange={(e) => setPickupOtpInput(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white w-36"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const r = await postAction({
                        action: 'CONFIRM_OWN_VEHICLE_DISPATCH',
                        transferId: challanModal.transfer.id,
                        groupId: challanModal.group.id,
                        otpCode: pickupOtpInput,
                      });
                      if (r) setChallanModal(null);
                    }}
                    className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
                  >
                    Verify &amp; Confirm Dispatch
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => window.print()} className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 inline-flex items-center gap-1 cursor-pointer">
                <Printer className="w-3.5 h-3.5" /> Print Both Copies
              </button>
              <button type="button" onClick={() => setChallanModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Load Modal */}
      {receiveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-white">
              Receive Load — {receiveModal.transfer.transferNumber} → {receiveModal.group.destinationName}
            </h3>

            <div className="space-y-2">
              {receiveModal.group.items.map((it: any) => {
                const rem = Math.max(0, it.packedQty - (it.receivedGoodQty + it.receivedDamagedQty));
                const cur = recvCounts[it.id] || { goodQty: rem, damagedQty: 0 };
                return (
                  <div key={it.id} className="bg-slate-950 border border-slate-800 rounded p-2.5 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <div className="font-medium text-white">{it.productName} ({it.variantName})</div>
                      <div className="text-[11px] text-slate-400">
                        Expected remaining: {rem} {it.orderNumber ? `• Order #${it.orderNumber}` : '• Replenishment'}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-emerald-400 block">Good Qty</label>
                      <input
                        type="number"
                        min={0}
                        max={rem}
                        value={cur.goodQty}
                        onChange={(e) =>
                          setRecvCounts({ ...recvCounts, [it.id]: { ...cur, goodQty: Number(e.target.value) } })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-rose-400 block">Damaged/Refused</label>
                      <input
                        type="number"
                        min={0}
                        max={rem}
                        value={cur.damagedQty}
                        onChange={(e) =>
                          setRecvCounts({ ...recvCounts, [it.id]: { ...cur, damagedQty: Number(e.target.value) } })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <input
              placeholder="Notes for missing packages, wrong items, or damage..."
              value={recvNotes}
              onChange={(e) => setRecvNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
            />

            {receiveModal.group.transportMethod === 'OWN_VEHICLE' && (
              <div className="bg-slate-950 border border-slate-800 rounded p-3 space-y-2">
                <div className="font-medium text-amber-300">Own Vehicle: Signed Acknowledgment Copy Upload</div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setRecvSignedFile(f.name);
                  }}
                  className="text-xs text-slate-300"
                />
                {recvSignedFile && <div className="text-[11px] text-emerald-400">Attached: {recvSignedFile}</div>}
              </div>
            )}

            <div className="bg-slate-950 border border-slate-800 rounded p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <select
                  value={reassignStaffId}
                  onChange={(e) => setReassignStaffId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                >
                  {(data?.staffUsers || []).map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={async () => {
                    const r = await postAction({
                      action: 'REQUEST_RECEIPT_OTP',
                      transferId: receiveModal.transfer.id,
                      groupId: receiveModal.group.id,
                      receiverUserId: reassignStaffId,
                    });
                    if (r?.receiptOtpCode) {
                      setReceiveModal({
                        ...receiveModal,
                        group: { ...receiveModal.group, receiptOtpCode: r.receiptOtpCode },
                      });
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-sky-600 text-white font-semibold cursor-pointer"
                >
                  Request Receipt OTP
                </button>
                {receiveModal.group.receiptOtpCode && (
                  <span className="font-mono text-emerald-400 font-semibold">OTP: {receiveModal.group.receiptOtpCode}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  placeholder="Enter Receipt OTP"
                  value={recvOtpInput}
                  onChange={(e) => setRecvOtpInput(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-32"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const receiver = data?.staffUsers?.find((u: any) => u.id === reassignStaffId) || activeStaff;
                    const counts = Object.entries(recvCounts).map(([lineId, val]) => ({ lineId, ...val }));
                    const r = await postAction({
                      action: 'ACCEPT_RECEIPT',
                      transferId: receiveModal.transfer.id,
                      groupId: receiveModal.group.id,
                      receiverUserId: receiver?.id,
                      receiverName: receiver?.name,
                      receiverRole: receiver?.assignments?.[0]?.roles?.[0] || 'RECEIVING_STAFF',
                      otpCode: recvOtpInput,
                      signedCopyAttachment: recvSignedFile,
                      notes: recvNotes,
                      counts,
                    });
                    if (r) setReceiveModal(null);
                  }}
                  className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
                >
                  Accept Receipt
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setReceiveModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Route Preview Modal */}
      {routeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-white">
              Choose Route for Order #{routeModal.order.orderNumber}
            </h3>

            <div className="space-y-1.5">
              <div className="text-slate-400 font-semibold">Nearest Locations &amp; Variant Availability Preview:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...routeModal.preview.warehousePreviews, ...routeModal.preview.franchiseePreviews].map((loc: any) => (
                  <div key={loc.locationId} className="bg-slate-950 border border-slate-800 rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{loc.name}</span>
                      <span className="text-[11px] text-slate-400">{loc.distanceKm} km</span>
                    </div>
                    {loc.canFulfillAll ? (
                      <div className="text-[11px] text-emerald-400">All lines available</div>
                    ) : (
                      <div className="text-[11px] text-rose-400">
                        Shortage: {loc.shortages.map((s: any) => `${s.productName} (${s.available}/${s.needed})`).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-slate-400 font-semibold">Recommended &amp; Alternative Routes:</div>
              {routeModal.preview.routes.map((rt: any) => (
                <div key={rt.id} className="bg-slate-950 border border-slate-800 rounded p-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-white">{rt.label}</div>
                    <div className="text-[11px] text-slate-400">
                      {rt.pattern} • {rt.distanceKm} km{' '}
                      {rt.canFulfillAll ? (
                        <span className="text-emerald-400 font-semibold">• Ready to fulfill</span>
                      ) : (
                        <span className="text-rose-400">• Unresolved shortage</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!rt.canFulfillAll}
                    onClick={async () => {
                      const r = await postAction({
                        action: 'CONFIRM_ORDER_ROUTE',
                        orderId: routeModal.order.id,
                        routePattern: rt.pattern,
                        sourceLocationId: rt.sourceLocationId,
                        branchLocationId: rt.branchLocationId,
                        franchiseeId: rt.franchiseeId,
                        carrierId: data?.carriers?.[0]?.id,
                      });
                      if (r) setRouteModal(null);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${
                      rt.canFulfillAll
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Route
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setRouteModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Custody Timeline Modal */}
      {timelineOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Order #{timelineOrder.orderNumber} Custody Timeline</h3>
            <div className="space-y-2">
              {(timelineOrder.fulfillment?.legs || []).map((leg: any) => (
                <div key={leg.legIndex} className="bg-slate-950 border border-slate-800 rounded p-2.5 space-y-1">
                  <div className="font-semibold text-emerald-300">
                    Leg {leg.legIndex}: {leg.fromName} → {leg.toName} ({leg.status})
                  </div>
                  {leg.transferNumber && <div className="text-slate-400">Transfer: {leg.transferNumber}</div>}
                  {leg.challanNumber && <div className="text-amber-300">Challan: {leg.challanNumber}</div>}
                  {leg.awbNumber && <div className="text-purple-300">Carrier: {leg.carrierName} • AWB: {leg.awbNumber}</div>}
                  {leg.receiverName && <div className="text-slate-300">Received by: {leg.receiverName}</div>}
                </div>
              ))}
              {timelineOrder.fulfillment?.deliveryReceiptNumber && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded p-2.5 text-emerald-200">
                  Final Delivery Receipt: <strong>{timelineOrder.fulfillment.deliveryReceiptNumber}</strong>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setTimelineOrder(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Carrier Dispatch Modal */}
      {carrierDispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Dispatch Order #{carrierDispatchOrder.orderNumber} via Delivery Partner</h3>
            <select value={carIdInput} onChange={(e) => setCarIdInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white">
              {(data?.carriers || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.mode})</option>
              ))}
            </select>
            <input placeholder="AWB / Consignment Number (or auto-generate)" value={awbInput} onChange={(e) => setAwbInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <button
              type="button"
              onClick={async () => {
                const r = await postAction({
                  action: 'DISPATCH_CARRIER_ORDER',
                  orderId: carrierDispatchOrder.id,
                  carrierId: carIdInput,
                  awbNumber: awbInput,
                  generateCourierOtp: true,
                });
                if (r?.courierOtpCode) {
                  setCarrierDispatchOrder({
                    ...carrierDispatchOrder,
                    fulfillment: { ...carrierDispatchOrder.fulfillment, courierOtpCode: r.courierOtpCode },
                  });
                }
              }}
              className="w-full py-1.5 rounded bg-purple-600 text-white font-semibold cursor-pointer"
            >
              Save AWB &amp; Generate Courier Pickup OTP
            </button>
            {carrierDispatchOrder.fulfillment?.courierOtpCode && (
              <div className="space-y-2 border-t border-slate-800 pt-2">
                <div className="text-emerald-400 font-mono">Courier OTP: {carrierDispatchOrder.fulfillment.courierOtpCode}</div>
                <div className="flex gap-2">
                  <input placeholder="Enter Courier OTP" value={courierOtpInput} onChange={(e) => setCourierOtpInput(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
                  <button
                    type="button"
                    onClick={async () => {
                      const r = await postAction({
                        action: 'DISPATCH_CARRIER_ORDER',
                        orderId: carrierDispatchOrder.id,
                        otpCode: courierOtpInput,
                      });
                      if (r) setCarrierDispatchOrder(null);
                    }}
                    className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
                  >
                    Confirm Handover
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button type="button" onClick={() => setCarrierDispatchOrder(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* New Demo Order Modal */}
      {newOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Create Customer Order</h3>
            <input placeholder="Customer Name" value={demoOrderForm.customerName} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, customerName: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <input placeholder="Customer Mobile" value={demoOrderForm.customerMobile} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, customerMobile: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <input placeholder="Address Line" value={demoOrderForm.addressLine} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, addressLine: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="District" value={demoOrderForm.district} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, district: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
              <input placeholder="Pincode" value={demoOrderForm.pincode} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, pincode: e.target.value })} className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            </div>
            <select
              value={`${demoOrderForm.productId}::${demoOrderForm.variantId}`}
              onChange={(e) => {
                const [pid, vid] = e.target.value.split('::');
                setDemoOrderForm({ ...demoOrderForm, productId: pid, variantId: vid });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
            >
              {(data?.catalogVariants || []).map((cv: any) => (
                <option key={`${cv.productId}::${cv.variantId}`} value={`${cv.productId}::${cv.variantId}`}>
                  {cv.productName} ({cv.variantName})
                </option>
              ))}
            </select>
            <input type="number" min={1} placeholder="Quantity" value={demoOrderForm.quantity} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, quantity: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setNewOrderModalOpen(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  const r = await postAction({ action: 'CREATE_DEMO_ORDER', ...demoOrderForm });
                  if (r) setNewOrderModalOpen(false);
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Customer OTP Modal */}
      {deliveryOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Verify Customer Delivery OTP (#{deliveryOtpModal.orderNumber})</h3>
            <div className="text-slate-400">Customer OTP: <strong className="text-emerald-400 font-mono">{deliveryOtpModal.fulfillment?.customerOtpCode}</strong></div>
            <input placeholder="Enter Customer OTP" value={custOtpInput} onChange={(e) => setCustOtpInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeliveryOtpModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  const r = await postAction({ action: 'VERIFY_CUSTOMER_OTP', orderId: deliveryOtpModal.id, otpCode: custOtpInput });
                  if (r) setDeliveryOtpModal(null);
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
              >
                Verify &amp; Deliver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Failed Delivery Modal */}
      {failedDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Record Failed Delivery (#{failedDeliveryModal.orderNumber})</h3>
            <input placeholder="Reason (e.g. Customer unavailable / OTP failed)" value={failReason} onChange={(e) => setFailReason(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            <select value={failAction} onChange={(e) => setFailAction(e.target.value as any)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white">
              <option value="RETRY">Request New OTP &amp; Retry</option>
              <option value="RESCHEDULE">Reschedule</option>
              <option value="RETURN">Return Parcel</option>
              <option value="EXCEPTION">Raise Support Exception</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setFailedDeliveryModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  const r = await postAction({
                    action: 'RECORD_FAILED_DELIVERY',
                    orderId: failedDeliveryModal.id,
                    reason: failReason,
                    followUpAction: failAction,
                    recordedBy: activeStaff?.name,
                  });
                  if (r) setFailedDeliveryModal(null);
                }}
                className="px-3 py-1.5 rounded bg-rose-600 text-white font-semibold cursor-pointer"
              >
                Save Attempt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Exception Modal */}
      {resolveExModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Resolve Exception: {resolveExModal.title}</h3>
            <input placeholder="Resolution Note" value={exResNote} onChange={(e) => setExResNote(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white" />
            {resolveExModal.type === 'CANCELLED_RETURN' && (
              <div>
                <label className="text-slate-400 block mb-1">Restock Inspected Return To:</label>
                <select value={exRestockLocId} onChange={(e) => setExRestockLocId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white">
                  {allLocations.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setResolveExModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  const r = await postAction({
                    action: 'RESOLVE_EXCEPTION',
                    exceptionId: resolveExModal.id,
                    resolutionNote: exResNote,
                    restockLocationId: resolveExModal.type === 'CANCELLED_RETURN' ? exRestockLocId : undefined,
                  });
                  if (r) setResolveExModal(null);
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold cursor-pointer"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
