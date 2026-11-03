'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Edit2,
  Trash2,
  Check,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface SettingItem {
  id: string;
  name: string;
  value: string;
  store: string;
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

export default function AllSettingsPage() {
  // Search state
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Table state
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editStore, setEditStore] = useState('All');

  // Add new record state
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newStore, setNewStore] = useState('All');
  const [adding, setAdding] = useState(false);

  // Delete confirmation modal
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch settings from API
  const fetchSettings = useCallback(
    async (currentPage = page, currentPageSize = pageSize, name = searchName, val = searchValue) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(currentPage),
          pageSize: String(currentPageSize),
        });
        if (name.trim()) queryParams.set('name', name.trim());
        if (val.trim()) queryParams.set('value', val.trim());

        const res = await fetch(`/api/admin/settings/all?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            const visibleSettings = (json.data || []).filter(
              (s: SettingItem) =>
                !s.name?.toLowerCase().startsWith('forumsettings.') &&
                !s.name?.toLowerCase().startsWith('pollsettings.')
            );
            setSettings(visibleSettings);
            setTotal(json.total || 0);
          }
        } else {
          showToast('Failed to load settings from server', 'error');
        }
      } catch (err) {
        console.error('Failed to fetch all settings:', err);
        showToast('Error connecting to settings server', 'error');
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchName, searchValue]
  );

  useEffect(() => {
    fetchSettings(page, pageSize);
  }, [page, pageSize, fetchSettings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSettings(1, pageSize, searchName, searchValue);
  };

  // Inline edit handlers
  const handleStartEdit = (setting: SettingItem) => {
    setEditingId(setting.id);
    setEditValue(setting.value);
    setEditStore(setting.store);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch('/api/admin/settings/all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          value: editValue,
          store: editStore,
        }),
      });

      if (res.ok) {
        showToast('Setting updated successfully.');
        setEditingId(null);
        fetchSettings(page, pageSize);
      } else {
        showToast('Failed to update setting.', 'error');
      }
    } catch {
      showToast('Error saving setting changes.', 'error');
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/settings/all?id=${deletingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Setting deleted successfully.');
        setDeletingId(null);
        fetchSettings(page, pageSize);
      } else {
        showToast('Failed to delete setting.', 'error');
      }
    } catch {
      showToast('Error deleting setting.', 'error');
    }
  };

  // Add new record handler
  const handleAddNewRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Please provide a setting name.', 'error');
      return;
    }

    setAdding(true);
    try {
      const res = await fetch('/api/admin/settings/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          value: newValue,
          store: newStore,
        }),
      });

      if (res.ok) {
        showToast('New setting record added successfully.');
        setNewName('');
        setNewValue('');
        setNewStore('All');
        fetchSettings(1, pageSize);
      } else {
        const json = await res.json();
        showToast(json.message || 'Failed to add new record.', 'error');
      }
    } catch {
      showToast('Error adding new record.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-sm text-white transition-all transform duration-300 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div
          onClick={() => setDeletingId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded shadow-xl w-full max-w-[500px] border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-xl font-normal text-slate-800">Are you sure?</h3>
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none cursor-pointer p-1"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm text-slate-700">Are you sure you want to delete this setting record?</p>
            </div>
            <div className="flex items-center justify-end gap-2.5 px-6 pb-6 pt-2 bg-white">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar matching Reference: Title */}
      <div className="pb-1">
        <h1 className="text-xl font-normal text-slate-800">All settings (advanced)</h1>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: SEARCH (Matching media_1791370336703.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {searchOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Name</span>
                  <HelpTooltip text="A setting name to search for." />
                </div>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Right Column: Value */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Value</span>
                  <HelpTooltip text="A setting value to search for." />
                </div>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Centered Search Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 mr-1.5" />
                Search
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: SETTINGS GRID / TABLE (Matching media_1791370336703.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
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
                <th className="py-3 px-4">Setting name</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Store</th>
                <th className="py-3 px-4 w-20 text-center">Edit</th>
                <th className="py-3 px-4 w-20 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No data available in table
                  </td>
                </tr>
              ) : (
                settings.map((setting) => {
                  const isEditing = editingId === setting.id;
                  return (
                    <tr key={setting.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-slate-800 text-[11px]">
                        {setting.name}
                      </td>
                      <td className="py-2.5 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full border border-blue-400 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs bg-white"
                          />
                        ) : (
                          <span className="text-slate-700 max-w-md block truncate" title={setting.value}>
                            {setting.value}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {isEditing ? (
                          <select
                            value={editStore}
                            onChange={(e) => setEditStore(e.target.value)}
                            className="border border-blue-400 rounded px-2 py-1 text-xs text-slate-800 bg-white"
                          >
                            <option value="All">All</option>
                            <option value="Main Store">Main Store</option>
                          </select>
                        ) : (
                          <span className="text-slate-600">{setting.store || 'All'}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(setting.id)}
                              className="text-emerald-600 hover:text-emerald-700 p-1 cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(setting)}
                            className="text-[#2489c5] hover:text-[#207ba5] font-medium text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setDeletingId(setting.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar matching Reference */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-white">
          {/* Left: Show items per page */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                setPage(1);
              }}
              className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>items</span>
          </div>

          {/* Center: Pagination numbers & Range */}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[11px]">
              {total > 0 ? `${startItem} - ${endItem} of ${total} items` : '0 items'}
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  &laquo;
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  &lsaquo;
                </button>
                <span className="px-2.5 py-1 bg-[#2489c5] text-white rounded font-medium shadow-2xs">
                  {page}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  &rsaquo;
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  &raquo;
                </button>
              </div>
            )}
          </div>

          {/* Right: Refresh Button */}
          <div>
            <button
              type="button"
              onClick={() => fetchSettings(page, pageSize)}
              className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: ADD NEW RECORD (Matching media_1791370336703.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-white border-b border-slate-100">
          <h2 className="text-slate-800 font-semibold text-sm">Add new record</h2>
        </div>

        <form onSubmit={handleAddNewRecord} className="p-6 space-y-4">
          {/* Setting name */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
              <span>Setting name</span>
              <HelpTooltip text="The name of the setting." />
            </div>
            <div className="md:col-span-9">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. catalogsettings.customsetting"
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Value */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
              <span>Value</span>
              <HelpTooltip text="The value of the setting." />
            </div>
            <div className="md:col-span-9">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Store */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
              <span>Store</span>
              <HelpTooltip text="The store for which the setting is defined." />
            </div>
            <div className="md:col-span-9">
              <select
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
              >
                <option value="All">All</option>
                <option value="Main Store">Main Store</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4">
            <div className="md:col-start-4 md:col-span-9 pt-2">
              <button
                type="submit"
                disabled={adding}
                className="inline-flex items-center justify-center px-4 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
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
