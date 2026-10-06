'use client';

import React, { useState } from 'react';
import {
  Save,
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Trash2,
  X,
} from 'lucide-react';

export interface AddressAttributeValueItem {
  id: string;
  name: string;
  priceAdjustment: number;
  weightAdjustment: number;
  isPreSelected: boolean;
  displayOrder: number;
}

export interface AddressAttributeData {
  id?: string;
  name: string;
  controlType: string;
  isRequired: boolean;
  displayOrder: number;
  values?: AddressAttributeValueItem[];
}

interface AddressAttributeFormProps {
  initialValues?: Partial<AddressAttributeData>;
  isEdit?: boolean;
  onBack: () => void;
  onSave: (data: AddressAttributeData, continueEditing?: boolean) => void;
  onDelete?: (id: string) => void;
  saving?: boolean;
}

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

export function AddressAttributeForm({
  initialValues,
  isEdit = false,
  onBack,
  onSave,
  onDelete,
  saving = false,
}: AddressAttributeFormProps) {
  // Form fields matching media_1791266119175.png
  const [name, setName] = useState(initialValues?.name || '');
  const [isRequired, setIsRequired] = useState(initialValues?.isRequired || false);
  const [controlType, setControlType] = useState(initialValues?.controlType || 'Drop-down list');
  const [displayOrder, setDisplayOrder] = useState<number>(initialValues?.displayOrder ?? 0);
  const [values, setValues] = useState<AddressAttributeValueItem[]>(initialValues?.values || []);

  // Multi-language tabs: Standard, EN, RTL
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [localized, setLocalized] = useState({
    en: { name: '' },
    rtl: { name: '' },
  });

  // Collapsible cards state
  const [infoOpen, setInfoOpen] = useState(true);
  const [valuesOpen, setValuesOpen] = useState(true);

  // Modal for Attribute Values in Edit mode
  const [valModalOpen, setValModalOpen] = useState(false);
  const [editingValId, setEditingValId] = useState<string | null>(null);
  const [valName, setValName] = useState('');
  const [valPriceAdjustment, setValPriceAdjustment] = useState<number>(0);
  const [valWeightAdjustment, setValWeightAdjustment] = useState<number>(0);
  const [valIsPreSelected, setValIsPreSelected] = useState<boolean>(false);
  const [valDisplayOrder, setValDisplayOrder] = useState<number>(1);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = (continueEditing: boolean = false) => {
    if (!name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    const data: AddressAttributeData = {
      id: initialValues?.id || Date.now().toString(),
      name: name.trim(),
      isRequired,
      controlType,
      displayOrder,
      values,
    };
    onSave(data, continueEditing);
  };

  const openAddValueModal = () => {
    setEditingValId(null);
    setValName('');
    setValPriceAdjustment(0);
    setValWeightAdjustment(0);
    setValIsPreSelected(false);
    setValDisplayOrder(values.length + 1);
    setValModalOpen(true);
  };

  const openEditValueModal = (val: AddressAttributeValueItem) => {
    setEditingValId(val.id);
    setValName(val.name);
    setValPriceAdjustment(val.priceAdjustment);
    setValWeightAdjustment(val.weightAdjustment);
    setValIsPreSelected(val.isPreSelected);
    setValDisplayOrder(val.displayOrder);
    setValModalOpen(true);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valName.trim()) {
      showToast('Value name is required.', 'error');
      return;
    }
    if (editingValId) {
      setValues((prev) =>
        prev.map((v) =>
          v.id === editingValId
            ? {
                ...v,
                name: valName.trim(),
                priceAdjustment: valPriceAdjustment,
                weightAdjustment: valWeightAdjustment,
                isPreSelected: valIsPreSelected,
                displayOrder: valDisplayOrder,
              }
            : v
        )
      );
      showToast('Attribute value updated.');
    } else {
      const newVal: AddressAttributeValueItem = {
        id: Date.now().toString(),
        name: valName.trim(),
        priceAdjustment: valPriceAdjustment,
        weightAdjustment: valWeightAdjustment,
        isPreSelected: valIsPreSelected,
        displayOrder: valDisplayOrder,
      };
      setValues((prev) => [...prev, newVal]);
      showToast('Attribute value added.');
    }
    setValModalOpen(false);
  };

  const handleDeleteValue = (id: string) => {
    if (confirm('Are you sure you want to delete this attribute value?')) {
      setValues((prev) => prev.filter((v) => v.id !== id));
      showToast('Attribute value deleted.');
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 ${
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

      {/* TOP TITLE BAR (Matching media_1791266119175.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h1 className="text-xl md:text-2xl font-light text-slate-800">
            {isEdit ? `Edit address attribute details - ${name}` : 'Add a new address attribute'}
          </h1>
          <button
            type="button"
            onClick={onBack}
            className="text-[#2489c5] hover:underline cursor-pointer text-xs md:text-sm font-normal inline-flex items-center gap-1.5"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2489c5] text-white text-[10px]">
              <ArrowLeft className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>back to address attribute list</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="bg-[#2489c5] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="bg-[#2489c5] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>

          {isEdit && onDelete && initialValues?.id && (
            <button
              type="button"
              onClick={() => onDelete(initialValues.id!)}
              className="bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* ── CARD 1: ATTRIBUTE INFO (Matching media_1791266119175.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setInfoOpen(!infoOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-normal text-sm">
            <span className="italic font-serif font-bold text-sm text-slate-700">i</span>
            <span>Attribute info</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600 focus:outline-none">
            {infoOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {infoOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* INNER LOCALIZATION TABS BOX */}
            <div className="border border-[#d2d6de] rounded p-4 md:p-6 bg-white space-y-4">
              {/* Tabs: Standard | EN | RTL */}
              <div className="flex items-center gap-1 border-b border-[#d2d6de] -mt-2 mb-4 select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('standard')}
                  className={`px-4 py-2 text-xs font-medium border-t-2 rounded-t transition cursor-pointer ${
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
                  className={`px-3 py-2 text-xs font-medium border-t-2 rounded-t flex items-center gap-1.5 transition cursor-pointer ${
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
                  className={`px-3 py-2 text-xs font-medium border-t-2 rounded-t flex items-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'rtl'
                      ? 'border-t-[#3c8dbc] border-x border-[#d2d6de] bg-white text-slate-800 -mb-px font-semibold'
                      : 'border-t-transparent text-slate-600 hover:text-slate-900 bg-slate-50/60'
                  }`}
                >
                  <span>🇮🇱</span>
                  <span>RTL</span>
                </button>
              </div>

              {/* Tab content: Name field with red asterisk */}
              <div className="grid grid-cols-12 items-center gap-3">
                <label className="col-span-12 sm:col-span-3 text-left sm:text-right font-medium text-slate-700 flex items-center sm:justify-end gap-1.5">
                  <span>Name</span>
                  <HelpTooltip text="The name of the custom address attribute." />
                </label>
                <div className="col-span-12 sm:col-span-9 relative">
                  <input
                    type="text"
                    value={activeTab === 'standard' ? name : localized[activeTab]?.name || ''}
                    onChange={(e) => {
                      if (activeTab === 'standard') {
                        setName(e.target.value);
                      } else {
                        setLocalized({
                          ...localized,
                          [activeTab]: { ...localized[activeTab], name: e.target.value },
                        });
                      }
                    }}
                    className="w-full border border-[#d2d6de] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#3c8dbc] pr-7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 font-bold text-sm pointer-events-none">
                    *
                  </span>
                </div>
              </div>
            </div>

            {/* Required field */}
            <div className="grid grid-cols-12 items-center gap-3">
              <label className="col-span-12 sm:col-span-3 text-left sm:text-right font-medium text-slate-700 flex items-center sm:justify-end gap-1.5">
                <span>Required</span>
                <HelpTooltip text="Check if an attribute is required." />
              </label>
              <div className="col-span-12 sm:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Control type field */}
            <div className="grid grid-cols-12 items-center gap-3">
              <label className="col-span-12 sm:col-span-3 text-left sm:text-right font-medium text-slate-700 flex items-center sm:justify-end gap-1.5">
                <span>Control type</span>
                <HelpTooltip text="Choose how to display your attribute values." />
              </label>
              <div className="col-span-12 sm:col-span-9 relative group">
                <select
                  value={controlType}
                  onChange={(e) => setControlType(e.target.value)}
                  className="w-full border border-[#d2d6de] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#3c8dbc] bg-white cursor-pointer"
                >
                  <option value="Drop-down list">Drop-down list</option>
                  <option value="Radio list">Radio list</option>
                  <option value="Checkboxes">Checkboxes</option>
                  <option value="TextBox">TextBox</option>
                  <option value="Multiline textbox">Multiline textbox</option>
                  <option value="Datepicker">Datepicker</option>
                  <option value="File upload">File upload</option>
                  <option value="Color squares">Color squares</option>
                  <option value="Read-only checkboxes">Read-only checkboxes</option>
                </select>
              </div>
            </div>

            {/* Display order field */}
            <div className="grid grid-cols-12 items-center gap-3">
              <label className="col-span-12 sm:col-span-3 text-left sm:text-right font-medium text-slate-700 flex items-center sm:justify-end gap-1.5">
                <span>Display order</span>
                <HelpTooltip text="The display order for this attribute. 1 represents the top of the list." />
              </label>
              <div className="col-span-12 sm:col-span-9">
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-32 border border-[#d2d6de] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: ATTRIBUTE VALUES (Matching media_1791266119175.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setValuesOpen(!valuesOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-normal text-sm">
            <CheckSquare className="w-4 h-4 text-slate-700" />
            <span>Attribute values</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600 focus:outline-none">
            {valuesOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {valuesOpen && (
          <div className="p-5 text-xs text-slate-700">
            {!isEdit ? (
              <p className="text-slate-600">
                You need to save the address attribute before you can add values for this address attribute page.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={openAddValueModal}
                    className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add new value</span>
                  </button>
                </div>

                <div className="border border-[#e5e7eb] rounded overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#f9fafb] text-[11px] uppercase tracking-wider text-slate-600 border-b border-[#e5e7eb] font-semibold">
                      <tr>
                        <th className="px-4 py-2.5 font-bold">Name</th>
                        <th className="px-4 py-2.5 font-bold text-right">Price adjustment</th>
                        <th className="px-4 py-2.5 font-bold text-right">Weight adjustment</th>
                        <th className="px-4 py-2.5 font-bold text-center">Is pre-selected</th>
                        <th className="px-4 py-2.5 font-bold text-center">Display order</th>
                        <th className="px-4 py-2.5 font-bold text-center w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f4f4]">
                      {values.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 px-4 text-center text-slate-500 text-xs">
                            No values available for this attribute.
                          </td>
                        </tr>
                      ) : (
                        values.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-2.5 font-medium text-slate-800">{v.name}</td>
                            <td className="px-4 py-2.5 text-right font-mono">
                              ${v.priceAdjustment.toFixed(2)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono">{v.weightAdjustment}</td>
                            <td className="px-4 py-2.5 text-center">
                              {v.isPreSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-[#2489c5] inline-block" />
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-center font-mono">{v.displayOrder}</td>
                            <td className="px-4 py-2.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditValueModal(v)}
                                  className="px-2 py-0.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-[11px] font-semibold"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteValue(v.id)}
                                  className="px-2 py-0.5 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL: ATTRIBUTE VALUE (IN EDIT MODE) ── */}
      {valModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                {editingValId ? 'Edit Attribute Value' : 'Add New Attribute Value'}
              </h3>
              <button
                type="button"
                onClick={() => setValModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveValue} className="p-5 space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={valName}
                  onChange={(e) => setValName(e.target.value)}
                  className="w-full border border-[#d2d6de] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#3c8dbc]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price adjustment</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valPriceAdjustment}
                    onChange={(e) => setValPriceAdjustment(parseFloat(e.target.value) || 0)}
                    className="w-full border border-[#d2d6de] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Weight adjustment</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valWeightAdjustment}
                    onChange={(e) => setValWeightAdjustment(parseFloat(e.target.value) || 0)}
                    className="w-full border border-[#d2d6de] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="valIsPreSelected"
                  checked={valIsPreSelected}
                  onChange={(e) => setValIsPreSelected(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
                <label htmlFor="valIsPreSelected" className="font-medium text-slate-700 cursor-pointer select-none">
                  Is pre-selected
                </label>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Display order</label>
                <input
                  type="number"
                  value={valDisplayOrder}
                  onChange={(e) => setValDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-24 border border-[#d2d6de] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setValModalOpen(false)}
                  className="border border-[#d2d6de] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded inline-flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER (Matching media_1791266119175.png) */}
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
        <div>Tuesday, October 6, 2026 7:25 AM</div>
        <div>nopCommerce version 4.90.0</div>
      </footer>
    </div>
  );
}
