'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Check,
  X,
  RefreshCw,
  Settings,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';

interface TaxProviderItem {
  id: string;
  friendlyName: string;
  systemName: string;
  isPrimary: boolean;
  displayOrder: number;
  config?: Record<string, any>;
}

export default function TaxProvidersPage() {
  const [providers, setProviders] = useState<TaxProviderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(15);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Configure modal state
  const [configuringProvider, setConfiguringProvider] = useState<TaxProviderItem | null>(null);
  const [fixedRate, setFixedRate] = useState<number | string>(10);
  const [calculationType, setCalculationType] = useState('FixedRate');
  const [avataxAccountId, setAvataxAccountId] = useState('');
  const [avataxLicenseKey, setAvataxLicenseKey] = useState('');
  const [avataxCompanyCode, setAvataxCompanyCode] = useState('');
  const [avataxSandbox, setAvataxSandbox] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  // Fetch tax providers
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tax-providers');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProviders(json.data || []);
        }
      } else {
        showToast('Failed to load tax providers from server', 'error');
      }
    } catch {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Mark as primary provider
  const handleMarkAsPrimary = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tax-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setPrimary',
          id,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        showToast(json.message || 'Primary tax provider updated successfully.');
        fetchProviders();
      } else {
        showToast('Failed to update primary tax provider.', 'error');
      }
    } catch {
      showToast('Error updating primary tax provider.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open configure modal
  const handleOpenConfigure = (provider: TaxProviderItem) => {
    setConfiguringProvider(provider);
    if (provider.systemName === 'Tax.FixedOrByCountryStateZip') {
      setFixedRate(provider.config?.taxRatePercentage ?? 10);
      setCalculationType(provider.config?.calculationType ?? 'FixedRate');
    } else if (provider.systemName === 'Tax.Avalara') {
      setAvataxAccountId(provider.config?.accountId ?? '');
      setAvataxLicenseKey(provider.config?.licenseKey ?? '');
      setAvataxCompanyCode(provider.config?.companyCode ?? '');
      setAvataxSandbox(provider.config?.sandbox ?? true);
    }
  };

  // Save configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringProvider) return;

    setSavingConfig(true);
    let newConfig = {};

    if (configuringProvider.systemName === 'Tax.FixedOrByCountryStateZip') {
      newConfig = {
        taxRatePercentage: Number(fixedRate) || 0,
        calculationType,
      };
    } else if (configuringProvider.systemName === 'Tax.Avalara') {
      newConfig = {
        accountId: avataxAccountId,
        licenseKey: avataxLicenseKey,
        companyCode: avataxCompanyCode,
        sandbox: avataxSandbox,
      };
    }

    try {
      const res = await fetch('/api/admin/tax-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'configure',
          id: configuringProvider.id,
          config: newConfig,
        }),
      });

      if (res.ok) {
        showToast('Tax provider configured successfully.');
        setConfiguringProvider(null);
        fetchProviders();
      } else {
        showToast('Failed to save configuration.', 'error');
      }
    } catch {
      showToast('Error saving configuration.', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

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

      {/* Configure Provider Modal */}
      {configuringProvider && (
        <div
          onClick={() => setConfiguringProvider(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded shadow-xl w-full max-w-[550px] border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configure - {configuringProvider.friendlyName}</span>
              </h3>
              <button
                type="button"
                onClick={() => setConfiguringProvider(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
              {configuringProvider.systemName === 'Tax.FixedOrByCountryStateZip' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Calculation method
                    </label>
                    <select
                      value={calculationType}
                      onChange={(e) => setCalculationType(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    >
                      <option value="FixedRate">Fixed tax rate percentage</option>
                      <option value="ByCountryStateZip">Tax by Country / State / Zip</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tax rate percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={fixedRate}
                      onChange={(e) => setFixedRate(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Account ID
                    </label>
                    <input
                      type="text"
                      value={avataxAccountId}
                      onChange={(e) => setAvataxAccountId(e.target.value)}
                      placeholder="e.g. 1100012345"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      License key
                    </label>
                    <input
                      type="password"
                      value={avataxLicenseKey}
                      onChange={(e) => setAvataxLicenseKey(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Company code
                    </label>
                    <input
                      type="text"
                      value={avataxCompanyCode}
                      onChange={(e) => setAvataxCompanyCode(e.target.value)}
                      placeholder="DEFAULT"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="avatax_sandbox"
                      checked={avataxSandbox}
                      onChange={(e) => setAvataxSandbox(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="avatax_sandbox" className="text-xs text-slate-700 cursor-pointer">
                      Use sandbox environment (testing)
                    </label>
                  </div>
                </>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfiguringProvider(null)}
                  className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded shadow-2xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingConfig ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Bar matching media_1791437069265.png */}
      <div className="pb-1">
        <h1 className="text-xl font-normal text-slate-800">Tax providers</h1>
      </div>

      {/* Subtitle link: Learn more about tax providers. You can download more plugins in our marketplace */}
      <div className="text-xs text-slate-600">
        <span>Learn more about </span>
        <a href="#tax-providers" className="text-[#2489c5] hover:underline font-normal">
          tax providers
        </a>
        <span>. You can download more plugins in our </span>
        <a href="#marketplace" className="text-[#2489c5] hover:underline font-normal">
          marketplace
        </a>
      </div>

      {/* Main Table Card matching media_1791437069265.png */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto min-h-[160px] relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-10">
              <RefreshCw className="w-7 h-7 text-slate-700 animate-spin" />
              <span className="text-xs text-slate-600 font-medium">Loading...</span>
            </div>
          )}

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                <th className="py-3 px-4">Friendly name</th>
                <th className="py-3 px-4">System name</th>
                <th className="py-3 px-4 text-center w-36">Is primary provider</th>
                <th className="py-3 px-4 text-center w-48">Mark as primary provider</th>
                <th className="py-3 px-4 text-center w-28">Configure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No tax providers configured.
                  </td>
                </tr>
              ) : (
                providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-normal text-slate-800">{p.friendlyName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{p.systemName}</td>
                    <td className="py-3 px-4 text-center">
                      {p.isPrimary ? (
                        <Check className="w-4 h-4 text-sky-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {p.isPrimary ? (
                        <span className="text-slate-400 text-xs italic select-none">Primary</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMarkAsPrimary(p.id)}
                          className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs transition-colors shadow-2xs cursor-pointer"
                        >
                          Mark as primary provider
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenConfigure(p)}
                        className="px-3 py-1 bg-[#2489c5] hover:bg-[#207ba5] text-white rounded text-xs transition-colors shadow-2xs cursor-pointer"
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching media_1791437069265.png */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-white">
          {/* Left: Show [ 15 v ] items */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>items</span>
          </div>

          {/* Right: Refresh Button matching media_1791437069265.png */}
          <div>
            <button
              type="button"
              onClick={fetchProviders}
              className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
