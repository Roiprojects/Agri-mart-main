'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useWmsContext } from '@/components/wms/WmsContext';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';
import { WmsEmptyState } from '@/components/wms/WmsEmptyState';
import { WmsButton } from '@/components/wms/WmsButton';

export default function IncomingModulePage() {
  const { loading, portalData, activeLocationId, activeStaff, postAction } = useWmsContext();
  const [incomingSearch, setIncomingSearch] = useState('');
  const [receiveModal, setReceiveModal] = useState<{ transfer: any; group: any } | null>(null);
  const [recvCounts, setRecvCounts] = useState<Record<string, { goodQty: number; damagedQty: number }>>({});
  const [recvNotes, setRecvNotes] = useState('');
  const [recvOtpInput, setRecvOtpInput] = useState('');
  const [recvSignedFile, setRecvSignedFile] = useState('');
  const [reassignStaffId, setReassignStaffId] = useState('');

  const incomingGroups = useMemo(() => {
    const list: { transfer: any; group: any }[] = [];
    for (const t of portalData?.transfers || []) {
      for (const g of t.groups || []) {
        if (activeLocationId !== 'ALL' && g.destinationId !== activeLocationId) continue;
        if (['DRAFT', 'PREPARED', 'CANCELLED'].includes(g.status)) continue;
        if (incomingSearch.trim()) {
          const q = incomingSearch.toLowerCase();
          const match =
            t.transferNumber.toLowerCase().includes(q) ||
            (g.challan?.challanNumber || '').toLowerCase().includes(q) ||
            g.items.some((i: any) => (i.packageId || '').toLowerCase().includes(q) || i.productName.toLowerCase().includes(q));
          if (!match) continue;
        }
        list.push({ transfer: t, group: g });
      }
    }
    return list;
  }, [portalData, activeLocationId, incomingSearch]);

  if (loading && !portalData) {
    return <WmsLoadingState label="Loading Incoming Shipments..." />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={incomingSearch}
          onChange={(e) => setIncomingSearch(e.target.value)}
          placeholder="Search incoming load by transfer #, challan #, package ID, or product..."
          className="flex-1 text-xs text-slate-700 outline-none"
        />
      </div>

      {incomingGroups.length === 0 ? (
        <WmsEmptyState
          title="No incoming loads pending"
          description="Dispatched transfers in transit to this location will appear here for counting, signed copy upload, and Receipt OTP verification."
        />
      ) : (
        <div className="space-y-3">
          {incomingGroups.map(({ transfer: t, group: g }) => (
            <div key={g.id} className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs space-x-2">
                  <span className="font-mono font-semibold text-[#2585be]">{t.transferNumber}</span>
                  <span className="text-slate-600">{t.sourceWarehouseName} → <strong className="text-slate-800">{g.destinationName}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">{g.status}</span>
                </div>
                {g.status !== 'RECEIVED' && (
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
                      setRecvNotes('');
                      setRecvOtpInput('');
                      setRecvSignedFile(g.challan?.signedCopyAttachment || '');
                      setReassignStaffId(activeStaff?.id || '');
                      setReceiveModal({ transfer: t, group: g });
                    }}
                  >
                    Receive &amp; Post Receipt
                  </WmsButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {receiveModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-slate-800">
              Receive Load — {receiveModal.transfer.transferNumber} → {receiveModal.group.destinationName}
            </h3>
            <div className="space-y-2">
              {receiveModal.group.items.map((it: any) => {
                const rem = Math.max(0, it.packedQty - (it.receivedGoodQty + it.receivedDamagedQty));
                const cur = recvCounts[it.id] || { goodQty: rem, damagedQty: 0 };
                return (
                  <div key={it.id} className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-2.5 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <div className="font-semibold text-slate-800">{it.productName} ({it.variantName})</div>
                      <div className="text-[11px] text-slate-500">Expected remaining: {rem}</div>
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-[#00a65a] font-semibold block">Good Qty</label>
                      <input type="number" min={0} max={rem} value={cur.goodQty} onChange={(e) => setRecvCounts({ ...recvCounts, [it.id]: { ...cur, goodQty: Number(e.target.value) } })} className="w-full bg-white border border-[#d2d6de] rounded px-2 py-1" />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-[#dd4b39] font-semibold block">Damaged/Refused</label>
                      <input type="number" min={0} max={rem} value={cur.damagedQty} onChange={(e) => setRecvCounts({ ...recvCounts, [it.id]: { ...cur, damagedQty: Number(e.target.value) } })} className="w-full bg-white border border-[#d2d6de] rounded px-2 py-1" />
                    </div>
                  </div>
                );
              })}
            </div>
            <input placeholder="Notes for missing packages or damage..." value={recvNotes} onChange={(e) => setRecvNotes(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            {receiveModal.group.transportMethod === 'OWN_VEHICLE' && (
              <div className="bg-[#f4f6f9] border border-[#d2d6de] rounded p-3 space-y-1.5">
                <div className="font-semibold text-slate-700">Own Vehicle: Signed Acknowledgment Copy Upload</div>
                <input type="file" accept="image/*,.pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) setRecvSignedFile(f.name); }} />
                {recvSignedFile && <div className="text-[11px] text-[#00a65a]">Attached: {recvSignedFile}</div>}
              </div>
            )}
            <div className="bg-[#f4f6f9] border border-[#d2d6de] rounded p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <select value={reassignStaffId} onChange={(e) => setReassignStaffId(e.target.value)} className="bg-white border border-[#d2d6de] rounded px-2 py-1">
                  {(portalData?.staffUsers || []).map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <WmsButton
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    const r = await postAction({ action: 'REQUEST_RECEIPT_OTP', transferId: receiveModal.transfer.id, groupId: receiveModal.group.id, receiverUserId: reassignStaffId });
                    if (r?.receiptOtpCode) setReceiveModal({ ...receiveModal, group: { ...receiveModal.group, receiptOtpCode: r.receiptOtpCode } });
                  }}
                >
                  Request Receipt OTP
                </WmsButton>
                {receiveModal.group.receiptOtpCode && <span className="font-mono text-[#00a65a] font-semibold">OTP: {receiveModal.group.receiptOtpCode}</span>}
              </div>
              <div className="flex items-center gap-2">
                <input placeholder="Enter Receipt OTP" value={recvOtpInput} onChange={(e) => setRecvOtpInput(e.target.value)} className="bg-white border border-[#d2d6de] rounded px-2 py-1 w-32" />
                <WmsButton
                  variant="success"
                  size="sm"
                  onClick={async () => {
                    const receiver = portalData?.staffUsers?.find((u: any) => u.id === reassignStaffId) || activeStaff;
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
                >
                  Accept Receipt
                </WmsButton>
              </div>
            </div>
            <div className="flex justify-end"><WmsButton onClick={() => setReceiveModal(null)}>Close</WmsButton></div>
          </div>
        </div>
      )}
    </div>
  );
}
