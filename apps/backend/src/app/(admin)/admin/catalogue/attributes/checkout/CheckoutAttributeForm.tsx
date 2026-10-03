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
} from 'lucide-react';

export interface AttributeValueItem {
  id: string;
  name: string;
  priceAdjustment: number;
  weightAdjustment: number;
  isPreSelected: boolean;
  displayOrder: number;
}

export interface CheckoutAttributeFormData {
  id?: string;
  name: string;
  textPrompt?: string;
  controlType: string;
  isRequired: boolean;
  displayOrder: number;
  shippableProductRequired?: boolean;
  isTaxExempt?: boolean;
  taxCategory?: string;
  limitedToStores?: string;
  values?: AttributeValueItem[];
}

interface CheckoutAttributeFormProps {
  initialValues?: Partial<CheckoutAttributeFormData>;
  onSave: (data: CheckoutAttributeFormData, continueEditing?: boolean) => Promise<void>;
  saving: boolean;
  isEdit?: boolean;
}

export function CheckoutAttributeForm({
  initialValues,
  onSave,
  saving,
  isEdit = false,
}: CheckoutAttributeFormProps) {
  // Advanced / Basic toggle mode (Default to Basic matching media_1791013379418.png)
  const [isAdvanced, setIsAdvanced] = useState(false);

  // Form State
  const [name, setName] = useState(initialValues?.name || '');
  const [textPrompt, setTextPrompt] = useState(initialValues?.textPrompt || '');
  const [controlType, setControlType] = useState(initialValues?.controlType || 'Drop-down list');
  const [isRequired, setIsRequired] = useState(initialValues?.isRequired || false);
  const [displayOrder, setDisplayOrder] = useState<number>(initialValues?.displayOrder ?? 0);
  const [shippableProductRequired, setShippableProductRequired] = useState(
    initialValues?.shippableProductRequired || false
  );
  const [isTaxExempt, setIsTaxExempt] = useState(initialValues?.isTaxExempt || false);
  const [taxCategory, setTaxCategory] = useState(initialValues?.taxCategory || '[None]');
  const [limitedToStores, setLimitedToStores] = useState(initialValues?.limitedToStores || '');
  const [attributeValues, setAttributeValues] = useState<AttributeValueItem[]>(
    initialValues?.values || []
  );

  // Localization tabs
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [localized, setLocalized] = useState({
    en: { name: '', textPrompt: '' },
    rtl: { name: '', textPrompt: '' },
  });

  // Card collapse state
  const [infoOpen, setInfoOpen] = useState(true);
  const [valuesOpen, setValuesOpen] = useState(true);

  // Modal State for Attribute Values (in Edit view)
  const [valModalOpen, setValModalOpen] = useState(false);
  const [editingValId, setEditingValId] = useState<string | null>(null);
  const [valName, setValName] = useState('');
  const [valPriceAdjustment, setValPriceAdjustment] = useState<number>(0);
  const [valWeightAdjustment, setValWeightAdjustment] = useState<number>(0);
  const [valIsPreSelected, setValIsPreSelected] = useState<boolean>(false);
  const [valDisplayOrder, setValDisplayOrder] = useState<number>(1);
  const [valError, setValError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (initialValues) {
      if (initialValues.name !== undefined) setName(initialValues.name);
      if (initialValues.textPrompt !== undefined) setTextPrompt(initialValues.textPrompt);
      if (initialValues.controlType !== undefined) setControlType(initialValues.controlType);
      if (initialValues.isRequired !== undefined) setIsRequired(initialValues.isRequired);
      if (initialValues.displayOrder !== undefined) setDisplayOrder(initialValues.displayOrder);
      if (initialValues.shippableProductRequired !== undefined)
        setShippableProductRequired(initialValues.shippableProductRequired);
      if (initialValues.isTaxExempt !== undefined) setIsTaxExempt(initialValues.isTaxExempt);
      if (initialValues.taxCategory !== undefined) setTaxCategory(initialValues.taxCategory);
      if (initialValues.limitedToStores !== undefined)
        setLimitedToStores(initialValues.limitedToStores);
      if (initialValues.values) setAttributeValues(initialValues.values);
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
        textPrompt: textPrompt.trim(),
        controlType,
        isRequired,
        displayOrder: Number(displayOrder) || 0,
        shippableProductRequired,
        isTaxExempt,
        taxCategory,
        limitedToStores,
        values: attributeValues,
      },
      continueEditing
    );
  };

  // Value Modal Handlers
  const handleOpenAddValue = () => {
    setEditingValId(null);
    setValName('');
    setValPriceAdjustment(0);
    setValWeightAdjustment(0);
    setValIsPreSelected(false);
    setValDisplayOrder(attributeValues.length + 1);
    setValError(null);
    setValModalOpen(true);
  };

  const handleEditValue = (val: AttributeValueItem) => {
    setEditingValId(val.id);
    setValName(val.name);
    setValPriceAdjustment(val.priceAdjustment);
    setValWeightAdjustment(val.weightAdjustment);
    setValIsPreSelected(val.isPreSelected);
    setValDisplayOrder(val.displayOrder);
    setValError(null);
    setValModalOpen(true);
  };

  const handleDeleteValue = (id: string) => {
    if (confirm('Are you sure you want to delete this attribute value?')) {
      setAttributeValues((prev) => prev.filter((v) => v.id !== id));
      showToast('Attribute value deleted', 'success');
    }
  };

  const handleSaveValue = () => {
    if (!valName.trim()) {
      setValError('Name is required');
      return;
    }

    if (editingValId) {
      setAttributeValues((prev) =>
        prev.map((v) =>
          v.id === editingValId
            ? {
                ...v,
                name: valName.trim(),
                priceAdjustment: Number(valPriceAdjustment) || 0,
                weightAdjustment: Number(valWeightAdjustment) || 0,
                isPreSelected: valIsPreSelected,
                displayOrder: Number(valDisplayOrder) || 1,
              }
            : v
        )
      );
      showToast('Attribute value updated', 'success');
    } else {
      const newVal: AttributeValueItem = {
        id: `val-${Date.now()}`,
        name: valName.trim(),
        priceAdjustment: Number(valPriceAdjustment) || 0,
        weightAdjustment: Number(valWeightAdjustment) || 0,
        isPreSelected: valIsPreSelected,
        displayOrder: Number(valDisplayOrder) || attributeValues.length + 1,
      };
      setAttributeValues((prev) => [...prev, newVal]);
      showToast('Attribute value added', 'success');
    }

    setValModalOpen(false);
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

      {/* ADVANCED / BASIC TOGGLE SWITCH (Matching media_1791013379418.png and media_1791012650324.png) */}
      <div className="flex items-center pt-1 pb-1">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2 py-1 rounded text-xs font-semibold border transition cursor-pointer select-none w-24 h-7 shadow-2xs ${
            isAdvanced
              ? 'bg-[#2585be] border-[#2585be] text-white'
              : 'bg-white border-[#3c8dbc] text-[#3c8dbc] hover:bg-slate-50'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white font-medium text-xs">Advanced</span>
              <span className="w-3.5 h-5 rounded-sm bg-white shadow-xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-5 rounded-sm bg-white border border-slate-300 shadow-xs" />
              <span className="text-[#3c8dbc] font-medium text-xs">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* TOP HEADER: Title + back link + Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            {isEdit
              ? `Edit checkout attribute details - ${name || ''}`
              : 'Add a new checkout attribute'}
          </h1>
          <Link
            href="/admin/catalogue/attributes/checkout"
            className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1.5 font-normal ml-1"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3c8dbc] text-white">
              <ArrowLeft className="w-2.5 h-2.5" />
            </span>
            <span>back to checkout attribute list</span>
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

      {/* 1. ATTRIBUTE INFO CARD (Matching media_1791013379418.png & media_1791012650324.png) */}
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

              {/* Name field (Always visible in both Basic and Advanced) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                  <span>Name</span>
                  <Tooltip text="The name of the checkout attribute." />
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

              {/* Text prompt field (ONLY visible in Advanced mode!) */}
              {isAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Text prompt</span>
                    <Tooltip text="The text prompt of the checkout attribute." />
                  </div>
                  <div className="sm:col-span-9">
                    <input
                      type="text"
                      value={
                        activeTab === 'standard'
                          ? textPrompt
                          : activeTab === 'en'
                          ? localized.en.textPrompt
                          : localized.rtl.textPrompt
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (activeTab === 'standard') setTextPrompt(val);
                        else if (activeTab === 'en')
                          setLocalized({ ...localized, en: { ...localized.en, textPrompt: val } });
                        else
                          setLocalized({ ...localized, rtl: { ...localized.rtl, textPrompt: val } });
                      }}
                      placeholder=""
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Control Type field (Always visible in both Basic and Advanced) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                <span>Control type</span>
                <Tooltip text="The control type of the checkout attribute." />
              </div>
              <div className="sm:col-span-9">
                <select
                  value={controlType}
                  onChange={(e) => setControlType(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                >
                  <option value="Drop-down list">Drop-down list</option>
                  <option value="Radio list">Radio list</option>
                  <option value="Checkboxes">Checkboxes</option>
                  <option value="Text box">Text box</option>
                  <option value="Multiline textbox">Multiline textbox</option>
                  <option value="Date picker">Date picker</option>
                  <option value="File upload">File upload</option>
                  <option value="Color squares">Color squares</option>
                  <option value="Image squares">Image squares</option>
                  <option value="Read-only checkboxes">Read-only checkboxes</option>
                </select>
              </div>
            </div>

            {/* Required field (Always visible in both Basic and Advanced) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                <span>Required</span>
                <Tooltip text="Check to require the customer to enter/select a value for this attribute." />
              </div>
              <div className="sm:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Display Order field (Always visible in both Basic and Advanced) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                <span>Display order</span>
                <Tooltip text="The display order of the checkout attribute. 1 represents the top of the list." />
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

            {/* ADVANCED-ONLY FIELDS: Shippable product required, Tax exempt, Tax category, Limited to stores */}
            {isAdvanced && (
              <>
                {/* Shippable product required field */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Shippable product required</span>
                    <Tooltip text="Check to specify that this checkout attribute is only displayed if at least one product in the cart requires shipping." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={shippableProductRequired}
                      onChange={(e) => setShippableProductRequired(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Tax exempt field */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Tax exempt</span>
                    <Tooltip text="Check to specify that this checkout attribute is tax exempt." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={isTaxExempt}
                      onChange={(e) => setIsTaxExempt(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Tax category field */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Tax category</span>
                    <Tooltip text="The tax category of the checkout attribute." />
                  </div>
                  <div className="sm:col-span-9">
                    <select
                      value={taxCategory}
                      onChange={(e) => setTaxCategory(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                    >
                      <option value="[None]">[None]</option>
                      <option value="Standard">Standard</option>
                      <option value="Reduced">Reduced</option>
                      <option value="Zero">Zero</option>
                    </select>
                  </div>
                </div>

                {/* Limited to stores field */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Limited to stores</span>
                    <Tooltip text="Determines whether the attribute is available only for specific stores." />
                  </div>
                  <div className="sm:col-span-9 flex flex-col md:flex-row items-start md:items-center gap-3">
                    <input
                      type="text"
                      value={limitedToStores}
                      onChange={(e) => setLimitedToStores(e.target.value)}
                      placeholder=""
                      className="w-full md:w-64 text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                    />
                    <div className="p-2.5 rounded border border-[#d2d6de] bg-slate-50/90 text-slate-600 text-xs leading-relaxed flex-1">
                      In order to use this functionality, you have to disable the following setting:{' '}
                      <span className="font-semibold text-slate-700">
                        Catalog settings &gt; Ignore &quot;limit per store&quot; rules.
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 2. ATTRIBUTE VALUES CARD (Matching media_1791013379418.png) */}
      <div className="bg-white rounded border border-[#d2d6de] border-t-2 border-t-[#3c8dbc] shadow-2xs overflow-hidden">
        {/* Card Header: Monitor icon + "Attribute values" */}
        <div
          onClick={() => setValuesOpen(!valuesOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <svg
              className="w-4 h-4 text-slate-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Attribute values</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {valuesOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Card Body */}
        {valuesOpen && (
          <div className="p-4 sm:p-5">
            {!isEdit ? (
              /* Exact message matching media_1791013379418.png */
              <p className="text-xs text-slate-600 font-normal">
                You need to save the checkout attribute before you can add values for this checkout attribute page.
              </p>
            ) : (
              /* Edit View: Table of attribute values */
              <div className="space-y-4">
                <div className="border border-[#e5e7eb] rounded overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f9fafb] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                          <th className="px-3.5 py-2.5 border-r border-[#e5e7eb]">Name</th>
                          <th className="px-3.5 py-2.5 border-r border-[#e5e7eb]">Price adjustment</th>
                          <th className="px-3.5 py-2.5 border-r border-[#e5e7eb]">Weight adjustment</th>
                          <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center">Is pre-selected</th>
                          <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center">Display order</th>
                          <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center">Edit</th>
                          <th className="px-3.5 py-2.5 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attributeValues.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-normal">
                              No data available in table
                            </td>
                          </tr>
                        ) : (
                          attributeValues.map((val) => (
                            <tr key={val.id} className="border-b border-[#f0f0f0] hover:bg-slate-50/70 transition">
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] font-medium text-slate-800">
                                {val.name}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-slate-700">
                                ${Number(val.priceAdjustment || 0).toFixed(2)}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-slate-700">
                                {Number(val.weightAdjustment || 0).toFixed(2)}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center">
                                {val.isPreSelected ? (
                                  <span className="text-[#00a65a] font-bold text-sm">✓</span>
                                ) : (
                                  <span className="text-slate-400 font-semibold">—</span>
                                )}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center text-slate-700">
                                {val.displayOrder}
                              </td>
                              <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center">
                                <button
                                  type="button"
                                  onClick={() => handleEditValue(val)}
                                  className="text-[#2585be] hover:underline font-medium cursor-pointer"
                                >
                                  Edit
                                </button>
                              </td>
                              <td className="px-3.5 py-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteValue(val.id)}
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

                  {/* Table footer / pagination */}
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
                      <select className="border border-[#d2d6de] bg-white rounded px-2 py-0.5 text-xs text-slate-700 outline-none">
                        <option value={15}>15</option>
                      </select>
                      <span>items</span>
                    </div>

                    <span>{attributeValues.length === 0 ? 'No records' : `1-${attributeValues.length} of ${attributeValues.length} items`}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleOpenAddValue}
                    className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition cursor-pointer"
                  >
                    Add a new value
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Add / Edit Value (in Edit View) */}
      {valModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800">
                {editingValId ? 'Edit value' : 'Add a new value'}
              </h3>
              <button
                type="button"
                onClick={() => setValModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-xs">
              {valError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded text-xs">
                  {valError}
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
                    value={valName}
                    onChange={(e) => setValName(e.target.value)}
                    placeholder="e.g. Yes, No, Premium box"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Price adjustment
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    step="0.01"
                    value={valPriceAdjustment}
                    onChange={(e) => setValPriceAdjustment(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Weight adjustment
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    step="0.01"
                    value={valWeightAdjustment}
                    onChange={(e) => setValWeightAdjustment(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Is pre-selected
                </label>
                <div className="col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={valIsPreSelected}
                    onChange={(e) => setValIsPreSelected(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
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
                    value={valDisplayOrder}
                    onChange={(e) => setValDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#f4f6f9] border-t border-[#e5e7eb] px-4 py-2.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setValModalOpen(false)}
                className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveValue}
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
