'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function OrderInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customer/orders?id=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
        Loading Tax Invoice...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Invoice Not Found</h2>
        <p className="text-xs text-slate-500">The requested order invoice could not be located.</p>
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-agri-green hover:underline"
        >
          &larr; Return to Orders
        </button>
      </div>
    );
  }

  const shipping = order.shippingAddress || {};
  const cgst = Math.round(order.taxAmount / 2);
  const sgst = order.taxAmount - cgst;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-slate-800">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex justify-between items-center print:hidden border-b border-slate-200 pb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <button
          onClick={() => window.print()}
          className="bg-agri-green hover:bg-agri-green-dark text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
        >
          <Printer className="w-4 h-4" /> Print / Save Tax Invoice PDF
        </button>
      </div>

      {/* Invoice Printable Sheet */}
      <div className="bg-white border border-slate-300 p-8 rounded-2xl shadow-sm space-y-6 text-xs print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Image
                src="/images/agrimart_logo_en_transparent.png"
                alt="Agri Mart Mega"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="text-[10px] text-slate-500">
              AGRI MART MEGA &bull; ROI E-Commerce Hubs Pvt Ltd
            </div>
            <div className="text-[10px] text-slate-500">
              GSTIN: <strong>29AAACA1234F1Z8</strong> &bull; PAN: AAACA1234F
            </div>
            <div className="text-[10px] text-slate-500">
              Dark Warehouse Origin: {order.warehouse?.name || 'Hubballi Central Fulfillment Hub'}
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-sm font-black text-slate-950 uppercase tracking-wider">TAX INVOICE</div>
            <div className="font-mono text-xs font-bold text-agri-green-dark">
              Invoice #{order.orderNumber.replace('AGM', 'INV')}
            </div>
            <div className="text-[11px] text-slate-500">
              Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-[11px] text-slate-500">
              Payment Status: <strong className="text-emerald-700">{order.paymentStatus}</strong> ({order.paymentMethod})
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8 py-2">
          <div className="space-y-1">
            <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Sold & Dispatched By:</div>
            <div className="font-bold text-slate-900">{order.warehouse?.name || 'Hubballi Central Dark Warehouse'}</div>
            <div className="text-slate-600 text-[11px] leading-relaxed">
              {order.warehouse?.address || 'Plot 44-B, KIADB Industrial Area, Tarihal, Hubballi, Karnataka - 580026'}
            </div>
            <div className="text-slate-600 text-[11px]">Kisan Helpline: 1800-425-AGRI</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Bill To / Deliver To:</div>
            <div className="font-bold text-slate-900">{shipping.fullName || 'Farmer Partner'}</div>
            <div className="text-slate-600 text-[11px] leading-relaxed">
              {shipping.addressLine}, {shipping.taluk ? shipping.taluk + ' Taluk,' : ''} {shipping.village ? shipping.village + ',' : ''}
              <br />
              {shipping.district}, Karnataka - {shipping.pincode}
            </div>
            <div className="text-slate-600 text-[11px]">Mobile: +91 {shipping.mobile}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Description of Goods</th>
                <th className="py-2.5 px-3">HSN Code</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Taxable Value</th>
                <th className="py-2.5 px-3 text-right">GST Rate</th>
                <th className="py-2.5 px-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {order.items?.map((item: any, idx: number) => (
                <tr key={item.id}>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{item.productName}</div>
                    <div className="text-[10px] text-slate-500">Variant: {item.variantTitle} &bull; SKU: {item.sku}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">8432.29</td>
                  <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right">5%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-72 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Taxable Subtotal:</span>
              <span className="font-semibold">₹{order.subtotalAmount.toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                <span>- ₹{order.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>CGST (2.5%):</span>
              <span>₹{cgst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST (2.5%):</span>
              <span>₹{sgst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Fulfillment & Delivery Freight:</span>
              <span>{order.deliveryFee === 0 ? 'FREE (Express Subsidy)' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-black text-slate-950">
              <span>Net Invoice Total:</span>
              <span className="text-agri-green-dark">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 space-y-1">
          <p>
            <strong>Declaration:</strong> This is a computer-generated tax invoice issued in accordance with Section 31 of the CGST Act 2017. All machinery covered by comprehensive 1-Year AMC warrantied by authorized Agri Mart Mega service networks.
          </p>
          <p>
            For support or warranty claims, contact Hubballi Support Desk at support@agrimart.in or call toll-free 1800-425-AGRI.
          </p>
        </div>
      </div>
    </div>
  );
}
