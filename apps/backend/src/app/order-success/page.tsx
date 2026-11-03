import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, FileText, ArrowRight, Home } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

interface OrderSuccessProps {
  searchParams: Promise<{ id?: string; wh?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.id || 'AGM-2026-9045';
  const warehouse = resolvedParams.wh || 'Mandya Cauvery Basin Dark Warehouse';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Payment & Allocation Successful</span>
        <h1 className="text-3xl font-extrabold text-slate-900">Thank You for Your Order!</h1>
        <p className="text-sm text-slate-600">
          Order Number: <strong className="text-slate-900">{orderId}</strong>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-left text-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Fulfillment & Tracking Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-slate-500 font-medium">Assigned Dark Warehouse:</div>
            <div className="text-slate-900 font-bold mt-0.5">{warehouse}</div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Order Status:</div>
            <div className="text-emerald-700 font-bold mt-0.5">Assigned & Preparing for Packing</div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Tracking Number:</div>
            <div className="text-slate-900 font-bold mt-0.5">TRK-AM-884920 (Rural Express)</div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Estimated Delivery:</div>
            <div className="text-slate-900 font-bold mt-0.5">Within 24-48 Hours</div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
          <strong>Next Step in Crop Lifecycle:</strong> Our procurement team has logged your purchase. As your crop enters Stage 3 & 4, you will receive timely WhatsApp alerts for weeding schedules and water scheduling.
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-4">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
        >
          <FileText className="w-4 h-4" />
          <span>View Order in Account</span>
        </Link>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
