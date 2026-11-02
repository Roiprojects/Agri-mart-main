'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  RotateCw,
} from 'lucide-react';

export interface SpecOption {
  id: string;
  name: string;
  displayOrder: number;
}

export interface SpecificationAttributeFormData {
  id?: string;
  name: string;
  groupId?: string;
  displayOrder: number;
  options?: SpecOption[];
  usedByProducts?: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    published: boolean;
    categoryHierarchy: string;
    specValue: string;
  }>;
}

interface SpecGroup {
  id: string;
  name: string;
  displayOrder: number;
}

interface SpecificationAttributeFormProps {
  initialValues?: Partial<SpecificationAttributeFormData>;
  onSave: (data: SpecificationAttributeFormData, continueEditing?: boolean) => Promise<void>;
  saving: boolean;
  isEdit?: boolean;
}

export function SpecificationAttributeForm({
  initialValues,
  onSave,
  saving,
  isEdit = false,
}: SpecificationAttributeFormProps) {
  // Form State
  const [name, setName] = useState(initialValues?.name || '');
  const [groupId, setGroupId] = useState(initialValues?.groupId || 'group-default');
  const [displayOrder, setDisplayOrder] = useState<number>(initialValues?.displayOrder ?? 0);
  const [options, setOptions] = useState<SpecOption[]>(initialValues?.options || []);
  const [usedByProducts, setUsedByProducts] = useState<any[]>(initialValues?.usedByProducts || []);
  const [usedProductSearch, setUsedProductSearch] = useState('');
  const [usedByOpen, setUsedByOpen] = useState(true);

  // Available groups
  const [groups, setGroups] = useState<SpecGroup[]>([
    { id: 'group-default', name: 'None (Default group)', displayOrder: 0 },
  ]);

  // Advanced / Basic Mode State (starts in Advanced mode showing all fields; clicking switches to Basic showing only mandatory/important fields)
  const [advancedMode, setAdvancedMode] = useState(true);

  // Localization tabs
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [localized, setLocalized] = useState({
    en: { name: '' },
    rtl: { name: '' },
  });

  // Card collapse state
  const [infoOpen, setInfoOpen] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(true);

  // Options Pagination & Modal
  const [optionsPageSize, setOptionsPageSize] = useState<number>(15);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [optName, setOptName] = useState('');
  const [optDisplayOrder, setOptDisplayOrder] = useState<number>(1);
  const [optError, setOptError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch available groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/admin/catalogue/attributes/specification');
        const json = await res.json();
        if (json.success && Array.isArray(json.groups)) {
          setGroups(json.groups);
        }
      } catch {}
    };
    fetchGroups();
  }, []);

  // Sync initialValues
  useEffect(() => {
    if (initialValues) {
      if (initialValues.name !== undefined) setName(initialValues.name);
      if (initialValues.groupId !== undefined) setGroupId(initialValues.groupId);
      if (initialValues.displayOrder !== undefined) setDisplayOrder(initialValues.displayOrder);
      if (initialValues.options) setOptions(initialValues.options);
      if (initialValues.usedByProducts) setUsedByProducts(initialValues.usedByProducts);
    }
  }, [initialValues]);

  const handleSubmit = async (continueEditing: boolean) => {
    if (!name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }

    await onSave(
      {
        id: initialValues?.id,
        name: name.trim(),
        groupId,
        displayOrder: Number(displayOrder) || 0,
        options,
      },
      continueEditing
    );
  };

  // Option Modal Handlers
  const handleOpenAddOption = () => {
    setEditingOptionId(null);
    setOptName('');
    setOptDisplayOrder(options.length + 1);
    setOptError(null);
    setOptionModalOpen(true);
  };

  const handleEditOption = (opt: SpecOption) => {
    setEditingOptionId(opt.id);
    setOptName(opt.name);
    setOptDisplayOrder(opt.displayOrder);
    setOptError(null);
    setOptionModalOpen(true);
  };

  const handleDeleteOption = (id: string) => {
    if (confirm('Are you sure you want to delete this option?')) {
      setOptions((prev) => prev.filter((o) => o.id !== id));
      showToast('Option deleted', 'success');
    }
  };

  const handleSaveOption = () => {
    if (!optName.trim()) {
      setOptError('Name is required');
      return;
    }

    if (editingOptionId) {
      setOptions((prev) =>
        prev.map((o) =>
          o.id === editingOptionId
            ? { ...o, name: optName.trim(), displayOrder: Number(optDisplayOrder) || 1 }
            : o
        )
      );
      showToast('Option updated', 'success');
    } else {
      const newOpt: SpecOption = {
        id: `opt-${Date.now()}`,
        name: optName.trim(),
        displayOrder: Number(optDisplayOrder) || options.length + 1,
      };
      setOptions((prev) => [...prev, newOpt]);
      showToast('Option added', 'success');
    }

    setOptionModalOpen(false);
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

      {/* ADVANCED / BASIC TOGGLE SWITCH */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 pb-1">
        <button
          type="button"
          onClick={() => setAdvancedMode(!advancedMode)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer select-none min-w-[96px] h-7 shadow-2xs ${
            advancedMode
              ? 'bg-[#2585be] border-[#2585be] text-white hover:bg-[#1f72a3]'
              : 'bg-white border-[#3c8dbc] text-[#3c8dbc] hover:bg-slate-50'
          }`}
          title={
            advancedMode
              ? 'Click to switch to Basic mode (show only mandatory & important fields)'
              : 'Click to switch to Advanced mode (show all hidden fields)'
          }
        >
          {advancedMode ? (
            <>
              <span className="text-white font-semibold text-xs">Advanced</span>
              <span className="w-3.5 h-5 rounded-xs bg-white shadow-xs ml-2" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-5 rounded-xs bg-[#3c8dbc] border border-[#3c8dbc] shadow-xs mr-2" />
              <span className="text-[#3c8dbc] font-semibold text-xs">Basic</span>
            </>
          )}
        </button>

        <span
          className={`text-[11px] px-2.5 py-0.5 rounded border font-medium ${
            advancedMode
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {advancedMode
            ? 'Advanced mode: Showing all specification attribute fields & sections'
            : 'Basic mode: Showing only mandatory & important fields (click Basic to show all hidden fields)'}
        </span>
      </div>

      {/* TOP HEADER: Title + back link + Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            {isEdit
              ? `Edit specification attribute details - ${name || ''}`
              : 'Add a new specification attribute'}
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

      {/* ATTRIBUTE INFO CARD (Matching media_1791011493055.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header: "i Attribute info" with collapse toggle */}
        <div
          onClick={() => setInfoOpen(!infoOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <span className="italic font-serif font-bold text-sm text-slate-700">i</span>
            <span>Attribute info</span>
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
            {/* INNER BOX WITH LOCALIZATION TABS */}
            <div className="border border-[#d2d6de] rounded p-4 bg-white space-y-4">
              {/* Tabs: Standard | EN | RTL — Advanced mode only */}
              {advancedMode && (
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
              )}

              {/* Name field inside the tab box (Mandatory / Important) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                  <span>Name</span>
                  <Tooltip text="The name of the specification attribute." />
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

            {/* Specification Attribute Group field (Important) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                <span>Specification attribute group</span>
                <Tooltip text="The group that the specification attribute belongs to." />
              </div>
              <div className="sm:col-span-9">
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                >
                  <option value="group-default">None (Default group)</option>
                  {groups
                    .filter((g) => g.id !== 'group-default')
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Display Order field (Advanced mode only) */}
            {advancedMode && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                  <span>Display order</span>
                  <Tooltip text="The display order of the specification attribute. 1 represents the top of the list." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OPTIONS CARD (For managing specification attribute options/values) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header: Options */}
        <div
          onClick={() => setOptionsOpen(!optionsOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <span>Options</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {optionsOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Card Body */}
        {optionsOpen && (
          <div>
            <div className="p-4 sm:p-5 space-y-4">
              {/* Table Container */}
              <div className="border border-[#e5e7eb] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafb] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb]">Name</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center w-36">Display order</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center w-24">Edit</th>
                        <th className="px-3.5 py-2.5 text-center w-24">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {options.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-normal">
                            No data available in table
                          </td>
                        </tr>
                      ) : (
                        options.map((opt) => (
                          <tr key={opt.id} className="border-b border-[#f0f0f0] hover:bg-slate-50/70 transition">
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] font-medium text-slate-800">
                              {opt.name}
                            </td>
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center text-slate-700">
                              {opt.displayOrder}
                            </td>
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center">
                              <button
                                type="button"
                                onClick={() => handleEditOption(opt)}
                                className="text-[#2585be] hover:underline font-medium cursor-pointer"
                              >
                                Edit
                              </button>
                            </td>
                            <td className="px-3.5 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteOption(opt.id)}
                                className="text-red-500 hover:underline font-medium cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="bg-[#fcfcfc] border-t border-[#e5e7eb] px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 border border-[#d2d6de] bg-white text-slate-400 rounded-l cursor-not-allowed hover:bg-slate-50 transition"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 border-t border-b border-r border-[#d2d6de] bg-white text-slate-400 rounded-r cursor-not-allowed hover:bg-slate-50 transition"
                    >
                      Next
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span>Show</span>
                    <select
                      value={optionsPageSize}
                      onChange={(e) => setOptionsPageSize(Number(e.target.value))}
                      className="border border-[#d2d6de] bg-white rounded px-2 py-0.5 text-xs text-slate-700 outline-none cursor-pointer"
                    >
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>items</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>
                      {options.length === 0 ? 'No records' : `1-${options.length} of ${options.length} items`}
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Options refreshed', 'success')}
                      className="p-1 border border-[#d2d6de] bg-white text-slate-600 hover:text-slate-900 rounded hover:bg-slate-50 transition cursor-pointer"
                      title="Refresh"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Section: Add a new option button */}
            <div className="bg-[#f4f6f9] border-t border-[#e5e7eb] px-4 sm:px-5 py-3">
              <button
                type="button"
                onClick={handleOpenAddOption}
                className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition cursor-pointer"
              >
                Add a new option
              </button>
            </div>
          </div>
        )}
      </div>

      {/* USED BY PRODUCTS CARD WITH SINGLE SEARCH BAR (Advanced mode only) */}
      {advancedMode && (
        <div className="bg-white rounded border border-[#d2d6de] border-t-2 border-t-[#3c8dbc] shadow-2xs overflow-hidden">
          <div
            onClick={() => setUsedByOpen(!usedByOpen)}
            className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
              <span>Used by products</span>
            </div>
            <button
              type="button"
              className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
            >
              {usedByOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>

          {usedByOpen && (
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Products using this specification attribute. Search by Product ID, Product Name, or Product SKU in one single search bar.
                </p>
                <div className="w-full sm:w-80">
                  <input
                    type="text"
                    value={usedProductSearch}
                    onChange={(e) => setUsedProductSearch(e.target.value)}
                    placeholder="Search by Product ID, Name, or SKU..."
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                  />
                </div>
              </div>

              <div className="border border-[#e5e7eb] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafb] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] w-1/6">Product ID</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] w-2/6">Product Name</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] w-1/6">Product SKU</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] w-1/6">Specification Value</th>
                        <th className="px-3.5 py-2.5 text-center w-1/6">View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usedByProducts.filter((p) => {
                        if (!usedProductSearch.trim()) return true;
                        const q = usedProductSearch.toLowerCase().trim();
                        return (
                          (p.id || '').toLowerCase().includes(q) ||
                          (p.name || '').toLowerCase().includes(q) ||
                          (p.sku || '').toLowerCase().includes(q) ||
                          (p.specValue || '').toLowerCase().includes(q)
                        );
                      }).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-normal">
                            No matching products found
                          </td>
                        </tr>
                      ) : (
                        usedByProducts
                          .filter((p) => {
                            if (!usedProductSearch.trim()) return true;
                            const q = usedProductSearch.toLowerCase().trim();
                            return (
                              (p.id || '').toLowerCase().includes(q) ||
                              (p.name || '').toLowerCase().includes(q) ||
                              (p.sku || '').toLowerCase().includes(q) ||
                              (p.specValue || '').toLowerCase().includes(q)
                            );
                          })
                          .map((p) => (
                            <tr key={p.id} className="border-b border-[#f0f0f0] hover:bg-slate-50/70 transition">
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] font-mono text-slate-700">
                                {p.id}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0]">
                                <Link
                                  href={`/admin/catalogue/products?productId=${encodeURIComponent(p.id)}&sku=${encodeURIComponent(p.sku || '')}&name=${encodeURIComponent(p.name || '')}`}
                                  className="text-[#2585be] hover:underline font-medium"
                                >
                                  {p.name}
                                </Link>
                                {p.categoryHierarchy && (
                                  <div className="text-[10px] text-slate-500 mt-0.5">{p.categoryHierarchy}</div>
                                )}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] font-mono text-blue-700 font-semibold">
                                {p.sku || '—'}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-emerald-700 font-medium">
                                {p.specValue || 'Standard'}
                              </td>
                              <td className="px-3.5 py-2.5 text-center">
                                <Link
                                  href={`/admin/catalogue/products?productId=${encodeURIComponent(p.id)}&sku=${encodeURIComponent(p.sku || '')}&name=${encodeURIComponent(p.name || '')}`}
                                  className="inline-flex items-center justify-center bg-[#2585be] hover:bg-[#1f72a3] text-white px-2.5 py-1 rounded text-xs transition"
                                >
                                  View in Products
                                </Link>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Add / Edit Option */}
      {optionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800">
                {editingOptionId ? 'Edit option' : 'Add a new option'}
              </h3>
              <button
                type="button"
                onClick={() => setOptionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-xs">
              {optError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded text-xs">
                  {optError}
                </div>
              )}

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="col-span-8">
                  <input
                    type="text"
                    required
                    value={optName}
                    onChange={(e) => setOptName(e.target.value)}
                    placeholder="e.g. Yes, No, 500cc"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Display order
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    value={optDisplayOrder}
                    onChange={(e) => setOptDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#f4f6f9] border-t border-[#e5e7eb] px-4 py-2.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOptionModalOpen(false)}
                className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOption}
                className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
