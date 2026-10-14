'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Settings,
  X,
  Check,
  Tractor,
  Layers,
  ChevronDown,
  ListPlus,
  ExternalLink,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface CropGuidanceItem {
  id: string;
  stageNumber: number;
  crop?: string;
  title: string;
  subtitle: string;
  summary: string;
  keyActions: string[];
  recommendedTools: string[];
  recommendedProducts?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminCropGuidancePage() {
  const [items, setItems] = useState<CropGuidanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CropGuidanceItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<CropGuidanceItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [stageNumber, setStageNumber] = useState<number | string>(1);
  const [crop, setCrop] = useState('All Crops');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [keyActions, setKeyActions] = useState<string[]>(['']);
  const [newActionInput, setNewActionInput] = useState('');
  const [recommendedTools, setRecommendedTools] = useState<string[]>([]);
  const [newToolInput, setNewToolInput] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<string[]>([]);
  const [newProductInput, setNewProductInput] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (cropFilter !== 'All') params.set('crop', cropFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/crop-guidance?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      }
    } catch {
      showToast('Error loading crop guidance stages', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, cropFilter, statusFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditingItem(null);
    setStageNumber(items.length + 1);
    setCrop('All Crops');
    setTitle(`Stage ${items.length + 1}: `);
    setSubtitle('');
    setSummary('');
    setKeyActions(['']);
    setRecommendedTools([]);
    setRecommendedProducts([]);
    setDisplayOrder(items.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (it: CropGuidanceItem) => {
    setEditingItem(it);
    setStageNumber(it.stageNumber || 1);
    setCrop(it.crop || 'All Crops');
    setTitle(it.title || '');
    setSubtitle(it.subtitle || '');
    setSummary(it.summary || '');
    setKeyActions(it.keyActions && it.keyActions.length > 0 ? [...it.keyActions] : ['']);
    setRecommendedTools(it.recommendedTools || []);
    setRecommendedProducts(it.recommendedProducts || []);
    setDisplayOrder(it.displayOrder || 1);
    setIsActive(it.isActive !== false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Stage title is required', 'error');
      return;
    }

    try {
      setSaving(true);
      const cleanedActions = keyActions.map((a) => a.trim()).filter((a) => a.length > 0);
      const payload = {
        id: editingItem?.id,
        stageNumber: Number(stageNumber) || 1,
        crop,
        title: title.trim(),
        subtitle: subtitle.trim(),
        summary: summary.trim(),
        keyActions: cleanedActions,
        recommendedTools,
        recommendedProducts,
        displayOrder: Number(displayOrder) || 1,
        isActive,
      };

      const url = '/api/admin/crop-guidance';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast(
          editingItem ? 'Crop guidance stage updated' : 'Crop guidance stage created',
          'success'
        );
        setModalOpen(false);
        fetchItems();
      } else {
        showToast(json.message || 'Error saving stage', 'error');
      }
    } catch {
      showToast('Network error saving stage', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/crop-guidance?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast('Crop guidance stage deleted', 'success');
        setDeleteTarget(null);
        fetchItems();
      } else {
        showToast(json.message || 'Error deleting stage', 'error');
      }
    } catch {
      showToast('Network error deleting stage', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (it: CropGuidanceItem) => {
    try {
      const updated = { ...it, isActive: !it.isActive };
      const res = await fetch('/api/admin/crop-guidance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          `Stage ${it.stageNumber} ${!it.isActive ? 'activated' : 'deactivated'}`,
          'success'
        );
        fetchItems();
      }
    } catch {
      showToast('Error toggling stage status', 'error');
    }
  };

  // Helper for adding dynamic list items
  const addActionItem = () => {
    if (newActionInput.trim()) {
      setKeyActions([...keyActions, newActionInput.trim()]);
      setNewActionInput('');
    } else {
      setKeyActions([...keyActions, '']);
    }
  };

  const removeActionItem = (index: number) => {
    setKeyActions(keyActions.filter((_, i) => i !== index));
  };

  const updateActionItem = (index: number, val: string) => {
    const copy = [...keyActions];
    copy[index] = val;
    setKeyActions(copy);
  };

  const addToolTag = () => {
    if (newToolInput.trim() && !recommendedTools.includes(newToolInput.trim())) {
      setRecommendedTools([...recommendedTools, newToolInput.trim()]);
      setNewToolInput('');
    }
  };

  const removeToolTag = (tag: string) => {
    setRecommendedTools(recommendedTools.filter((t) => t !== tag));
  };

  const addProductTag = () => {
    if (newProductInput.trim() && !recommendedProducts.includes(newProductInput.trim())) {
      setRecommendedProducts([...recommendedProducts, newProductInput.trim()]);
      setNewProductInput('');
    }
  };

  const removeProductTag = (tag: string) => {
    setRecommendedProducts(recommendedProducts.filter((p) => p !== tag));
  };

  return (
    <div className="space-y-4 pb-12 text-[#333333] text-[13px]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold transition-all ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#f4f4f4]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-emerald-50 text-emerald-600">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-normal text-[#333333]">Crop Guidance & Practices</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                {items.length} Stages
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage the 7-stage agronomy lifecycle guidelines, recommended tools, and products displayed on /crop-guidance.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/configuration/settings/crop-guidance"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition"
          >
            <Settings className="w-3.5 h-3.5 text-[#3c8dbc]" />
            Settings
          </Link>

          <Link
            href="/crop-guidance"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            View Storefront
          </Link>

          <button
            type="button"
            onClick={fetchItems}
            className="p-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-700 rounded shadow-xs transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add new stage
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#d2d6de] rounded p-3 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search stage title, subtitle, or actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Crop:</span>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full h-8 px-2 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
            >
              <option value="All">All Crops</option>
              <option value="All Crops">All Crops (Universal)</option>
              <option value="Paddy">Paddy (Rice)</option>
              <option value="Cotton">Cotton</option>
              <option value="Maize">Maize</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Arecanut">Arecanut</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-8 px-2 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
            >
              <option value="all">All</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafc] border-b border-[#f4f4f4] text-xs font-semibold text-[#444444]">
                <th className="py-2.5 px-3 w-16 text-center">Stage #</th>
                <th className="py-2.5 px-3 w-28">Crop</th>
                <th className="py-2.5 px-4 min-w-[240px]">Stage Details</th>
                <th className="py-2.5 px-3 min-w-[200px]">Key Actions</th>
                <th className="py-2.5 px-3 min-w-[160px]">Tools & Implements</th>
                <th className="py-2.5 px-2 w-16 text-center">Order</th>
                <th className="py-2.5 px-3 w-20 text-center">Status</th>
                <th className="py-2.5 px-3 w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                    Loading crop guidance stages...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No crop guidance stages found. Click &quot;Add new stage&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                        {it.stageNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {it.crop || 'All Crops'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{it.title}</div>
                      {it.subtitle && (
                        <div className="text-xs text-emerald-700 font-medium mt-0.5">
                          {it.subtitle}
                        </div>
                      )}
                      {it.summary && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{it.summary}</p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        {(it.keyActions || []).slice(0, 2).map((act, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-slate-600 line-clamp-1">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span>{act}</span>
                          </div>
                        ))}
                        {(it.keyActions || []).length > 2 && (
                          <span className="text-[11px] text-slate-400">
                            +{it.keyActions.length - 2} more action(s)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {(it.recommendedTools || []).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-medium text-slate-700">
                      {it.displayOrder}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(it)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                          it.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {it.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(it)}
                          className="p-1 text-[#3c8dbc] hover:bg-blue-50 rounded transition"
                          title="Edit Stage"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(it)}
                          className="p-1 text-[#dd4b39] hover:bg-red-50 rounded transition"
                          title="Delete Stage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden my-8 animate-fadeIn text-[#333]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#f9fafc] border-b border-[#f4f4f4]">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  {editingItem ? `Edit Crop Guidance: Stage ${editingItem.stageNumber}` : 'Add New Crop Guidance Stage'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stage Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    required
                    value={stageNumber}
                    onChange={(e) => setStageNumber(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Crop Scope
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                  >
                    <option value="All Crops">All Crops (Universal)</option>
                    <option value="Paddy">Paddy (Rice)</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Arecanut">Arecanut</option>
                    <option value="Vegetables">Horticulture Vegetables</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stage Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage 1: Preparation of Soil"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deep Ploughing, Hardpan Shattering & Basal Conditioning"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary / Overview
                </label>
                <textarea
                  rows={2}
                  placeholder="Comprehensive agronomist summary of this stage..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                />
              </div>

              {/* Key Actions List */}
              <div className="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Key Actions & Farm Practices
                  </label>
                  <button
                    type="button"
                    onClick={addActionItem}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <Plus className="w-3 h-3" /> Add Action
                  </button>
                </div>

                <div className="space-y-1.5">
                  {keyActions.map((act, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 w-4 text-center">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder="Action description..."
                        value={act}
                        onChange={(e) => updateActionItem(idx, e.target.value)}
                        className="flex-1 h-7 px-2 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                      />
                      {keyActions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActionItem(idx)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Tools */}
              <div className="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Recommended Tools & Machinery
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {recommendedTools.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeToolTag(t)}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Multi-Speed Rotavator, 55HP 4WD Tractor..."
                    value={newToolInput}
                    onChange={(e) => setNewToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToolTag();
                      }
                    }}
                    className="flex-1 h-7 px-2 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={addToolTag}
                    className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Recommended Products & Inputs
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {recommendedProducts.map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {p}
                      <button
                        type="button"
                        onClick={() => removeProductTag(p)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. AgriPro Power Tiller 12HP, Neem Coated Urea..."
                    value={newProductInput}
                    onChange={(e) => setNewProductInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addProductTag();
                      }
                    }}
                    className="flex-1 h-7 px-2 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={addProductTag}
                    className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Is Active (visible on public /crop-guidance)
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded text-xs font-semibold shadow-xs transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Stage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Crop Guidance Stage"
          message={`Are you sure you want to delete Stage ${deleteTarget.stageNumber} ("${deleteTarget.title}")? This action cannot be undone.`}
          confirmLabel={deleting ? 'Deleting...' : 'Delete Stage'}
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
