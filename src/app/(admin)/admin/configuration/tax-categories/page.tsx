'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
} from 'lucide-react';

interface TaxCategoryItem {
  id: string;
  name: string;
  displayOrder: number;
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

export default function TaxCategoriesPage() {
  const [categories, setCategories] = useState<TaxCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editOrder, setEditOrder] = useState<number | string>(0);
  const [savingEdit, setSavingEdit] = useState(false);

  // Add new record state
  const [newName, setNewName] = useState('');
  const [newOrder, setNewOrder] = useState<number | string>(0);
  const [adding, setAdding] = useState(false);

  // Delete modal state
  const [deletingCat, setDeletingCat] = useState<TaxCategoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tax-categories');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCategories(json.data || []);
        }
      } else {
        showToast('Failed to load tax categories from server.', 'error');
      }
    } catch {
      showToast('Error connecting to server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle add new record
  const handleAddRecord = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newName.trim()) {
      showToast('Please enter a name for the tax category.', 'error');
      return;
    }

    setAdding(true);
    try {
      const res = await fetch('/api/admin/tax-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          displayOrder: parseInt(String(newOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'The new tax category has been added successfully.');
        setNewName('');
        setNewOrder(0);
        fetchCategories();
      } else {
        showToast(json.message || 'Failed to add tax category.', 'error');
      }
    } catch {
      showToast('Error adding tax category.', 'error');
    } finally {
      setAdding(false);
    }
  };

  // Start inline editing
  const startEdit = (cat: TaxCategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditOrder(cat.displayOrder);
  };

  // Cancel inline editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditOrder(0);
  };

  // Save inline edit
  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      showToast('Category name cannot be empty.', 'error');
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/tax-categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editName.trim(),
          displayOrder: parseInt(String(editOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'The tax category has been updated successfully.');
        setEditingId(null);
        fetchCategories();
      } else {
        showToast(json.message || 'Failed to update tax category.', 'error');
      }
    } catch {
      showToast('Error updating tax category.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingCat) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tax-categories?id=${encodeURIComponent(deletingCat.id)}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'The tax category has been deleted successfully.');
        setDeletingCat(null);
        fetchCategories();
      } else {
        showToast(json.message || 'Failed to delete tax category.', 'error');
      }
    } catch {
      showToast('Error deleting tax category.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 pb-16 bg-[#f4f6f9] min-h-[calc(100vh-60px)] -m-6 p-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded shadow-lg text-xs font-medium transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-[#28a745] text-white'
              : 'bg-[#dc3545] text-white'
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

      {/* Delete Confirmation Modal */}
      {deletingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-semibold text-slate-800">Are you sure?</h3>
              <button
                type="button"
                onClick={() => setDeletingCat(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-slate-600">
              Are you sure you want to delete tax category{' '}
              <strong className="text-slate-800">"{deletingCat.name}"</strong>?
            </div>
            <div className="flex items-center justify-end gap-2.5 px-6 pb-6 pt-2 bg-white">
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setDeletingCat(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Title matching media_1791438188781.png */}
      <div className="pb-1">
        <h1 className="text-xl font-normal text-slate-800">Tax categories</h1>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: TAX CATEGORIES TABLE (Matching media_1791438188781.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        {/* Subtitle link */}
        <div className="p-4 border-b border-slate-100 text-xs text-slate-600">
          Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/tax-settings/tax-categories.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2489c5] hover:underline"
          >
            tax management
          </a>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto min-h-[160px] relative">
          {loading ? (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-12">
              <RefreshCw className="w-8 h-8 text-slate-700 animate-spin" />
              <span className="text-xs text-slate-600 font-medium">Loading...</span>
            </div>
          ) : null}

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                <th className="py-3 px-4 w-[50%]">Name</th>
                <th className="py-3 px-4 w-[20%] text-center">Display order</th>
                <th className="py-3 px-4 w-[15%] text-center">Edit</th>
                <th className="py-3 px-4 w-[15%] text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No data available in table
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const isEditing = editingId === cat.id;
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      {/* Name Column */}
                      <td className="py-3 px-4 text-slate-800 font-normal">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                            autoFocus
                          />
                        ) : (
                          <span>{cat.name}</span>
                        )}
                      </td>

                      {/* Display Order Column */}
                      <td className="py-3 px-4 text-center text-slate-700 font-normal">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editOrder}
                            onChange={(e) => setEditOrder(e.target.value)}
                            className="w-24 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs mx-auto"
                          />
                        ) : (
                          <span>{cat.displayOrder}</span>
                        )}
                      </td>

                      {/* Edit Column */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <button
                            type="button"
                            disabled={savingEdit}
                            onClick={() => handleSaveEdit(cat.id)}
                            className="inline-flex items-center justify-center px-3 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(cat)}
                            className="inline-flex items-center justify-center px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </td>

                      {/* Delete Column */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center justify-center px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingCat(cat)}
                            className="inline-flex items-center justify-center px-3 py-1 bg-white border border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Controls matching media_1791438188781.png */}
        <div className="px-4 py-3 bg-[#fafafa] border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option value={7}>7</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>items</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs">
              1 - {categories.length} of {categories.length} items
            </span>
            <button
              type="button"
              onClick={fetchCategories}
              title="Refresh"
              className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: ADD NEW RECORD (Matching media_1791438188781.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div className="px-4 py-3 bg-white border-b border-slate-100 text-slate-800 font-semibold text-sm">
          Add new record
        </div>

        {/* Card Form */}
        <form onSubmit={handleAddRecord} className="p-6 space-y-4">
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
              <span>Name</span>
              <HelpTooltip text="The tax category name." />
            </div>
            <div className="md:col-span-9">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder=""
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Row 2: Display order */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
              <span>Display order</span>
              <HelpTooltip text="The display order for this tax category. 1 represents the top of the list." />
            </div>
            <div className="md:col-span-9">
              <input
                type="number"
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Row 3: Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            <div className="md:col-start-4 md:col-span-9">
              <button
                type="submit"
                disabled={adding}
                className="inline-flex items-center justify-center px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                {adding ? 'Adding...' : 'Add new record'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
