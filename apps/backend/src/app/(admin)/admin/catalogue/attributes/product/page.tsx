'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ChevronUp,
} from 'lucide-react';

interface ProductAttribute {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
}

export default function ProductAttributesPage() {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<ProductAttribute | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);

  // Delete Confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogue/attributes/product');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAttributes(json.data.sort((a: any, b: any) => a.displayOrder - b.displayOrder));
      } else {
        showToast(json.error || 'Failed to load product attributes', 'error');
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

  const openCreateModal = () => {
    setEditingAttr(null);
    setFormName('');
    setFormDescription('');
    setFormDisplayOrder(attributes.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (attr: ProductAttribute) => {
    setEditingAttr(attr);
    setFormName(attr.name);
    setFormDescription(attr.description || '');
    setFormDisplayOrder(attr.displayOrder);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setSaving(true);
      const isEdit = !!editingAttr;
      const res = await fetch('/api/admin/catalogue/attributes/product', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAttr?.id,
          name: formName.trim(),
          description: formDescription.trim(),
          displayOrder: Number(formDisplayOrder),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(isEdit ? 'Product attribute updated!' : 'Product attribute created!');
        setModalOpen(false);
        fetchAttributes();
      } else {
        showToast(json.error || 'Failed to save attribute', 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!targetDeleteId) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/catalogue/attributes/product?id=${targetDeleteId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast('Product attribute deleted!');
        setDeleteConfirmOpen(false);
        setTargetDeleteId(null);
        fetchAttributes();
      } else {
        showToast(json.error || 'Failed to delete attribute', 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
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

      {/* TOP HEADER: Title + Add new button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Product attributes</h1>

        <div>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add new</span>
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div className="px-4 py-2 border-b border-[#f4f4f4] bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Manage product-level configurable attributes</span>
          <button
            type="button"
            onClick={fetchAttributes}
            className="text-slate-500 hover:text-slate-800 p-1"
            title="Refresh"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-[#d2d6de] text-slate-700 font-semibold select-none">
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[240px]">Name</th>
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[200px]">Description</th>
                <th className="p-2.5 border-r border-[#d2d6de] text-center w-32">Display order</th>
                <th className="p-2.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500 bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="w-5 h-5 animate-spin text-[#3c8dbc]" />
                      <span>Loading product attributes...</span>
                    </div>
                  </td>
                </tr>
              ) : attributes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 bg-white">
                    No product attributes defined.
                  </td>
                </tr>
              ) : (
                attributes.map((attr, index) => {
                  const isEven = index % 2 === 1;
                  return (
                    <tr
                      key={attr.id}
                      className={`${isEven ? 'bg-[#f9f9f9]' : 'bg-white'} hover:bg-[#f1f1f1] border-b border-[#e9ecef] transition-colors`}
                    >
                      <td className="p-2.5 border-r border-[#e9ecef] font-medium text-slate-800">
                        {attr.name}
                      </td>
                      <td className="p-2.5 border-r border-[#e9ecef] text-slate-600">
                        {attr.description || '—'}
                      </td>
                      <td className="p-2.5 border-r border-[#e9ecef] text-center text-slate-700">
                        {attr.displayOrder}
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(attr)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 shadow-2xs transition cursor-pointer"
                          >
                            <Edit className="w-3 h-3 text-slate-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetDeleteId(attr.id);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGING FOOTER */}
        <div className="p-3 border-t border-[#d2d6de] bg-[#fcfcfc] flex items-center justify-between text-xs text-slate-600">
          <div>{attributes.length} item(s) found</div>
          <div>Page 1 of 1</div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-slate-50 border-b border-[#d2d6de] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#3c8dbc]" />
                <span>{editingAttr ? 'Edit product attribute' : 'Add new product attribute'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3.5 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tank Capacity"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Volume capacity for chemical spraying"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Display order</label>
                <input
                  type="number"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#d2d6de] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-1.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-1.5 rounded bg-[#2585be] hover:bg-[#1f72a3] text-white font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-sm overflow-hidden animate-fadeIn">
            <div className="bg-slate-50 border-b border-[#d2d6de] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-red-600 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </h3>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 text-xs text-slate-700 space-y-3">
              <p>Are you sure you want to delete this product attribute?</p>
              <div className="pt-2 border-t border-[#d2d6de] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={executeDelete}
                  className="px-4 py-1 rounded bg-[#dd4b39] text-white font-semibold hover:bg-[#c23321]"
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
        <div>Powered by <a href="https://www.nopcommerce.com/" target="_blank" rel="noopener noreferrer" className="text-[#3c8dbc] hover:underline">nopCommerce</a></div>
        <div>nopCommerce version 4.90.0</div>
      </footer>

      {/* Floating Scroll to Top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-2.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] text-white shadow-lg transition cursor-pointer z-40"
        title="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
