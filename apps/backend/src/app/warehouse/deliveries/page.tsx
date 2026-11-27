'use client';

import React, { useState, useMemo } from 'react';
import { useWmsContext } from '@/components/wms/WmsContext';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';
import { WmsEmptyState } from '@/components/wms/WmsEmptyState';
import { WmsButton } from '@/components/wms/WmsButton';

export default function DeliveriesModulePage() {
  const { loading, portalData, activeLocationId, activeStaff, postAction } = useWmsContext();
  const [deliveryOtpModal, setDeliveryOtpModal] = useState<any>(null);
  const [failedDeliveryModal, setFailedDeliveryModal] = useState<any>(null);
  const [custOtpInput, setCustOtpInput] = useState('');
  const [failReason, setFailReason] = useState('');
  const [failAction, setFailAction] = useState<'RETRY' | 'RESCHEDULE' | 'RETURN' | 'EXCEPTION'>('RETRY');

  const deliveryOrders = useMemo(() => {
    return (portalData?.orders || []).filter((o: any) => {
      if (!o.fulfillment?.franchiseeId) return false;
      if (activeLocationId !== 'ALL' && o.fulfillment.franchiseeId !== activeLocationId) return false;
      return true;
    });
  }, [portalData, activeLocationId]);

  if (loading && !portalData) {
    return <WmsLoadingState label="Loading Franchisee Deliveries..." />;
  }

  return (
    <div className="space-y-4">
      {deliveryOrders.length === 0 ? (
        <WmsEmptyState
          title="No franchisee deliveries assigned"
          description="Route an order to a franchisee in Orders → Dispatch to manage doorstep delivery and customer OTP verification here."
        />
      ) : (
        <div className="space-y-3">
          {deliveryOrders.map((o: any) => {
            const ful = o.fulfillment;
            const waiting = ful.status === 'WAITING_FOR_STOCK' || ful.status === 'IN_TRANSIT';
            return (
              <div key={o.id} className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs space-x-2">
                  <span className="font-mono font-semibold text-[#2585be]">#{o.orderNumber}</span>
                  <strong className="text-slate-800">{o.shippingAddress?.fullName}</strong>
                  <span className="text-slate-500">• {o.shippingAddress?.addressLine}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">
                    {ful.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {waiting && <span className="text-xs text-slate-500">Waiting for incoming warehouse receipt</span>}
                  {ful.status === 'READY_FOR_DELIVERY' && (
                    <WmsButton
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        postAction({
                          action: 'MARK_OUT_FOR_DELIVERY',
                          orderId: o.id,
                          staffId: activeStaff?.id,
                          staffName: activeStaff?.name,
                        })
                      }
                    >
                      Mark Out for Delivery
                    </WmsButton>
                  )}
                  {ful.status === 'OUT_FOR_DELIVERY' && (
                    <>
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
                      <WmsButton
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setFailReason('');
                          setFailAction('RETRY');
                          setFailedDeliveryModal(o);
                        }}
                      >
                        Failed Attempt
                      </WmsButton>
                    </>
                  )}
                  {ful.status === 'DELIVERED' && (
                    <span className="text-xs font-semibold text-[#00a65a]">
                      Delivered • Receipt {ful.deliveryReceiptNumber}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                  const r = await postAction({ action: 'VERIFY_CUSTOMER_OTP', orderId: deliveryOtpModal.id, otpCode: custOtpInput });
                  if (r) setDeliveryOtpModal(null);
                }}
              >
                Verify &amp; Deliver
              </WmsButton>
            </div>
          </div>
        </div>
      )}

      {failedDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-sm p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Record Failed Delivery (#{failedDeliveryModal.orderNumber})</h3>
            <input placeholder="Reason" value={failReason} onChange={(e) => setFailReason(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <select value={failAction} onChange={(e) => setFailAction(e.target.value as any)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5">
              <option value="RETRY">Request New OTP &amp; Retry</option>
              <option value="RESCHEDULE">Reschedule</option>
              <option value="RETURN">Return Parcel</option>
              <option value="EXCEPTION">Raise Support Exception</option>
            </select>
            <div className="flex justify-end gap-2">
              <WmsButton onClick={() => setFailedDeliveryModal(null)}>Cancel</WmsButton>
              <WmsButton
                variant="danger"
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
              >
                Save Attempt
              </WmsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
