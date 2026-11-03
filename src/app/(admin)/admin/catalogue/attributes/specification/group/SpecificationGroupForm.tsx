'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface SpecificationGroupFormData {
  id?: string;
  name: string;
  displayOrder: number;
}

interface SpecificationGroupFormProps {
  initialValues?: Partial<SpecificationGroupFormData>;
  onSave: (data: SpecificationGroupFormData, continueEditing?: boolean) => Promise<void>;
  saving: boolean;
  isEdit?: boolean;
}

export function SpecificationGroupForm({
  initialValues,
  onSave,
  saving,
  isEdit = false,
}: SpecificationGroupFormProps) {
  // Form State
  const [name, setName] = useState(initialValues?.name || '');
  const [displayOrder, setDisplayOrder] = useState<number>(initialValues?.displayOrder ?? 0);

  // Localization tabs
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [localized, setLocalized] = useState({
    en: { name: '' },
    rtl: { name: '' },
  });

  // Card collapse state
  const [infoOpen, setInfoOpen] = useState(true);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (continueEditing: boolean) => {
    if (!name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }

    await onSave(
      {
        id: initialValues?.id,
        name: name.trim(),
        displayOrder: Number(displayOrder) || 0,
      },
      continueEditing
    );
  };

  // Tooltip helper
  const Tooltip = ({ text }: { text: string }) => (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none ml-1"
    >
      ?
    </span>
  );

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER: Title + back link + Action buttons (Matching media_1791010606427.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            {isEdit
              ? `Edit specification attribute group details - ${name || ''}`
              : 'Add a new specification attribute group'}
          </h1>
          <Link
            href="/admin/catalogue/attributes/specification"
            className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1.5 font-normal ml-1"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3c8dbc] text-white">
              <ArrowLeft className="w-2.5 h-2.5" />
            </span>
            <span>back to specification attribute list</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Save button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit(false)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {/* Save and Continue Edit button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit(true)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>
        </div>
      </div>

      {/* ATTRIBUTE GROUP INFO CARD (Matching media_1791010606427.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header: "i Attribute group info" with collapse toggle */}
        <div
          onClick={() => setInfoOpen(!infoOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <span className="italic font-serif font-bold text-sm text-slate-700">i</span>
            <span>Attribute group info</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {infoOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Card Body */}
        {infoOpen && (
          <div className="p-4 sm:p-6 space-y-5 text-xs text-slate-700">
            {/* INNER BOX WITH LOCALIZATION TABS (Matching media_1791010606427.png) */}
            <div className="border border-[#d2d6de] rounded p-4 bg-white space-y-4">
              {/* Tabs: Standard | EN | RTL */}
              <div className="flex items-center gap-1 border-b border-[#d2d6de] -mt-1 mb-4 select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('standard')}
                  className={`px-4 py-2 text-xs font-medium border-t-2 rounded-t transition-colors cursor-pointer ${
                    activeTab === 'standard'
                      ? 'border-t-[#3c8dbc] border-x border-[#d2d6de] bg-white text-slate-800 -mb-px font-semibold'
                      : 'border-t-transparent text-slate-600 hover:text-slate-900 bg-slate-50/60'
                  }`}
                >
                  Standard
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-2 text-xs font-medium border-t-2 rounded-t flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'en'
                      ? 'border-t-[#3c8dbc] border-x border-[#d2d6de] bg-white text-slate-800 -mb-px font-semibold'
                      : 'border-t-transparent text-slate-600 hover:text-slate-900 bg-slate-50/60'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>EN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('rtl')}
                  className={`px-3 py-2 text-xs font-medium border-t-2 rounded-t flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'rtl'
                      ? 'border-t-[#3c8dbc] border-x border-[#d2d6de] bg-white text-slate-800 -mb-px font-semibold'
                      : 'border-t-transparent text-slate-600 hover:text-slate-900 bg-slate-50/60'
                  }`}
                >
                  <span>🇮🇱</span>
                  <span>RTL</span>
                </button>
              </div>

              {/* Name field inside the tab box */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                  <span>Name</span>
                  <Tooltip text="The name of the specification attribute group." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={
                      activeTab === 'standard'
                        ? name
                        : activeTab === 'en'
                        ? localized.en.name
                        : localized.rtl.name
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeTab === 'standard') setName(val);
                      else if (activeTab === 'en')
                        setLocalized({ ...localized, en: { ...localized.en, name: val } });
                      else
                        setLocalized({ ...localized, rtl: { ...localized.rtl, name: val } });
                    }}
                    placeholder=""
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                  />
                  <span className="text-red-500 font-bold text-sm select-none">*</span>
                </div>
              </div>
            </div>

            {/* Display Order field below the tab box */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                <span>Display order</span>
                <Tooltip text="The display order of the specification attribute group. 1 represents the top of the list." />
              </div>
              <div className="sm:col-span-9">
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-[#d2d6de] pt-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Powered by{' '}
          <a
            href="https://www.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            nopCommerce
          </a>
        </div>
        <div>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          {new Date().toLocaleTimeString()}
        </div>
        <div>nopCommerce version 4.90.0</div>
      </footer>
    </div>
  );
}
