'use client';

import React, { useState } from 'react';
import { useWmsContext } from '@/components/wms/WmsContext';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';
import { WmsEmptyState } from '@/components/wms/WmsEmptyState';
import { WmsButton } from '@/components/wms/WmsButton';

export default function ExceptionsModulePage() {
  const { loading, portalData, allLocations, postAction } = useWmsContext();
  const [resolveExModal, setResolveExModal] = useState<any>(null);
  const [exResNote, setExResNote] = useState('');
  const [exRestockLocId, setExRestockLocId] = useState('');

  if (loading && !portalData) {
    return <WmsLoadingState label="Loading Exceptions & Returns..." />;
  }

  const exceptions = portalData?.exceptions || [];

  return (
    <div className="space-y-4">
      {exceptions.length === 0 ? (
        <WmsEmptyState
          title="No open exceptions or returns"
          description="Partial receipts, damaged/held stock, missing signed copies, failed delivery attempts, and post-pickup cancellations will appear here."
        />
      ) : (
        <div className="space-y-3">
          {exceptions.map((ex: any) => (
            <div key={ex.id} className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-[#dd4b39] font-mono text-[10px] font-semibold">
                    {ex.type}
                  </span>
                  <strong className="text-slate-800">{ex.title}</strong>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ex.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {ex.status}
                  </span>
                </div>
                <p className="text-slate-600">{ex.description}</p>
                <div className="text-[11px] text-slate-500">
                  Current Holder: <strong className="text-slate-700">{ex.currentHolder}</strong>
                  {ex.resolutionNote && ` • Resolution: ${ex.resolutionNote}`}
                </div>
              </div>
              {ex.status !== 'RESOLVED' && (
                <WmsButton
                  variant="success"
                  size="sm"
                  onClick={() => {
                    setExResNote('');
                    setExRestockLocId(portalData?.warehouses?.[0]?.id || '');
                    setResolveExModal(ex);
                  }}
                >
                  Resolve Case
                </WmsButton>
              )}
            </div>
          ))}
        </div>
      )}

      {resolveExModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Resolve Exception: {resolveExModal.title}</h3>
            <input placeholder="Resolution Note" value={exResNote} onChange={(e) => setExResNote(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            {resolveExModal.type === 'CANCELLED_RETURN' && (
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Restock Inspected Return To:</label>
                <select value={exRestockLocId} onChange={(e) => setExRestockLocId(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5">
                  {allLocations.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <WmsButton onClick={() => setResolveExModal(null)}>Cancel</WmsButton>
              <WmsButton
                variant="success"
                onClick={async () => {
                  const r = await postAction({
                    action: 'RESOLVE_EXCEPTION',
                    exceptionId: resolveExModal.id,
                    resolutionNote: exResNote,
                    restockLocationId: resolveExModal.type === 'CANCELLED_RETURN' ? exRestockLocId : undefined,
                  });
                  if (r) setResolveExModal(null);
                }}
              >
                Mark Resolved
              </WmsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
