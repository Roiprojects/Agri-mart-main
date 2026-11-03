'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  Printer,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelNotice, setCancelNotice] = useState<string>('');

  const fetchOrders = () => {
    fetch('/api/customer/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    const confirmCancel = window.confirm(
      `Are you sure you wish to cancel Order #${orderNumber}? Reserved warehouse stock will be immediately returned to inventory.`
    );
    if (!confirmCancel) return;

    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Farmer cancelled via online account' }),
      });
      const data = await res.json();
      if (data.success) {
        setCancelNotice(`Order #${orderNumber} cancelled successfully. Inventory restored.`);
        fetchOrders();
      } else {
        alert(data.message || 'Failed to cancel order.');
      }
    } catch (err: any) {
      alert('Error cancelling order: ' + err.message);
    } finally {
      setCancellingId(null);
      setTimeout(() => setCancelNotice(''), 5000);
    }
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'PLACED': return 1;
      case 'CONFIRMED': return 2;
      case 'PACKED': return 3;
      case 'DISPATCHED': return 4;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'DELIVERED': return 5;
      case 'CANCELLED': return -1;
      default: return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href="/account" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Your Order History &amp; Real-Time Tracking</h1>
          <p className="text-xs text-slate-500 mt-0.5">Live status updates from regional dark fulfillment warehouses and logistics carriers.</p>
        </div>
        <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          Auto-synced with Dark Warehouses
        </div>
      </div>

      {cancelNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{cancelNotice}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our catalog of power weeders, organic fertilizers, and hybrid seeds delivered directly to your field.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-agri-green hover:bg-agri-green-dark text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => {
            const stepIdx = getStatusStepIndex(ord.status);
            const isCancelled = ord.status === 'CANCELLED';
            const canCancel = ord.status === 'PLACED' || ord.status === 'CONFIRMED';

            return (
              <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs transition hover:border-emerald-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-slate-900">Order #{ord.orderNumber}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Fulfillment Hub: <strong>{ord.assignedWarehouseName || 'Hubballi Dark Warehouse'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black px-3.5 py-1 rounded-full text-[11px] uppercase tracking-wider ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : ord.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>

                    <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-[11px]">
                      {ord.paymentStatus} ({ord.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper (If not cancelled) */}
                {!isCancelled ? (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="font-bold text-slate-700 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-agri-green" /> Delivery Tracking Pipeline
                      </span>
                      {ord.trackingNumber && (
                        <span className="font-mono text-xs text-slate-500">
                          {ord.courierName}: <strong>{ord.trackingNumber}</strong>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                      {[
                        { label: 'Placed', step: 1 },
                        { label: 'Confirmed', step: 2 },
                        { label: 'Packed', step: 3 },
                        { label: 'Dispatched', step: 4 },
                        { label: 'Delivered', step: 5 },
                      ].map((s) => {
                        const active = stepIdx >= s.step;
                        return (
                          <div key={s.step} className="space-y-1">
                            <div
                              className={`h-2 rounded-full transition-colors duration-300 ${
                                active ? 'bg-agri-green' : 'bg-slate-200'
                              }`}
                            />
                            <span className={`font-semibold ${active ? 'text-agri-green-dark' : 'text-slate-400'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>
                      This order was cancelled on {new Date(ord.cancelledAt || ord.updatedAt).toLocaleDateString('en-IN')}.
                      {ord.cancellationReason && ` Reason: "${ord.cancellationReason}".`}
                    </span>
                  </div>
                )}

                {/* Items in Order */}
                <div className="space-y-2">
                  <div className="font-extrabold text-slate-900">Items Ordered:</div>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="text-[10px] text-slate-500">
                            Pack/Variant: {item.variantTitle} &bull; Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-slate-400">₹{item.unitPrice.toLocaleString('en-IN')} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer & Actions */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-100">
                  <div className="text-sm">
                    <span className="text-slate-500">Total Order Value: </span>
                    <strong className="text-base text-slate-950 font-black">₹{ord.totalAmount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Cancellation Button */}
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(ord.id, ord.orderNumber)}
                        disabled={cancellingId === ord.id}
                        className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {cancellingId === ord.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}

                    {/* Tax Invoice Link */}
                    <Link
                      href={`/account/orders/${ord.id}/invoice`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> View Tax Invoice
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
