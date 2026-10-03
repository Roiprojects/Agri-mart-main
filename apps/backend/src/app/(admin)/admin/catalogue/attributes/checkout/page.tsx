'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Check,
} from 'lucide-react';

interface CheckoutAttribute {
  id: string;
  name: string;
  controlType: string;
  isRequired: boolean;
  displayOrder: number;
}

const CONTROL_TYPE_LABELS: Record<string, string> = {
  Dropdown: 'Drop-down list',
  RadioList: 'Radio list',
  Checkboxes: 'Checkboxes',
  TextBox: 'Text box',
  'Drop-down list': 'Drop-down list',
  'Radio list': 'Radio list',
  'Text box': 'Text box',
};

export default function CheckoutAttributesPage() {
  const [attributes, setAttributes] = useState<CheckoutAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection for bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(15);

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<CheckoutAttribute | null>(null);
  const [formName, setFormName] = useState('');
  const [formControlType, setFormControlType] = useState('Dropdown');
  const [formIsRequired, setFormIsRequired] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirm Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'bulk' | 'single'>('bulk');
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogue/attributes/checkout');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAttributes(json.data.sort((a: any, b: any) => a.displayOrder - b.displayOrder));
      } else {
        showToast(json.error || 'Failed to load checkout attributes', 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // Selection helpers
  const handleToggleSelectAll = () => {
    if (attributes.length === 0) return;
    if (selectedIds.length === attributes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(attributes.map((a) => a.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingAttr(null);
    setFormName('');
    setFormControlType('Dropdown');
    setFormIsRequired(false);
    setFormDisplayOrder(attributes.length + 1);
    setFormError(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (attr: CheckoutAttribute) => {
    setEditingAttr(attr);
    setFormName(attr.name);
    setFormControlType(attr.controlType || 'Dropdown');
    setFormIsRequired(attr.isRequired);
    setFormDisplayOrder(attr.displayOrder);
    setFormError(null);
    setModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Name is required');
      return;
    }

    try {
      setSaving(true);
      const isEdit = !!editingAttr;
      const res = await fetch('/api/admin/catalogue/attributes/checkout', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAttr?.id,
          name: formName.trim(),
          controlType: formControlType,
          isRequired: formIsRequired,
          displayOrder: Number(formDisplayOrder) || 1,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(isEdit ? 'Checkout attribute updated!' : 'Checkout attribute created!');
        setModalOpen(false);
        fetchAttributes();
      } else {
        setFormError(json.error || 'Failed to save attribute');
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete Handlers
  const handleConfirmDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one attribute to delete.', 'error');
      return;
    }
    setDeleteMode('bulk');
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteSingle = (id: string) => {
    setSingleDeleteId(id);
    setDeleteMode('single');
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    try {
      setSaving(true);
      const idsToDelete = deleteMode === 'bulk' ? selectedIds : singleDeleteId ? [singleDeleteId] : [];
      if (idsToDelete.length === 0) return;

      const res = await fetch('/api/admin/catalogue/attributes/checkout', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Deleted ${idsToDelete.length} checkout attribute(s) successfully!`);
        setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
        setDeleteConfirmOpen(false);
        setSingleDeleteId(null);
        fetchAttributes();
      } else {
        showToast(json.error || 'Failed to delete attribute(s)', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

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

      {/* TOP HEADER: Title + Action buttons (Matching media_1791012149701.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Checkout attributes</h1>

        <div className="flex items-center gap-2">
          {/* Add new button */}
          <Link
            href="/admin/catalogue/attributes/checkout/new"
            className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add new</span>
          </Link>

          {/* Delete (selected) button */}
          <button
            type="button"
            onClick={handleConfirmDeleteSelected}
            className="bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete (selected)</span>
          </button>
        </div>
      </div>

      {/* MAIN CARD (Matching media_1791012149701.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Explanatory Paragraph matching screenshot copy */}
          <p className="text-xs text-slate-600 leading-relaxed">
            Checkout attributes are displayed on the shopping cart page and provide the opportunity to offer more services to customers, i.e. gift wrapping, before placing the order. Learn more about{' '}
            <a
              href="https://docs.nopcommerce.com/en/running-your-store/order-management/checkout-attributes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3c8dbc] hover:underline"
            >
              checkout attributes
            </a>
          </p>

          {/* Table Container */}
          <div className="border border-[#e5e7eb] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                    <th className="px-3.5 py-2.5 w-12 text-center border-r border-[#e5e7eb]">
                      <input
                        type="checkbox"
                        checked={attributes.length > 0 && selectedIds.length === attributes.length}
                        onChange={handleToggleSelectAll}
                        className="w-3.5 h-3.5 rounded text-[#3c8dbc] cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-2.5 border-r border-[#e5e7eb]">Name</th>
                    <th className="px-4 py-2.5 border-r border-[#e5e7eb]">Control type</th>
                    <th className="px-4 py-2.5 text-center border-r border-[#e5e7eb] w-36">Required</th>
                    <th className="px-4 py-2.5 text-center border-r border-[#e5e7eb] w-36">Display order</th>
                    <th className="px-4 py-2.5 text-center w-28">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                          <RotateCw className="w-6 h-6 animate-spin text-[#3c8dbc]" />
                          <span className="text-xs font-normal">Loading checkout attributes...</span>
                        </div>
                      </td>
                    </tr>
                  ) : attributes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-normal">
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    attributes.map((attr) => (
                      <tr
                        key={attr.id}
                        className="border-b border-[#f0f0f0] hover:bg-slate-50/70 transition"
                      >
                        <td className="px-3.5 py-2.5 text-center border-r border-[#f0f0f0]">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(attr.id)}
                            onChange={() => handleToggleSelectRow(attr.id)}
                            className="w-3.5 h-3.5 rounded text-[#3c8dbc] cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-2.5 border-r border-[#f0f0f0] font-medium text-slate-800">
                          <Link
                            href={`/admin/catalogue/attributes/checkout/${attr.id}/edit`}
                            className="text-[#3c8dbc] hover:underline"
                          >
                            {attr.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 border-r border-[#f0f0f0] text-slate-600">
                          {CONTROL_TYPE_LABELS[attr.controlType] || attr.controlType}
                        </td>
                        <td className="px-4 py-2.5 text-center border-r border-[#f0f0f0]">
                          {attr.isRequired ? (
                            <span className="text-[#00a65a] font-bold text-sm">✓</span>
                          ) : (
                            <span className="text-slate-400 font-semibold">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center text-slate-700 border-r border-[#f0f0f0]">
                          {attr.displayOrder}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <Link
                            href={`/admin/catalogue/attributes/checkout/${attr.id}/edit`}
                            className="text-[#2585be] hover:underline font-medium cursor-pointer"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Table Footer (Matching media_1791012149701.png) */}
            <div className="bg-[#fcfcfc] border-t border-[#e5e7eb] px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              {/* Previous / Next */}
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

              {/* Show [ 15 ▾ ] items */}
              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-[#d2d6de] bg-white rounded px-2 py-0.5 text-xs text-slate-700 outline-none cursor-pointer"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>items</span>
              </div>

              {/* Records count & Refresh button */}
              <div className="flex items-center gap-3">
                <span>
                  {attributes.length === 0
                    ? 'No records'
                    : `1-${attributes.length} of ${attributes.length} items`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    fetchAttributes();
                    showToast('Checkout attributes refreshed', 'success');
                  }}
                  className="p-1 border border-[#d2d6de] bg-white text-slate-600 hover:text-slate-900 rounded hover:bg-slate-50 transition cursor-pointer"
                  title="Refresh"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#3c8dbc]" />
                <span>{editingAttr ? 'Edit checkout attribute' : 'Add a new checkout attribute'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 text-xs">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded text-xs">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="col-span-8">
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Gift wrapping, Extra warranty"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Control Type */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Control type
                </label>
                <div className="col-span-8">
                  <select
                    value={formControlType}
                    onChange={(e) => setFormControlType(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  >
                    <option value="Dropdown">Drop-down list</option>
                    <option value="RadioList">Radio list</option>
                    <option value="Checkboxes">Checkboxes</option>
                    <option value="TextBox">Text box</option>
                  </select>
                </div>
              </div>

              {/* Required */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Required
                </label>
                <div className="col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={formIsRequired}
                    onChange={(e) => setFormIsRequired(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Display Order */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Display order
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-sm overflow-hidden animate-fadeIn">
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-red-600 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </h3>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-4 sm:p-5 text-xs text-slate-700 space-y-3">
              <p>
                {deleteMode === 'bulk'
                  ? `Are you sure you want to delete ${selectedIds.length} selected checkout attribute(s)?`
                  : 'Are you sure you want to delete this checkout attribute?'}
              </p>
              <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={executeDelete}
                  className="bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-semibold px-4 py-1.5 rounded disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Delete'}
                </button>
              </div>
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
