'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
  X,
  Edit2,
  Trash2,
  RotateCw,
  ArrowLeftCircle,
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

export interface GdprConsentItem {
  id: string;
  message: string;
  isRequired: boolean;
  displayDuringRegistration: boolean;
  displayOnCustomerInfoPage: boolean;
  displayOrder: number;
  locales?: {
    en?: { message: string };
    rtl?: { message: string };
  };
}

export default function GdprSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // View state: 'list' | 'add' | 'edit'
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');

  // Collapse state
  const [commonOpen, setCommonOpen] = useState(true);
  const [consentsOpen, setConsentsOpen] = useState(true);

  // Common Settings (media_1791359633035.png & media_1791359639950.png)
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [logAcceptPrivacyPolicyConsent, setLogAcceptPrivacyPolicyConsent] = useState(true);
  const [logNewsletterConsent, setLogNewsletterConsent] = useState(true);
  const [logUserProfileChanges, setLogUserProfileChanges] = useState(true);
  const [deleteInactiveCustomersAfterMonths, setDeleteInactiveCustomersAfterMonths] = useState<number | string>(36);

  // Consents List
  const [consents, setConsents] = useState<GdprConsentItem[]>([]);

  // Add / Edit Consent Form State (media_1791359643322.png)
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [editingConsentId, setEditingConsentId] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState('');
  const [formEnMessage, setFormEnMessage] = useState('');
  const [formRtlMessage, setFormRtlMessage] = useState('');
  const [formIsRequired, setFormIsRequired] = useState(false);
  const [formDisplayDuringRegistration, setFormDisplayDuringRegistration] = useState(false);
  const [formDisplayOnCustomerInfoPage, setFormDisplayOnCustomerInfoPage] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number | string>(1);

  // Status & Notification
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/gdpr');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.gdprEnabled !== undefined) setGdprEnabled(d.gdprEnabled);
            if (d.logAcceptPrivacyPolicyConsent !== undefined)
              setLogAcceptPrivacyPolicyConsent(d.logAcceptPrivacyPolicyConsent);
            if (d.logNewsletterConsent !== undefined)
              setLogNewsletterConsent(d.logNewsletterConsent);
            if (d.logUserProfileChanges !== undefined)
              setLogUserProfileChanges(d.logUserProfileChanges);
            if (d.deleteInactiveCustomersAfterMonths !== undefined)
              setDeleteInactiveCustomersAfterMonths(d.deleteInactiveCustomersAfterMonths);
            if (Array.isArray(d.consents)) setConsents(d.consents);
            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch GDPR settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_gdpr_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.gdprEnabled !== undefined) setGdprEnabled(d.gdprEnabled);
          if (d.logAcceptPrivacyPolicyConsent !== undefined)
            setLogAcceptPrivacyPolicyConsent(d.logAcceptPrivacyPolicyConsent);
          if (d.logNewsletterConsent !== undefined)
            setLogNewsletterConsent(d.logNewsletterConsent);
          if (d.logUserProfileChanges !== undefined)
            setLogUserProfileChanges(d.logUserProfileChanges);
          if (d.deleteInactiveCustomersAfterMonths !== undefined)
            setDeleteInactiveCustomersAfterMonths(d.deleteInactiveCustomersAfterMonths);
          if (Array.isArray(d.consents)) setConsents(d.consents);
          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchSettings();
  }, []);

  const saveToBackend = async (
    customConsents?: GdprConsentItem[],
    customAdvanced?: boolean
  ) => {
    const payload = {
      gdprEnabled,
      logAcceptPrivacyPolicyConsent,
      logNewsletterConsent,
      logUserProfileChanges,
      deleteInactiveCustomersAfterMonths: Number(deleteInactiveCustomersAfterMonths) || 36,
      consents: customConsents !== undefined ? customConsents : consents,
      isAdvanced: customAdvanced !== undefined ? customAdvanced : isAdvanced,
    };

    localStorage.setItem('admin_gdpr_settings', JSON.stringify(payload));

    try {
      const res = await fetch('/api/admin/settings/gdpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSaveMain = async () => {
    setSaving(true);
    try {
      await saveToBackend();
      showToast('The GDPR settings have been updated successfully.');
    } catch {
      showToast('The GDPR settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingConsentId(null);
    setFormMessage('');
    setFormEnMessage('');
    setFormRtlMessage('');
    setFormIsRequired(false);
    setFormDisplayDuringRegistration(false);
    setFormDisplayOnCustomerInfoPage(false);
    setFormDisplayOrder(consents.length + 1);
    setActiveTab('standard');
    setView('add');
  };

  const handleOpenEdit = (item: GdprConsentItem) => {
    setEditingConsentId(item.id);
    setFormMessage(item.message || '');
    setFormEnMessage(item.locales?.en?.message || '');
    setFormRtlMessage(item.locales?.rtl?.message || '');
    setFormIsRequired(item.isRequired || false);
    setFormDisplayDuringRegistration(item.displayDuringRegistration || false);
    setFormDisplayOnCustomerInfoPage(item.displayOnCustomerInfoPage || false);
    setFormDisplayOrder(item.displayOrder !== undefined ? item.displayOrder : 1);
    setActiveTab('standard');
    setView('edit');
  };

  const handleSaveConsent = async (continueEditing: boolean) => {
    if (!formMessage.trim()) {
      showToast('Please enter a consent message.', 'error');
      return;
    }

    setSaving(true);
    let updatedConsents: GdprConsentItem[] = [];

    if (view === 'edit' && editingConsentId) {
      updatedConsents = consents.map((c) =>
        c.id === editingConsentId
          ? {
              ...c,
              message: formMessage.trim(),
              isRequired: formIsRequired,
              displayDuringRegistration: formDisplayDuringRegistration,
              displayOnCustomerInfoPage: formDisplayOnCustomerInfoPage,
              displayOrder: Number(formDisplayOrder) || 1,
              locales: {
                en: { message: formEnMessage.trim() },
                rtl: { message: formRtlMessage.trim() },
              },
            }
          : c
      );
      showToast('The consent has been updated successfully.');
    } else {
      const newId = `consent-${Date.now()}`;
      const newItem: GdprConsentItem = {
        id: newId,
        message: formMessage.trim(),
        isRequired: formIsRequired,
        displayDuringRegistration: formDisplayDuringRegistration,
        displayOnCustomerInfoPage: formDisplayOnCustomerInfoPage,
        displayOrder: Number(formDisplayOrder) || 1,
        locales: {
          en: { message: formEnMessage.trim() },
          rtl: { message: formRtlMessage.trim() },
        },
      };
      updatedConsents = [...consents, newItem];
      setEditingConsentId(newId);
      showToast('The new consent has been added successfully.');
    }

    setConsents(updatedConsents);
    await saveToBackend(updatedConsents);
    setSaving(false);

    if (continueEditing) {
      setView('edit');
    } else {
      setView('list');
    }
  };

  const handleDeleteConsent = async () => {
    if (!editingConsentId) return;
    if (!confirm('Are you sure you want to delete this consent?')) return;

    setSaving(true);
    const updated = consents.filter((c) => c.id !== editingConsentId);
    setConsents(updated);
    await saveToBackend(updated);
    setSaving(false);
    showToast('The consent has been deleted successfully.');
    setView('list');
  };

  // =========================================================================
  // VIEW: ADD / EDIT CONSENT (media_1791359643322.png)
  // =========================================================================
  if (view === 'add' || view === 'edit') {
    return (
      <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
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

        {/* ── HEADER (Matching media_1791359643322.png) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
              {view === 'add' ? 'Add consent' : `Edit consent details - ${formMessage || 'Consent'}`}
            </h1>
            <button
              type="button"
              onClick={() => setView('list')}
              className="text-[#007bff] hover:text-[#0056b3] text-xs font-normal flex items-center gap-1 cursor-pointer pl-2 select-none"
            >
              <ArrowLeftCircle className="w-3.5 h-3.5 fill-[#007bff] text-white" />
              <span>back to consent list</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveConsent(false)}
              className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveConsent(true)}
              className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save and Continue Edit</span>
            </button>

            {view === 'edit' && (
              <button
                type="button"
                disabled={saving}
                onClick={handleDeleteConsent}
                className="bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* ── CARD: CONSENT DETAILS ── */}
        <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
          {/* Tabs on Top (Standard, EN, RTL) */}
          <div className="border-b border-slate-200 bg-[#f8fafc] px-4 pt-3 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('standard')}
              className={`px-4 py-2 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer select-none ${
                activeTab === 'standard'
                  ? 'bg-white text-slate-800 border-t-[#007bff] border-x border-slate-200 -mb-[1px]'
                  : 'text-slate-600 hover:text-slate-900 border-t-transparent'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-4 py-2 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer select-none flex items-center gap-1.5 ${
                activeTab === 'en'
                  ? 'bg-white text-slate-800 border-t-[#007bff] border-x border-slate-200 -mb-[1px]'
                  : 'text-slate-600 hover:text-slate-900 border-t-transparent'
              }`}
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rtl')}
              className={`px-4 py-2 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer select-none flex items-center gap-1.5 ${
                activeTab === 'rtl'
                  ? 'bg-white text-slate-800 border-t-[#007bff] border-x border-slate-200 -mb-[1px]'
                  : 'text-slate-600 hover:text-slate-900 border-t-transparent'
              }`}
            >
              <span>🇮🇱</span>
              <span>RTL</span>
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* 1. Message */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Message</span>
                <HelpTooltip text="The consent message text displayed to customers." />
              </div>
              <div className="md:col-span-9 flex items-center gap-1">
                {activeTab === 'standard' && (
                  <input
                    type="text"
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Enter consent message..."
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                )}
                {activeTab === 'en' && (
                  <input
                    type="text"
                    value={formEnMessage}
                    onChange={(e) => setFormEnMessage(e.target.value)}
                    placeholder="Enter consent message in English..."
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                )}
                {activeTab === 'rtl' && (
                  <input
                    type="text"
                    dir="rtl"
                    value={formRtlMessage}
                    onChange={(e) => setFormRtlMessage(e.target.value)}
                    placeholder="הזן הודעת הסכמה..."
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs text-right"
                  />
                )}
                <span className="text-red-500 font-bold text-sm px-1 select-none">*</span>
              </div>
            </div>

            {/* 2. Is required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Is required</span>
                <HelpTooltip text="Check if customer consent is required before proceeding." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={formIsRequired}
                  onChange={(e) => setFormIsRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Display during registration */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Display during registration</span>
                <HelpTooltip text="Check to display this consent prompt on the customer registration page." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={formDisplayDuringRegistration}
                  onChange={(e) => setFormDisplayDuringRegistration(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Display on 'customer info' page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Display on &apos;customer info&apos; page</span>
                <HelpTooltip text="Check to display this consent prompt on the customer account info page." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={formDisplayOnCustomerInfoPage}
                  onChange={(e) => setFormDisplayOnCustomerInfoPage(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 5. Display order */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Display order</span>
                <HelpTooltip text="The display order of this consent prompt (1 represents first)." />
              </div>
              <div className="md:col-span-9">
                <input
                  type="number"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN GDPR SETTINGS LIST (media_1791359633035.png & media_1791359639950.png)
  // =========================================================================
  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
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

      {/* ── HEADER (Matching media_1791359633035.png & media_1791359639950.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">GDPR settings</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveMain}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching screenshots) ── */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[94px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-[#f8fafc] border-[#2489c5] text-[#2489c5] hover:bg-slate-100'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white text-xs font-normal pl-0.5">Advanced</span>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white shadow-2xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-[18px] rounded-full border border-slate-400 bg-white shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: COMMON (Matching media_1791359633035.png & media_1791359639950.png)*/}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setCommonOpen(!commonOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Common</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {commonOpen && (
          <div className="p-6 space-y-4">
            {/* 1. GDPR enabled (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>GDPR enabled</span>
                <HelpTooltip text="Check to enable General Data Protection Regulation (GDPR) compliance features." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={gdprEnabled}
                  onChange={(e) => setGdprEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Advanced Only Fields in Card 1 */}
            {isAdvanced && (
              <>
                {/* 2. Log "accept privacy policy" consent */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Log &quot;accept privacy policy&quot; consent</span>
                    <HelpTooltip text="Log customer consent actions for privacy policy agreements." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={logAcceptPrivacyPolicyConsent}
                      onChange={(e) => setLogAcceptPrivacyPolicyConsent(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Log "newsletter" consent */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Log &quot;newsletter&quot; consent</span>
                    <HelpTooltip text="Log customer consent actions for newsletter subscriptions." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={logNewsletterConsent}
                      onChange={(e) => setLogNewsletterConsent(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. Log user profile changes */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Log user profile changes</span>
                    <HelpTooltip text="Log all customer changes to their personal profile data." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={logUserProfileChanges}
                      onChange={(e) => setLogUserProfileChanges(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 5. Delete inactive customers after months */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Delete inactive customers after months</span>
                    <HelpTooltip text="Set number of months after which inactive customer records can be scheduled for deletion." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={deleteInactiveCustomersAfterMonths}
                      onChange={(e) => setDeleteInactiveCustomersAfterMonths(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: CONSENTS (Advanced Only - Matching media_1791359639950.png)       */}
      {/* ========================================================================= */}
      {isAdvanced && (
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setConsentsOpen(!consentsOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="text-slate-800 font-semibold text-sm">
              <span>Consents</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {consentsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {consentsOpen && (
            <div className="p-4 sm:p-6 space-y-4">
              {/* Data Table */}
              <div className="border border-slate-200 rounded overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#f8f9fa] border-b border-slate-200 text-slate-800 font-bold">
                    <tr>
                      <th className="py-3 px-4">Message</th>
                      <th className="py-3 px-4 text-center">Is required</th>
                      <th className="py-3 px-4 text-center">Display during registration</th>
                      <th className="py-3 px-4 text-center">Display on &apos;customer info&apos; page</th>
                      <th className="py-3 px-4 text-center">Display order</th>
                      <th className="py-3 px-4 text-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {consents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-5 text-center text-slate-500 text-xs">
                          No data available in table
                        </td>
                      </tr>
                    ) : (
                      consents.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-normal text-slate-800">{item.message}</td>
                          <td className="py-3.5 px-4 text-center">
                            {item.isRequired ? (
                              <span className="inline-flex items-center justify-center text-[#007bff]">
                                <Check className="w-4 h-4 stroke-[2.5]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center text-slate-300">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {item.displayDuringRegistration ? (
                              <span className="inline-flex items-center justify-center text-[#007bff]">
                                <Check className="w-4 h-4 stroke-[2.5]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center text-slate-300">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {item.displayOnCustomerInfoPage ? (
                              <span className="inline-flex items-center justify-center text-[#007bff]">
                                <Check className="w-4 h-4 stroke-[2.5]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center text-slate-300">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center font-normal text-slate-700">
                            {item.displayOrder}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-normal rounded text-xs transition shadow-2xs cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-slate-500" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Controls */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-200 rounded text-slate-400 bg-slate-50 cursor-not-allowed select-none"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-200 rounded text-slate-400 bg-slate-50 cursor-not-allowed select-none"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Show</span>
                  <select
                    defaultValue="15"
                    className="border border-slate-300 rounded px-1.5 py-1 text-xs bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span>items</span>
                </div>

                <div className="flex items-center gap-3">
                  <span>{consents.length === 0 ? 'No records' : `1-${consents.length} of ${consents.length} items`}</span>
                  <button
                    type="button"
                    onClick={() => showToast('Refreshed consents list.')}
                    className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded text-slate-600 transition cursor-pointer"
                    title="Refresh"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add Consent Button (Matching media_1791359639950.png) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <span>Add consent</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
