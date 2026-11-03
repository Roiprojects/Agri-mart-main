import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function CustomerWalletPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link href="/account" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-block bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full mb-1">
            OPTIONAL COMPONENT (Doc 2, Section 12)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kisan Cash & Rental Wallet</h1>
          <p className="text-xs text-slate-500">Store credits, equipment rental deposit hold & instant cashback refunds.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="text-xs text-emerald-200">Available Wallet Balance</div>
        <div className="text-4xl font-black text-white">₹2,500.00</div>
        <div className="flex gap-3 pt-2 text-xs">
          <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-lg transition flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Money via UPI
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition border border-white/20">
            Redeem at Checkout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Security Deposit Refund (Weeder)</div>
                <div className="text-[10px] text-slate-400">12 Sep 2026</div>
              </div>
            </div>
            <div className="font-bold text-emerald-700 text-sm">+₹5,000</div>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Drip Kit Purchase Payment</div>
                <div className="text-[10px] text-slate-400">10 Sep 2026</div>
              </div>
            </div>
            <div className="font-bold text-slate-900 text-sm">-₹2,500</div>
          </div>
        </div>
      </div>
    </div>
  );
}
