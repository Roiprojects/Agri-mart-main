import React from 'react';
import { SITE_CONFIG } from '@/lib/config';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-xs sm:text-sm">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Contact {SITE_CONFIG.name}</h1>
        <p className="text-slate-500 mt-1">Get in touch with our agronomists, regional dark warehouses, or headquarters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <Phone className="w-6 h-6 text-emerald-700" />
          <h3 className="font-bold text-slate-900">Helpline</h3>
          <p className="text-slate-500">Toll-Free: {SITE_CONFIG.tollFree}</p>
          <p className="text-slate-500">Phone: {SITE_CONFIG.supportPhone}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <Mail className="w-6 h-6 text-emerald-700" />
          <h3 className="font-bold text-slate-900">Support Email</h3>
          <p className="text-slate-500">{SITE_CONFIG.supportEmail}</p>
          <p className="text-slate-500">dealer@agrimart.in</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <MapPin className="w-6 h-6 text-emerald-700" />
          <h3 className="font-bold text-slate-900">Headquarters</h3>
          <p className="text-slate-500">{SITE_CONFIG.parentCompany}</p>
          <p className="text-slate-500">{SITE_CONFIG.headquarters}</p>
        </div>
      </div>
    </div>
  );
}
