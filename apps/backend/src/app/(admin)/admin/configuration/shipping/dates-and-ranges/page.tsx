'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays,
  ArrowLeftRight,
  RefreshCw,
  Plus,
  Minus,
  Check,
  X,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface DateRangeItem {
  id: string;
  name: string;
  displayOrder: number;
}

export default function DatesAndRangesPage() {
  // Delivery Dates state
  const [deliveryDates, setDeliveryDates] = useState<DateRangeItem[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [datesOpen, setDatesOpen] = useState(true);
  const [datesPageSize, setDatesPageSize] = useState(15);

  // Delivery Dates Inline Edit state
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editDateName, setEditDateName] = useState('');
  const [editDateOrder, setEditDateOrder] = useState<number | string>(1);
  const [savingDateEdit, setSavingDateEdit] = useState(false);

  // Add Delivery Date Modal state
  const [showAddDateModal, setShowAddDateModal] = useState(false);
  const [newDateName, setNewDateName] = useState('');
  const [newDateOrder, setNewDateOrder] = useState<number | string>(1);
  const [addingDate, setAddingDate] = useState(false);

  // Product Availability Ranges state
  const [availabilityRanges, setAvailabilityRanges] = useState<DateRangeItem[]>([]);
  const [loadingRanges, setLoadingRanges] = useState(true);
  const [rangesOpen, setRangesOpen] = useState(true);
  const [rangesPageSize, setRangesPageSize] = useState(15);

  // Availability Ranges Inline Edit state
  const [editingRangeId, setEditingRangeId] = useState<string | null>(null);
  const [editRangeName, setEditRangeName] = useState('');
  const [editRangeOrder, setEditRangeOrder] = useState<number | string>(1);
  const [savingRangeEdit, setSavingRangeEdit] = useState(false);

  // Add Availability Range Modal state
  const [showAddRangeModal, setShowAddRangeModal] = useState(false);
  const [newRangeName, setNewRangeName] = useState('');
  const [newRangeOrder, setNewRangeOrder] = useState<number | string>(1);
  const [addingRange, setAddingRange] = useState(false);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string; type: 'deliveryDate' | 'availabilityRange' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Delivery Dates
  const fetchDeliveryDates = useCallback(async () => {
    setLoadingDates(true);
    try {
      const res = await fetch('/api/admin/dates-and-ranges?type=deliveryDates');
      const json = await res.json();
      if (json.success) {
        setDeliveryDates(json.data || []);
      }
    } catch {
      showToast('Error loading delivery dates', 'error');
    } finally {
      setLoadingDates(false);
    }
  }, []);

  // Fetch Availability Ranges
  const fetchAvailabilityRanges = useCallback(async () => {
    setLoadingRanges(true);
    try {
      const res = await fetch('/api/admin/dates-and-ranges?type=availabilityRanges');
      const json = await res.json();
      if (json.success) {
        setAvailabilityRanges(json.data || []);
      }
    } catch {
      showToast('Error loading product availability ranges', 'error');
    } finally {
      setLoadingRanges(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryDates();
    fetchAvailabilityRanges();
  }, [fetchDeliveryDates, fetchAvailabilityRanges]);

  // Handle Add Delivery Date
  const handleAddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateName.trim()) {
      showToast('Name is required.', 'error');
      return;
    }

    setAddingDate(true);
    try {
      const res = await fetch('/api/admin/dates-and-ranges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'deliveryDate',
          name: newDateName.trim(),
          displayOrder: parseInt(String(newDateOrder), 10) || 1,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Delivery date added successfully.');
        setNewDateName('');
        setNewDateOrder(deliveryDates.length + 2);
        setShowAddDateModal(false);
        fetchDeliveryDates();
      } else {
        showToast(json.message || 'Failed to add delivery date.', 'error');
      }
    } catch {
      showToast('Error adding delivery date.', 'error');
    } finally {
      setAddingDate(false);
    }
  };

  // Handle Save Delivery Date Edit
  const handleSaveDateEdit = async (id: string) => {
    if (!editDateName.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    setSavingDateEdit(true);
    try {
      const res = await fetch('/api/admin/dates-and-ranges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'deliveryDate',
          id,
          name: editDateName.trim(),
          displayOrder: parseInt(String(editDateOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Delivery date updated successfully.');
        setEditingDateId(null);
        fetchDeliveryDates();
      } else {
        showToast(json.message || 'Failed to update delivery date.', 'error');
      }
    } catch {
      showToast('Error updating delivery date.', 'error');
    } finally {
      setSavingDateEdit(false);
    }
  };

  // Handle Add Availability Range
  const handleAddRange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRangeName.trim()) {
      showToast('Name is required.', 'error');
      return;
    }

    setAddingRange(true);
    try {
      const res = await fetch('/api/admin/dates-and-ranges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'availabilityRange',
          name: newRangeName.trim(),
          displayOrder: parseInt(String(newRangeOrder), 10) || 1,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Availability range added successfully.');
        setNewRangeName('');
        setNewRangeOrder(availabilityRanges.length + 2);
        setShowAddRangeModal(false);
        fetchAvailabilityRanges();
      } else {
        showToast(json.message || 'Failed to add availability range.', 'error');
      }
    } catch {
      showToast('Error adding availability range.', 'error');
    } finally {
      setAddingRange(false);
    }
  };

  // Handle Save Availability Range Edit
  const handleSaveRangeEdit = async (id: string) => {
    if (!editRangeName.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    setSavingRangeEdit(true);
    try {
      const res = await fetch('/api/admin/dates-and-ranges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'availabilityRange',
          id,
          name: editRangeName.trim(),
          displayOrder: parseInt(String(editRangeOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Availability range updated successfully.');
        setEditingRangeId(null);
        fetchAvailabilityRanges();
      } else {
        showToast(json.message || 'Failed to update availability range.', 'error');
      }
    } catch {
      showToast('Error updating availability range.', 'error');
    } finally {
      setSavingRangeEdit(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/dates-and-ranges?type=${encodeURIComponent(deletingItem.type)}&id=${encodeURIComponent(deletingItem.id)}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Item deleted successfully.');
        setDeletingItem(null);
        if (deletingItem.type === 'deliveryDate') {
          fetchDeliveryDates();
        } else {
          fetchAvailabilityRanges();
        }
      } else {
        showToast(json.message || 'Failed to delete item.', 'error');
      }
    } catch {
      showToast('Error deleting item.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 bg-[#f4f6f9] min-h-[calc(100vh-60px)] -m-6 p-6">
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
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-semibold text-slate-800">Are you sure?</h3>
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-slate-600">
              Are you sure you want to delete{' '}
              <strong className="text-slate-800">"{deletingItem.name}"</strong>?
            </div>
            <div className="flex items-center justify-end gap-2.5 px-6 pb-6 pt-2 bg-white">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Delivery Date */}
      {showAddDateModal && (
        <div
          onClick={() => setShowAddDateModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded shadow-xl w-full max-w-md border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#2489c5]" />
                <span>Add new delivery date</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDateName}
                  onChange={(e) => setNewDateName(e.target.value)}
                  placeholder="e.g. 1-2 days, Same day dispatch"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Display order
                </label>
                <input
                  type="number"
                  value={newDateOrder}
                  onChange={(e) => setNewDateOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDateModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDate}
                  className="px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                >
                  {addingDate ? 'Saving...' : 'Add record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Availability Range */}
      {showAddRangeModal && (
        <div
          onClick={() => setShowAddRangeModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded shadow-xl w-full max-w-md border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-[#2489c5]" />
                <span>Add new product availability range</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRangeModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRange} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRangeName}
                  onChange={(e) => setNewRangeName(e.target.value)}
                  placeholder="e.g. In stock, 7 to 14 days"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Display order
                </label>
                <input
                  type="number"
                  value={newRangeOrder}
                  onChange={(e) => setNewRangeOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRangeModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingRange}
                  className="px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                >
                  {addingRange ? 'Saving...' : 'Add record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CARD 1: DELIVERY DATES (Matching media_1791444547020.png)                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setDatesOpen(!datesOpen)}
          className="px-4 py-3 bg-white flex items-center justify-between cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-800">Delivery dates</h2>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            {datesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Body */}
        {datesOpen && (
          <div className="p-4 space-y-4">
            {/* Subtitle text matching reference */}
            <p className="text-xs italic text-slate-600">
              List of delivery dates which will be available on the product details page.
            </p>

            {/* Table */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="overflow-x-auto min-h-[140px] relative">
                {loadingDates ? (
                  <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-10">
                    <RefreshCw className="w-8 h-8 text-slate-700 animate-spin" />
                    <span className="text-xs text-slate-600 font-medium">Loading...</span>
                  </div>
                ) : null}

                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                      <th className="py-3 px-4 w-[50%]">Name</th>
                      <th className="py-3 px-4 w-[25%] text-center">Display order</th>
                      <th className="py-3 px-4 w-[25%] text-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deliveryDates.length === 0 && !loadingDates ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-slate-400">
                          No delivery dates available. Click <strong>"+ Add new"</strong> below.
                        </td>
                      </tr>
                    ) : (
                      deliveryDates.map((item) => {
                        const isEditing = editingDateId === item.id;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            {/* Name */}
                            <td className="py-3 px-4 text-slate-800 font-normal">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editDateName}
                                  onChange={(e) => setEditDateName(e.target.value)}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  autoFocus
                                />
                              ) : (
                                <span>{item.name}</span>
                              )}
                            </td>

                            {/* Display order */}
                            <td className="py-3 px-4 text-center text-slate-700 font-normal">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editDateOrder}
                                  onChange={(e) => setEditDateOrder(e.target.value)}
                                  className="w-20 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 mx-auto"
                                />
                              ) : (
                                <span>{item.displayOrder}</span>
                              )}
                            </td>

                            {/* Edit & Delete Actions */}
                            <td className="py-3 px-4 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={savingDateEdit}
                                    onClick={() => handleSaveDateEdit(item.id)}
                                    className="inline-flex items-center justify-center px-2.5 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Update
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingDateId(null)}
                                    className="inline-flex items-center justify-center px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingDateId(item.id);
                                      setEditDateName(item.name);
                                      setEditDateOrder(item.displayOrder);
                                    }}
                                    className="inline-flex items-center justify-center px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingItem({ id: item.id, name: item.name, type: 'deliveryDate' })}
                                    className="p-1 border border-slate-200 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Controls matching reference */}
              <div className="px-4 py-2.5 bg-[#fafafa] border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={datesPageSize}
                    onChange={(e) => setDatesPageSize(Number(e.target.value))}
                    className="border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value={7}>7</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>items</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs">
                    1 - {deliveryDates.length} of {deliveryDates.length} items
                  </span>
                  <button
                    type="button"
                    onClick={fetchDeliveryDates}
                    title="Refresh"
                    className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* "+ Add new" Button matching media_1791444547020.png */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setNewDateName('');
                  setNewDateOrder(deliveryDates.length + 1);
                  setShowAddDateModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add new</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: PRODUCT AVAILABILITY RANGES (Matching media_1791444547020.png)    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setRangesOpen(!rangesOpen)}
          className="px-4 py-3 bg-white flex items-center justify-between cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-800">Product availability ranges</h2>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            {rangesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Body */}
        {rangesOpen && (
          <div className="p-4 space-y-4">
            {/* Subtitle text matching reference */}
            <p className="text-xs italic text-slate-600">
              List of availability range options which will be available in product details.
            </p>

            {/* Table */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="overflow-x-auto min-h-[140px] relative">
                {loadingRanges ? (
                  <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-10">
                    <RefreshCw className="w-8 h-8 text-slate-700 animate-spin" />
                    <span className="text-xs text-slate-600 font-medium">Loading...</span>
                  </div>
                ) : null}

                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                      <th className="py-3 px-4 w-[50%]">Name</th>
                      <th className="py-3 px-4 w-[25%] text-center">Display order</th>
                      <th className="py-3 px-4 w-[25%] text-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {availabilityRanges.length === 0 && !loadingRanges ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-slate-400">
                          No product availability ranges available. Click <strong>"+ Add new"</strong> below.
                        </td>
                      </tr>
                    ) : (
                      availabilityRanges.map((item) => {
                        const isEditing = editingRangeId === item.id;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            {/* Name */}
                            <td className="py-3 px-4 text-slate-800 font-normal">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editRangeName}
                                  onChange={(e) => setEditRangeName(e.target.value)}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  autoFocus
                                />
                              ) : (
                                <span>{item.name}</span>
                              )}
                            </td>

                            {/* Display order */}
                            <td className="py-3 px-4 text-center text-slate-700 font-normal">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editRangeOrder}
                                  onChange={(e) => setEditRangeOrder(e.target.value)}
                                  className="w-20 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 mx-auto"
                                />
                              ) : (
                                <span>{item.displayOrder}</span>
                              )}
                            </td>

                            {/* Edit & Delete Actions */}
                            <td className="py-3 px-4 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={savingRangeEdit}
                                    onClick={() => handleSaveRangeEdit(item.id)}
                                    className="inline-flex items-center justify-center px-2.5 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Update
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingRangeId(null)}
                                    className="inline-flex items-center justify-center px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingRangeId(item.id);
                                      setEditRangeName(item.name);
                                      setEditRangeOrder(item.displayOrder);
                                    }}
                                    className="inline-flex items-center justify-center px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingItem({ id: item.id, name: item.name, type: 'availabilityRange' })}
                                    className="p-1 border border-slate-200 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Controls matching reference */}
              <div className="px-4 py-2.5 bg-[#fafafa] border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={rangesPageSize}
                    onChange={(e) => setRangesPageSize(Number(e.target.value))}
                    className="border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value={7}>7</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>items</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs">
                    1 - {availabilityRanges.length} of {availabilityRanges.length} items
                  </span>
                  <button
                    type="button"
                    onClick={fetchAvailabilityRanges}
                    title="Refresh"
                    className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* "+ Add new" Button matching media_1791444547020.png */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setNewRangeName('');
                  setNewRangeOrder(availabilityRanges.length + 1);
                  setShowAddRangeModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add new</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
