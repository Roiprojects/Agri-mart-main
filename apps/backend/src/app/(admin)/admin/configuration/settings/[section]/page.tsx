'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Settings,
  ChevronDown,
  Minus,
  Plus,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 select-none shadow-2xs"
    >
      ?
    </span>
  );
}

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  general: { title: 'General and common settings', subtitle: 'Manage store name, URL, theme, logos and default settings' },
  customer: { title: 'Customer settings', subtitle: 'Registration methods, password lifetimes, address fields and privacy policies' },
  order: { title: 'Order settings', subtitle: 'Checkout options, min/max orders, return requests and order statuses' },
  shipping: { title: 'Shipping settings', subtitle: 'Free shipping thresholds, calculation methods, and estimated delivery dates' },
  tax: { title: 'Tax settings', subtitle: 'Tax rates, prices displayed inclusive/exclusive of tax and default addresses' },
  catalog: { title: 'Catalog settings', subtitle: 'Search results, pagination, categories display, and reviews moderation' },
  'filter-ymm': { title: 'Filter (YMM) settings', subtitle: 'Year, make, and model vehicle-farm machinery equipment filters' },
  'shopping-cart': { title: 'Shopping cart settings', subtitle: 'Mini-shopping cart, wishlist, item limits and cart checkout behavior' },
  'reward-points': { title: 'Reward points settings', subtitle: 'Exchange rates, points expiration, and loyalty incentives' },
  gdpr: { title: 'GDPR settings', subtitle: 'Customer data consents, export tools, and right-to-be-forgotten rules' },
  vendor: { title: 'Vendor settings', subtitle: 'Vendor registration, commissions, store pages, and multi-vendor restrictions' },
  blog: { title: 'Blog settings', subtitle: 'Allow blog comments, notifications, posts per page and RSS feeds' },
  news: { title: 'News settings', subtitle: 'Archive settings, comments approval, and news display limits' },
  forum: { title: 'Forum settings', subtitle: 'Topic limits, user signatures, attachments and moderation rules' },
  media: { title: 'Media settings', subtitle: 'Thumbnail resolutions, storage providers, and image quality thresholds' },
  all: { title: 'All settings (advanced)', subtitle: 'Complete raw settings configuration dictionary for system administrators' },
};

import CatalogSettingsPage from '../catalog/page';
import CustomerSettingsPage from '../customer/page';
import OrderSettingsPage from '../order/page';
import ShippingSettingsPage from '../shipping/page';
import TaxSettingsPage from '../tax/page';
import ShoppingCartSettingsPage from '../shopping-cart/page';
import FilterYmmSettingsPage from '../filter-ymm/page';
import RewardPointsSettingsPage from '../reward-points/page';
import GdprSettingsPage from '../gdpr/page';

export default function ConfigurationSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const unwrappedParams = use(params);
  const section = unwrappedParams.section || 'general';

  if (section === 'catalog') {
    return <CatalogSettingsPage />;
  }
  if (section === 'customer') {
    return <CustomerSettingsPage />;
  }
  if (section === 'order') {
    return <OrderSettingsPage />;
  }
  if (section === 'shipping') {
    return <ShippingSettingsPage />;
  }
  if (section === 'tax') {
    return <TaxSettingsPage />;
  }
  if (section === 'shopping-cart') {
    return <ShoppingCartSettingsPage />;
  }
  if (section === 'filter-ymm') {
    return <FilterYmmSettingsPage />;
  }
  if (section === 'reward-points') {
    return <RewardPointsSettingsPage />;
  }
  if (section === 'gdpr') {
    return <GdprSettingsPage />;
  }

  const info = sectionTitles[section] || {
    title: `${section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} settings`,
    subtitle: `Manage ${section.replace(/-/g, ' ')} parameters and configurations`,
  };

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Common toggles
  const [commonOpen, setCommonOpen] = useState(true);
  const [notifyAdmin, setNotifyAdmin] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [mustBeApproved, setMustBeApproved] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState('15');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((res) => setTimeout(res, 500));
    setSaving(false);
    showToast('The settings have been updated successfully.');
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">{info.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{info.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* ── SETTINGS CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div
          onClick={() => setCommonOpen(!commonOpen)}
          className="px-4 py-2.5 bg-slate-50/90 border-b border-[#d2d6de] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-800">General parameters</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {commonOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {commonOpen && (
          <form onSubmit={handleSave} className="p-5 space-y-4 text-xs text-slate-700">
            {/* Setting 1: Items per page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Items per page</span>
                <HelpTooltip text="Number of items to show per page in catalog and administrative listings." />
              </label>
              <div className="md:col-span-9 max-w-xs">
                <input
                  type="number"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Setting 2: Allow comments / reviews */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Allow comments / feedback</span>
                <HelpTooltip text="Determines whether customers can post comments or feedback in this section." />
              </label>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Setting 3: Comments must be approved */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Comments must be approved</span>
                <HelpTooltip text="Determines whether submitted customer comments require admin review prior to publication." />
              </label>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={mustBeApproved}
                  onChange={(e) => setMustBeApproved(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Setting 4: Notify store owner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Notify store owner about events</span>
                <HelpTooltip text="Send instant automated email alerts to administrator mailbox." />
              </label>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={notifyAdmin}
                  onChange={(e) => setNotifyAdmin(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
