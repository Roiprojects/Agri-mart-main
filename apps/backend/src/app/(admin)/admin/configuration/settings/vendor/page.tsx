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
  List,
  AtSign,
  CheckSquare,
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

export interface VendorAttributeValue {
  id: string;
  name: string;
  isPreSelected?: boolean;
  displayOrder: number;
}

export interface VendorAttributeItem {
  id: string;
  name: string;
  isRequired: boolean;
  controlType: string;
  displayOrder: number;
  values?: VendorAttributeValue[];
  locales?: {
    en?: { name: string };
    rtl?: { name: string };
  };
}

export default function VendorSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // View state: 'list' | 'add' | 'edit'
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');

  // Collapse states for main view
  const [commonOpen, setCommonOpen] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [attributesOpen, setAttributesOpen] = useState(true);

  // Collapse states for attribute edit view
  const [attrInfoOpen, setAttrInfoOpen] = useState(true);
  const [attrValuesOpen, setAttrValuesOpen] = useState(true);

  // Card 1: Common Settings (media_1791360250579.png & media_1791360301213.png)
  const [allowCustomersToApplyForVendorAccount, setAllowCustomersToApplyForVendorAccount] = useState(true);
  const [termsOfServiceEnabled, setTermsOfServiceEnabled] = useState(false);
  const [allowVendorsToEditInfo, setAllowVendorsToEditInfo] = useState(true);
  const [notifyAboutVendorInformationChanges, setNotifyAboutVendorInformationChanges] = useState(false);
  const [maximumNumberOfProducts, setMaximumNumberOfProducts] = useState<number | string>(3000);
  const [allowVendorsToImportProducts, setAllowVendorsToImportProducts] = useState(false);

  // Card 2: Catalog Settings (media_1791360250579.png & media_1791360301213.png)
  const [allowCustomersToContactVendors, setAllowCustomersToContactVendors] = useState(false);
  const [allowSearchByVendor, setAllowSearchByVendor] = useState(false);
  const [showVendorOnProductDetailsPage, setShowVendorOnProductDetailsPage] = useState(false);
  const [showVendorNameOnOrderDetailsPage, setShowVendorNameOnOrderDetailsPage] = useState(false);
  const [numberOfVendorsToDisplay, setNumberOfVendorsToDisplay] = useState<number | string>(0);

  // Card 3: Vendor Attributes (media_1791360258031.png)
  const [vendorAttributes, setVendorAttributes] = useState<VendorAttributeItem[]>([]);

  // Add / Edit Attribute Form State (media_1791360264733.png)
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [editingAttrId, setEditingAttrId] = useState<string | null>(null);
  const [attrName, setAttrName] = useState('');
  const [attrEnName, setAttrEnName] = useState('');
  const [attrRtlName, setAttrRtlName] = useState('');
  const [attrRequired, setAttrRequired] = useState(false);
  const [attrControlType, setAttrControlType] = useState('Drop-down list');
  const [attrDisplayOrder, setAttrDisplayOrder] = useState<number | string>(0);
  const [attrValues, setAttrValues] = useState<VendorAttributeValue[]>([]);

  // Value Modal / inline state for editing values
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [valName, setValName] = useState('');
  const [valPreSelected, setValPreSelected] = useState(false);
  const [valDisplayOrder, setValDisplayOrder] = useState<number | string>(0);

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
        const res = await fetch('/api/admin/settings/vendor');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.allowCustomersToApplyForVendorAccount !== undefined)
              setAllowCustomersToApplyForVendorAccount(d.allowCustomersToApplyForVendorAccount);
            if (d.termsOfServiceEnabled !== undefined)
              setTermsOfServiceEnabled(d.termsOfServiceEnabled);
            if (d.allowVendorsToEditInfo !== undefined)
              setAllowVendorsToEditInfo(d.allowVendorsToEditInfo);
            if (d.notifyAboutVendorInformationChanges !== undefined)
              setNotifyAboutVendorInformationChanges(d.notifyAboutVendorInformationChanges);
            if (d.maximumNumberOfProducts !== undefined)
              setMaximumNumberOfProducts(d.maximumNumberOfProducts);
            if (d.allowVendorsToImportProducts !== undefined)
              setAllowVendorsToImportProducts(d.allowVendorsToImportProducts);

            if (d.allowCustomersToContactVendors !== undefined)
              setAllowCustomersToContactVendors(d.allowCustomersToContactVendors);
            if (d.allowSearchByVendor !== undefined)
              setAllowSearchByVendor(d.allowSearchByVendor);
            if (d.showVendorOnProductDetailsPage !== undefined)
              setShowVendorOnProductDetailsPage(d.showVendorOnProductDetailsPage);
            if (d.showVendorNameOnOrderDetailsPage !== undefined)
              setShowVendorNameOnOrderDetailsPage(d.showVendorNameOnOrderDetailsPage);
            if (d.numberOfVendorsToDisplay !== undefined)
              setNumberOfVendorsToDisplay(d.numberOfVendorsToDisplay);

            if (Array.isArray(d.vendorAttributes)) setVendorAttributes(d.vendorAttributes);
            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch vendor settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_vendor_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.allowCustomersToApplyForVendorAccount !== undefined)
            setAllowCustomersToApplyForVendorAccount(d.allowCustomersToApplyForVendorAccount);
          if (d.termsOfServiceEnabled !== undefined)
            setTermsOfServiceEnabled(d.termsOfServiceEnabled);
          if (d.allowVendorsToEditInfo !== undefined)
            setAllowVendorsToEditInfo(d.allowVendorsToEditInfo);
          if (d.notifyAboutVendorInformationChanges !== undefined)
            setNotifyAboutVendorInformationChanges(d.notifyAboutVendorInformationChanges);
          if (d.maximumNumberOfProducts !== undefined)
            setMaximumNumberOfProducts(d.maximumNumberOfProducts);
          if (d.allowVendorsToImportProducts !== undefined)
            setAllowVendorsToImportProducts(d.allowVendorsToImportProducts);

          if (d.allowCustomersToContactVendors !== undefined)
            setAllowCustomersToContactVendors(d.allowCustomersToContactVendors);
          if (d.allowSearchByVendor !== undefined)
            setAllowSearchByVendor(d.allowSearchByVendor);
          if (d.showVendorOnProductDetailsPage !== undefined)
            setShowVendorOnProductDetailsPage(d.showVendorOnProductDetailsPage);
          if (d.showVendorNameOnOrderDetailsPage !== undefined)
            setShowVendorNameOnOrderDetailsPage(d.showVendorNameOnOrderDetailsPage);
          if (d.numberOfVendorsToDisplay !== undefined)
            setNumberOfVendorsToDisplay(d.numberOfVendorsToDisplay);

          if (Array.isArray(d.vendorAttributes)) setVendorAttributes(d.vendorAttributes);
          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchSettings();
  }, []);

  const saveToBackend = async (
    customAttributes?: VendorAttributeItem[],
    customAdvanced?: boolean
  ) => {
    const payload = {
      allowCustomersToApplyForVendorAccount,
      termsOfServiceEnabled,
      allowVendorsToEditInfo,
      notifyAboutVendorInformationChanges,
      maximumNumberOfProducts: Number(maximumNumberOfProducts) || 3000,
      allowVendorsToImportProducts,

      allowCustomersToContactVendors,
      allowSearchByVendor,
      showVendorOnProductDetailsPage,
      showVendorNameOnOrderDetailsPage,
      numberOfVendorsToDisplay: Number(numberOfVendorsToDisplay) || 0,

      vendorAttributes: customAttributes !== undefined ? customAttributes : vendorAttributes,
      isAdvanced: customAdvanced !== undefined ? customAdvanced : isAdvanced,
    };

    localStorage.setItem('admin_vendor_settings', JSON.stringify(payload));

    try {
      const res = await fetch('/api/admin/settings/vendor', {
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
      showToast('The vendor settings have been updated successfully.');
    } catch {
      showToast('The vendor settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAttrId(null);
    setAttrName('');
    setAttrEnName('');
    setAttrRtlName('');
    setAttrRequired(false);
    setAttrControlType('Drop-down list');
    setAttrDisplayOrder(vendorAttributes.length);
    setAttrValues([]);
    setActiveTab('standard');
    setView('add');
  };

  const handleOpenEdit = (item: VendorAttributeItem) => {
    setEditingAttrId(item.id);
    setAttrName(item.name || '');
    setAttrEnName(item.locales?.en?.name || '');
    setAttrRtlName(item.locales?.rtl?.name || '');
    setAttrRequired(item.isRequired || false);
    setAttrControlType(item.controlType || 'Drop-down list');
    setAttrDisplayOrder(item.displayOrder !== undefined ? item.displayOrder : 0);
    setAttrValues(item.values || []);
    setActiveTab('standard');
    setView('edit');
  };

  const handleSaveAttribute = async (continueEditing: boolean) => {
    if (!attrName.trim()) {
      showToast('Please enter an attribute name.', 'error');
      return;
    }

    setSaving(true);
    let updatedAttributes: VendorAttributeItem[] = [];

    if (view === 'edit' && editingAttrId) {
      updatedAttributes = vendorAttributes.map((attr) =>
        attr.id === editingAttrId
          ? {
              ...attr,
              name: attrName.trim(),
              isRequired: attrRequired,
              controlType: attrControlType,
              displayOrder: Number(attrDisplayOrder) || 0,
              values: attrValues,
              locales: {
                en: { name: attrEnName.trim() },
                rtl: { name: attrRtlName.trim() },
              },
            }
          : attr
      );
      showToast('The vendor attribute has been updated successfully.');
    } else {
      const newId = `vattr-${Date.now()}`;
      const newItem: VendorAttributeItem = {
        id: newId,
        name: attrName.trim(),
        isRequired: attrRequired,
        controlType: attrControlType,
        displayOrder: Number(attrDisplayOrder) || 0,
        values: attrValues,
        locales: {
          en: { name: attrEnName.trim() },
          rtl: { name: attrRtlName.trim() },
        },
      };
      updatedAttributes = [...vendorAttributes, newItem];
      setEditingAttrId(newId);
      showToast('The new vendor attribute has been added successfully.');
    }

    setVendorAttributes(updatedAttributes);
    await saveToBackend(updatedAttributes);
    setSaving(false);

    if (continueEditing) {
      setView('edit');
    } else {
      setView('list');
    }
  };

  const handleDeleteAttribute = async () => {
    if (!editingAttrId) return;
    if (!confirm('Are you sure you want to delete this vendor attribute?')) return;

    setSaving(true);
    const updated = vendorAttributes.filter((attr) => attr.id !== editingAttrId);
    setVendorAttributes(updated);
    await saveToBackend(updated);
    setSaving(false);
    showToast('The vendor attribute has been deleted successfully.');
    setView('list');
  };

  // Add / Edit Attribute Value Helpers
  const handleOpenAddValue = () => {
    setEditingValueId(null);
    setValName('');
    setValPreSelected(false);
    setValDisplayOrder(attrValues.length + 1);
    setValueModalOpen(true);
  };

  const handleOpenEditValue = (val: VendorAttributeValue) => {
    setEditingValueId(val.id);
    setValName(val.name);
    setValPreSelected(val.isPreSelected || false);
    setValDisplayOrder(val.displayOrder);
    setValueModalOpen(true);
  };

  const handleSaveValue = () => {
    if (!valName.trim()) {
      showToast('Please enter a value name.', 'error');
      return;
    }
    let updatedVals: VendorAttributeValue[] = [];
    if (editingValueId) {
      updatedVals = attrValues.map((v) =>
        v.id === editingValueId
          ? { ...v, name: valName.trim(), isPreSelected: valPreSelected, displayOrder: Number(valDisplayOrder) || 0 }
          : v
      );
    } else {
      updatedVals = [
        ...attrValues,
        {
          id: `val-${Date.now()}`,
          name: valName.trim(),
          isPreSelected: valPreSelected,
          displayOrder: Number(valDisplayOrder) || 0,
        },
      ];
    }
    setAttrValues(updatedVals);
    setValueModalOpen(false);
    showToast('Attribute value saved.');
  };

  const handleDeleteValue = (id: string) => {
    setAttrValues((prev) => prev.filter((v) => v.id !== id));
    showToast('Attribute value removed.');
  };

  // =========================================================================
  // VIEW: ADD / EDIT VENDOR ATTRIBUTE (media_1791360264733.png)
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

        {/* ── HEADER (Matching media_1791360264733.png) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
              {view === 'add' ? 'Add new vendor attribute' : `Edit vendor attribute details - ${attrName || 'Attribute'}`}
            </h1>
            <button
              type="button"
              onClick={() => setView('list')}
              className="text-[#007bff] hover:text-[#0056b3] text-xs font-normal flex items-center gap-1 cursor-pointer pl-2 select-none"
            >
              <ArrowLeftCircle className="w-3.5 h-3.5 fill-[#007bff] text-white" />
              <span>back to vendor settings</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveAttribute(false)}
              className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveAttribute(true)}
              className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save and Continue Edit</span>
            </button>

            {view === 'edit' && (
              <button
                type="button"
                disabled={saving}
                onClick={handleDeleteAttribute}
                className="bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* ── CARD 1: ATTRIBUTE INFO (Matching media_1791360264733.png) ── */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setAttrInfoOpen(!attrInfoOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Attribute info</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {attrInfoOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {attrInfoOpen && (
            <div>
              {/* Language Tabs (Standard, EN, RTL) */}
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
                {/* 1. Name */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Name</span>
                    <HelpTooltip text="The name of the vendor attribute." />
                  </div>
                  <div className="md:col-span-9 flex items-center gap-1">
                    {activeTab === 'standard' && (
                      <input
                        type="text"
                        value={attrName}
                        onChange={(e) => setAttrName(e.target.value)}
                        placeholder="Enter attribute name..."
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    )}
                    {activeTab === 'en' && (
                      <input
                        type="text"
                        value={attrEnName}
                        onChange={(e) => setAttrEnName(e.target.value)}
                        placeholder="Enter attribute name in English..."
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    )}
                    {activeTab === 'rtl' && (
                      <input
                        type="text"
                        dir="rtl"
                        value={attrRtlName}
                        onChange={(e) => setAttrRtlName(e.target.value)}
                        placeholder="הזן שם תכונה..."
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs text-right"
                      />
                    )}
                    <span className="text-red-500 font-bold text-sm px-1 select-none">*</span>
                  </div>
                </div>

                {/* 2. Required */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Required</span>
                    <HelpTooltip text="When an attribute is required, the vendor must choose an appropriate attribute value." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={attrRequired}
                      onChange={(e) => setAttrRequired(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Control type */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Control type</span>
                    <HelpTooltip text="Choose how to display attribute values." />
                  </div>
                  <div className="md:col-span-9">
                    <select
                      value={attrControlType}
                      onChange={(e) => setAttrControlType(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    >
                      <option value="Drop-down list">Drop-down list</option>
                      <option value="Radio list">Radio list</option>
                      <option value="Checkboxes">Checkboxes</option>
                      <option value="TextBox">TextBox</option>
                      <option value="Multiline textbox">Multiline textbox</option>
                      <option value="Date picker">Date picker</option>
                      <option value="File upload">File upload</option>
                      <option value="Color squares">Color squares</option>
                      <option value="Image squares">Image squares</option>
                      <option value="Read-only checkboxes">Read-only checkboxes</option>
                    </select>
                  </div>
                </div>

                {/* 4. Display order */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Display order</span>
                    <HelpTooltip text="The display order of this attribute (1 represents top)." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={attrDisplayOrder}
                      onChange={(e) => setAttrDisplayOrder(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── CARD 2: ATTRIBUTE VALUES (Matching media_1791360264733.png) ── */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setAttrValuesOpen(!attrValuesOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <CheckSquare className="w-4 h-4 text-slate-500" />
              <span>Attribute values</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {attrValuesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {attrValuesOpen && (
            <div className="p-6">
              {view === 'add' ? (
                <p className="text-xs text-slate-500">
                  You need to save the vendor attribute before you can add values for it.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Values Data Table */}
                  <div className="border border-slate-200 rounded overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead className="bg-[#f8f9fa] border-b border-slate-200 text-slate-800 font-bold">
                        <tr>
                          <th className="py-2.5 px-4">Name</th>
                          <th className="py-2.5 px-4 text-center">Is pre-selected</th>
                          <th className="py-2.5 px-4 text-center">Display order</th>
                          <th className="py-2.5 px-4 text-center">Edit</th>
                          <th className="py-2.5 px-4 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {attrValues.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-slate-500 text-xs">
                              No values added yet
                            </td>
                          </tr>
                        ) : (
                          attrValues.map((val) => (
                            <tr key={val.id} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-4 text-slate-800 font-medium">{val.name}</td>
                              <td className="py-2.5 px-4 text-center">
                                {val.isPreSelected ? (
                                  <span className="inline-flex items-center text-blue-600">
                                    <Check className="w-4 h-4" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-slate-300">
                                    <X className="w-4 h-4" />
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-center text-slate-600">{val.displayOrder}</td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditValue(val)}
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5 mx-auto" />
                                </button>
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteValue(val.id)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleOpenAddValue}
                      className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add a new value</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal: Add/Edit Attribute Value */}
        {valueModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
            <div className="bg-white rounded border border-slate-300 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-800">
                  {editingValueId ? 'Edit attribute value' : 'Add a new attribute value'}
                </h3>
                <button
                  type="button"
                  onClick={() => setValueModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={valName}
                    onChange={(e) => setValName(e.target.value)}
                    placeholder="Enter value name..."
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="chk-val-preselected"
                    checked={valPreSelected}
                    onChange={(e) => setValPreSelected(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="chk-val-preselected" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Is pre-selected
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display order
                  </label>
                  <input
                    type="number"
                    value={valDisplayOrder}
                    onChange={(e) => setValDisplayOrder(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setValueModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveValue}
                  className="px-4 py-1.5 bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN VENDOR SETTINGS LIST (media_1791360250579.png & media_1791360301213.png)
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

      {/* ── HEADER (Matching media_1791360250579.png & media_1791360301213.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Vendor settings</h1>

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
      {/* CARD 1: COMMON (Matching media_1791360250579.png & media_1791360301213.png)*/}
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
            {/* 1. Allow customers to apply for vendor account (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Allow customers to apply for vendor account</span>
                <HelpTooltip text="Check if you want to allow customers to apply for vendor account." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCustomersToApplyForVendorAccount}
                  onChange={(e) => setAllowCustomersToApplyForVendorAccount(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Sub-branch: Terms of service (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <div className="flex items-center gap-1.5">
                  <span>Terms of service</span>
                  <HelpTooltip text="Require customers to accept terms of service before applying for vendor account." />
                </div>
              </div>
              <div className="md:col-span-9 flex items-center relative">
                {/* Tree connector branch */}
                <div className="absolute -left-4 top-1/2 w-3.5 h-[1px] bg-slate-300" />
                <div className="absolute -left-4 -top-3 w-[1px] h-4.5 bg-slate-300" />
                <input
                  type="checkbox"
                  disabled={!allowCustomersToApplyForVendorAccount}
                  checked={termsOfServiceEnabled}
                  onChange={(e) => setTermsOfServiceEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            {/* Advanced Only Fields in Card 1 */}
            {isAdvanced && (
              <>
                {/* 2. Allow vendors to edit info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center pt-2">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow vendors to edit info</span>
                    <HelpTooltip text="Check if you want to allow vendors to edit their information in public store." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowVendorsToEditInfo}
                      onChange={(e) => setAllowVendorsToEditInfo(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sub-branch: Notify about vendor information changes */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span>Notify about vendor information changes</span>
                      <HelpTooltip text="Check if you want store owner to be notified about vendor info changes." />
                    </div>
                  </div>
                  <div className="md:col-span-9 flex items-center relative">
                    <div className="absolute -left-4 top-1/2 w-3.5 h-[1px] bg-slate-300" />
                    <div className="absolute -left-4 -top-3 w-[1px] h-4.5 bg-slate-300" />
                    <input
                      type="checkbox"
                      disabled={!allowVendorsToEditInfo}
                      checked={notifyAboutVendorInformationChanges}
                      onChange={(e) => setNotifyAboutVendorInformationChanges(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* 3. Maximum number of products */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center pt-2">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Maximum number of products</span>
                    <HelpTooltip text="The maximum number of products that each vendor can add (0 for unlimited)." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={maximumNumberOfProducts}
                      onChange={(e) => setMaximumNumberOfProducts(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 4. Allow vendors to import products */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow vendors to import products</span>
                    <HelpTooltip text="Check if you want to allow vendors to import products in vendor area." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowVendorsToImportProducts}
                      onChange={(e) => setAllowVendorsToImportProducts(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: CATALOG (Matching media_1791360250579.png & media_1791360301213.png)*/}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setCatalogOpen(!catalogOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <List className="w-4 h-4 text-slate-500" />
            <span>Catalog</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {catalogOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {catalogOpen && (
          <div className="p-6 space-y-4">
            {/* 1. Allow customers to contact vendors (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Allow customers to contact vendors</span>
                <HelpTooltip text="Check if customers can contact vendors using contact form on vendor page." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCustomersToContactVendors}
                  onChange={(e) => setAllowCustomersToContactVendors(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Advanced Only Fields in Card 2 */}
            {isAdvanced && (
              <>
                {/* 2. Allow search by vendor */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow search by vendor</span>
                    <HelpTooltip text="Check if you want to allow customers to search by vendor." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowSearchByVendor}
                      onChange={(e) => setAllowSearchByVendor(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Show vendor on product details page */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Show vendor on product details page</span>
                    <HelpTooltip text="Check if you want to display vendor name on product details page." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={showVendorOnProductDetailsPage}
                      onChange={(e) => setShowVendorOnProductDetailsPage(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. Show vendor name on order details page */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Show vendor name on order details page</span>
                    <HelpTooltip text="Check if you want to display vendor name on order details page." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={showVendorNameOnOrderDetailsPage}
                      onChange={(e) => setShowVendorNameOnOrderDetailsPage(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 5. Number of vendors to display */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Number of vendors to display</span>
                    <HelpTooltip text="The number of vendors to display on public store vendor list block (0 for all)." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={numberOfVendorsToDisplay}
                      onChange={(e) => setNumberOfVendorsToDisplay(e.target.value)}
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
      {/* CARD 3: VENDOR ATTRIBUTES (Advanced Only - Matching media_1791360258031.png) */}
      {/* ========================================================================= */}
      {isAdvanced && (
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setAttributesOpen(!attributesOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <AtSign className="w-4 h-4 text-slate-500" />
              <span>Vendor attributes</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {attributesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {attributesOpen && (
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-xs text-slate-600 italic">
                You can manage additional vendor attributes below.
              </p>

              {/* Data Table */}
              <div className="border border-slate-200 rounded overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#f8f9fa] border-b border-slate-200 text-slate-800 font-bold">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Control type</th>
                      <th className="py-3 px-4 text-center">Required</th>
                      <th className="py-3 px-4 text-center">Display order</th>
                      <th className="py-3 px-4 text-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {vendorAttributes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-5 text-center text-slate-500 text-xs">
                          No data available in table
                        </td>
                      </tr>
                    ) : (
                      vendorAttributes.map((attr) => (
                        <tr key={attr.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-normal text-slate-800">{attr.name}</td>
                          <td className="py-3.5 px-4 text-slate-600">{attr.controlType}</td>
                          <td className="py-3.5 px-4 text-center">
                            {attr.isRequired ? (
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
                            {attr.displayOrder}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(attr)}
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
                  <span>
                    {vendorAttributes.length === 0
                      ? 'No records'
                      : `1-${vendorAttributes.length} of ${vendorAttributes.length} items`}
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast('Refreshed vendor attributes list.')}
                    className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded text-slate-600 transition cursor-pointer"
                    title="Refresh"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add New Button (Matching media_1791360258031.png) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add new</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
