'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Edit,
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from 'lucide-react';

interface ProductAttribute {
  id: string;
  name: string;
  description?: string;
  displayOrder?: number;
}

export default function ProductAttributesPage() {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search Collapsible State
  const [searchOpen, setSearchOpen] = useState(true);

  // Filter Input
  const [filterName, setFilterName] = useState('');
  const [appliedName, setAppliedName] = useState('');

  // Pagination State
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State (Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<ProductAttribute | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Delete Confirm Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

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
        // Priority order matching media_1791007940603.png: Color, Frame Color, Pattern
        const priorityOrder = ['Color', 'Frame Color', 'Pattern'];
        const sorted = [...json.data].sort((a: any, b: any) => {
          const idxA = priorityOrder.indexOf(a.name);
          const idxB = priorityOrder.indexOf(b.name);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        });
        setAttributes(sorted);
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

  const handleSearch = () => {
    setAppliedName(filterName.trim());
    setCurrentPage(1);
  };

  const filteredAttributes = useMemo(() => {
    if (!appliedName) return attributes;
    const q = appliedName.toLowerCase();
    return attributes.filter((a) => a.name.toLowerCase().includes(q));
  }, [attributes, appliedName]);

  const totalItems = filteredAttributes.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedAttributes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAttributes.slice(startIndex, startIndex + pageSize);
  }, [filteredAttributes, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedAttributes.map((a) => a.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allIds])));
    } else {
      const currentIds = paginatedAttributes.map((a) => a.id);
      setSelectedIds(selectedIds.filter((id) => !currentIds.includes(id)));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected =
    paginatedAttributes.length > 0 &&
    paginatedAttributes.every((a) => selectedIds.includes(a.id));

  // Bulk Delete
  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) {
      showToast('No attributes selected for deletion.', 'error');
      return;
    }
    setDeleteTargetIds(selectedIds);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/catalogue/attributes/product?ids=${deleteTargetIds.join(',')}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Deleted ${deleteTargetIds.length} attribute(s) successfully!`);
        setSelectedIds((prev) => prev.filter((id) => !deleteTargetIds.includes(id)));
        setDeleteConfirmOpen(false);
        setDeleteTargetIds([]);
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

  // Add / Edit Modal
  const openCreateModal = () => {
    setEditingAttr(null);
    setFormName('');
    setFormDescription('');
    setModalOpen(true);
  };

  const openEditModal = (attr: ProductAttribute) => {
    setEditingAttr(attr);
    setFormName(attr.name);
    setFormDescription(attr.description || '');
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
          displayOrder: editingAttr?.displayOrder || attributes.length + 1,
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

  // Tooltip Helper
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

      {/* TOP HEADER: Title + Add new & Delete selected buttons (Matching media_1791007940603.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Product attributes</h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add new button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add new</span>
          </button>

          {/* Delete selected button */}
          <button
            type="button"
            onClick={handleBulkDeleteConfirm}
            disabled={saving || selectedIds.length === 0}
            className="bg-[#dd4b39] hover:bg-[#c23321] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete (selected)</span>
          </button>
        </div>
      </div>

      {/* SEARCH CARD (Collapsible, matching media_1791007940603.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <Search className="w-4 h-4 text-slate-800" />
            <span>Search</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {searchOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {searchOpen && (
          <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
            <div className="max-w-xl mx-auto space-y-4">
              {/* Product attribute name Field */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-5 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                  <span>Product attribute name</span>
                  <Tooltip text="A product attribute name." />
                </div>
                <div className="sm:col-span-7">
                  <input
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder=""
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                  />
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-6 py-2 rounded flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLE CARD (Matching media_1791007940603.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Descriptive Text matching screenshot */}
        <div className="p-4 border-b border-[#f4f4f4] bg-white text-xs text-slate-700 leading-relaxed">
          Product attributes are quantifiable or descriptive aspects of a product (such as, color). For example, if you were to create an attribute for color, with the values of blue, green, yellow, and so on, you may want to apply this attribute to shirts, which you sell in various colors (you can adjust a price or weight for any of existing attribute values). You can add attributes to existing product on a product details page. Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/catalog/products/product-attributes.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            product attributes
          </a>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-[#d2d6de] text-slate-700 font-semibold select-none">
                <th className="p-2.5 w-12 text-center border-r border-[#d2d6de]">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-[#d2d6de] text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </th>
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[300px]">Name</th>
                <th className="p-2.5 text-center w-28">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-500 bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="w-5 h-5 animate-spin text-[#3c8dbc]" />
                      <span>Loading product attributes...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedAttributes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-400 bg-white">
                    No product attributes found.
                  </td>
                </tr>
              ) : (
                paginatedAttributes.map((attr, index) => {
                  const isSelected = selectedIds.includes(attr.id);
                  const isEven = index % 2 === 1;
                  const rowBg = isSelected
                    ? 'bg-blue-50/70'
                    : isEven
                    ? 'bg-[#f9f9f9]'
                    : 'bg-white';

                  return (
                    <tr
                      key={attr.id}
                      className={`${rowBg} hover:bg-[#f1f1f1] border-b border-[#e9ecef] transition-colors`}
                    >
                      {/* Checkbox */}
                      <td className="p-2.5 text-center border-r border-[#e9ecef]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(attr.id)}
                          className="rounded border-[#d2d6de] text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                        />
                      </td>

                      {/* Name */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-slate-700 font-normal">
                        {attr.name}
                      </td>

                      {/* Edit Button */}
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => openEditModal(attr)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 shadow-2xs transition cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-600" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGING FOOTER (Matching media_1791007940603.png) */}
        <div className="p-3 border-t border-[#d2d6de] bg-[#fcfcfc] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 select-none">
          {/* Previous / Page / Next */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 rounded border transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#3c8dbc] border-[#3c8dbc] text-white font-bold'
                    : 'border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>

          {/* Show [ 15 ] items dropdown */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>items</span>
          </div>

          {/* Summary and Refresh */}
          <div className="flex items-center gap-3">
            <span>
              {totalItems === 0
                ? '0 items'
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(
                    currentPage * pageSize,
                    totalItems
                  )} of ${totalItems} items`}
            </span>
            <button
              type="button"
              onClick={fetchAttributes}
              className="p-1 text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
              title="Refresh"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            {/* Header */}
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

            {/* Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3.5 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-medium text-slate-700 flex items-center">
                  <span>Name *</span>
                  <Tooltip text="The name of the product attribute." />
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Color"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700 flex items-center">
                  <span>Description</span>
                  <Tooltip text="The description of the product attribute." />
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Available color variations"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                />
              </div>

              {/* Footer */}
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

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-slate-50 border-b border-[#d2d6de] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5 text-red-600">
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
            <div className="p-4 sm:p-5 text-xs text-slate-700 space-y-3">
              <p>
                Are you sure you want to delete{' '}
                <span className="font-bold text-slate-900">{deleteTargetIds.length}</span> selected
                product attribute(s)?
              </p>
              <p className="text-slate-500">This action cannot be undone.</p>
              <div className="pt-3 border-t border-[#d2d6de] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={executeDelete}
                  className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
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
        <div className="flex items-center gap-1">
          <span>Powered by</span>
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

      {/* Floating Scroll to Top Button */}
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
