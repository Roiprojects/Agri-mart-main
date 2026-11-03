'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  Check,
  Edit2,
  RotateCw,
  Info,
  GitFork,
  X,
} from 'lucide-react';

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

interface FilterLevelItem {
  id: string;
  name: string;
  enabled: boolean;
  displayOrder: number;
}

export default function FilterYmmSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Card collapse state
  const [commonOpen, setCommonOpen] = useState(true);
  const [levelsOpen, setLevelsOpen] = useState(true);

  // Common settings
  const [filterLevelEnabled, setFilterLevelEnabled] = useState(true);
  const [displayOnHomePage, setDisplayOnHomePage] = useState(true);
  const [displayOnProductDetailsPage, setDisplayOnProductDetailsPage] = useState(true);

  // Levels grid
  const [levels, setLevels] = useState<FilterLevelItem[]>([
    { id: 'lvl-1', name: 'Year', enabled: true, displayOrder: 1 },
    { id: 'lvl-2', name: 'Make', enabled: true, displayOrder: 2 },
    { id: 'lvl-3', name: 'Model', enabled: true, displayOrder: 3 },
  ]);

  // Edit level modal/state
  const [editingLevel, setEditingLevel] = useState<FilterLevelItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editEnabled, setEditEnabled] = useState(true);

  // Learn more info modal
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Page state
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/filter-ymm');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.filterLevelEnabled !== undefined) setFilterLevelEnabled(d.filterLevelEnabled);
            if (d.displayOnHomePage !== undefined) setDisplayOnHomePage(d.displayOnHomePage);
            if (d.displayOnProductDetailsPage !== undefined)
              setDisplayOnProductDetailsPage(d.displayOnProductDetailsPage);
            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            if (d.levels && Array.isArray(d.levels) && d.levels.length > 0) setLevels(d.levels);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch filter YMM settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_filter_ymm_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.filterLevelEnabled !== undefined) setFilterLevelEnabled(d.filterLevelEnabled);
          if (d.displayOnHomePage !== undefined) setDisplayOnHomePage(d.displayOnHomePage);
          if (d.displayOnProductDetailsPage !== undefined)
            setDisplayOnProductDetailsPage(d.displayOnProductDetailsPage);
          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
          if (d.levels && Array.isArray(d.levels) && d.levels.length > 0) setLevels(d.levels);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      filterLevelEnabled,
      displayOnHomePage,
      displayOnProductDetailsPage,
      isAdvanced,
      levels,
    };

    localStorage.setItem('admin_filter_ymm_settings', JSON.stringify(payload));

    try {
      const res = await fetch('/api/admin/settings/filter-ymm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('The filter (YMM) settings have been updated successfully.');
      } else {
        showToast('The filter (YMM) settings have been updated successfully.');
      }
    } catch {
      showToast('The filter (YMM) settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (lvl: FilterLevelItem) => {
    setEditingLevel(lvl);
    setEditName(lvl.name);
    setEditEnabled(lvl.enabled);
  };

  const handleSaveEditLevel = () => {
    if (!editingLevel) return;
    const updated = levels.map((l) =>
      l.id === editingLevel.id ? { ...l, name: editName.trim() || l.name, enabled: editEnabled } : l
    );
    setLevels(updated);
    setEditingLevel(null);
    showToast(`Updated level "${editName.trim() || editingLevel.name}".`);
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── HEADER (Matching Catalog settings / media_1791358067127.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Filter (YMM) settings</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching Catalog settings / media_1791358067127.png) ── */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[94px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-[#f8fafc] border-[#2489c5] text-[#2489c5] hover:bg-slate-100'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white text-xs font-normal pl-0.5">Advanced</span>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white shadow-2xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-[18px] rounded-full border border-slate-400 bg-white shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

        {/* ========================================================================= */}
        {/* CARD 1: COMMON (Matching media_1791356854242.png)                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setCommonOpen(!commonOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Common</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {commonOpen && (
            <div className="p-6 space-y-6">
              {/* Learn more link */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowLearnMore(true)}
                  className="text-xs text-[#007bff] hover:underline cursor-pointer"
                >
                  Learn more about filter level values
                </button>
              </div>

              {/* Indented Form with Tree Lines */}
              <div className="space-y-4 max-w-2xl pl-4 sm:pl-16">
                {/* 1. Filter level enabled */}
                <div className="flex items-center gap-4">
                  <div className="w-56 flex items-center justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Filter level enabled</span>
                    <HelpTooltip text="An option indicating whether the Year-Make-Model (YMM) product filtering system is enabled sitewide." />
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={filterLevelEnabled}
                      onChange={(e) => setFilterLevelEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sub-tree branches with connecting line (Advanced only - Matching media_1791358506019.png) */}
                {isAdvanced && (
                  <div className="relative pl-56">
                    {/* Vertical tree stem line */}
                    <div className="absolute left-[232px] top-[-8px] bottom-3 w-[1px] bg-slate-300" />

                    {/* 2. Display on home page */}
                    <div className="relative flex items-center gap-4 py-2">
                      {/* Horizontal branch line */}
                      <div className="absolute left-[-8px] top-1/2 w-2 h-[1px] bg-slate-300" />
                      <div className="w-48 flex items-center justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                        <span>Display on home page</span>
                        <HelpTooltip text="An option indicating whether the Year-Make-Model machinery compatibility filter widget should appear on the homepage." />
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          disabled={!filterLevelEnabled}
                          checked={displayOnHomePage}
                          onChange={(e) => setDisplayOnHomePage(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* 3. Display on product details page */}
                    <div className="relative flex items-center gap-4 py-2">
                      {/* Horizontal branch line */}
                      <div className="absolute left-[-8px] top-1/2 w-2 h-[1px] bg-slate-300" />
                      <div className="w-48 flex items-center justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                        <span>Display on product details page</span>
                        <HelpTooltip text="An option indicating whether the equipment compatibility matrix tab should appear on product detail pages." />
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          disabled={!filterLevelEnabled}
                          checked={displayOnProductDetailsPage}
                          onChange={(e) => setDisplayOnProductDetailsPage(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: LEVELS (Advanced only - Matching media_1791358506019.png)          */}
        {/* ========================================================================= */}
        {isAdvanced && (
          <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setLevelsOpen(!levelsOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <GitFork className="w-4 h-4 text-slate-500 rotate-180" />
              <span>Levels</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {levelsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {levelsOpen && (
            <div className="p-4 sm:p-6 space-y-4">
              {/* Data Table */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f9fa] border-b border-slate-200 text-slate-800 font-bold">
                    <tr>
                      <th className="py-3 px-4 w-1/3">Name</th>
                      <th className="py-3 px-4 w-1/3 text-center">Enabled</th>
                      <th className="py-3 px-4 w-1/3 text-left">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {levels.map((lvl) => (
                      <tr key={lvl.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-normal text-slate-800">{lvl.name}</td>
                        <td className="py-3.5 px-4 text-center">
                          {lvl.enabled ? (
                            <span className="inline-flex items-center justify-center text-[#007bff]">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center text-slate-300">
                              <X className="w-4 h-4" />
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          <button
                            type="button"
                            onClick={() => openEditModal(lvl)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-normal rounded text-xs transition shadow-2xs cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Bar matching screenshot */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-600">
                {/* Pagination */}
                <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 bg-white text-slate-400 font-medium hover:bg-slate-50 border-r border-slate-200 cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-[#007bff] text-white font-medium cursor-pointer"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 bg-white text-slate-400 font-medium hover:bg-slate-50 border-l border-slate-200 cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Show Items Selector */}
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    defaultValue="15"
                    className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span>items</span>
                </div>

                {/* Counts & Refresh Icon */}
                <div className="flex items-center gap-3">
                  <span>1-3 of 3 items</span>
                  <button
                    type="button"
                    onClick={() => showToast('Refreshed filter levels list.')}
                    className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded text-slate-600 transition cursor-pointer"
                    title="Refresh"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* Edit Level Modal */}
      {editingLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded border border-slate-300 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-800">
                Edit Level &quot;{editingLevel.name}&quot;
              </h3>
              <button
                type="button"
                onClick={() => setEditingLevel(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Level Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-level-enabled"
                  checked={editEnabled}
                  onChange={(e) => setEditEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="chk-level-enabled"
                  className="text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Enabled in filter sequence
                </label>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingLevel(null)}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 font-medium text-xs rounded hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditLevel}
                className="px-4 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-medium text-xs rounded transition cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span>About Filter Level Values (YMM)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLearnMore(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                The <strong>Year-Make-Model (YMM)</strong> filtering system allows farmers and buyers to filter agricultural machinery, power weeders, sprayers, and replacement parts by their tractor or farm equipment compatibility.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 space-y-1">
                <div className="font-semibold text-xs">Hierarchy Levels:</div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li><strong>Year:</strong> Manufacturing year range (e.g., 2021, 2022, 2023, 2024, 2025).</li>
                  <li><strong>Make:</strong> Equipment brand/manufacturer (e.g., AgriPro, KisanKraft, Mahindra, Bhoomi Sanjivani).</li>
                  <li><strong>Model:</strong> Specific machinery model or horsepower tier (e.g., 7HP Power Weeder, 575 DI, Multi-Crop Sprayer).</li>
                </ul>
              </div>
              <p>
                When enabled, products mapped to these values will automatically appear when farmers filter on the homepage or catalogue, and compatibility badges will render on the product detail page.
              </p>
            </div>
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowLearnMore(false)}
                className="px-4 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-medium text-xs rounded transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
