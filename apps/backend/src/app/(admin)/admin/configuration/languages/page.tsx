'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Check,
  X,
  Minus,
  RefreshCw,
  Edit2,
  Trash2,
  Save,
  Info,
  Database,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface StringResource {
  id: string;
  name: string;
  value: string;
}

interface LanguageItem {
  id: string;
  name: string;
  flag: string;
  flagEmoji?: string;
  languageCulture: string;
  uniqueSeoCode: string;
  rightToLeft: boolean;
  defaultCurrency: string;
  limitedToStores?: string;
  displayOrder: number;
  published: boolean;
  resources?: StringResource[];
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

// Available Flag Options
const FLAG_OPTIONS = [
  { file: 'ad.png', emoji: '🇦🇩', label: 'ad.png' },
  { file: 'us.png', emoji: '🇺🇸', label: 'us.png' },
  { file: 'il.png', emoji: '🇮🇱', label: 'il.png' },
  { file: 'gb.png', emoji: '🇬🇧', label: 'gb.png' },
  { file: 'in.png', emoji: '🇮🇳', label: 'in.png' },
  { file: 'fr.png', emoji: '🇫🇷', label: 'fr.png' },
  { file: 'de.png', emoji: '🇩🇪', label: 'de.png' },
  { file: 'es.png', emoji: '🇪🇸', label: 'es.png' },
  { file: 'sa.png', emoji: '🇸🇦', label: 'sa.png' },
];

// Available Culture Options
const CULTURE_OPTIONS = [
  'Afar (Djibouti). aa-DJ',
  'English (United States). en-US',
  'English (United Kingdom). en-GB',
  'Hebrew (Israel). he-IL',
  'Spanish (Spain). es-ES',
  'French (France). fr-FR',
  'German (Germany). de-DE',
  'Hindi (India). hi-IN',
  'Arabic (Saudi Arabia). ar-SA',
  'Chinese (China). zh-CN',
  'Japanese (Japan). ja-JP',
  'Russian (Russia). ru-RU',
];

export default function LanguagesPage() {
  // View mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null);

  // List data state
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [infoOpen, setInfoOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const [formName, setFormName] = useState('');
  const [formLanguageCulture, setFormLanguageCulture] = useState('Afar (Djibouti). aa-DJ');
  const [formUniqueSeoCode, setFormUniqueSeoCode] = useState('');
  const [formFlag, setFormFlag] = useState('ad.png');
  const [formRightToLeft, setFormRightToLeft] = useState(false);
  const [formDefaultCurrency, setFormDefaultCurrency] = useState('---');
  const [formLimitedToStores, setFormLimitedToStores] = useState('');
  const [formPublished, setFormPublished] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number | string>(3);
  const [formResources, setFormResources] = useState<StringResource[]>([]);
  const [savingForm, setSavingForm] = useState(false);

  // Resource strings search & add
  const [resourceSearch, setResourceSearch] = useState('');
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceValue, setNewResourceValue] = useState('');

  // Fetch languages list
  const fetchLanguages = useCallback(async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/languages?page=${currentPage}&pageSize=${currentPageSize}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLanguages(json.data || []);
          setTotal(json.total || 0);
        }
      } else {
        showToast('Failed to load languages from server', 'error');
      }
    } catch {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Initial mount & URL detection
  useEffect(() => {
    fetchLanguages(page, pageSize);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      let editId = params.get('edit');
      const action = params.get('action');

      if (!editId) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        const last = segments[segments.length - 1];
        if (last && last !== 'languages' && last !== 'configuration' && last !== 'admin') {
          editId = last;
        }
      }

      if (editId) {
        fetch(`/api/admin/languages/${editId}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data) {
              handleOpenEdit(json.data, false);
            }
          })
          .catch(() => {});
      } else if (action === 'create') {
        handleOpenCreate(false);
      }
    }
  }, [page, pageSize, fetchLanguages]);

  // Open Create mode
  const handleOpenCreate = (updateUrl = true) => {
    setViewMode('create');
    setEditingLanguageId(null);
    setFormName('');
    setFormLanguageCulture('Afar (Djibouti). aa-DJ');
    setFormUniqueSeoCode('');
    setFormFlag('ad.png');
    setFormRightToLeft(false);
    setFormDefaultCurrency('---');
    setFormLimitedToStores('');
    setFormPublished(true);
    setFormDisplayOrder(3);
    setFormResources([]);
    if (updateUrl && typeof window !== 'undefined') {
      window.history.pushState(null, '', '?action=create');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Edit mode
  const handleOpenEdit = async (lang: LanguageItem, updateUrl = true) => {
    setViewMode('edit');
    setEditingLanguageId(lang.id);
    setFormName(lang.name || '');
    setFormLanguageCulture(
      CULTURE_OPTIONS.find((c) => c.includes(lang.languageCulture)) ||
        (lang.languageCulture ? `${lang.name}. ${lang.languageCulture}` : 'Afar (Djibouti). aa-DJ')
    );
    setFormUniqueSeoCode(lang.uniqueSeoCode || '');
    setFormFlag(lang.flag || 'ad.png');
    setFormRightToLeft(Boolean(lang.rightToLeft));
    setFormDefaultCurrency(lang.defaultCurrency || '---');
    setFormLimitedToStores(lang.limitedToStores || '');
    setFormPublished(lang.published ?? true);
    setFormDisplayOrder(lang.displayOrder ?? 1);
    setFormResources(lang.resources || []);

    if (updateUrl && typeof window !== 'undefined') {
      window.history.pushState(null, '', `?edit=${lang.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch full language details
    try {
      const res = await fetch(`/api/admin/languages/${lang.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFormResources(json.data.resources || []);
        }
      }
    } catch {
      // ignore
    }
  };

  // Back to list view
  const handleBackToList = () => {
    setViewMode('list');
    setEditingLanguageId(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.pathname);
    }
    fetchLanguages(page, pageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save language
  const handleSaveLanguage = async (continueEditing = false) => {
    if (!formName.trim()) {
      showToast('Language name is required.', 'error');
      return;
    }
    if (!formUniqueSeoCode.trim()) {
      showToast('Unique SEO code is required.', 'error');
      return;
    }

    setSavingForm(true);
    const flagObj = FLAG_OPTIONS.find((f) => f.file === formFlag);
    const cultureCode = formLanguageCulture.includes('.')
      ? formLanguageCulture.split('.').pop()?.trim() || formLanguageCulture
      : formLanguageCulture;

    const payload = {
      name: formName.trim(),
      languageCulture: cultureCode,
      uniqueSeoCode: formUniqueSeoCode.trim().toLowerCase(),
      flag: formFlag,
      flagEmoji: flagObj ? flagObj.emoji : '🌐',
      rightToLeft: formRightToLeft,
      defaultCurrency: formDefaultCurrency,
      limitedToStores: formLimitedToStores,
      published: formPublished,
      displayOrder: Number(formDisplayOrder) || 0,
      resources: formResources,
    };

    try {
      const isEdit = viewMode === 'edit' && editingLanguageId;
      const url = isEdit ? `/api/admin/languages/${editingLanguageId}` : '/api/admin/languages';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        showToast(isEdit ? 'Language updated successfully.' : 'New language added successfully.');
        if (!continueEditing) {
          handleBackToList();
        } else if (!isEdit && json.data?.id) {
          setEditingLanguageId(json.data.id);
          setViewMode('edit');
          if (typeof window !== 'undefined') {
            window.history.pushState(null, '', `?edit=${json.data.id}`);
          }
        }
      } else {
        showToast('Failed to save language.', 'error');
      }
    } catch {
      showToast('Error saving language to server.', 'error');
    } finally {
      setSavingForm(false);
    }
  };

  // Delete language
  const handleConfirmDeleteLanguage = async () => {
    if (!editingLanguageId) return;
    try {
      const res = await fetch(`/api/admin/languages/${editingLanguageId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Language deleted successfully.');
        setShowDeleteModal(false);
        handleBackToList();
      } else {
        showToast('Failed to delete language.', 'error');
      }
    } catch {
      showToast('Error deleting language.', 'error');
    }
  };

  // Add resource string
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceName.trim() || !newResourceValue.trim()) {
      showToast('Resource name and value are required.', 'error');
      return;
    }
    const newRes: StringResource = {
      id: String(Date.now()),
      name: newResourceName.trim(),
      value: newResourceValue.trim(),
    };
    setFormResources((prev) => [...prev, newRes]);
    setNewResourceName('');
    setNewResourceValue('');
    setShowAddResourceModal(false);
    showToast('String resource added. Click Save to persist changes.');
  };

  const handleDeleteResource = (id: string) => {
    setFormResources((prev) => prev.filter((r) => r.id !== id));
    showToast('String resource removed. Click Save to persist.');
  };

  const filteredResources = formResources.filter(
    (r) =>
      r.name.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.value.toLowerCase().includes(resourceSearch.toLowerCase())
  );

  // Helper flag renderer
  const getFlagVisual = (flagFile: string) => {
    if (flagFile === 'us.png') return <span className="text-base select-none">🇺🇸</span>;
    if (flagFile === 'il.png') return <span className="text-base select-none">🇮🇱</span>;
    if (flagFile === 'gb.png') return <span className="text-base select-none">🇬🇧</span>;
    if (flagFile === 'in.png') return <span className="text-base select-none">🇮🇳</span>;
    if (flagFile === 'ad.png') return <span className="text-base select-none">🇦🇩</span>;
    if (flagFile === 'fr.png') return <span className="text-base select-none">🇫🇷</span>;
    if (flagFile === 'de.png') return <span className="text-base select-none">🇩🇪</span>;
    if (flagFile === 'es.png') return <span className="text-base select-none">🇪🇸</span>;
    return <span className="text-base select-none">🌐</span>;
  };

  // =========================================================================
  // VIEW: ADD A NEW LANGUAGE / EDIT LANGUAGE (Matching media_1791436124588.png)
  // =========================================================================
  if (viewMode === 'create' || viewMode === 'edit') {
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

        {/* Delete Language Confirmation Modal */}
        {showDeleteModal && (
          <div
            onClick={() => setShowDeleteModal(false)}
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
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none cursor-pointer p-1"
                >
                  &times;
                </button>
              </div>
              <div className="px-6 py-6">
                <p className="text-sm text-slate-700">Are you sure you want to delete this language?</p>
              </div>
              <div className="flex items-center justify-end gap-2.5 px-6 pb-6 pt-2 bg-white">
                <button
                  type="button"
                  onClick={handleConfirmDeleteLanguage}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add String Resource Modal */}
        {showAddResourceModal && (
          <div
            onClick={() => setShowAddResourceModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded shadow-xl w-full max-w-[500px] border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-800">Add string resource</h3>
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none cursor-pointer p-1"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddResource} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Resource name *</label>
                  <input
                    type="text"
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    required
                    placeholder="e.g. Common.Save"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Value *</label>
                  <textarea
                    value={newResourceValue}
                    onChange={(e) => setNewResourceValue(e.target.value)}
                    required
                    rows={3}
                    placeholder="e.g. Save changes"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddResourceModal(false)}
                    className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded shadow-2xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Top Header Bar matching media_1791436124588.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-normal text-slate-800">
              {viewMode === 'edit' ? `Edit language details - ${formName || 'Language'}` : 'Add a new language'}
            </h1>
            <button
              type="button"
              onClick={handleBackToList}
              className="text-[#2489c5] hover:underline text-xs flex items-center gap-1 cursor-pointer font-normal pl-2"
            >
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#2489c5] text-white text-[9px] font-bold">
                &lsaquo;
              </span>
              <span>back to language list</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* 1. Save (Blue) */}
            <button
              type="button"
              onClick={() => handleSaveLanguage(false)}
              disabled={savingForm}
              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save
            </button>

            {/* 2. Save and Continue Edit (Blue) */}
            <button
              type="button"
              onClick={() => handleSaveLanguage(true)}
              disabled={savingForm}
              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save and Continue Edit
            </button>

            {/* 3. Delete (Red) - Visible in Edit mode */}
            {viewMode === 'edit' && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#dc3545] hover:bg-[#c82333] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* CARD 1: INFO (Collapsible, Cyan Top Border) */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setInfoOpen(!infoOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Info</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {infoOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {infoOpen && (
            <div className="p-6 space-y-4">
              {/* 1. Name * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Name</span>
                  <HelpTooltip text="The name of the language." />
                </div>
                <div className="md:col-span-9 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-xs select-none">*</span>
                </div>
              </div>

              {/* 2. Language culture */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Language culture</span>
                  <HelpTooltip text="The language culture code (e.g. en-US, en-GB, he-IL)." />
                </div>
                <div className="md:col-span-9">
                  <select
                    value={formLanguageCulture}
                    onChange={(e) => setFormLanguageCulture(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  >
                    {CULTURE_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Unique SEO code * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Unique SEO code</span>
                  <HelpTooltip text="The two or three letter language SEO code used in URLs (e.g. en, fr, de)." />
                </div>
                <div className="md:col-span-9 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formUniqueSeoCode}
                    onChange={(e) => setFormUniqueSeoCode(e.target.value.toLowerCase())}
                    placeholder="e.g. en"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-xs select-none">*</span>
                </div>
              </div>

              {/* 4. Flag image file name */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Flag image file name</span>
                  <HelpTooltip text="The flag image file name for this language." />
                </div>
                <div className="md:col-span-9">
                  <select
                    value={formFlag}
                    onChange={(e) => setFormFlag(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  >
                    {FLAG_OPTIONS.map((f) => (
                      <option key={f.file} value={f.file}>
                        {f.emoji} {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Right-to-left */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Right-to-left</span>
                  <HelpTooltip text="Check to set right-to-left alignment for the language (e.g. Arabic, Hebrew)." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={formRightToLeft}
                    onChange={(e) => setFormRightToLeft(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 6. Default currency */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Default currency</span>
                  <HelpTooltip text="The default currency for this language." />
                </div>
                <div className="md:col-span-9">
                  <select
                    value={formDefaultCurrency}
                    onChange={(e) => setFormDefaultCurrency(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  >
                    <option value="---">---</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* 8. Published */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Published</span>
                  <HelpTooltip text="Determines whether this language is published and active in the store." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 9. Display order */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Display order</span>
                  <HelpTooltip text="The display order of this language." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CARD 2: STRING RESOURCES (Collapsible) */}
        <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
          <div
            onClick={() => setResourcesOpen(!resourcesOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Database className="w-4 h-4 text-slate-500" />
              <span>String resources</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {resourcesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {resourcesOpen && (
            <div className="p-6 space-y-4">
              {viewMode === 'create' && !editingLanguageId ? (
                <div className="text-xs text-slate-500 italic py-2">
                  You need to save the language before you can add string resources for this language page.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Search and Add buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={resourceSearch}
                      onChange={(e) => setResourceSearch(e.target.value)}
                      className="w-full sm:w-64 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddResourceModal(true)}
                      className="inline-flex items-center justify-center px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add new record
                    </button>
                  </div>

                  {/* Resources Table */}
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                          <th className="py-2.5 px-4">Resource name</th>
                          <th className="py-2.5 px-4">Value</th>
                          <th className="py-2.5 px-4 w-20 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredResources.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-center py-6 text-slate-400">
                              No string resources found.
                            </td>
                          </tr>
                        ) : (
                          filteredResources.map((res) => (
                            <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-4 font-mono text-slate-800 text-[11px]">{res.name}</td>
                              <td className="py-2.5 px-4 text-slate-700">{res.value}</td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteResource(res.id)}
                                  className="text-red-500 hover:text-red-700 font-medium text-xs cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LANGUAGES LIST (Matching media_1791436122750.png)
  // =========================================================================
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

      {/* Header Bar matching media_1791436122750.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <h1 className="text-xl font-normal text-slate-800">Languages</h1>
        <div className="flex items-center gap-2">
          {/* Add new button (Blue) */}
          <button
            type="button"
            onClick={() => handleOpenCreate(true)}
            className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add new
          </button>
        </div>
      </div>

      {/* Subtitle link: Learn more about localization */}
      <div className="text-xs text-slate-600">
        <span>Learn more about </span>
        <a href="#learn-more" className="text-[#2489c5] hover:underline font-normal">
          localization
        </a>
      </div>

      {/* Languages Table Card */}
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
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 text-center w-24">Flag</th>
                <th className="py-3 px-4">Language culture</th>
                <th className="py-3 px-4 text-center w-32">Display order</th>
                <th className="py-3 px-4 text-center w-32">Published</th>
                <th className="py-3 px-4 text-center w-24">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {languages.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No languages found.
                  </td>
                </tr>
              ) : (
                languages.map((lang) => (
                  <tr key={lang.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-normal text-slate-800">{lang.name}</td>
                    <td className="py-3 px-4 text-center">{getFlagVisual(lang.flag)}</td>
                    <td className="py-3 px-4 text-slate-700">{lang.languageCulture}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{lang.displayOrder}</td>
                    <td className="py-3 px-4 text-center">
                      {lang.published ? (
                        <Check className="w-4 h-4 text-sky-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(lang, true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-slate-500" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching media_1791436122750.png */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-white">
          {/* Left: Previous, Page 1, Next */}
          <div className="flex items-center gap-1 order-2 sm:order-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2.5 py-1 bg-[#2489c5] text-white rounded font-medium shadow-2xs">
              {page}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / pageSize)}
              className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* Center: Show [ 15 v ] items */}
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>items</span>
          </div>

          {/* Right: Item range & Refresh button */}
          <div className="flex items-center gap-3 order-3">
            <span className="text-slate-500 text-[11px]">
              {total > 0 ? `1-${languages.length} of ${total} items` : '0 items'}
            </span>
            <button
              type="button"
              onClick={() => fetchLanguages(page, pageSize)}
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
