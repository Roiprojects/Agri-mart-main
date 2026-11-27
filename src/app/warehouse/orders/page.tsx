'use client';

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useWmsContext } from '@/components/wms/WmsContext';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';
import { WmsEmptyState } from '@/components/wms/WmsEmptyState';
import { WmsButton } from '@/components/wms/WmsButton';

export default function OrdersDispatchModulePage() {
  const { loading, portalData, postAction, notify } = useWmsContext();
  const [orderSearch, setOrderSearch] = useState('');
  const [routeModal, setRouteModal] = useState<{ order: any; preview: any } | null>(null);
  const [timelineOrder, setTimelineOrder] = useState<any>(null);
  const [carrierDispatchOrder, setCarrierDispatchOrder] = useState<any>(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);

  const [carIdInput, setCarIdInput] = useState('');
  const [awbInput, setAwbInput] = useState('');
  const [courierOtpInput, setCourierOtpInput] = useState('');

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

  if (loading && !portalData) {
    return <WmsLoadingState label="Loading Customer Orders & Dispatch Queue..." />;
  }

  const openRoutePreview = async (order: any) => {
    const res = await fetch(`/api/warehouse/portal?routePreviewOrderId=${order.id}`);
    const json = await res.json();
    if (json.success && json.preview) {
      setRouteModal({ order, preview: json.preview });
    } else {
      notify('err', json.error || 'Could not compute route preview');
    }
  };

  const orders = (portalData?.orders || []).filter((o: any) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return o.orderNumber?.toLowerCase().includes(q) || o.shippingAddress?.fullName?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search order # or customer name..."
            className="w-full border border-[#d2d6de] rounded pl-8 pr-2.5 py-1.5 text-xs text-slate-700 outline-none"
          />
        </div>
        <WmsButton
          variant="primary"
          size="md"
          onClick={() => {
            const firstVar = portalData?.catalogVariants?.[0];
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
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Create Order
        </WmsButton>
      </div>

      {orders.length === 0 ? (
        <WmsEmptyState title="No orders found" description="Customer orders from the storefront or portal will appear here." />
      ) : (
        <div className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                  <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Order #</th>
                  <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Customer &amp; Location</th>
                  <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Items</th>
                  <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Status / Route</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => {
                  const ful = o.fulfillment;
                  return (
                    <tr key={o.id} className="border-b border-[#f0f0f0] hover:bg-slate-50">
                      <td className="py-2.5 px-3 border-r border-[#f0f0f0] font-mono font-semibold text-[#2585be]">
                        #{o.orderNumber}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#f0f0f0]">
                        <div className="font-semibold text-slate-800">{o.shippingAddress?.fullName || o.user?.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {o.shippingAddress?.district} ({o.shippingAddress?.pincode})
                        </div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#f0f0f0]">
                        <div className="flex flex-wrap gap-1">
                          {(o.items || []).map((it: any) => (
                            <span key={it.id} className="px-2 py-0.5 rounded bg-[#f4f6f9] border border-[#e5e7eb] text-[11px] text-slate-700">
                              {it.productName} × <strong>{it.quantity}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center space-y-1">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                            {ful ? ful.status : o.status}
                          </span>
                        </div>
                        {ful?.routePattern && (
                          <div className="text-[10px] text-[#2585be] font-medium">{ful.routePattern}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        {(!ful || ful.status === 'UNALLOCATED' || ful.status === 'ALLOCATION_REVIEW') && (
                          <WmsButton variant="primary" size="sm" onClick={() => openRoutePreview(o)}>
                            Dispatch
                          </WmsButton>
                        )}
                        {ful?.routePattern === 'CARRIER_DIRECT' && ful.status === 'READY_FOR_DISPATCH' && (
                          <WmsButton
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setCarIdInput(ful.carrierId || portalData?.carriers?.[0]?.id || '');
                              setAwbInput(ful.awbNumber || '');
                              setCourierOtpInput('');
                              setCarrierDispatchOrder(o);
                            }}
                          >
                            Carrier Dispatch
                          </WmsButton>
                        )}
                        {ful && (
                          <WmsButton variant="secondary" size="sm" onClick={() => setTimelineOrder(o)}>
                            Timeline
                          </WmsButton>
                        )}
                        {o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && (
                          <WmsButton
                            variant="danger"
                            size="sm"
                            onClick={() => postAction({ action: 'CANCEL_ORDER_FULFILLMENT', orderId: o.id, reason: 'Cancelled by operator' })}
                          >
                            Cancel
                          </WmsButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Route Preview Modal */}
      {routeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
            <h3 className="text-sm font-semibold text-slate-800">Choose Route for Order #{routeModal.order.orderNumber}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...routeModal.preview.warehousePreviews, ...routeModal.preview.franchiseePreviews].map((loc: any) => (
                <div key={loc.locationId} className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-2.5">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{loc.name}</span>
                    <span className="text-slate-500">{loc.distanceKm} km</span>
                  </div>
                  {loc.canFulfillAll ? (
                    <div className="text-[11px] text-[#00a65a] font-medium">All lines available</div>
                  ) : (
                    <div className="text-[11px] text-[#dd4b39]">
                      Shortage: {loc.shortages.map((s: any) => `${s.productName} (${s.available}/${s.needed})`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {routeModal.preview.routes.map((rt: any) => (
                <div key={rt.id} className="bg-white border border-[#d2d6de] rounded p-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-800">{rt.label}</div>
                    <div className="text-[11px] text-slate-500">
                      {rt.pattern} • {rt.distanceKm} km •{' '}
                      {rt.canFulfillAll ? <span className="text-[#00a65a] font-semibold">Ready</span> : <span className="text-[#dd4b39]">Shortage</span>}
                    </div>
                  </div>
                  <WmsButton
                    variant="primary"
                    size="sm"
                    disabled={!rt.canFulfillAll}
                    onClick={async () => {
                      const r = await postAction({
                        action: 'CONFIRM_ORDER_ROUTE',
                        orderId: routeModal.order.id,
                        routePattern: rt.pattern,
                        sourceLocationId: rt.sourceLocationId,
                        branchLocationId: rt.branchLocationId,
                        franchiseeId: rt.franchiseeId,
                        carrierId: portalData?.carriers?.[0]?.id,
                      });
                      if (r) setRouteModal(null);
                    }}
                  >
                    Confirm Route
                  </WmsButton>
                </div>
              ))}
            </div>
            <div className="flex justify-end"><WmsButton onClick={() => setRouteModal(null)}>Close</WmsButton></div>
          </div>
        </div>
      )}

      {/* Custody Timeline Modal */}
      {timelineOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Order #{timelineOrder.orderNumber} Custody Timeline</h3>
            {(timelineOrder.fulfillment?.legs || []).map((leg: any) => (
              <div key={leg.legIndex} className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-2.5 space-y-1">
                <div className="font-semibold text-[#2585be]">Leg {leg.legIndex}: {leg.fromName} → {leg.toName} ({leg.status})</div>
                {leg.transferNumber && <div>Transfer: {leg.transferNumber}</div>}
                {leg.challanNumber && <div>Challan: {leg.challanNumber}</div>}
                {leg.awbNumber && <div>Carrier: {leg.carrierName} • AWB: {leg.awbNumber}</div>}
              </div>
            ))}
            <div className="flex justify-end"><WmsButton onClick={() => setTimelineOrder(null)}>Close</WmsButton></div>
          </div>
        </div>
      )}

      {/* Carrier Dispatch Modal */}
      {carrierDispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Dispatch #{carrierDispatchOrder.orderNumber} via Delivery Partner</h3>
            <select value={carIdInput} onChange={(e) => setCarIdInput(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5">
              {(portalData?.carriers || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.mode})</option>
              ))}
            </select>
            <input placeholder="AWB Number (or auto)" value={awbInput} onChange={(e) => setAwbInput(e.target.value)} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <WmsButton
              variant="primary"
              className="w-full"
              onClick={async () => {
                const r = await postAction({
                  action: 'DISPATCH_CARRIER_ORDER',
                  orderId: carrierDispatchOrder.id,
                  carrierId: carIdInput,
                  awbNumber: awbInput,
                  generateCourierOtp: true,
                });
                if (r?.courierOtpCode) {
                  setCarrierDispatchOrder({ ...carrierDispatchOrder, fulfillment: { ...carrierDispatchOrder.fulfillment, courierOtpCode: r.courierOtpCode } });
                }
              }}
            >
              Save AWB &amp; Gen Courier OTP
            </WmsButton>
            {carrierDispatchOrder.fulfillment?.courierOtpCode && (
              <div className="space-y-2 border-t border-[#e5e7eb] pt-2">
                <div className="font-mono text-[#00a65a] font-semibold">Courier OTP: {carrierDispatchOrder.fulfillment.courierOtpCode}</div>
                <div className="flex gap-2">
                  <input placeholder="Enter Courier OTP" value={courierOtpInput} onChange={(e) => setCourierOtpInput(e.target.value)} className="flex-1 border border-[#d2d6de] rounded px-2.5 py-1.5" />
                  <WmsButton
                    variant="success"
                    onClick={async () => {
                      const r = await postAction({ action: 'DISPATCH_CARRIER_ORDER', orderId: carrierDispatchOrder.id, otpCode: courierOtpInput });
                      if (r) setCarrierDispatchOrder(null);
                    }}
                  >
                    Confirm
                  </WmsButton>
                </div>
              </div>
            )}
            <div className="flex justify-end"><WmsButton onClick={() => setCarrierDispatchOrder(null)}>Close</WmsButton></div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {newOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">Create Customer Order</h3>
            <input placeholder="Customer Name" value={demoOrderForm.customerName} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, customerName: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <input placeholder="Customer Mobile" value={demoOrderForm.customerMobile} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, customerMobile: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <input placeholder="Address Line" value={demoOrderForm.addressLine} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, addressLine: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="District" value={demoOrderForm.district} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, district: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Pincode" value={demoOrderForm.pincode} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, pincode: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
            </div>
            <select
              value={`${demoOrderForm.productId}::${demoOrderForm.variantId}`}
              onChange={(e) => {
                const [pid, vid] = e.target.value.split('::');
                setDemoOrderForm({ ...demoOrderForm, productId: pid, variantId: vid });
              }}
              className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5"
            >
              {(portalData?.catalogVariants || []).map((cv: any) => (
                <option key={`${cv.productId}::${cv.variantId}`} value={`${cv.productId}::${cv.variantId}`}>
                  {cv.productName} ({cv.variantName})
                </option>
              ))}
            </select>
            <input type="number" min={1} value={demoOrderForm.quantity} onChange={(e) => setDemoOrderForm({ ...demoOrderForm, quantity: Number(e.target.value) })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <div className="flex justify-end gap-2 pt-2">
              <WmsButton onClick={() => setNewOrderModalOpen(false)}>Cancel</WmsButton>
              <WmsButton
                variant="primary"
                onClick={async () => {
                  const r = await postAction({ action: 'CREATE_DEMO_ORDER', ...demoOrderForm });
                  if (r) setNewOrderModalOpen(false);
                }}
              >
                Create Order
              </WmsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
