'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useWmsContext } from '@/components/wms/WmsContext';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';
import { WmsButton } from '@/components/wms/WmsButton';

export default function StockModulePage() {
  const { loading, portalData, allLocations, activeStaff, postAction } = useWmsContext();
  const [locationId, setLocationId] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<'ALL' | 'ON_HAND' | 'RESERVED' | 'AVAILABLE' | 'HELD' | 'INCOMING'>('ALL');
  const [stockModal, setStockModal] = useState<any>(null);

  useEffect(() => {
    if (!locationId && allLocations.length > 0) {
      setLocationId(allLocations[0].id);
    }
  }, [allLocations, locationId]);

  if (loading && !portalData) {
    return <WmsLoadingState label="Loading Product & Variant Stock..." />;
  }

  const computeIncomingQty = (locId: string, productId: string, variantId: string) => {
    let total = 0;
    for (const t of portalData?.transfers || []) {
      for (const g of t.groups || []) {
        if (g.destinationId === locId && ['IN_TRANSIT', 'PARTIAL_RECEIPT', 'PENDING_SIGNED_COPY'].includes(g.status)) {
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

  const rows = (portalData?.catalogVariants || [])
    .filter((cv: any) => {
      if (categoryFilter !== 'ALL' && cv.categoryId !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !cv.productName.toLowerCase().includes(q) &&
          !cv.variantName.toLowerCase().includes(q) &&
          !cv.sku.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    })
    .map((cv: any) => {
      const row = (portalData?.stocks || []).find(
        (s: any) => s.locationId === locationId && s.productId === cv.productId && s.variantId === cv.variantId
      );
      const onHand = row?.onHand || 0;
      const reserved = row?.reserved || 0;
      const available = Math.max(0, onHand - reserved);
      const held = row?.held || 0;
      const incoming = computeIncomingQty(locationId, cv.productId, cv.variantId);
      return { cv, onHand, reserved, available, held, incoming };
    })
    .filter((item: any) => {
      if (balanceFilter === 'ON_HAND') return item.onHand > 0;
      if (balanceFilter === 'RESERVED') return item.reserved > 0;
      if (balanceFilter === 'AVAILABLE') return item.available > 0;
      if (balanceFilter === 'HELD') return item.held > 0;
      if (balanceFilter === 'INCOMING') return item.incoming > 0;
      return true;
    });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Location:</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="border border-[#d2d6de] rounded px-2.5 py-1.5 text-xs text-slate-700 bg-white"
            >
              {allLocations.map((l: any) => (
                <option key={l.id} value={l.id}>[{l.kind}] {l.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-[#d2d6de] rounded px-2.5 py-1.5 text-xs text-slate-700 bg-white"
            >
              <option value="ALL">All Categories</option>
              {(portalData?.categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter product or SKU..."
              className="border border-[#d2d6de] rounded pl-8 pr-2.5 py-1.5 text-xs text-slate-700 w-48"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium mr-1">Balances:</span>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'ON_HAND', label: 'On hand' },
            { key: 'RESERVED', label: 'Reserved' },
            { key: 'AVAILABLE', label: 'Available' },
            { key: 'HELD', label: 'Held' },
            { key: 'INCOMING', label: 'Incoming' },
          ].map((b) => {
            const active = balanceFilter === b.key;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => setBalanceFilter(active && b.key !== 'ALL' ? 'ALL' : (b.key as any))}
                className={`px-2.5 py-1 rounded border font-semibold transition cursor-pointer ${
                  active
                    ? 'bg-[#2585be] text-white border-[#1f72a3]'
                    : 'bg-[#f4f6f9] text-slate-700 border-[#d2d6de] hover:bg-slate-100'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Product &amp; Variant</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Category</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">SKU</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">On hand</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Reserved</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Available</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Held</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Incoming</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No matching stock records for this filter.
                  </td>
                </tr>
              ) : (
                rows.map(({ cv, onHand, reserved, available, held, incoming }: any) => (
                  <tr key={`${cv.productId}-${cv.variantId}`} className="border-b border-[#f0f0f0] hover:bg-slate-50">
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0]">
                      <div className="font-semibold text-slate-800">{cv.productName}</div>
                      <div className="text-[11px] text-slate-500">{cv.variantName}</div>
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-slate-600">{cv.categoryName}</td>
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0] font-mono text-slate-600">{cv.sku}</td>
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center font-semibold text-slate-800">{onHand}</td>
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center font-semibold text-amber-600">{reserved}</td>
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center font-bold text-[#00a65a]">{available}</td>
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center font-semibold text-[#dd4b39]">{held}</td>
                    <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center font-semibold text-[#2585be]">{incoming}</td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          setStockModal({
                            mode: 'OPENING',
                            locationId,
                            productId: cv.productId,
                            variantId: cv.variantId,
                            productName: cv.productName,
                            variantName: cv.variantName,
                            quantity: onHand,
                            delta: 0,
                            reason: 'Opening balance',
                          })
                        }
                        className="text-[#2585be] hover:underline font-medium cursor-pointer"
                      >
                        Opening
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setStockModal({
                            mode: 'ADJUST',
                            locationId,
                            productId: cv.productId,
                            variantId: cv.variantId,
                            productName: cv.productName,
                            variantName: cv.variantName,
                            quantity: onHand,
                            delta: 0,
                            reason: '',
                          })
                        }
                        className="text-amber-600 hover:underline font-medium cursor-pointer"
                      >
                        Adjust
                      </button>
                      {held > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            postAction({
                              action: 'RELEASE_HELD_STOCK',
                              locationId,
                              productId: cv.productId,
                              variantId: cv.variantId,
                              productName: cv.productName,
                              variantName: cv.variantName,
                              qty: held,
                              toAvailable: true,
                              performedBy: activeStaff?.name,
                            })
                          }
                          className="text-[#00a65a] hover:underline font-medium cursor-pointer"
                        >
                          Release Held
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 space-y-2">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Recent Stock Ledger</h3>
        {(portalData?.adjustmentLogs || []).length === 0 ? (
          <div className="text-xs text-slate-500">No stock adjustments recorded yet.</div>
        ) : (
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {(portalData?.adjustmentLogs || []).map((log: any) => (
              <div key={log.id} className="text-xs flex flex-wrap items-center justify-between gap-2 py-1.5 border-b border-[#f0f0f0]">
                <div>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 mr-2">
                    {log.type}
                  </span>
                  <strong className="text-slate-800">{log.productName}</strong>{' '}
                  <span className="text-slate-500">({log.variantName})</span> — {log.reason}
                </div>
                <div className="flex items-center gap-3">
                  <span className={log.delta >= 0 ? 'text-[#00a65a] font-semibold' : 'text-[#dd4b39] font-semibold'}>
                    {log.delta >= 0 ? `+${log.delta}` : log.delta}
                  </span>
                  <span className="text-[11px] text-slate-500">{log.performedBy}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {stockModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">
              {stockModal.mode === 'OPENING' ? 'Set Opening Balance' : 'Adjust Stock'} — {stockModal.productName} ({stockModal.variantName})
            </h3>
            {stockModal.mode === 'OPENING' ? (
              <input type="number" min={0} value={stockModal.quantity} onChange={(e) => setStockModal({ ...stockModal, quantity: Number(e.target.value) })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            ) : (
              <input type="number" value={stockModal.delta} onChange={(e) => setStockModal({ ...stockModal, delta: Number(e.target.value) })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" placeholder="Delta (+/-)" />
            )}
            <input placeholder="Reason (required)" value={stockModal.reason} onChange={(e) => setStockModal({ ...stockModal, reason: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <div className="flex justify-end gap-2 pt-2">
              <WmsButton onClick={() => setStockModal(null)}>Cancel</WmsButton>
              <WmsButton
                variant="primary"
                onClick={async () => {
                  const r = await postAction({
                    action: stockModal.mode === 'OPENING' ? 'SET_OPENING_STOCK' : 'ADJUST_STOCK',
                    ...stockModal,
                    performedBy: activeStaff?.name,
                  });
                  if (r) setStockModal(null);
                }}
              >
                Save Stock
              </WmsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
