'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  Truck,
  RefreshCw,
  Minus,
  Plus,
  Check,
  X,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface MeasureItem {
  id: string;
  name: string;
  systemKeyword: string;
  ratio: number;
  displayOrder: number;
  isPrimary: boolean;
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

export default function MeasuresPage() {
  // Dimensions state
  const [dimensions, setDimensions] = useState<MeasureItem[]>([]);
  const [loadingDims, setLoadingDims] = useState(true);
  const [dimsOpen, setDimsOpen] = useState(true);
  const [dimsPageSize, setDimsPageSize] = useState(15);

  // Dimensions inline edit
  const [editingDimId, setEditingDimId] = useState<string | null>(null);
  const [editDimName, setEditDimName] = useState('');
  const [editDimKeyword, setEditDimKeyword] = useState('');
  const [editDimRatio, setEditDimRatio] = useState<number | string>(1);
  const [editDimOrder, setEditDimOrder] = useState<number | string>(0);
  const [savingDimEdit, setSavingDimEdit] = useState(false);

  // Add new dimension record state
  const [newDimName, setNewDimName] = useState('');
  const [newDimKeyword, setNewDimKeyword] = useState('');
  const [newDimRatio, setNewDimRatio] = useState<number | string>(0);
  const [newDimOrder, setNewDimOrder] = useState<number | string>(0);
  const [addingDim, setAddingDim] = useState(false);

  // Weights state
  const [weights, setWeights] = useState<MeasureItem[]>([]);
  const [loadingWeights, setLoadingWeights] = useState(true);
  const [weightsOpen, setWeightsOpen] = useState(true);
  const [weightsPageSize, setWeightsPageSize] = useState(15);

  // Weights inline edit
  const [editingWeightId, setEditingWeightId] = useState<string | null>(null);
  const [editWeightName, setEditWeightName] = useState('');
  const [editWeightKeyword, setEditWeightKeyword] = useState('');
  const [editWeightRatio, setEditWeightRatio] = useState<number | string>(1);
  const [editWeightOrder, setEditWeightOrder] = useState<number | string>(0);
  const [savingWeightEdit, setSavingWeightEdit] = useState(false);

  // Add new weight record state
  const [newWeightName, setNewWeightName] = useState('');
  const [newWeightKeyword, setNewWeightKeyword] = useState('');
  const [newWeightRatio, setNewWeightRatio] = useState<number | string>(0);
  const [newWeightOrder, setNewWeightOrder] = useState<number | string>(0);
  const [addingWeight, setAddingWeight] = useState(false);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string; type: 'dimension' | 'weight' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Dimensions
  const fetchDimensions = useCallback(async () => {
    setLoadingDims(true);
    try {
      const res = await fetch('/api/admin/measures?type=dimensions');
      const json = await res.json();
      if (json.success) {
        setDimensions(json.data || []);
      }
    } catch {
      showToast('Error loading dimensions', 'error');
    } finally {
      setLoadingDims(false);
    }
  }, []);

  // Fetch Weights
  const fetchWeights = useCallback(async () => {
    setLoadingWeights(true);
    try {
      const res = await fetch('/api/admin/measures?type=weights');
      const json = await res.json();
      if (json.success) {
        setWeights(json.data || []);
      }
    } catch {
      showToast('Error loading weights', 'error');
    } finally {
      setLoadingWeights(false);
    }
  }, []);

  useEffect(() => {
    fetchDimensions();
    fetchWeights();
  }, [fetchDimensions, fetchWeights]);

  // Mark as Primary Dimension
  const handleMarkPrimaryDimension = async (id: string) => {
    try {
      const res = await fetch('/api/admin/measures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markPrimary', type: 'dimension', id }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Primary dimension updated.');
        fetchDimensions();
      } else {
        showToast(json.message || 'Failed to update primary dimension.', 'error');
      }
    } catch {
      showToast('Error updating primary dimension.', 'error');
    }
  };

  // Mark as Primary Weight
  const handleMarkPrimaryWeight = async (id: string) => {
    try {
      const res = await fetch('/api/admin/measures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markPrimary', type: 'weight', id }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Primary weight updated.');
        fetchWeights();
      } else {
        showToast(json.message || 'Failed to update primary weight.', 'error');
      }
    } catch {
      showToast('Error updating primary weight.', 'error');
    }
  };

  // Add New Dimension Record
  const handleAddDimension = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDimName.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    if (!newDimKeyword.trim()) {
      showToast('System keyword is required.', 'error');
      return;
    }

    setAddingDim(true);
    try {
      const res = await fetch('/api/admin/measures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dimension',
          name: newDimName.trim(),
          systemKeyword: newDimKeyword.trim(),
          ratio: parseFloat(String(newDimRatio)) || 0,
          displayOrder: parseInt(String(newDimOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'The new dimension has been added successfully.');
        setNewDimName('');
        setNewDimKeyword('');
        setNewDimRatio(0);
        setNewDimOrder(0);
        fetchDimensions();
      } else {
        showToast(json.message || 'Failed to add dimension.', 'error');
      }
    } catch {
      showToast('Error adding dimension.', 'error');
    } finally {
      setAddingDim(false);
    }
  };

  // Save Dimension Inline Edit
  const handleSaveDimEdit = async (id: string) => {
    if (!editDimName.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    setSavingDimEdit(true);
    try {
      const res = await fetch('/api/admin/measures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dimension',
          id,
          name: editDimName.trim(),
          systemKeyword: editDimKeyword.trim(),
          ratio: parseFloat(String(editDimRatio)) || 0,
          displayOrder: parseInt(String(editDimOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Dimension updated successfully.');
        setEditingDimId(null);
        fetchDimensions();
      } else {
        showToast(json.message || 'Failed to update dimension.', 'error');
      }
    } catch {
      showToast('Error updating dimension.', 'error');
    } finally {
      setSavingDimEdit(false);
    }
  };

  // Add New Weight Record
  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeightName.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    if (!newWeightKeyword.trim()) {
      showToast('System keyword is required.', 'error');
      return;
    }

    setAddingWeight(true);
    try {
      const res = await fetch('/api/admin/measures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'weight',
          name: newWeightName.trim(),
          systemKeyword: newWeightKeyword.trim(),
          ratio: parseFloat(String(newWeightRatio)) || 0,
          displayOrder: parseInt(String(newWeightOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'The new weight has been added successfully.');
        setNewWeightName('');
        setNewWeightKeyword('');
        setNewWeightRatio(0);
        setNewWeightOrder(0);
        fetchWeights();
      } else {
        showToast(json.message || 'Failed to add weight.', 'error');
      }
    } catch {
      showToast('Error adding weight.', 'error');
    } finally {
      setAddingWeight(false);
    }
  };

  // Save Weight Inline Edit
  const handleSaveWeightEdit = async (id: string) => {
    if (!editWeightName.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    setSavingWeightEdit(true);
    try {
      const res = await fetch('/api/admin/measures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'weight',
          id,
          name: editWeightName.trim(),
          systemKeyword: editWeightKeyword.trim(),
          ratio: parseFloat(String(editWeightRatio)) || 0,
          displayOrder: parseInt(String(editWeightOrder), 10) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Weight updated successfully.');
        setEditingWeightId(null);
        fetchWeights();
      } else {
        showToast(json.message || 'Failed to update weight.', 'error');
      }
    } catch {
      showToast('Error updating weight.', 'error');
    } finally {
      setSavingWeightEdit(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/measures?type=${encodeURIComponent(deletingItem.type)}&id=${encodeURIComponent(deletingItem.id)}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Measure deleted successfully.');
        setDeletingItem(null);
        if (deletingItem.type === 'dimension') {
          fetchDimensions();
        } else {
          fetchWeights();
        }
      } else {
        showToast(json.message || 'Failed to delete measure.', 'error');
      }
    } catch {
      showToast('Error deleting measure.', 'error');
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
              Are you sure you want to delete measure{' '}
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

      {/* Top Header matching media_1791446082349.png */}
      <div className="space-y-1 pb-1">
        <h1 className="text-xl font-normal text-slate-800">Measures</h1>
        <div className="text-xs text-slate-600">
          Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/shipping-settings/measures.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2489c5] hover:underline"
          >
            measures
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: DIMENSIONS (Matching media_1791446082349.png)                     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setDimsOpen(!dimsOpen)}
          className="px-4 py-3 bg-white flex items-center justify-between cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-800">Dimensions</h2>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600 p-1">
            {dimsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Body */}
        {dimsOpen && (
          <div>
            {/* Dimensions Table Area */}
            <div className="overflow-x-auto min-h-[140px] relative border-b border-slate-200">
              {loadingDims ? (
                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-10">
                  <RefreshCw className="w-8 h-8 text-slate-700 animate-spin" />
                  <span className="text-xs text-slate-600 font-medium">Loading...</span>
                </div>
              ) : null}

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                    <th className="py-3 px-4 w-[16%]">Name</th>
                    <th className="py-3 px-4 w-[16%]">System keyword</th>
                    <th className="py-3 px-4 w-[18%] text-center">Ratio to primary dimension</th>
                    <th className="py-3 px-4 w-[12%] text-center">Display order</th>
                    <th className="py-3 px-4 w-[12%] text-center">Is primary dimension</th>
                    <th className="py-3 px-4 w-[14%] text-center">Mark as primary dimension</th>
                    <th className="py-3 px-4 w-[6%] text-center">Edit</th>
                    <th className="py-3 px-4 w-[6%] text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dimensions.length === 0 && !loadingDims ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        No dimensions configured.
                      </td>
                    </tr>
                  ) : (
                    dimensions.map((dim) => {
                      const isEditing = editingDimId === dim.id;
                      return (
                        <tr key={dim.id} className="hover:bg-slate-50 transition-colors">
                          {/* Name */}
                          <td className="py-3 px-4 text-slate-800 font-normal">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editDimName}
                                onChange={(e) => setEditDimName(e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                            ) : (
                              <span>{dim.name}</span>
                            )}
                          </td>

                          {/* System keyword */}
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editDimKeyword}
                                onChange={(e) => setEditDimKeyword(e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <span>{dim.systemKeyword}</span>
                            )}
                          </td>

                          {/* Ratio */}
                          <td className="py-3 px-4 text-center text-slate-700 font-normal">
                            {isEditing ? (
                              <input
                                type="number"
                                step="any"
                                value={editDimRatio}
                                onChange={(e) => setEditDimRatio(e.target.value)}
                                className="w-24 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 mx-auto"
                              />
                            ) : (
                              <span>{dim.ratio}</span>
                            )}
                          </td>

                          {/* Display order */}
                          <td className="py-3 px-4 text-center text-slate-700 font-normal">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editDimOrder}
                                onChange={(e) => setEditDimOrder(e.target.value)}
                                className="w-16 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 mx-auto"
                              />
                            ) : (
                              <span>{dim.displayOrder}</span>
                            )}
                          </td>

                          {/* Is primary */}
                          <td className="py-3 px-4 text-center">
                            {dim.isPrimary ? (
                              <Check className="w-4 h-4 text-sky-600 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-red-500 mx-auto" />
                            )}
                          </td>

                          {/* Mark as primary button */}
                          <td className="py-3 px-4 text-center">
                            {dim.isPrimary ? (
                              <span className="text-slate-400 text-xs italic select-none">Primary</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleMarkPrimaryDimension(dim.id)}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                              >
                                Mark as primary dimension
                              </button>
                            )}
                          </td>

                          {/* Edit Action */}
                          <td className="py-3 px-4 text-center">
                            {isEditing ? (
                              <button
                                type="button"
                                disabled={savingDimEdit}
                                onClick={() => handleSaveDimEdit(dim.id)}
                                className="px-2.5 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white rounded text-xs shadow-2xs transition-colors cursor-pointer"
                              >
                                Update
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDimId(dim.id);
                                  setEditDimName(dim.name);
                                  setEditDimKeyword(dim.systemKeyword);
                                  setEditDimRatio(dim.ratio);
                                  setEditDimOrder(dim.displayOrder);
                                }}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs shadow-2xs transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                            )}
                          </td>

                          {/* Delete Action */}
                          <td className="py-3 px-4 text-center">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => setEditingDimId(null)}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs shadow-2xs transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={dim.isPrimary}
                                onClick={() => setDeletingItem({ id: dim.id, name: dim.name, type: 'dimension' })}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs shadow-2xs transition-colors cursor-pointer"
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

            {/* Table Footer Controls */}
            <div className="px-4 py-2.5 bg-[#fafafa] border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={dimsPageSize}
                  onChange={(e) => setDimsPageSize(Number(e.target.value))}
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
                <button
                  type="button"
                  onClick={fetchDimensions}
                  title="Refresh"
                  className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-Card: Add new record matching media_1791446082349.png */}
            <div className="p-6">
              <div className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                Add new record
              </div>

              <form onSubmit={handleAddDimension} className="space-y-4">
                {/* Row: Name */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Name</span>
                    <HelpTooltip text="The name of the dimension unit." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="text"
                      required
                      value={newDimName}
                      onChange={(e) => setNewDimName(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row: System keyword */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>System keyword</span>
                    <HelpTooltip text="The system keyword used in calculations." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="text"
                      required
                      value={newDimKeyword}
                      onChange={(e) => setNewDimKeyword(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row: Ratio to primary dimension */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Ratio to primary dimension</span>
                    <HelpTooltip text="The ratio against the primary dimension." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      step="any"
                      value={newDimRatio}
                      onChange={(e) => setNewDimRatio(e.target.value)}
                      className="w-36 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row: Display order */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Display order</span>
                    <HelpTooltip text="The display order for this dimension." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={newDimOrder}
                      onChange={(e) => setNewDimOrder(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                  <div className="md:col-start-4 md:col-span-9">
                    <button
                      type="submit"
                      disabled={addingDim}
                      className="px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                    >
                      {addingDim ? 'Adding...' : 'Add new record'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: WEIGHTS (Matching media_1791446080067.png)                        */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setWeightsOpen(!weightsOpen)}
          className="px-4 py-3 bg-white flex items-center justify-between cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-800">Weights</h2>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600 p-1">
            {weightsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Body */}
        {weightsOpen && (
          <div>
            {/* Weights Table Area */}
            <div className="overflow-x-auto min-h-[140px] relative border-b border-slate-200">
              {loadingWeights ? (
                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-10">
                  <RefreshCw className="w-8 h-8 text-slate-700 animate-spin" />
                  <span className="text-xs text-slate-600 font-medium">Loading...</span>
                </div>
              ) : null}

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                    <th className="py-3 px-4 w-[16%]">Name</th>
                    <th className="py-3 px-4 w-[16%]">System keyword</th>
                    <th className="py-3 px-4 w-[18%] text-center">Ratio to primary weight</th>
                    <th className="py-3 px-4 w-[12%] text-center">Display order</th>
                    <th className="py-3 px-4 w-[12%] text-center">Is primary weight</th>
                    <th className="py-3 px-4 w-[14%] text-center">Mark as primary weight</th>
                    <th className="py-3 px-4 w-[6%] text-center">Edit</th>
                    <th className="py-3 px-4 w-[6%] text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {weights.length === 0 && !loadingWeights ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        No weights configured.
                      </td>
                    </tr>
                  ) : (
                    weights.map((wt) => {
                      const isEditing = editingWeightId === wt.id;
                      return (
                        <tr key={wt.id} className="hover:bg-slate-50 transition-colors">
                          {/* Name */}
                          <td className="py-3 px-4 text-slate-800 font-normal">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editWeightName}
                                onChange={(e) => setEditWeightName(e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                            ) : (
                              <span>{wt.name}</span>
                            )}
                          </td>

                          {/* System keyword */}
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editWeightKeyword}
                                onChange={(e) => setEditWeightKeyword(e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <span>{wt.systemKeyword}</span>
                            )}
                          </td>

                          {/* Ratio */}
                          <td className="py-3 px-4 text-center text-slate-700 font-normal">
                            {isEditing ? (
                              <input
                                type="number"
                                step="any"
                                value={editWeightRatio}
                                onChange={(e) => setEditWeightRatio(e.target.value)}
                                className="w-24 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 mx-auto"
                              />
                            ) : (
                              <span>{wt.ratio}</span>
                            )}
                          </td>

                          {/* Display order */}
                          <td className="py-3 px-4 text-center text-slate-700 font-normal">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editWeightOrder}
                                onChange={(e) => setEditWeightOrder(e.target.value)}
                                className="w-16 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 mx-auto"
                              />
                            ) : (
                              <span>{wt.displayOrder}</span>
                            )}
                          </td>

                          {/* Is primary */}
                          <td className="py-3 px-4 text-center">
                            {wt.isPrimary ? (
                              <Check className="w-4 h-4 text-sky-600 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-red-500 mx-auto" />
                            )}
                          </td>

                          {/* Mark as primary button */}
                          <td className="py-3 px-4 text-center">
                            {wt.isPrimary ? (
                              <span className="text-slate-400 text-xs italic select-none">Primary</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleMarkPrimaryWeight(wt.id)}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                              >
                                Mark as primary weight
                              </button>
                            )}
                          </td>

                          {/* Edit Action */}
                          <td className="py-3 px-4 text-center">
                            {isEditing ? (
                              <button
                                type="button"
                                disabled={savingWeightEdit}
                                onClick={() => handleSaveWeightEdit(wt.id)}
                                className="px-2.5 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white rounded text-xs shadow-2xs transition-colors cursor-pointer"
                              >
                                Update
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingWeightId(wt.id);
                                  setEditWeightName(wt.name);
                                  setEditWeightKeyword(wt.systemKeyword);
                                  setEditWeightRatio(wt.ratio);
                                  setEditWeightOrder(wt.displayOrder);
                                }}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs shadow-2xs transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                            )}
                          </td>

                          {/* Delete Action */}
                          <td className="py-3 px-4 text-center">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => setEditingWeightId(null)}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs shadow-2xs transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={wt.isPrimary}
                                onClick={() => setDeletingItem({ id: wt.id, name: wt.name, type: 'weight' })}
                                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs shadow-2xs transition-colors cursor-pointer"
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

            {/* Table Footer Controls */}
            <div className="px-4 py-2.5 bg-[#fafafa] border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={weightsPageSize}
                  onChange={(e) => setWeightsPageSize(Number(e.target.value))}
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
                <button
                  type="button"
                  onClick={fetchWeights}
                  title="Refresh"
                  className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-Card: Add new record matching media_1791446080067.png */}
            <div className="p-6">
              <div className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                Add new record
              </div>

              <form onSubmit={handleAddWeight} className="space-y-4">
                {/* Row: Name */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Name</span>
                    <HelpTooltip text="The name of the weight unit." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="text"
                      required
                      value={newWeightName}
                      onChange={(e) => setNewWeightName(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row: System keyword */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>System keyword</span>
                    <HelpTooltip text="The system keyword used in shipping calculations." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="text"
                      required
                      value={newWeightKeyword}
                      onChange={(e) => setNewWeightKeyword(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row: Ratio to primary weight */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Ratio to primary weight</span>
                    <HelpTooltip text="The ratio against the primary weight unit." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      step="any"
                      value={newWeightRatio}
                      onChange={(e) => setNewWeightRatio(e.target.value)}
                      className="w-36 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row: Display order */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Display order</span>
                    <HelpTooltip text="The display order for this weight unit." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={newWeightOrder}
                      onChange={(e) => setNewWeightOrder(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                  <div className="md:col-start-4 md:col-span-9">
                    <button
                      type="submit"
                      disabled={addingWeight}
                      className="px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                    >
                      {addingWeight ? 'Adding...' : 'Add new record'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
