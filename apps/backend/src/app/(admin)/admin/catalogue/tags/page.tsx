'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit,
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Tag as TagIcon,
} from 'lucide-react';

interface ProductTag {
  id: string;
  name: string;
  taggedProductsCount: number;
  createdAt?: string;
}

export default function AdminProductTagsPage() {
  // Data States
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search Collapsible State
  const [searchOpen, setSearchOpen] = useState(true);

  // Filter Input
  const [filterTagName, setFilterTagName] = useState('');
  const [appliedTagName, setAppliedTagName] = useState('');

  // Pagination State
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);
  const [editTagName, setEditTagName] = useState('');

  // Delete Confirm Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Tags
  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogue/tags');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Maintain priority order matching screenshot: awesome, cool, computer, apparel, compact
        const priorityOrder = ['awesome', 'cool', 'computer', 'apparel', 'compact'];
        const sorted = [...json.data].sort((a, b) => {
          const indexA = priorityOrder.indexOf(a.name.toLowerCase());
          const indexB = priorityOrder.indexOf(b.name.toLowerCase());
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return b.taggedProductsCount - a.taggedProductsCount;
        });
        setTags(sorted);
      } else {
        showToast(json.error || 'Failed to load product tags', 'error');
      }
    } catch (err: any) {
      showToast('Error loading tags: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Search Submit
  const handleSearch = () => {
    setAppliedTagName(filterTagName.trim());
    setCurrentPage(1);
  };

  // Filtered Tags
  const filteredTags = useMemo(() => {
    if (!appliedTagName) return tags;
    const query = appliedTagName.toLowerCase();
    return tags.filter((t) => t.name.toLowerCase().includes(query));
  }, [tags, appliedTagName]);

  // Paginated Tags
  const totalItems = filteredTags.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedTags = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTags.slice(startIndex, startIndex + pageSize);
  }, [filteredTags, currentPage, pageSize]);

  // Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedTags.map((t) => t.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allIds])));
    } else {
      const currentIds = paginatedTags.map((t) => t.id);
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
    paginatedTags.length > 0 &&
    paginatedTags.every((t) => selectedIds.includes(t.id));

  // Bulk Delete
  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) {
      showToast('No tags selected for deletion.', 'error');
      return;
    }
    setDeleteTargetIds(selectedIds);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/catalogue/tags?ids=${deleteTargetIds.join(',')}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Deleted ${deleteTargetIds.length} tag(s) successfully!`);
        setSelectedIds((prev) => prev.filter((id) => !deleteTargetIds.includes(id)));
        setDeleteConfirmOpen(false);
        setDeleteTargetIds([]);
        fetchTags();
      } else {
        showToast(json.error || 'Failed to delete tags', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (tag: ProductTag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditModalOpen(true);
  };

  // Save Edit Tag
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag || !editTagName.trim()) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/tags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTag.id,
          name: editTagName.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Tag updated successfully!');
        setEditModalOpen(false);
        setEditingTag(null);
        fetchTags();
      } else {
        showToast(json.error || 'Failed to update tag', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
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
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER: Title + Delete selected button (Matching media_1791004623590.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Product tags</h1>

        <div>
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

      {/* SEARCH CARD (Collapsible, matching media_1791004623590.png) */}
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
              {/* Tag name Input Field */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-4 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                  <span>Tag name</span>
                  <Tooltip text="A tag name." />
                </div>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={filterTagName}
                    onChange={(e) => setFilterTagName(e.target.value)}
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

      {/* TABLE CARD (Matching media_1791004623590.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
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
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[200px]">Tag name</th>
                <th className="p-2.5 border-r border-[#d2d6de] text-center w-40">Tagged products</th>
                <th className="p-2.5 text-center w-24">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500 bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="w-5 h-5 animate-spin text-[#3c8dbc]" />
                      <span>Loading product tags...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedTags.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 bg-white">
                    No product tags found.
                  </td>
                </tr>
              ) : (
                paginatedTags.map((tag, index) => {
                  const isSelected = selectedIds.includes(tag.id);
                  const isEven = index % 2 === 1;
                  const rowBg = isSelected
                    ? 'bg-blue-50/70'
                    : isEven
                    ? 'bg-[#f9f9f9]'
                    : 'bg-white';

                  return (
                    <tr
                      key={tag.id}
                      className={`${rowBg} hover:bg-[#f1f1f1] border-b border-[#e9ecef] transition-colors`}
                    >
                      {/* Checkbox */}
                      <td className="p-2.5 text-center border-r border-[#e9ecef]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(tag.id)}
                          className="rounded border-[#d2d6de] text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                        />
                      </td>

                      {/* Tag name */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-slate-700 font-normal">
                        {tag.name}
                      </td>

                      {/* Tagged products */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-center font-normal text-slate-700">
                        {tag.taggedProductsCount}
                      </td>

                      {/* Edit Button */}
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => openEditModal(tag)}
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

        {/* PAGING FOOTER */}
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
              onClick={fetchTags}
              className="p-1 text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
              title="Refresh"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* EDIT TAG MODAL */}
      {editModalOpen && editingTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-slate-50 border-b border-[#d2d6de] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-[#3c8dbc]" />
                <span>Edit product tag</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-medium text-slate-700 flex items-center">
                  <span>Tag name</span>
                  <Tooltip text="A tag name." />
                </label>
                <input
                  type="text"
                  required
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Tagged products:</span>
                <span className="font-bold text-slate-900">{editingTag.taggedProductsCount}</span>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#d2d6de] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
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
                product tag(s)?
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
