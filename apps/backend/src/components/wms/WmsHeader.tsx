'use client';

import React from 'react';
import Link from 'next/link';
import { Warehouse, ShieldCheck, RefreshCw, Plus, Truck } from 'lucide-react';
import { useWmsContext } from './WmsContext';
import { WmsButton } from './WmsButton';

export function WmsHeader() {
  const {
    loading,
    busy,
    portalData,
    activeStaffId,
    setActiveStaffId,
    activeLocationId,
    setActiveLocationId,
    refreshPortal,
    postAction,
  } = useWmsContext();

  const warehouses = portalData?.warehouses || [];
  const franchisees = portalData?.franchisees || [];
  const staffUsers = portalData?.staffUsers || [];

  return (
    <header className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded bg-[#e8f4fa] border border-[#b8dcf0] text-[#2585be] shrink-0">
          <Warehouse className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-normal text-slate-800 tracking-tight">
            Warehouse &amp; Franchisee Fulfillment Portal
          </h1>
          <p className="text-xs text-slate-500">
            Connected with Super Admin Shipping, Warehouses, Catalogue Variants &amp; Customer Orders
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2.5">
        <div className="flex flex-col min-w-[190px]">
          <label
            htmlFor="wms-staff-select"
            className="text-[11px] font-semibold text-slate-600 mb-1"
          >
            Signed-in Staff
          </label>
          <select
            id="wms-staff-select"
            value={activeStaffId}
            onChange={(e) => setActiveStaffId(e.target.value)}
            className="bg-white border border-[#d2d6de] rounded px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#3c8dbc]"
          >
            {staffUsers.length === 0 ? (
              <option value="">No staff configured</option>
            ) : (
              staffUsers.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name} (
                  {(u.assignments || []).flatMap((a: any) => a.roles || []).join(', ') || u.status})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col min-w-[180px]">
          <label
            htmlFor="wms-location-select"
            className="text-[11px] font-semibold text-slate-600 mb-1"
          >
            Active Location View
          </label>
          <select
            id="wms-location-select"
            value={activeLocationId}
            onChange={(e) => setActiveLocationId(e.target.value)}
            className="bg-white border border-[#d2d6de] rounded px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#3c8dbc]"
          >
            <option value="ALL">All Locations (Central View)</option>
            {warehouses.map((w: any) => (
              <option key={w.id} value={w.id}>
                [{w.tier || 'BRANCH'}] {w.name}
              </option>
            ))}
            {franchisees.map((f: any) => (
              <option key={f.id} value={f.id}>
                [FRANCHISEE] {f.name}
              </option>
            ))}
          </select>
        </div>

        <WmsButton
          variant="success"
          size="md"
          disabled={busy}
          onClick={() => postAction({ action: 'SEED_TEST_SCENARIOS' })}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Seed Test Data (All Categories)
        </WmsButton>

        <Link
          href="/franchisee"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-[#d2d6de] text-xs font-semibold text-[#2585be] shadow-2xs transition"
        >
          <Truck className="w-3.5 h-3.5 text-[#2585be]" />
          <span>Franchisee Portal</span>
        </Link>

        <Link
          href="/admin/configuration/settings/shipping"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-[#d2d6de] text-xs font-semibold text-slate-700 shadow-2xs transition"
        >
          <Truck className="w-3.5 h-3.5 text-[#2585be]" />
          <span>Admin Shipping</span>
        </Link>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-[#d2d6de] text-xs font-semibold text-slate-700 shadow-2xs transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#2585be]" />
          <span>Super Admin</span>
        </Link>

        <WmsButton
          variant="secondary"
          size="md"
          loading={loading}
          onClick={refreshPortal}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </WmsButton>
      </div>
    </header>
  );
}
