import React from 'react';
import { SEED_DEALERS } from '@/lib/seed-data';
import { MapPin, Phone, Mail, Award, Wrench, ShieldCheck } from 'lucide-react';

export default function DealersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg space-y-2">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Authorized Retail & Service Centers</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold">1,500+ Agri Mart Dealer Network</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
          Authorized sales points and service workshops across every taluk in Karnataka. Purchase genuine GreenShield equipment, spare parts, and avail warranty service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SEED_DEALERS.map((dealer) => (
          <div key={dealer.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dealer Code: {dealer.dealerCode}</span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">{dealer.businessName}</h3>
                <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" /> {dealer.region}
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                dealer.tier === 'PLATINUM'
                  ? 'bg-purple-100 text-purple-800'
                  : dealer.tier === 'GOLD'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {dealer.tier} TIER
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-slate-400">Contact Person:</span>
                <div className="font-semibold text-slate-800">{dealer.contactPerson}</div>
              </div>
              <div>
                <span className="text-slate-400">Phone:</span>
                <div className="font-semibold text-emerald-800">{dealer.mobile}</div>
              </div>
              <div>
                <span className="text-slate-400">GSTIN:</span>
                <div className="font-mono text-slate-700">{dealer.gstin}</div>
              </div>
              <div>
                <span className="text-slate-400">Service Center:</span>
                <div className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> 9-Stage Authorized Workshop
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Service Desk & Job Cards Managed: <strong>{dealer.totalJobCards}</strong></span>
              <a
                href={`tel:${dealer.mobile}`}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition"
              >
                Call Dealer
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
