'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Check,
  X,
  Settings,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ExternalAuthItem {
  id: string;
  friendlyName: string;
  systemName: string;
  displayOrder: number;
  isActive: boolean;
  config?: Record<string, any>;
}

export default function ExternalAuthenticationPage() {
  const [methods, setMethods] = useState<ExternalAuthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<number | string>(0);
  const [editIsActive, setEditIsActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  // Configure modal state
  const [configuringMethod, setConfiguringMethod] = useState<ExternalAuthItem | null>(null);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch methods
  const fetchMethods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/authentication/external');
      const json = await res.json();
      if (json.success) {
        setMethods(json.data || []);
      }
    } catch {
      showToast('Error loading authentication methods', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  // Start inline editing
  const startEdit = (m: ExternalAuthItem) => {
    setEditingId(m.id);
    setEditOrder(m.displayOrder);
    setEditIsActive(m.isActive);
  };

  // Save inline edit
  const handleSaveEdit = async (id: string) => {
    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/authentication/external', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          displayOrder: parseInt(String(editOrder), 10) || 0,
          isActive: editIsActive,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Authentication method updated successfully.');
        setEditingId(null);
        fetchMethods();
      } else {
        showToast(json.message || 'Failed to update method.', 'error');
      }
    } catch {
      showToast('Error updating method.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Open Configure Modal
  const handleOpenConfigure = (m: ExternalAuthItem) => {
    setConfiguringMethod(m);
    const cfg = m.config || {};
    setClientId(cfg.clientId || cfg.appId || cfg.serviceId || '');
    setClientSecret(cfg.clientSecret || cfg.appSecret || '');
  };

  // Save Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringMethod) return;

    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/authentication/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveConfig',
          id: configuringMethod.id,
          config: {
            clientId: clientId.trim(),
            clientSecret: clientSecret.trim(),
          },
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Configuration saved successfully.');
        setConfiguringMethod(null);
        fetchMethods();
      } else {
        showToast(json.message || 'Failed to save configuration.', 'error');
      }
    } catch {
      showToast('Error saving configuration.', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="space-y-4 pb-16 bg-[#f4f6f9] min-h-[calc(100vh-60px)] -m-6 p-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded shadow-lg text-xs font-medium transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-[#28a745] text-white' : 'bg-[#dc3545] text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Configure Modal */}
      {configuringMethod && (
        <div
          onClick={() => setConfiguringMethod(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded shadow-xl w-full max-w-[550px] border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configure - {configuringMethod.friendlyName}</span>
              </h3>
              <button
                type="button"
                onClick={() => setConfiguringMethod(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Client ID / App ID
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="e.g. 123456789.apps.googleusercontent.com"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Client Secret / App Secret
                </label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                >
                  {savingConfig ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfiguringMethod(null)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div className="pb-1">
        <h1 className="text-xl font-normal text-slate-800">External authentication methods</h1>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
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
                <th className="py-3 px-4 w-[28%]">Friendly name</th>
                <th className="py-3 px-4 w-[28%]">System name</th>
                <th className="py-3 px-4 w-[12%] text-center">Display order</th>
                <th className="py-3 px-4 w-[10%] text-center">Is active</th>
                <th className="py-3 px-4 w-[11%] text-center">Configure</th>
                <th className="py-3 px-4 w-[11%] text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {methods.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No external authentication methods found.
                  </td>
                </tr>
              ) : (
                methods.map((m) => {
                  const isEditing = editingId === m.id;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-800 font-normal">{m.friendlyName}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{m.systemName}</td>
                      <td className="py-3 px-4 text-center text-slate-700 font-normal">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editOrder}
                            onChange={(e) => setEditOrder(e.target.value)}
                            className="w-20 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs mx-auto"
                          />
                        ) : (
                          <span>{m.displayOrder}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={editIsActive}
                            onChange={(e) => setEditIsActive(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                        ) : m.isActive ? (
                          <Check className="w-4 h-4 text-sky-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          disabled={isEditing}
                          onClick={() => handleOpenConfigure(m)}
                          className="inline-flex items-center justify-center px-3 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-40 text-white text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                        >
                          Configure
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              disabled={savingEdit}
                              onClick={() => handleSaveEdit(m.id)}
                              className="inline-flex items-center justify-center px-2.5 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center justify-center px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(m)}
                            className="inline-flex items-center justify-center px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                          >
                            Edit
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

        {/* Table Footer */}
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
            </select>
            <span>items</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs">
              1 - {methods.length} of {methods.length} items
            </span>
            <button
              type="button"
              onClick={fetchMethods}
              title="Refresh"
              className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
