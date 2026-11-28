'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Store,
  Package,
  Send,
  Inbox,
  Truck,
  LogOut,
  RefreshCw,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  KeyRound,
  Warehouse,
} from 'lucide-react';
import { WmsButton } from '@/components/wms/WmsButton';
import { WmsBadge } from '@/components/wms/WmsBadge';
import { WmsEmptyState } from '@/components/wms/WmsEmptyState';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';

type FranchiseeTab = 'catalog' | 'requests' | 'incoming' | 'orders';

export default function GlobalFranchiseePortalPage() {
  const [session, setSession] = useState<{
    staff: any;
    assignedFranchisees: any[];
    activeFranchisee: any;
  } | null>(null);
  const [directory, setDirectory] = useState<any[]>([]);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [portalState, setPortalState] = useState<any>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [activeTab, setActiveTab] = useState<FranchiseeTab>('catalog');
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Request Stock Modal
  const [requestModal, setRequestModal] = useState<{
    targetWarehouseId: string;
    notes: string;
    items: {
      productId: string;
      variantId: string;
      productName: string;
      variantName: string;
      sku: string;
      requestedQty: number;
    }[];
  } | null>(null);

  // Receive & Delivery OTP Modals
  const [receiveModal, setReceiveModal] = useState<{ transfer: any; group: any } | null>(null);
  const [recvCounts, setRecvCounts] = useState<Record<string, { goodQty: number; damagedQty: number }>>({});
  const [recvOtpInput, setRecvOtpInput] = useState('');
  const [recvSignedFile, setRecvSignedFile] = useState('');
  const [recvNotes, setRecvNotes] = useState('');

  const [deliveryOtpModal, setDeliveryOtpModal] = useState<any>(null);
  const [custOtpInput, setCustOtpInput] = useState('');

  const notify = (type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    fetch('/api/franchisee/portal')
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.directory) setDirectory(j.directory);
      })
      .catch(() => {});
  }, []);

  const loadFranchiseeState = useCallback(async (franchiseeId: string) => {
    setLoadingState(true);
    try {
      const res = await fetch(`/api/franchisee/portal?franchiseeId=${encodeURIComponent(franchiseeId)}`);
      const json = await res.json();
      if (json.success) {
        setPortalState(json);
      } else {
        notify('err', json.error || 'Failed to load franchisee data');
      }
    } catch (err: any) {
      notify('err', err.message || 'Network error');
    } finally {
      setLoadingState(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch('/api/franchisee/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOGIN', loginId, password }),
      });
      const json = await res.json();
      if (!json.success) {
        notify('err', json.error || 'Login failed');
        return;
      }
      setSession({
        staff: json.staff,
        assignedFranchisees: json.assignedFranchisees,
        activeFranchisee: json.activeFranchisee,
      });
      if (json.activeFranchisee?.id) {
        await loadFranchiseeState(json.activeFranchisee.id);
      }
    } catch (err: any) {
      notify('err', err.message || 'Login error');
    } finally {
      setAuthLoading(false);
    }
  };

  const postWarehouseAction = async (payload: any) => {
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
      if (session?.activeFranchisee?.id) {
        await loadFranchiseeState(session.activeFranchisee.id);
      }
      return json;
    } catch (err: any) {
      notify('err', err.message || 'Request failed');
      return null;
    }
  };

  const openQuickRequest = (cv?: any) => {
    const warehouses = portalState?.linkedWarehouses || portalState?.warehouses || [];
    const targetVar = cv || portalState?.catalogVariants?.[0];
    setRequestModal({
      targetWarehouseId: warehouses[0]?.id || '',
      notes: '',
      items: targetVar
        ? [
            {
              productId: targetVar.productId,
              variantId: targetVar.variantId,
              productName: targetVar.productName,
              variantName: targetVar.variantName,
              sku: targetVar.sku,
              requestedQty: 10,
            },
          ]
        : [],
    });
  };

  const submitStockRequest = async () => {
    if (!requestModal || !session?.activeFranchisee) return;
    try {
      const res = await fetch('/api/franchisee/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_STOCK_REQUEST',
          franchiseeId: session.activeFranchisee.id,
          targetWarehouseId: requestModal.targetWarehouseId,
          requestedByUserId: session.staff.id,
          requestedByName: session.staff.name,
          items: requestModal.items,
          notes: requestModal.notes,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        notify('err', json.error || 'Failed to submit request');
        return;
      }
      notify('ok', json.message);
      setRequestModal(null);
      await loadFranchiseeState(session.activeFranchisee.id);
    } catch (err: any) {
      notify('err', err.message || 'Request error');
    }
  };

  // ==================== LOGIN SCREEN ====================
  if (!session) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-4">
        {toast && (
          <div className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded border shadow-lg text-xs font-medium flex items-center gap-2 ${toast.type === 'ok' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
            {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
            <span>{toast.text}</span>
          </div>
        )}

        <div className="w-full max-w-md bg-white border border-[#d2d6de] rounded shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4">
            <div className="p-2.5 rounded bg-[#e8f4fa] border border-[#b8dcf0] text-[#2585be]">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Franchisee &amp; Local Hub Portal</h1>
              <p className="text-xs text-slate-500">Sign in with your User ID &amp; Password to manage your stock, requests &amp; orders</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">User ID (Email or Mobile)</label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter your User ID / Email / Mobile"
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-slate-800 outline-none focus:border-[#3c8dbc]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-slate-800 outline-none focus:border-[#3c8dbc]"
              />
            </div>
            <WmsButton type="submit" variant="primary" loading={authLoading} className="w-full py-2" icon={<KeyRound className="w-3.5 h-3.5" />}>
              Sign In to Franchisee Portal
            </WmsButton>
          </form>

          {directory.length > 0 && (
            <div className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-3 space-y-1.5 text-[11px]">
              <div className="font-semibold text-slate-700">Active Franchisee Accounts (Configured in Warehouse Portal):</div>
              {directory.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 text-slate-600">
                  <span>
                    <strong>{d.franchiseeName}</strong> — <code className="text-[#2585be]">{d.loginId}</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => setLoginId(d.loginId)}
                    className="text-[#2585be] hover:underline font-semibold cursor-pointer"
                  >
                    Fill ID
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-center pt-1">
            <Link href="/warehouse/locations" className="text-xs text-[#2585be] hover:underline font-medium">
              ← Back to Warehouse Management Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==================== AUTHENTICATED FRANCHISEE DASHBOARD ====================
  const stocks = portalState?.stocks || [];
  const stockRequests = portalState?.stockRequests || [];
  const incomingTransfers = portalState?.incomingTransfers || [];
  const orders = portalState?.orders || [];
  const catalogVariants = (portalState?.catalogVariants || []).filter((cv: any) => {
    if (categoryFilter !== 'ALL' && cv.categoryId !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        cv.productName.toLowerCase().includes(q) ||
        cv.variantName.toLowerCase().includes(q) ||
        cv.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingIncomingCount = incomingTransfers.filter((x: any) => x.group.status !== 'RECEIVED').length;

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-800 p-4 sm:p-6">
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded border shadow-lg text-xs font-medium flex items-center gap-2 ${toast.type === 'ok' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
          {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
          <span>{toast.text}</span>
        </div>
      )}

      <div className="max-w-[1500px] mx-auto space-y-4">
        {/* Header */}
        <header className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#e8f4fa] border border-[#b8dcf0] text-[#2585be]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                {session.activeFranchisee?.name || 'Franchisee Portal'}
              </h1>
              <p className="text-xs text-slate-500">
                Signed in as <strong>{session.staff.name}</strong> ({session.staff.email || session.staff.mobile}) • Scoped to your location data
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {session.assignedFranchisees.length > 1 && (
              <select
                value={session.activeFranchisee?.id}
                onChange={(e) => {
                  const next = session.assignedFranchisees.find((f) => f.id === e.target.value);
                  if (next) {
                    setSession({ ...session, activeFranchisee: next });
                    loadFranchiseeState(next.id);
                  }
                }}
                className="border border-[#d2d6de] rounded px-2.5 py-1.5 text-xs bg-white"
              >
                {session.assignedFranchisees.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            )}

            <WmsButton variant="primary" size="md" onClick={() => openQuickRequest()} icon={<Send className="w-3.5 h-3.5" />}>
              Request Stock from Warehouse
            </WmsButton>

            <Link
              href="/warehouse/transfers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-[#d2d6de] text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <Warehouse className="w-3.5 h-3.5 text-[#2585be]" />
              <span>Warehouse Portal</span>
            </Link>

            <WmsButton
              variant="secondary"
              size="md"
              loading={loadingState}
              onClick={() => loadFranchiseeState(session.activeFranchisee.id)}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </WmsButton>

            <WmsButton
              variant="danger"
              size="md"
              onClick={() => {
                setSession(null);
                setPortalState(null);
                setPassword('');
              }}
              icon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </WmsButton>
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className="bg-white border border-[#d2d6de] rounded shadow-2xs p-2 flex flex-wrap gap-1.5">
          {[
            { id: 'catalog', label: '01. All Products & My Stock', icon: Package, count: catalogVariants.length },
            { id: 'requests', label: '02. My Stock Requests', icon: Send, count: stockRequests.length },
            { id: 'incoming', label: '03. Incoming from Warehouse', icon: Inbox, count: pendingIncomingCount },
            { id: 'orders', label: '04. My Orders & Deliveries', icon: Truck, count: orders.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FranchiseeTab)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                  active ? 'bg-[#2585be] text-white' : 'bg-[#f4f6f9] text-slate-700 border border-[#e5e7eb] hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <WmsBadge count={tab.count} active={active} />
              </button>
            );
          })}
        </nav>

        {loadingState && !portalState ? (
          <WmsLoadingState label="Loading your franchisee data..." />
        ) : (
          <>
            {/* TAB 1: ALL PRODUCTS & MY STOCK */}
            {activeTab === 'catalog' && (
              <div className="space-y-4">
                <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-3 flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search all products, variants, or SKU..."
                      className="w-full border border-[#d2d6de] rounded pl-8 pr-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-[#d2d6de] rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="ALL">All Categories</option>
                    {(portalState?.categories || []).map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                          <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Product &amp; Variant</th>
                          <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Category</th>
                          <th className="py-2.5 px-3 border-r border-[#e5e7eb]">SKU</th>
                          <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">My On Hand</th>
                          <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Reserved</th>
                          <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Available</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalogVariants.map((cv: any) => {
                          const row = stocks.find((s: any) => s.productId === cv.productId && s.variantId === cv.variantId);
                          const onHand = row?.onHand || 0;
                          const reserved = row?.reserved || 0;
                          const available = Math.max(0, onHand - reserved);
                          return (
                            <tr key={`${cv.productId}-${cv.variantId}`} className="border-b border-[#f0f0f0] hover:bg-slate-50">
                              <td className="py-2.5 px-3 border-r border-[#f0f0f0]">
                                <div className="font-semibold text-slate-800">{cv.productName}</div>
                                <div className="text-[11px] text-slate-500">{cv.variantName}</div>
                              </td>
                              <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-slate-600">{cv.categoryName}</td>
                              <td className="py-2.5 px-3 border-r border-[#f0f0f0] font-mono text-slate-600">{cv.sku}</td>
                              <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center font-semibold">{onHand}</td>
                              <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center text-amber-600">{reserved}</td>
                              <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center">
                                <span className={`font-bold ${available === 0 ? 'text-[#dd4b39]' : 'text-[#00a65a]'}`}>
                                  {available === 0 ? '0 (Empty)' : available}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <WmsButton variant="primary" size="sm" onClick={() => openQuickRequest(cv)} icon={<Plus className="w-3 h-3" />}>
                                  Request Stock
                                </WmsButton>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY STOCK REQUESTS */}
            {activeTab === 'requests' && (
              <div className="space-y-3">
                {stockRequests.length === 0 ? (
                  <WmsEmptyState
                    title="No stock requests sent yet"
                    description="If any product is empty or low, click Request Stock from Warehouse to ask for replenishment."
                    action={<WmsButton variant="primary" size="sm" onClick={() => openQuickRequest()}>New Stock Request</WmsButton>}
                  />
                ) : (
                  stockRequests.map((req: any) => (
                    <div key={req.id} className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-semibold text-[#2585be]">{req.requestNumber}</span>
                          <span>To: <strong>{req.targetWarehouseName}</strong></span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            req.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            req.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {req.status}
                          </span>
                          {req.linkedTransferNumber && (
                            <span className="font-mono text-[#00a65a] font-semibold">
                              Transfer: {req.linkedTransferNumber}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">Requested by {req.requestedByName}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {req.items.map((it: any, idx: number) => (
                          <span key={idx} className="bg-[#f4f6f9] border border-[#e5e7eb] px-2 py-0.5 rounded">
                            {it.productName} ({it.variantName}) × <strong>{it.requestedQty}</strong>
                          </span>
                        ))}
                      </div>
                      {req.warehouseNote && (
                        <div className="bg-[#e8f4fa] border border-[#b8dcf0] rounded px-3 py-1.5 text-[#1f72a3]">
                          <strong>Warehouse Update:</strong> {req.warehouseNote}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: INCOMING FROM WAREHOUSE */}
            {activeTab === 'incoming' && (
              <div className="space-y-3">
                {incomingTransfers.length === 0 ? (
                  <WmsEmptyState
                    title="No incoming shipments from warehouse"
                    description="Approved stock requests and order shipments dispatched to your franchisee will appear here."
                  />
                ) : (
                  incomingTransfers.map(({ transfer: t, group: g }: any) => (
                    <div key={g.id} className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#2585be]">{t.transferNumber}</span>
                          <span>From: <strong>{t.sourceWarehouseName}</strong></span>
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">{g.status}</span>
                        </div>
                        <div className="text-slate-600">
                          {g.items.map((it: any) => `${it.productName} (${it.variantName}) × ${it.packedQty}`).join(', ')}
                        </div>
                      </div>
                      {g.status === 'IN_TRANSIT' && (
                        <WmsButton
                          variant="success"
                          size="sm"
                          onClick={() => {
                            const initCounts: Record<string, { goodQty: number; damagedQty: number }> = {};
                            for (const it of g.items) {
                              const rem = Math.max(0, it.packedQty - (it.receivedGoodQty + it.receivedDamagedQty));
                              initCounts[it.id] = { goodQty: rem, damagedQty: 0 };
                            }
                            setRecvCounts(initCounts);
                            setRecvOtpInput('');
                            setRecvSignedFile(g.challan?.signedCopyAttachment || '');
                            setRecvNotes('');
                            setReceiveModal({ transfer: t, group: g });
                          }}
                        >
                          Receive &amp; Verify OTP
                        </WmsButton>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: MY ORDERS & DELIVERIES */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <WmsEmptyState
                    title="No customer orders assigned to your franchisee"
                    description="Only orders routed to your franchisee appear here."
                  />
                ) : (
                  orders.map((o: any) => {
                    const ful = o.fulfillment;
                    return (
                      <div key={o.id} className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-mono font-semibold text-[#2585be] mr-2">#{o.orderNumber}</span>
                          <strong className="text-slate-800">{o.shippingAddress?.fullName}</strong>
                          <span className="text-slate-500 ml-2">• {o.shippingAddress?.addressLine}</span>
                          <span className="ml-2 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                            {ful.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ful.status === 'READY_FOR_DELIVERY' && (
                            <WmsButton
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                postWarehouseAction({
                                  action: 'MARK_OUT_FOR_DELIVERY',
                                  orderId: o.id,
                                  staffId: session.staff.id,
                                  staffName: session.staff.name,
                                })
                              }
                            >
                              Mark Out for Delivery
                            </WmsButton>
                          )}
                          {ful.status === 'OUT_FOR_DELIVERY' && (
                            <WmsButton
                              variant="success"
                              size="sm"
                              onClick={() => {
                                setCustOtpInput('');
                                setDeliveryOtpModal(o);
                              }}
                            >
                              Verify Customer OTP ({ful.customerOtpCode})
                            </WmsButton>
                          )}
                          {ful.status === 'DELIVERED' && (
                            <span className="font-semibold text-[#00a65a]">Delivered • {ful.deliveryReceiptNumber}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Request Stock Modal */}
      {requestModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Request Stock from Warehouse</h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Warehouse</label>
              <select
                value={requestModal.targetWarehouseId}
                onChange={(e) => setRequestModal({ ...requestModal, targetWarehouseId: e.target.value })}
                className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5"
              >
                {(portalState?.linkedWarehouses || []).map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              {requestModal.items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <select
                    value={`${it.productId}::${it.variantId}`}
                    onChange={(e) => {
                      const [pid, vid] = e.target.value.split('::');
                      const cv = portalState?.catalogVariants?.find((c: any) => c.productId === pid && c.variantId === vid);
                      if (!cv) return;
                      const copy = [...requestModal.items];
                      copy[idx] = { ...copy[idx], productId: cv.productId, variantId: cv.variantId, productName: cv.productName, variantName: cv.variantName, sku: cv.sku };
                      setRequestModal({ ...requestModal, items: copy });
                    }}
                    className="col-span-8 border border-[#d2d6de] rounded px-2 py-1.5"
                  >
                    {(portalState?.catalogVariants || []).map((cv: any) => (
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
                      const copy = [...requestModal.items];
                      copy[idx].requestedQty = Number(e.target.value);
                      setRequestModal({ ...requestModal, items: copy });
                    }}
                    className="col-span-4 border border-[#d2d6de] rounded px-2 py-1.5"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const first = portalState?.catalogVariants?.[0];
                  if (!first) return;
                  setRequestModal({
                    ...requestModal,
                    items: [
                      ...requestModal.items,
                      { productId: first.productId, variantId: first.variantId, productName: first.productName, variantName: first.variantName, sku: first.sku, requestedQty: 5 },
                    ],
                  });
                }}
                className="text-[#2585be] hover:underline font-semibold cursor-pointer"
              >
                + Add Another Product
              </button>
            </div>
            <input
              placeholder="Note to warehouse (e.g. Stock is empty, please send urgently)"
              value={requestModal.notes}
              onChange={(e) => setRequestModal({ ...requestModal, notes: e.target.value })}
              className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5"
            />
            <div className="flex justify-end gap-2 pt-2">
              <WmsButton onClick={() => setRequestModal(null)}>Cancel</WmsButton>
              <WmsButton variant="primary" onClick={submitStockRequest}>Send Request to Warehouse</WmsButton>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {receiveModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Receive Shipment {receiveModal.transfer.transferNumber}</h3>
            {receiveModal.group.items.map((it: any) => {
              const rem = Math.max(0, it.packedQty - (it.receivedGoodQty + it.receivedDamagedQty));
              const cur = recvCounts[it.id] || { goodQty: rem, damagedQty: 0 };
              return (
                <div key={it.id} className="bg-[#f4f6f9] p-2.5 rounded border border-[#e5e7eb] flex items-center justify-between gap-2">
                  <div><strong>{it.productName}</strong> ({it.variantName})</div>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} max={rem} value={cur.goodQty} onChange={(e) => setRecvCounts({ ...recvCounts, [it.id]: { ...cur, goodQty: Number(e.target.value) } })} className="w-16 border border-[#d2d6de] rounded px-2 py-1 bg-white" />
                    <input type="number" min={0} max={rem} value={cur.damagedQty} onChange={(e) => setRecvCounts({ ...recvCounts, [it.id]: { ...cur, damagedQty: Number(e.target.value) } })} className="w-16 border border-[#d2d6de] rounded px-2 py-1 bg-white" />
                  </div>
                </div>
              );
            })}
            <input type="file" accept="image/*,.pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) setRecvSignedFile(f.name); }} />
            <div className="flex items-center gap-2">
              <WmsButton
                variant="primary"
                size="sm"
                onClick={async () => {
                  const r = await postWarehouseAction({
                    action: 'REQUEST_RECEIPT_OTP',
                    transferId: receiveModal.transfer.id,
                    groupId: receiveModal.group.id,
                    receiverUserId: session.staff.id,
                  });
                  if (r?.receiptOtpCode) setReceiveModal({ ...receiveModal, group: { ...receiveModal.group, receiptOtpCode: r.receiptOtpCode } });
                }}
              >
                Request Receipt OTP
              </WmsButton>
              {receiveModal.group.receiptOtpCode && <span className="font-mono text-[#00a65a] font-semibold">OTP: {receiveModal.group.receiptOtpCode}</span>}
              <input placeholder="Enter OTP" value={recvOtpInput} onChange={(e) => setRecvOtpInput(e.target.value)} className="border border-[#d2d6de] rounded px-2 py-1 w-28" />
            </div>
            <div className="flex justify-end gap-2">
              <WmsButton onClick={() => setReceiveModal(null)}>Close</WmsButton>
              <WmsButton
                variant="success"
                onClick={async () => {
                  const counts = Object.entries(recvCounts).map(([lineId, val]) => ({ lineId, ...val }));
                  const r = await postWarehouseAction({
                    action: 'ACCEPT_RECEIPT',
                    transferId: receiveModal.transfer.id,
                    groupId: receiveModal.group.id,
                    receiverUserId: session.staff.id,
                    receiverName: session.staff.name,
                    receiverRole: session.staff.roles?.[0] || 'FRANCHISEE_MANAGER',
                    otpCode: recvOtpInput,
                    signedCopyAttachment: recvSignedFile,
                    notes: recvNotes,
                    counts,
                  });
                  if (r) setReceiveModal(null);
                }}
              >
                Accept Receipt
              </WmsButton>
            </div>
          </div>
        </div>
      )}

      {/* Verify Customer OTP Modal */}
      {deliveryOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-sm p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Verify Customer OTP (#{deliveryOtpModal.orderNumber})</h3>
            <div>Customer OTP: <strong className="font-mono text-[#00a65a]">{deliveryOtpModal.fulfillment?.customerOtpCode}</strong></div>
            <input placeholder="Enter Customer OTP" value={custOtpInput} onChange={(e) => setCustOtpInput(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <div className="flex justify-end gap-2">
              <WmsButton onClick={() => setDeliveryOtpModal(null)}>Cancel</WmsButton>
              <WmsButton
                variant="success"
                onClick={async () => {
                  const r = await postWarehouseAction({ action: 'VERIFY_CUSTOMER_OTP', orderId: deliveryOtpModal.id, otpCode: custOtpInput });
                  if (r) setDeliveryOtpModal(null);
                }}
              >
                Verify &amp; Deliver
              </WmsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
