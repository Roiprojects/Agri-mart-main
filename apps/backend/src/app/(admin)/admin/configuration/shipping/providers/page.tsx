'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Settings,
  Edit2,
  Save,
} from 'lucide-react';

interface ShippingProviderItem {
  id: string;
  friendlyName: string;
  systemName: string;
  displayOrder: number;
  isActive: boolean;
  config?: Record<string, any>;
}

export default function ShippingProvidersPage() {
  const [providers, setProviders] = useState<ShippingProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<number | string>(0);
  const [editIsActive, setEditIsActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  // Configure modal state
  const [configuringProvider, setConfiguringProvider] = useState<ShippingProviderItem | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);

  // Config form states
  const [manualCalcType, setManualCalcType] = useState('FixedRate');
  const [manualFixedRate, setManualFixedRate] = useState<number | string>(15);
  const [manualFreeThreshold, setManualFreeThreshold] = useState<number | string>(500);
  const [manualHandlingCharge, setManualHandlingCharge] = useState<number | string>(5);

  const [upsAccount, setUpsAccount] = useState('');
  const [upsAccessKey, setUpsAccessKey] = useState('');
  const [upsUsername, setUpsUsername] = useState('');
  const [upsPassword, setUpsPassword] = useState('');
  const [upsSandbox, setUpsSandbox] = useState(true);

  const [fleetRatePerKm, setFleetRatePerKm] = useState<number | string>(12.5);
  const [fleetMaxRadius, setFleetMaxRadius] = useState<number | string>(150);
  const [fleetSurcharge, setFleetSurcharge] = useState<number | string>(100);

  const [byTotalBase, setByTotalBase] = useState<number | string>(20);
  const [byTotalPercent, setByTotalPercent] = useState<number | string>(2.5);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch shipping providers
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shipping-providers');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProviders(json.data || []);
        }
      } else {
        showToast('Failed to load shipping providers from server.', 'error');
      }
    } catch {
      showToast('Error connecting to server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Start inline editing
  const startEdit = (provider: ShippingProviderItem) => {
    setEditingId(provider.id);
    setEditOrder(provider.displayOrder);
    setEditIsActive(provider.isActive);
  };

  // Cancel inline editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditOrder(0);
    setEditIsActive(true);
  };

  // Save inline edit
  const handleSaveEdit = async (id: string) => {
    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/shipping-providers', {
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
        showToast(json.message || 'The shipping provider has been updated successfully.');
        setEditingId(null);
        fetchProviders();
      } else {
        showToast(json.message || 'Failed to update shipping provider.', 'error');
      }
    } catch {
      showToast('Error updating shipping provider.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Open Configure Modal
  const handleOpenConfigure = (provider: ShippingProviderItem) => {
    setConfiguringProvider(provider);
    const cfg = provider.config || {};

    if (provider.systemName === 'Shipping.FixedByWeightByTotal') {
      setManualCalcType(cfg.calculationType || 'FixedRate');
      setManualFixedRate(cfg.fixedRate ?? 15);
      setManualFreeThreshold(cfg.freeShippingOver ?? 500);
      setManualHandlingCharge(cfg.additionalHandlingCharge ?? 5);
    } else if (provider.systemName === 'Shipping.UPS') {
      setUpsAccount(cfg.accountNumber || '');
      setUpsAccessKey(cfg.accessKey || '');
      setUpsUsername(cfg.username || '');
      setUpsPassword(cfg.password || '');
      setUpsSandbox(cfg.useSandbox ?? true);
    } else if (provider.systemName === 'Shipping.AgriMartFleet') {
      setFleetRatePerKm(cfg.baseRatePerKm ?? 12.5);
      setFleetMaxRadius(cfg.maxRadiusKm ?? 150);
      setFleetSurcharge(cfg.bulkMachinerySurcharge ?? 100);
    } else {
      setByTotalBase(cfg.baseRate ?? 20);
      setByTotalPercent(cfg.percentageFee ?? 2.5);
    }
  };

  // Save Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringProvider) return;

    setSavingConfig(true);
    let newConfig: Record<string, any> = {};

    if (configuringProvider.systemName === 'Shipping.FixedByWeightByTotal') {
      newConfig = {
        calculationType: manualCalcType,
        fixedRate: parseFloat(String(manualFixedRate)) || 0,
        freeShippingOver: parseFloat(String(manualFreeThreshold)) || 0,
        additionalHandlingCharge: parseFloat(String(manualHandlingCharge)) || 0,
      };
    } else if (configuringProvider.systemName === 'Shipping.UPS') {
      newConfig = {
        accountNumber: upsAccount.trim(),
        accessKey: upsAccessKey.trim(),
        username: upsUsername.trim(),
        password: upsPassword.trim(),
        useSandbox: upsSandbox,
      };
    } else if (configuringProvider.systemName === 'Shipping.AgriMartFleet') {
      newConfig = {
        baseRatePerKm: parseFloat(String(fleetRatePerKm)) || 0,
        maxRadiusKm: parseFloat(String(fleetMaxRadius)) || 0,
        bulkMachinerySurcharge: parseFloat(String(fleetSurcharge)) || 0,
      };
    } else {
      newConfig = {
        baseRate: parseFloat(String(byTotalBase)) || 0,
        percentageFee: parseFloat(String(byTotalPercent)) || 0,
      };
    }

    try {
      const res = await fetch('/api/admin/shipping-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveConfig',
          id: configuringProvider.id,
          config: newConfig,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Configuration saved successfully.');
        setConfiguringProvider(null);
        fetchProviders();
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

      {/* Configure Provider Modal */}
      {configuringProvider && (
        <div
          onClick={() => setConfiguringProvider(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded shadow-xl w-full max-w-[550px] border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configure - {configuringProvider.friendlyName}</span>
              </h3>
              <button
                type="button"
                onClick={() => setConfiguringProvider(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
              {configuringProvider.systemName === 'Shipping.FixedByWeightByTotal' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Computation method
                    </label>
                    <select
                      value={manualCalcType}
                      onChange={(e) => setManualCalcType(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    >
                      <option value="FixedRate">Fixed rate calculation</option>
                      <option value="ByWeight">Shipping by package weight</option>
                      <option value="ByTotal">Shipping by order subtotal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Fixed shipping rate ($/₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={manualFixedRate}
                      onChange={(e) => setManualFixedRate(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Free shipping threshold ($/₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={manualFreeThreshold}
                      onChange={(e) => setManualFreeThreshold(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Additional handling charge ($/₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={manualHandlingCharge}
                      onChange={(e) => setManualHandlingCharge(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </>
              )}

              {configuringProvider.systemName === 'Shipping.UPS' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      UPS Account Number
                    </label>
                    <input
                      type="text"
                      value={upsAccount}
                      onChange={(e) => setUpsAccount(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Access Key / Client ID
                    </label>
                    <input
                      type="text"
                      value={upsAccessKey}
                      onChange={(e) => setUpsAccessKey(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Username / Client Secret
                    </label>
                    <input
                      type="text"
                      value={upsUsername}
                      onChange={(e) => setUpsUsername(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={upsPassword}
                      onChange={(e) => setUpsPassword(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="upsSandbox"
                      checked={upsSandbox}
                      onChange={(e) => setUpsSandbox(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <label htmlFor="upsSandbox" className="text-xs text-slate-700">
                      Use sandbox / testing environment
                    </label>
                  </div>
                </>
              )}

              {configuringProvider.systemName === 'Shipping.AgriMartFleet' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Base Rate per Km (₹)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={fleetRatePerKm}
                      onChange={(e) => setFleetRatePerKm(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Maximum Service Radius (Km)
                    </label>
                    <input
                      type="number"
                      value={fleetMaxRadius}
                      onChange={(e) => setFleetMaxRadius(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Heavy Machinery & Tractor Surcharge (₹)
                    </label>
                    <input
                      type="number"
                      value={fleetSurcharge}
                      onChange={(e) => setFleetSurcharge(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </>
              )}

              {configuringProvider.systemName === 'Shipping.ByTotal' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Base Rate ($/₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={byTotalBase}
                      onChange={(e) => setByTotalBase(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Percentage Fee (% of order total)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={byTotalPercent}
                      onChange={(e) => setByTotalPercent(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </>
              )}

              {/* Modal Footer */}
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
                  onClick={() => setConfiguringProvider(null)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Title matching media_1791438865658.png */}
      <div className="pb-1">
        <h1 className="text-xl font-normal text-slate-800">
          Shipping rate computation methods (providers)
        </h1>
      </div>

      {/* Main Card matching media_1791438865658.png */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        {/* Subtitle link banner matching reference */}
        <div className="p-4 border-b border-slate-100 text-xs text-slate-600">
          Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/shipping-settings/shipping-providers.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2489c5] hover:underline"
          >
            shipping providers
          </a>
          . You can download more plugins in our{' '}
          <a
            href="https://www.nopcommerce.com/marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2489c5] hover:underline"
          >
            marketplace
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
                <th className="py-3 px-4 w-[28%]">Friendly name</th>
                <th className="py-3 px-4 w-[28%]">System name</th>
                <th className="py-3 px-4 w-[12%] text-center">Display order</th>
                <th className="py-3 px-4 w-[10%] text-center">Is active</th>
                <th className="py-3 px-4 w-[11%] text-center">Configure</th>
                <th className="py-3 px-4 w-[11%] text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No shipping providers found.
                  </td>
                </tr>
              ) : (
                providers.map((p) => {
                  const isEditing = editingId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      {/* Friendly Name */}
                      <td className="py-3 px-4 text-slate-800 font-normal">
                        {p.friendlyName}
                      </td>

                      {/* System Name */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {p.systemName}
                      </td>

                      {/* Display Order */}
                      <td className="py-3 px-4 text-center text-slate-700 font-normal">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editOrder}
                            onChange={(e) => setEditOrder(e.target.value)}
                            className="w-20 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs mx-auto"
                          />
                        ) : (
                          <span>{p.displayOrder}</span>
                        )}
                      </td>

                      {/* Is Active */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={editIsActive}
                            onChange={(e) => setEditIsActive(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                        ) : p.isActive ? (
                          <Check className="w-4 h-4 text-sky-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 mx-auto" />
                        )}
                      </td>

                      {/* Configure Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          disabled={isEditing}
                          onClick={() => handleOpenConfigure(p)}
                          className="inline-flex items-center justify-center px-3 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-40 text-white text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                        >
                          Configure
                        </button>
                      </td>

                      {/* Edit Button */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              disabled={savingEdit}
                              onClick={() => handleSaveEdit(p.id)}
                              className="inline-flex items-center justify-center px-2.5 py-1 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="inline-flex items-center justify-center px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
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

        {/* Table Footer Controls matching media_1791438865658.png */}
        <div className="px-4 py-3 bg-[#fafafa] border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          {/* Left: Show [ 15 v ] items */}
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

          {/* Right: Items counter and Refresh button */}
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs">
              1 - {providers.length} of {providers.length} items
            </span>
            <button
              type="button"
              onClick={fetchProviders}
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
