'use client';

import { useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import { FormSection } from '@/components/admin/FormSection';

export default function AdminSettingsPage() {
  const [savedNotice, setSavedNotice] = useState(false);
  const [form, setForm] = useState({
    name: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    domain: SITE_CONFIG.domain,
    parentCompany: SITE_CONFIG.parentCompany,
    tollFree: SITE_CONFIG.tollFree,
    farmerHelpline: SITE_CONFIG.supportPhone || '+91 94801 23456',
    supportEmail: SITE_CONFIG.supportEmail,
    gstNumber: '29AAACG1234F1Z5',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Platform Settings</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global branding, parent company registration, toll-free helpline, and domain configurations.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Save className="h-4 w-4" /> Save Configuration
        </button>
      </div>

      {savedNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Configuration saved! Note: Environment and DNS settings take effect upon node restart.</span>
        </div>
      )}

      {/* Brand & Corporate Identity */}
      <FormSection title="Brand & Corporate Identity" description="Company registered name, brand slogans, and domain">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Brand Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Production Domain</label>
              <input
                type="text"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Parent Entity</label>
              <input
                type="text"
                value={form.parentCompany}
                onChange={(e) => setForm({ ...form, parentCompany: e.target.value })}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">GSTIN Registration</label>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Farmer Helpline & Contact */}
      <FormSection title="Farmer Contact & Helpline Channels" description="Phone numbers published in headers, invoices, and dispatch slips">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Toll-Free Helpline</label>
            <input
              type="text"
              value={form.tollFree}
              onChange={(e) => setForm({ ...form, tollFree: e.target.value })}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Direct Farmer Cell</label>
            <input
              type="text"
              value={form.farmerHelpline}
              onChange={(e) => setForm({ ...form, farmerHelpline: e.target.value })}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Support Email</label>
            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>
      </FormSection>

      {/* Server & Cluster Architecture */}
      <FormSection title="Runtime Topology" description="Port assignments and service mesh endpoints">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-slate-500 block mb-1">Customer Frontend</span>
            <span className="font-mono text-emerald-700 font-semibold">http://localhost:3000</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-slate-500 block mb-1">Operations & API Hub</span>
            <span className="font-mono text-emerald-700 font-semibold">http://localhost:3001</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-slate-500 block mb-1">Database Mode</span>
            <span className="font-mono text-emerald-700 font-semibold">In-Memory JSON devDb</span>
          </div>
        </div>
      </FormSection>
    </form>
  );
}
