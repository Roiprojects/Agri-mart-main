'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Calendar,
  Monitor,
  Search,
  Minus,
  Plus,
  Info,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 shadow-2xs select-none"
    >
      ?
    </span>
  );
}

export default function AddNewTopicPage() {
  const router = useRouter();

  // Mode Pill: Advanced / Basic
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [infoOpen, setInfoOpen] = useState(true);
  const [displayOpen, setDisplayOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(true);

  // SEO active tab: 'standard' | 'en' | 'rtl'
  const [seoTab, setSeoTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [infoTab, setInfoTab] = useState<'standard' | 'en' | 'rtl'>('standard');

  // Form Fields - Info
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Form Fields - Display (media_1791186883131.png)
  const [published, setPublished] = useState(true);
  const [availabilityStartDate, setAvailabilityStartDate] = useState('');
  const [availabilityEndDate, setAvailabilityEndDate] = useState('');
  const [includeInSitemap, setIncludeInSitemap] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [limitedToCustomerRoles, setLimitedToCustomerRoles] = useState('');
  const [limitedToStores, setLimitedToStores] = useState('');
  const [accessibleWhenStoreClosed, setAccessibleWhenStoreClosed] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number | string>(1);
  const [systemName, setSystemName] = useState('');

  // Form Fields - SEO (media_1791186885304.png)
  const [seName, setSeName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Saving state & Toast
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (continueEditing: boolean = false) => {
    const finalSystemName = systemName.trim() || title.trim();
    if (!finalSystemName) {
      showToast('System name or Title is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: finalSystemName,
        systemName: finalSystemName,
        title: title.trim() || finalSystemName,
        body: body.trim(),
        published,
        availabilityStartDate,
        availabilityEndDate,
        includeInSitemap,
        passwordProtected,
        limitedToCustomerRoles,
        limitedToStores,
        accessibleWhenStoreClosed,
        displayOrder: Number(displayOrder) || 1,
        seName: seName.trim(),
        metaTitle: metaTitle.trim(),
        metaKeywords: metaKeywords.trim(),
        metaDescription: metaDescription.trim(),
      };

      const res = await fetch('/api/admin/content/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast('The new topic has been added successfully.', 'success');
        if (!continueEditing) {
          setTimeout(() => {
            router.push('/admin/content/topics');
          }, 800);
        }
      } else {
        showToast(json.error || 'Failed to save topic.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred while saving.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Add a new topic (page)</h1>
          <Link
            href="/admin/content/topics"
            className="inline-flex items-center gap-1 text-xs text-[#2489c5] hover:underline"
          >
            <span className="w-4 h-4 rounded-full bg-[#2489c5] text-white flex items-center justify-center shrink-0">
              <ArrowLeft className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
            <span>back to topic list</span>
          </Link>
        </div>

        {/* Action Buttons & Advanced Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(false)}
              className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save and Continue Edit</span>
            </button>
          </div>

          {/* Mode Pill Toggle */}
          <div className="flex items-center bg-slate-200 rounded-full p-0.5 border border-slate-300">
            <button
              type="button"
              onClick={() => setIsAdvanced(false)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition cursor-pointer ${
                !isAdvanced ? 'bg-[#3c8dbc] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setIsAdvanced(true)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition cursor-pointer ${
                isAdvanced ? 'bg-[#3c8dbc] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* ── CARD 1: TOPIC INFO ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setInfoOpen(!infoOpen)}
          className="px-4 py-3 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Info className="w-4 h-4 text-slate-600" />
            <span>Info</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {infoOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {infoOpen && (
          <div className="p-6 md:p-8 space-y-4">
            {/* Language Tabs */}
            <div className="border-b border-slate-200 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setInfoTab('standard')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer ${
                  infoTab === 'standard'
                    ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setInfoTab('en')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer flex items-center gap-1.5 ${
                  infoTab === 'en'
                    ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setInfoTab('rtl')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer flex items-center gap-1.5 ${
                  infoTab === 'rtl'
                    ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🇮🇱</span>
                <span>RTL</span>
              </button>
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Title</span>
                <HelpTooltip text="The title of the topic." />
              </div>
              <div className="md:col-span-9 flex items-center gap-1.5">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=""
                  className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
                <span className="text-red-500 font-bold text-sm shrink-0 leading-none select-none">*</span>
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700 pt-2">
                <span>Body</span>
                <HelpTooltip text="The body content of the topic page." />
              </div>
              <div className="md:col-span-9 flex items-start gap-1.5">
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder=""
                  className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs p-2.5 text-xs text-slate-800 bg-white transition font-sans resize-y"
                />
                <span className="text-red-500 font-bold text-sm shrink-0 leading-none select-none pt-2">*</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: DISPLAY (Exact match to media_1791186883131.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setDisplayOpen(!displayOpen)}
          className="px-4 py-3 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Monitor className="w-4 h-4 text-slate-700" />
            <span>Display</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {displayOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {displayOpen && (
          <div className="p-6 md:p-8 space-y-4">
            {/* 1. Published */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Published</span>
                <HelpTooltip text="Determines whether this page is published and visible on the website." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de] cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Availability start date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Availability start date</span>
                <HelpTooltip text="The start date of availability of this page." />
              </div>
              <div className="md:col-span-9">
                <div className="relative w-full max-w-[260px]">
                  <input
                    type="text"
                    value={availabilityStartDate}
                    onChange={(e) => setAvailabilityStartDate(e.target.value)}
                    placeholder="mm/dd/yyyy --:-- --"
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs pl-2.5 pr-8 py-1.5 text-xs text-slate-800 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 3. Availability end date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Availability end date</span>
                <HelpTooltip text="The end date of availability of this page." />
              </div>
              <div className="md:col-span-9">
                <div className="relative w-full max-w-[260px]">
                  <input
                    type="text"
                    value={availabilityEndDate}
                    onChange={(e) => setAvailabilityEndDate(e.target.value)}
                    placeholder="mm/dd/yyyy --:-- --"
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs pl-2.5 pr-8 py-1.5 text-xs text-slate-800 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 4. Include in sitemap */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Include in sitemap</span>
                <HelpTooltip text="Check if this page should be included in the sitemap." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={includeInSitemap}
                  onChange={(e) => setIncludeInSitemap(e.target.checked)}
                  className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de] cursor-pointer"
                />
              </div>
            </div>

            {/* 5. Password protected */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Password protected</span>
                <HelpTooltip text="Check if password protection is enabled for this topic." />
              </div>
              <div className="md:col-span-9 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={passwordProtected}
                  onChange={(e) => setPasswordProtected(e.target.checked)}
                  className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de] cursor-pointer"
                />
                {passwordProtected && (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter topic password"
                    className="border border-[#d2d6de] rounded-xs px-2.5 py-1 text-xs text-slate-800 w-48"
                  />
                )}
              </div>
            </div>

            {/* 6. Limited to customer roles */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Limited to customer roles</span>
                <HelpTooltip text="Determines whether the topic is available only to certain customer roles." />
              </div>
              <div className="md:col-span-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="text"
                  value={limitedToCustomerRoles}
                  onChange={(e) => setLimitedToCustomerRoles(e.target.value)}
                  placeholder=""
                  className="w-full sm:w-72 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
                <div className="bg-[#f4f4f4] border border-[#d2d6de] rounded p-2.5 text-xs text-slate-700 shadow-2xs flex-1">
                  In order to use this functionality, you have to disable the following setting: Catalog settings &gt; Ignore ACL rules.
                </div>
              </div>
            </div>

            {/* 7. Limited to stores */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Limited to stores</span>
                <HelpTooltip text="Determines whether the topic is available only in certain stores." />
              </div>
              <div className="md:col-span-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="text"
                  value={limitedToStores}
                  onChange={(e) => setLimitedToStores(e.target.value)}
                  placeholder=""
                  className="w-full sm:w-72 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
                <div className="bg-[#f4f4f4] border border-[#d2d6de] rounded p-2.5 text-xs text-slate-700 shadow-2xs flex-1">
                  In order to use this functionality, you have to disable the following setting: Catalog settings &gt; Ignore &quot;limit per store&quot; rules.
                </div>
              </div>
            </div>

            {/* 8. Accessible when store closed */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Accessible when store closed</span>
                <HelpTooltip text="Check to allow access to this topic page even when store closed mode is enabled." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={accessibleWhenStoreClosed}
                  onChange={(e) => setAccessibleWhenStoreClosed(e.target.checked)}
                  className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de] cursor-pointer"
                />
              </div>
            </div>

            {/* 9. Display order */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Display order</span>
                <HelpTooltip text="Display order of this page. 1 represents top of the list." />
              </div>
              <div className="md:col-span-9">
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* 10. System name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>System name</span>
                <HelpTooltip text="The system name of the topic. Used internally by developers and templates." />
              </div>
              <div className="md:col-span-9">
                <input
                  type="text"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  placeholder=""
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 3: SEO (Exact match to media_1791186885304.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setSeoOpen(!seoOpen)}
          className="px-4 py-3 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Search className="w-4 h-4 text-slate-700" />
            <span>SEO</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {seoOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {seoOpen && (
          <div className="p-6 md:p-8 space-y-4">
            {/* Language Tabs matching media_1791186885304.png */}
            <div className="border-b border-slate-200 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSeoTab('standard')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer ${
                  seoTab === 'standard'
                    ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setSeoTab('en')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer flex items-center gap-1.5 ${
                  seoTab === 'en'
                    ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setSeoTab('rtl')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer flex items-center gap-1.5 ${
                  seoTab === 'rtl'
                    ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🇮🇱</span>
                <span>RTL</span>
              </button>
            </div>

            {/* 1. Search engine friendly page name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Search engine friendly page name</span>
                <HelpTooltip text="Set a search engine friendly page name such as 'about-us'. If empty, default is used." />
              </div>
              <div className="md:col-span-9">
                <input
                  type="text"
                  value={seName}
                  onChange={(e) => setSeName(e.target.value)}
                  placeholder=""
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* 2. Meta title */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Meta title</span>
                <HelpTooltip text="The meta title to appear at the top of browser." />
              </div>
              <div className="md:col-span-9">
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder=""
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* 3. Meta keywords */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Meta keywords</span>
                <HelpTooltip text="Meta keywords to be added to page header." />
              </div>
              <div className="md:col-span-9">
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder=""
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* 4. Meta description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700 pt-2">
                <span>Meta description</span>
                <HelpTooltip text="Meta description to be added to page header." />
              </div>
              <div className="md:col-span-9">
                <textarea
                  rows={4}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder=""
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs p-2.5 text-xs text-slate-800 bg-white transition font-sans resize-y"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
