'use client';

import React from 'react';
import Link from 'next/link';
import { Warehouse, ShieldCheck, RefreshCw } from 'lucide-react';
import { useWmsContext } from './WmsContext';
import { WmsButton } from './WmsButton';

export function WmsHeader() {
  const {
    loading,
    warehouses,
    franchisees,
    staffUsers,
    activeStaffId,
    setActiveStaffId,
    activeLocationId,
    setActiveLocationId,
    refreshSummary,
  } = useWmsContext();

  return (
    <header className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
          <Warehouse className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Dark Warehouse &amp; Franchisee Fulfillment Portal
          </h1>
          <p className="text-xs text-slate-400">
            Stock Transfers, Two-Copy Challans, OTP Handover, Multi-Leg Order Routing &amp; Direct Delivery
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col min-w-[200px]">
          <label
            htmlFor="wms-staff-select"
            className="text-[10px] uppercase tracking-wider text-slate-400 mb-1"
          >
            Signed-in Staff
          </label>
          <select
            id="wms-staff-select"
            value={activeStaffId}
            onChange={(e) => setActiveStaffId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
          >
            {staffUsers.length === 0 ? (
              <option value="">No staff configured</option>
            ) : (
              staffUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.roles.join(', ') || u.status})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col min-w-[190px]">
          <label
            htmlFor="wms-location-select"
            className="text-[10px] uppercase tracking-wider text-slate-400 mb-1"
          >
            Active Location View
          </label>
          <select
            id="wms-location-select"
            value={activeLocationId}
            onChange={(e) => setActiveLocationId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Locations (Central View)</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                [{w.tier || 'WAREHOUSE'}] {w.name}
              </option>
            ))}
            {franchisees.map((f) => (
              <option key={f.id} value={f.id}>
                [FRANCHISEE] {f.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Super Admin</span>
        </Link>

        <WmsButton
          variant="secondary"
          size="sm"
          loading={loading}
          onClick={refreshSummary}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </WmsButton>
      </div>
    </header>
  );
}
