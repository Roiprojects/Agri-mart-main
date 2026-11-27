'use client';

import React, { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { useWmsContext } from '@/components/wms/WmsContext';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';
import { WmsEmptyState } from '@/components/wms/WmsEmptyState';
import { WmsButton } from '@/components/wms/WmsButton';

export default function TransfersModulePage() {
  const { loading, portalData, allLocations, activeStaff, postAction } = useWmsContext();
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [trfSourceId, setTrfSourceId] = useState('');
  const [trfNotes, setTrfNotes] = useState('');
  const [trfGroups, setTrfGroups] = useState<any[]>([]);
  const [challanModal, setChallanModal] = useState<{ transfer: any; group: any } | null>(null);
  const [vehReg, setVehReg] = useState('');
  const [vehType, setVehType] = useState('');
  const [drvName, setDrvName] = useState('');
  const [drvRef, setDrvRef] = useState('');
  const [drvMobile, setDrvMobile] = useState('');
  const [pickupOtpInput, setPickupOtpInput] = useState('');

  if (loading && !portalData) {
    return <WmsLoadingState label="Loading Stock Transfers & Challans..." />;
  }

  const openTransferBuilder = () => {
    const firstDest = portalData?.warehouses?.[1]?.id || portalData?.franchisees?.[0]?.id || portalData?.warehouses?.[0]?.id || '';
    const firstVar = portalData?.catalogVariants?.[0];
    setTrfSourceId(portalData?.warehouses?.[0]?.id || '');
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

  const transfers = portalData?.transfers || [];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-600">
          Prepare single or multi-stop bulk transfers, issue two-copy numbered challans, and verify driver Pickup OTPs.
        </p>
        <WmsButton variant="primary" size="md" onClick={openTransferBuilder} icon={<Plus className="w-3.5 h-3.5" />}>
          New Stock Transfer / Bulk Trip
        </WmsButton>
      </div>

      {transfers.length === 0 ? (
        <WmsEmptyState
          title="No stock transfers created yet"
          description="Create a single or multi-stop transfer, or click Seed Test Data in the header."
          action={<WmsButton variant="primary" size="sm" onClick={openTransferBuilder}>Create Transfer</WmsButton>}
        />
      ) : (
        <div className="space-y-4">
          {transfers.map((t: any) => (
            <div key={t.id} className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7eb] pb-2.5">
                <div>
                  <span className="font-mono text-sm font-semibold text-[#2585be]">{t.transferNumber}</span>
                  <span className="ml-2 text-xs text-slate-600">From: <strong>{t.sourceWarehouseName}</strong></span>
                  {t.isBulkTrip && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-semibold">
                      Multi-Stop Bulk Trip ({t.groups.length} stops)
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">{t.notes}</span>
              </div>

              {t.groups.map((g: any, gIdx: number) => (
                <div key={g.id} className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-3 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-800">Stop {gIdx + 1}: → {g.destinationName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700">{g.purpose}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-[#2585be]">{g.transportMethod}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">{g.status}</span>
                      {g.challan?.challanNumber && <span className="font-mono text-[11px] text-amber-700">Challan: {g.challan.challanNumber}</span>}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {g.status === 'DRAFT' && (
                        <WmsButton variant="primary" size="sm" onClick={() => postAction({ action: 'PREPARE_TRANSFER_GROUP', transferId: t.id, groupId: g.id })}>
                          Prepare (Reserve Stock)
                        </WmsButton>
                      )}
                      {g.status === 'PREPARED' && g.transportMethod === 'OWN_VEHICLE' && (
                        <WmsButton
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setVehReg(g.vehicleRegistration || '');
                            setVehType(g.vehicleType || '');
                            setDrvName(g.driverName || '');
                            setDrvRef(g.driverReference || '');
                            setDrvMobile(g.driverMobile || '');
                            setPickupOtpInput('');
                            setChallanModal({ transfer: t, group: g });
                          }}
                        >
                          Own Vehicle &amp; 2-Copy Challan
                        </WmsButton>
                      )}
                      {g.challan && (
                        <WmsButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setVehReg(g.vehicleRegistration || '');
                            setVehType(g.vehicleType || '');
                            setDrvName(g.driverName || '');
                            setDrvRef(g.driverReference || '');
                            setDrvMobile(g.driverMobile || '');
                            setPickupOtpInput('');
                            setChallanModal({ transfer: t, group: g });
                          }}
                        >
                          View Challan Copies
                        </WmsButton>
                      )}
                      {(g.status === 'DRAFT' || g.status === 'PREPARED') && (
                        <WmsButton variant="danger" size="sm" onClick={() => postAction({ action: 'CANCEL_TRANSFER_GROUP', transferId: t.id, groupId: g.id })}>
                          Cancel
                        </WmsButton>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {g.items.map((it: any) => (
                      <div key={it.id} className="flex flex-wrap items-center justify-between gap-2 bg-white border border-[#e5e7eb] px-2.5 py-1.5 rounded">
                        <div>
                          <span className="font-mono text-slate-500 mr-2">{it.packageId}</span>
                          <strong className="text-slate-800">{it.productName}</strong> ({it.variantName})
                        </div>
                        <div className="text-slate-600">
                          Packed: <strong>{it.packedQty}</strong> | Recv Good: <strong>{it.receivedGoodQty}</strong> | Damaged: <strong>{it.receivedDamagedQty}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Transfer Builder Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-slate-800">New Single or Multi-Stop Bulk Transfer</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Source Warehouse</label>
                <select value={trfSourceId} onChange={(e) => setTrfSourceId(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5">
                  {(portalData?.warehouses || []).map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Trip Notes</label>
                <input value={trfNotes} onChange={(e) => setTrfNotes(e.target.value)} placeholder="e.g. Morning Bulk Trip" className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
              </div>
            </div>

            {trfGroups.map((g, gIdx) => (
              <div key={gIdx} className="bg-[#f4f6f9] border border-[#d2d6de] rounded p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#2585be]">Dispatch Group / Stop #{gIdx + 1}</span>
                  {trfGroups.length > 1 && (
                    <button type="button" onClick={() => setTrfGroups(trfGroups.filter((_, i) => i !== gIdx))} className="text-[#dd4b39] hover:underline cursor-pointer">
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
                    className="bg-white border border-[#d2d6de] rounded px-2 py-1.5"
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
                    className="bg-white border border-[#d2d6de] rounded px-2 py-1.5"
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
                        const cv = portalData?.catalogVariants?.find((c: any) => c.productId === pid && c.variantId === vid);
                        if (!cv) return;
                        const copy = [...trfGroups];
                        copy[gIdx].items[iIdx] = { ...copy[gIdx].items[iIdx], productId: cv.productId, variantId: cv.variantId, productName: cv.productName, variantName: cv.variantName, sku: cv.sku };
                        setTrfGroups(copy);
                      }}
                      className="col-span-6 bg-white border border-[#d2d6de] rounded px-2 py-1"
                    >
                      {(portalData?.catalogVariants || []).map((cv: any) => (
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
                      className="col-span-2 bg-white border border-[#d2d6de] rounded px-2 py-1"
                    />
                    <select
                      value={it.orderId || ''}
                      onChange={(e) => {
                        const ord = portalData?.orders?.find((o: any) => o.id === e.target.value);
                        const copy = [...trfGroups];
                        copy[gIdx].items[iIdx].orderId = ord?.id || '';
                        copy[gIdx].items[iIdx].orderNumber = ord?.orderNumber || '';
                        setTrfGroups(copy);
                      }}
                      className="col-span-4 bg-white border border-[#d2d6de] rounded px-2 py-1"
                    >
                      <option value="">Replenishment Stock</option>
                      {(portalData?.orders || []).map((o: any) => (
                        <option key={o.id} value={o.id}>Order #{o.orderNumber}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const firstVar = portalData?.catalogVariants?.[0];
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
                className="text-[#2585be] hover:underline font-semibold cursor-pointer"
              >
                + Add Another Stop (Bulk Trip)
              </button>
              <div className="flex gap-2">
                <WmsButton onClick={() => setTransferModalOpen(false)}>Cancel</WmsButton>
                <WmsButton
                  variant="primary"
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
                >
                  Prepare &amp; Reserve Stock
                </WmsButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Copy Challan Modal */}
      {challanModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-slate-800">
              Own Vehicle Dispatch &amp; Two-Copy Delivery Challan ({challanModal.transfer.transferNumber})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Vehicle Registration" value={vehReg} onChange={(e) => setVehReg(e.target.value)} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Vehicle Type" value={vehType} onChange={(e) => setVehType(e.target.value)} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Driver Name" value={drvName} onChange={(e) => setDrvName(e.target.value)} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Driver Reference" value={drvRef} onChange={(e) => setDrvRef(e.target.value)} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Driver Mobile" value={drvMobile} onChange={(e) => setDrvMobile(e.target.value)} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <WmsButton
                variant="primary"
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
                    setChallanModal({ ...challanModal, group: { ...challanModal.group, challan: r.challan, pickupOtpCode: r.pickupOtpCode } });
                  }
                }}
              >
                Issue 2 Challan Copies &amp; Gen Pickup OTP
              </WmsButton>
            </div>

            {challanModal.group.challan && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['DELIVERY COPY (Receiver Keeps)', 'ACKNOWLEDGMENT COPY (Signed & Returned)'].map((copyTitle) => (
                  <div key={copyTitle} className="bg-[#f4f6f9] rounded p-3 space-y-1 border border-[#d2d6de]">
                    <div className="font-bold text-slate-800">{challanModal.group.challan.challanNumber}</div>
                    <div className="text-[10px] font-semibold uppercase text-[#2585be]">{copyTitle}</div>
                    <div><strong>From:</strong> {challanModal.group.challan.sourceName}</div>
                    <div><strong>To:</strong> {challanModal.group.challan.destinationName}</div>
                    <div><strong>Driver:</strong> {challanModal.group.challan.driverName} ({challanModal.group.challan.vehicleRegistration})</div>
                  </div>
                ))}
              </div>
            )}

            {challanModal.group.pickupOtpCode && challanModal.group.status === 'PREPARED' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3 flex flex-wrap items-center justify-between gap-2">
                <div>Driver Pickup OTP: <strong className="font-mono text-emerald-700">{challanModal.group.pickupOtpCode}</strong></div>
                <div className="flex items-center gap-2">
                  <input placeholder="Enter Pickup OTP" value={pickupOtpInput} onChange={(e) => setPickupOtpInput(e.target.value)} className="border border-[#d2d6de] bg-white rounded px-2.5 py-1 w-32" />
                  <WmsButton
                    variant="success"
                    onClick={async () => {
                      const r = await postAction({
                        action: 'CONFIRM_OWN_VEHICLE_DISPATCH',
                        transferId: challanModal.transfer.id,
                        groupId: challanModal.group.id,
                        otpCode: pickupOtpInput,
                      });
                      if (r) setChallanModal(null);
                    }}
                  >
                    Verify &amp; Confirm Dispatch
                  </WmsButton>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <WmsButton
                variant="primary"
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
                      group: {
                        ...challanModal.group,
                        vehicleRegistration: vehReg,
                        vehicleType: vehType,
                        driverName: drvName,
                        driverReference: drvRef,
                        driverMobile: drvMobile,
                        challan: r.challan,
                        pickupOtpCode: r.pickupOtpCode,
                      },
                    });
                  }
                }}
              >
                Save
              </WmsButton>
              <WmsButton onClick={() => window.print()} icon={<Printer className="w-3.5 h-3.5" />}>Print Copies</WmsButton>
              <WmsButton onClick={() => setChallanModal(null)}>Close</WmsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
