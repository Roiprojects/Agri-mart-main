'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  User,
  Save,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FormSection } from '@/components/admin/FormSection';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form states
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`);
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
        setStatus(json.data.status || 'PLACED');
        setPaymentStatus(json.data.paymentStatus || 'PENDING');
        setTrackingNumber(json.data.trackingNumber || '');
        setCourierName(json.data.courierName || '');
      } else {
        setError(json.error || 'Failed to load order');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [resolvedParams.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotice(null);
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber,
          courierName,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNotice('Order updated successfully!');
        fetchOrder();
        setTimeout(() => setNotice(null), 4000);
      } else {
        setError(json.error || 'Failed to update order');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-500">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 mr-3" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center max-w-md mx-auto shadow-xs">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-red-900 mb-1">Failed to load order</h2>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const items = order.items || [];
  const address = order.shippingAddress || {};

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Order #{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2 shadow-xs">
          <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Items & Fulfillment Update */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <FormSection title={`Order Items (${items.length})`}>
            <div className="divide-y divide-slate-100">
              {items.map((item: any, idx: number) => (
                <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      SKU: {item.sku} {item.variantTitle && `• ${item.variantTitle}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 font-mono">
                      ₹{item.totalPrice?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} × ₹{item.unitPrice?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-mono font-medium">₹{order.subtotalAmount?.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono font-medium">-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-slate-800 font-mono font-medium">₹{order.deliveryFee?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax / GST (5%)</span>
                <span className="text-slate-800 font-mono font-medium">₹{order.taxAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-emerald-700 font-mono">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </FormSection>

          {/* Quick Fulfillment Management */}
          <form onSubmit={handleUpdate}>
            <FormSection
              title="Fulfillment & Tracking Controls"
              description="Update live delivery milestones and carrier references"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Order Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PACKED">PACKED</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Courier / Partner
                  </label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. AgriMart Rural Fleet, Delhivery"
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tracking / Waybill Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TRK-KA-2026-981"
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-xs"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving Changes...' : 'Update Fulfillment Status'}
                </button>
              </div>
            </FormSection>
          </form>
        </div>

        {/* Right Col: Customer & Delivery Address */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <User className="h-4 w-4 text-emerald-600" />
              Customer Information
            </div>
            <div className="text-xs space-y-1 text-slate-600">
              <p className="font-semibold text-slate-800 text-sm">
                {order.user?.name || address.fullName || 'Registered Farmer'}
              </p>
              <p className="font-mono text-slate-500">
                {order.user?.mobile || address.mobile || '—'}
              </p>
              {order.user?.email && <p className="text-slate-500">{order.user.email}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Delivery Destination
            </div>
            <div className="text-xs space-y-1 text-slate-600">
              <p className="font-semibold text-slate-800">{address.fullName || 'Recipient'}</p>
              <p>{address.addressLine || 'Address details on slip'}</p>
              {(address.village || address.taluk) && (
                <p>
                  Village: {address.village || '—'}, Taluk: {address.taluk || '—'}
                </p>
              )}
              <p>
                {address.district || 'Karnataka'} - {address.pincode || '—'}
              </p>
            </div>
          </div>

          {/* Warehouse Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Truck className="h-4 w-4 text-emerald-600" />
              Fulfillment Hub
            </div>
            <div className="text-xs space-y-1 text-slate-600">
              <p className="font-semibold text-slate-800">
                {order.warehouse?.name || order.assignedWarehouseName || 'Hubballi Fulfillment Hub'}
              </p>
              <p className="text-slate-500">Mode: {order.assignmentMode || 'AUTO'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
