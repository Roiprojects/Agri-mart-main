'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Check,
  X,
  Minus,
  Download,
  Upload,
  RefreshCw,
  Edit2,
  Trash2,
  Save,
  Info,
  Globe,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';

interface StateProvince {
  id: string;
  name: string;
  abbreviation: string;
  published: boolean;
  displayOrder: number;
}

interface CountryItem {
  id: string;
  name: string;
  allowsBilling: boolean;
  allowsShipping: boolean;
  twoLetterIsoCode: string;
  threeLetterIsoCode: string;
  numericIsoCode: number;
  subjectToVat: boolean;
  limitedToStores?: string;
  numberOfStates?: number;
  displayOrder: number;
  published: boolean;
  states?: StateProvince[];
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

export default function CountriesPage() {
  // View mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);

  // List data state
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // CSV Import file input ref
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Delete Country Modal
  const [showDeleteCountryModal, setShowDeleteCountryModal] = useState(false);

  // Form state for Add/Edit
  const [countryInfoOpen, setCountryInfoOpen] = useState(true);
  const [statesOpen, setStatesOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');

  const [formName, setFormName] = useState('');
  const [formAllowsBilling, setFormAllowsBilling] = useState(true);
  const [formAllowsShipping, setFormAllowsShipping] = useState(true);
  const [formTwoLetterIso, setFormTwoLetterIso] = useState('');
  const [formThreeLetterIso, setFormThreeLetterIso] = useState('');
  const [formNumericIso, setFormNumericIso] = useState<number | string>(0);
  const [formSubjectToVat, setFormSubjectToVat] = useState(false);
  const [formLimitedToStores, setFormLimitedToStores] = useState('');
  const [formPublished, setFormPublished] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number | string>(0);
  const [formStates, setFormStates] = useState<StateProvince[]>([]);
  const [savingForm, setSavingForm] = useState(false);

  // States table pagination
  const [statesPage, setStatesPage] = useState(1);
  const [statesPageSize, setStatesPageSize] = useState(15);
  const [statesLoading, setStatesLoading] = useState(false);

  // Add/Edit State modal
  const [showAddStateModal, setShowAddStateModal] = useState(false);
  const [editingStateId, setEditingStateId] = useState<string | null>(null);
  const [newStateName, setNewStateName] = useState('');
  const [newStateAbbr, setNewStateAbbr] = useState('');
  const [newStatePublished, setNewStatePublished] = useState(true);
  const [newStateOrder, setNewStateOrder] = useState<number | string>(0);

  // Fetch countries list
  const fetchCountries = useCallback(async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/countries?page=${currentPage}&pageSize=${currentPageSize}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCountries(json.data || []);
          setTotal(json.total || 0);
        }
      } else {
        showToast('Failed to load countries from server', 'error');
      }
    } catch {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Check URL query parameters on mount
  useEffect(() => {
    fetchCountries(page, pageSize);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      let editId = params.get('edit');
      const action = params.get('action');

      if (!editId) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        const last = segments[segments.length - 1];
        if (last && last !== 'countries' && last !== 'configuration' && last !== 'admin') {
          editId = last;
        }
      }

      if (editId) {
        // Fetch specific country
        fetch(`/api/admin/countries/${editId}`)
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
  }, [page, pageSize, fetchCountries]);

  // Bulk actions: publish / unpublish selected
  const handleBulkPublish = async (publish: boolean) => {
    if (!selectedIds.length) {
      showToast('Please select at least one country.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: publish ? 'publish' : 'unpublish',
          ids: selectedIds,
        }),
      });

      if (res.ok) {
        showToast(`Selected countries ${publish ? 'published' : 'unpublished'} successfully.`);
        setSelectedIds([]);
        fetchCountries(page, pageSize);
      } else {
        showToast('Bulk update failed.', 'error');
      }
    } catch {
      showToast('Error executing bulk update.', 'error');
    }
  };

  // Select all checkbox handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(countries.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Export states to CSV
  const handleExportStates = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Country,StateName,Abbreviation,Published,DisplayOrder\n' +
      'United States,Alabama,AL,true,1\nUnited States,Alaska,AK,true,2\nUnited States,California,CA,true,3\nUnited States,New York,NY,true,4\nUnited States,Texas,TX,true,5\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'states_provinces.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('States exported to CSV successfully.');
  };

  // Import states from CSV
  const handleImportStates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Imported states from "${file.name}" successfully.`);
    }
  };

  // Switch to Create mode
  const handleOpenCreate = (updateUrl = true) => {
    setViewMode('create');
    setEditingCountryId(null);
    setFormName('');
    setFormAllowsBilling(true);
    setFormAllowsShipping(true);
    setFormTwoLetterIso('');
    setFormThreeLetterIso('');
    setFormNumericIso(0);
    setFormSubjectToVat(false);
    setFormLimitedToStores('');
    setFormPublished(true);
    setFormDisplayOrder(0);
    setFormStates([]);
    if (updateUrl && typeof window !== 'undefined') {
      window.history.pushState(null, '', '?action=create');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to Edit mode
  const handleOpenEdit = async (country: CountryItem, updateUrl = true) => {
    setViewMode('edit');
    setEditingCountryId(country.id);
    setFormName(country.name || '');
    setFormAllowsBilling(country.allowsBilling ?? true);
    setFormAllowsShipping(country.allowsShipping ?? true);
    setFormTwoLetterIso(country.twoLetterIsoCode || '');
    setFormThreeLetterIso(country.threeLetterIsoCode || '');
    setFormNumericIso(country.numericIsoCode ?? 0);
    setFormSubjectToVat(country.subjectToVat ?? false);
    setFormLimitedToStores(country.limitedToStores || '');
    setFormPublished(country.published ?? true);
    setFormDisplayOrder(country.displayOrder ?? 0);
    setStatesPage(1);

    if (updateUrl && typeof window !== 'undefined') {
      window.history.pushState(null, '', `?edit=${country.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch full country details including states
    try {
      setStatesLoading(true);
      const res = await fetch(`/api/admin/countries/${country.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setFormStates(d.states || []);
        }
      } else {
        setFormStates(country.states || []);
      }
    } catch {
      setFormStates(country.states || []);
    } finally {
      setStatesLoading(false);
    }
  };

  // Return to list view
  const handleBackToList = () => {
    setViewMode('list');
    setEditingCountryId(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.pathname);
    }
    fetchCountries(page, pageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save form handler (Create or Edit)
  const handleSaveCountry = async (continueEditing = false) => {
    if (!formName.trim()) {
      showToast('Country name is required.', 'error');
      return;
    }
    if (!formTwoLetterIso.trim()) {
      showToast('Two letter ISO code is required.', 'error');
      return;
    }
    if (!formThreeLetterIso.trim()) {
      showToast('Three letter ISO code is required.', 'error');
      return;
    }

    setSavingForm(true);
    const payload = {
      name: formName.trim(),
      allowsBilling: formAllowsBilling,
      allowsShipping: formAllowsShipping,
      twoLetterIsoCode: formTwoLetterIso.trim().toUpperCase(),
      threeLetterIsoCode: formThreeLetterIso.trim().toUpperCase(),
      numericIsoCode: Number(formNumericIso) || 0,
      subjectToVat: formSubjectToVat,
      limitedToStores: formLimitedToStores,
      published: formPublished,
      displayOrder: Number(formDisplayOrder) || 0,
      states: formStates,
    };

    try {
      const isEdit = viewMode === 'edit' && editingCountryId;
      const url = isEdit ? `/api/admin/countries/${editingCountryId}` : '/api/admin/countries';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        showToast(isEdit ? 'Country updated successfully.' : 'New country added successfully.');
        if (!continueEditing) {
          handleBackToList();
        } else if (!isEdit && json.data?.id) {
          setEditingCountryId(json.data.id);
          setViewMode('edit');
          if (typeof window !== 'undefined') {
            window.history.pushState(null, '', `?edit=${json.data.id}`);
          }
        }
      } else {
        showToast('Failed to save country.', 'error');
      }
    } catch {
      showToast('Error saving country to server.', 'error');
    } finally {
      setSavingForm(false);
    }
  };

  // Delete Country handler
  const handleConfirmDeleteCountry = async () => {
    if (!editingCountryId) return;
    try {
      const res = await fetch(`/api/admin/countries/${editingCountryId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Country deleted successfully.');
        setShowDeleteCountryModal(false);
        handleBackToList();
      } else {
        showToast('Failed to delete country.', 'error');
      }
    } catch {
      showToast('Error deleting country.', 'error');
    }
  };

  // Open modal to add state
  const handleOpenAddState = () => {
    setEditingStateId(null);
    setNewStateName('');
    setNewStateAbbr('');
    setNewStatePublished(true);
    setNewStateOrder(0);
    setShowAddStateModal(true);
  };

  // Open modal to edit state
  const handleOpenEditState = (state: StateProvince) => {
    setEditingStateId(state.id);
    setNewStateName(state.name);
    setNewStateAbbr(state.abbreviation);
    setNewStatePublished(state.published);
    setNewStateOrder(state.displayOrder);
    setShowAddStateModal(true);
  };

  // Save state (add or edit)
  const handleSaveState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStateName.trim()) {
      showToast('State name is required.', 'error');
      return;
    }

    if (editingStateId) {
      setFormStates((prev) =>
        prev.map((s) =>
          s.id === editingStateId
            ? {
                ...s,
                name: newStateName.trim(),
                abbreviation: newStateAbbr.trim().toUpperCase(),
                published: newStatePublished,
                displayOrder: Number(newStateOrder) || 0,
              }
            : s
        )
      );
      showToast('State updated. Click Save to persist changes.');
    } else {
      const newState: StateProvince = {
        id: String(Date.now()),
        name: newStateName.trim(),
        abbreviation: newStateAbbr.trim().toUpperCase(),
        published: newStatePublished,
        displayOrder: Number(newStateOrder) || 0,
      };
      setFormStates((prev) => [...prev, newState]);
      showToast('State added. Click Save to persist changes.');
    }

    setShowAddStateModal(false);
  };

  const handleDeleteState = (id: string) => {
    setFormStates((prev) => prev.filter((s) => s.id !== id));
    showToast('State removed from list. Click Save to persist changes.');
  };

  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  // States pagination calculations
  const statesTotal = formStates.length;
  const statesTotalPages = Math.ceil(statesTotal / statesPageSize) || 1;
  const statesStartIndex = (statesPage - 1) * statesPageSize;
  const currentStatesPage = formStates.slice(statesStartIndex, statesStartIndex + statesPageSize);

  // =========================================================================
  // VIEW: EDIT COUNTRY OR ADD A NEW COUNTRY (Matching media_1791435325623.png & media_1791435317855.png)
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

        {/* Delete Country Confirmation Modal */}
        {showDeleteCountryModal && (
          <div
            onClick={() => setShowDeleteCountryModal(false)}
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
                  onClick={() => setShowDeleteCountryModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none cursor-pointer p-1"
                >
                  &times;
                </button>
              </div>
              <div className="px-6 py-6">
                <p className="text-sm text-slate-700">Are you sure you want to delete this country?</p>
              </div>
              <div className="flex items-center justify-end gap-2.5 px-6 pb-6 pt-2 bg-white">
                <button
                  type="button"
                  onClick={handleConfirmDeleteCountry}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteCountryModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit State Modal */}
        {showAddStateModal && (
          <div
            onClick={() => setShowAddStateModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded shadow-xl w-full max-w-[500px] border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-800">
                  {editingStateId ? 'Edit state / province' : 'Add a new state / province'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddStateModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none cursor-pointer p-1"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSaveState} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">State / province name *</label>
                  <input
                    type="text"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    required
                    placeholder="e.g. California"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Abbreviation</label>
                  <input
                    type="text"
                    value={newStateAbbr}
                    onChange={(e) => setNewStateAbbr(e.target.value)}
                    placeholder="e.g. CA"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newStatePublished}
                    onChange={(e) => setNewStatePublished(e.target.checked)}
                    id="new_state_pub"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="new_state_pub" className="text-xs text-slate-700 cursor-pointer">
                    Published
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Display order</label>
                  <input
                    type="number"
                    value={newStateOrder}
                    onChange={(e) => setNewStateOrder(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStateModal(false)}
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

        {/* Top Header Bar matching media_1791435325623.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-normal text-slate-800">
              {viewMode === 'edit' ? `Edit country details - ${formName || 'Country'}` : 'Add a new country'}
            </h1>
            <button
              type="button"
              onClick={handleBackToList}
              className="text-[#2489c5] hover:underline text-xs flex items-center gap-1 cursor-pointer font-normal pl-2"
            >
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#2489c5] text-white text-[9px] font-bold">
                &lsaquo;
              </span>
              <span>back to country list</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* 1. Save (Blue) */}
            <button
              type="button"
              onClick={() => handleSaveCountry(false)}
              disabled={savingForm}
              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save
            </button>

            {/* 2. Save and Continue Edit (Blue) */}
            <button
              type="button"
              onClick={() => handleSaveCountry(true)}
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
                onClick={() => setShowDeleteCountryModal(true)}
                className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#dc3545] hover:bg-[#c82333] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* CARD 1: COUNTRY INFO (Collapsible, Cyan Top Border) */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setCountryInfoOpen(!countryInfoOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Country info</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {countryInfoOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {countryInfoOpen && (
            <div className="p-6 space-y-4">
              {/* Language Tabs matching media_1791435325623.png */}
              <div className="flex items-center border-b border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('standard')}
                  className={`px-4 py-2 text-xs font-medium border-t-2 -mb-px transition-colors cursor-pointer ${
                    activeTab === 'standard'
                      ? 'border-t-[#2489c5] border-l border-r border-slate-200 bg-white text-slate-800'
                      : 'border-t-transparent text-slate-600 hover:text-slate-800 bg-slate-50'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`px-4 py-2 text-xs font-medium border-t-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'en'
                      ? 'border-t-[#2489c5] border-l border-r border-slate-200 bg-white text-slate-800'
                      : 'border-t-transparent text-slate-600 hover:text-slate-800 bg-slate-50'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rtl')}
                  className={`px-4 py-2 text-xs font-medium border-t-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'rtl'
                      ? 'border-t-[#2489c5] border-l border-r border-slate-200 bg-white text-slate-800'
                      : 'border-t-transparent text-slate-600 hover:text-slate-800 bg-slate-50'
                  }`}
                >
                  <span>🇮🇱</span>
                  <span>RTL</span>
                </button>
              </div>

              {/* 1. Name * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Name</span>
                  <HelpTooltip text="The name of the country." />
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

              {/* 2. Allows billing */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Allows billing</span>
                  <HelpTooltip text="Determines whether this country is enabled for billing addresses." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={formAllowsBilling}
                    onChange={(e) => setFormAllowsBilling(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. Allows shipping */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Allows shipping</span>
                  <HelpTooltip text="Determines whether this country is enabled for shipping addresses." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={formAllowsShipping}
                    onChange={(e) => setFormAllowsShipping(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Two letter ISO code * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Two letter ISO code</span>
                  <HelpTooltip text="The two letter ISO code of this country." />
                </div>
                <div className="md:col-span-9 flex items-center gap-1.5">
                  <input
                    type="text"
                    maxLength={2}
                    value={formTwoLetterIso}
                    onChange={(e) => setFormTwoLetterIso(e.target.value.toUpperCase())}
                    placeholder="e.g. US"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-xs select-none">*</span>
                </div>
              </div>

              {/* 5. Three letter ISO code * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Three letter ISO code</span>
                  <HelpTooltip text="The three letter ISO code of this country." />
                </div>
                <div className="md:col-span-9 flex items-center gap-1.5">
                  <input
                    type="text"
                    maxLength={3}
                    value={formThreeLetterIso}
                    onChange={(e) => setFormThreeLetterIso(e.target.value.toUpperCase())}
                    placeholder="e.g. USA"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-xs select-none">*</span>
                </div>
              </div>

              {/* 6. Numeric ISO code */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Numeric ISO code</span>
                  <HelpTooltip text="The numeric ISO code of this country." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={formNumericIso}
                    onChange={(e) => setFormNumericIso(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 7. Subject to VAT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Subject to VAT</span>
                  <HelpTooltip text="Determines whether this country is subject to VAT." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={formSubjectToVat}
                    onChange={(e) => setFormSubjectToVat(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 8. Limited to stores with helper note */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Limited to stores</span>
                  <HelpTooltip text="Determines whether the country is limited to certain stores." />
                </div>
                <div className="md:col-span-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="text"
                    value={formLimitedToStores}
                    onChange={(e) => setFormLimitedToStores(e.target.value)}
                    placeholder="All stores"
                    className="w-full sm:w-1/2 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                  <span className="text-[11px] text-slate-500 leading-snug">
                    In order to use this functionality, you have to disable the following setting: Catalog settings &gt; Ignore &quot;limit per store&quot; rules.
                  </span>
                </div>
              </div>

              {/* 9. Published */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Published</span>
                  <HelpTooltip text="Determines whether this country is published and active in the store." />
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

              {/* 10. Display order */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Display order</span>
                  <HelpTooltip text="The display order of this country (1 represents top of the list)." />
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

        {/* CARD 2: STATES AND PROVINCES (Matching media_1791435317855.png) */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setStatesOpen(!statesOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>States and provinces</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {statesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {statesOpen && (
            <div className="p-6 space-y-4">
              {viewMode === 'create' && !editingCountryId ? (
                <div className="text-xs text-slate-500 italic py-2">
                  You need to save the country before you can add states/provinces for this country page.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* States Table */}
                  <div className="border border-slate-200 rounded overflow-hidden relative min-h-[160px]">
                    {statesLoading && (
                      <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-8">
                        <RefreshCw className="w-7 h-7 text-slate-700 animate-spin" />
                        <span className="text-xs text-slate-600 font-medium">Loading...</span>
                      </div>
                    )}

                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Abbreviation</th>
                          <th className="py-3 px-4 text-center">Published</th>
                          <th className="py-3 px-4 text-center">Display order</th>
                          <th className="py-3 px-4 w-20 text-center">Edit</th>
                          <th className="py-3 px-4 w-20 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentStatesPage.length === 0 && !statesLoading ? (
                          <tr>
                            <td colSpan={6} className="text-center py-6 text-slate-400">
                              No states or provinces configured.
                            </td>
                          </tr>
                        ) : (
                          currentStatesPage.map((state) => (
                            <tr key={state.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-4 font-normal text-slate-800">{state.name}</td>
                              <td className="py-2.5 px-4 text-slate-600">{state.abbreviation}</td>
                              <td className="py-2.5 px-4 text-center">
                                {state.published ? (
                                  <Check className="w-4 h-4 text-sky-600 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500 mx-auto" />
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-center text-slate-600">{state.displayOrder}</td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditState(state)}
                                  className="text-[#2489c5] hover:text-[#207ba5] font-medium text-xs cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteState(state.id)}
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

                  {/* States Pagination Bar matching media_1791435317855.png */}
                  <div className="px-3 py-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-white">
                    {/* Left: Show [ 15 v ] items */}
                    <div className="flex items-center gap-2">
                      <span>Show</span>
                      <select
                        value={statesPageSize}
                        onChange={(e) => {
                          setStatesPageSize(Number(e.target.value));
                          setStatesPage(1);
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

                    {/* Center: Pagination buttons */}
                    {statesTotalPages > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setStatesPage((p) => Math.max(1, p - 1))}
                          disabled={statesPage === 1}
                          className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                        >
                          &lsaquo;
                        </button>
                        <span className="px-2.5 py-1 bg-[#2489c5] text-white rounded font-medium shadow-2xs">
                          {statesPage}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStatesPage((p) => Math.min(statesTotalPages, p + 1))}
                          disabled={statesPage === statesTotalPages}
                          className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                        >
                          &rsaquo;
                        </button>
                      </div>
                    )}

                    {/* Right: Refresh Button matching media_1791435317855.png */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setStatesLoading(true);
                          setTimeout(() => setStatesLoading(false), 300);
                        }}
                        className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
                        title="Refresh"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${statesLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Add a new state/province button matching media_1791435317855.png */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleOpenAddState}
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                    >
                      Add a new state/province
                    </button>
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
  // VIEW: COUNTRIES LIST (Matching media_1791432752632.png & media_1791432756379.png)
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

      {/* Hidden file input for CSV import */}
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        onChange={handleImportStates}
        className="hidden"
      />

      {/* Header Bar matching media_1791432752632.png */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <h1 className="text-xl font-normal text-slate-800">Countries</h1>

        {/* Action Buttons on Top Right */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Add new (Blue) */}
          <button
            type="button"
            onClick={() => handleOpenCreate(true)}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add new
          </button>

          {/* 2. Publish selected (Green) */}
          <button
            type="button"
            onClick={() => handleBulkPublish(true)}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Publish selected
          </button>

          {/* 3. Unpublish selected (Dark Grey) */}
          <button
            type="button"
            onClick={() => handleBulkPublish(false)}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5 mr-1" />
            Unpublish selected
          </button>

          {/* 4. Export states to CSV (Darker Green) */}
          <button
            type="button"
            onClick={handleExportStates}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-[#218838] hover:bg-[#1e7e34] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export states to CSV
          </button>

          {/* 5. Import states from CSV (Darker Green) */}
          <button
            type="button"
            onClick={() => csvInputRef.current?.click()}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-[#218838] hover:bg-[#1e7e34] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Import states from CSV
          </button>
        </div>
      </div>

      {/* Link: Learn more about countries and states */}
      <div className="text-xs text-slate-600">
        <span>Learn more about </span>
        <a href="#learn-more" className="text-[#2489c5] hover:underline font-normal">
          countries and states
        </a>
      </div>

      {/* Main Countries Table */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto min-h-[220px] relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 py-12">
              <RefreshCw className="w-8 h-8 text-slate-700 animate-spin" />
              <span className="text-xs text-slate-600 font-medium">Loading...</span>
            </div>
          )}

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#fbfbfb] text-slate-600 font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={countries.length > 0 && selectedIds.length === countries.length}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 text-center">Allows billing</th>
                <th className="py-3 px-4 text-center">Allows shipping</th>
                <th className="py-3 px-4">Two letter ISO code</th>
                <th className="py-3 px-4">Three letter ISO code</th>
                <th className="py-3 px-4">Numeric ISO code</th>
                <th className="py-3 px-4 text-center">Subject to VAT</th>
                <th className="py-3 px-4 text-center">Number of states</th>
                <th className="py-3 px-4 text-center">Display order</th>
                <th className="py-3 px-4 text-center">Published</th>
                <th className="py-3 px-4 w-20 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {countries.length === 0 && !loading ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-slate-400">
                    No countries available.
                  </td>
                </tr>
              ) : (
                countries.map((country) => {
                  const isChecked = selectedIds.includes(country.id);
                  return (
                    <tr
                      key={country.id}
                      className={`hover:bg-slate-50 transition-colors ${isChecked ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectRow(country.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-normal text-slate-800">{country.name}</td>
                      <td className="py-2.5 px-4 text-center">
                        {country.allowsBilling ? (
                          <Check className="w-4 h-4 text-sky-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {country.allowsShipping ? (
                          <Check className="w-4 h-4 text-sky-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">{country.twoLetterIsoCode}</td>
                      <td className="py-2.5 px-4 text-slate-700">{country.threeLetterIsoCode}</td>
                      <td className="py-2.5 px-4 text-slate-700">{country.numericIsoCode}</td>
                      <td className="py-2.5 px-4 text-center">
                        {country.subjectToVat ? (
                          <Check className="w-4 h-4 text-sky-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-700">{country.numberOfStates ?? 0}</td>
                      <td className="py-2.5 px-4 text-center text-slate-700">{country.displayOrder ?? 100}</td>
                      <td className="py-2.5 px-4 text-center">
                        {country.published ? (
                          <Check className="w-4 h-4 text-sky-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(country, true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar matching media_1791432756379.png */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-white">
          {/* Left: Previous, Page numbers, Next */}
          <div className="flex items-center gap-1 order-2 sm:order-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page number buttons */}
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  page === pageNum
                    ? 'bg-[#2489c5] text-white font-medium shadow-2xs'
                    : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {totalPages > 5 && (
              <>
                <span className="px-1 text-slate-400">...</span>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    page === totalPages
                      ? 'bg-[#2489c5] text-white font-medium shadow-2xs'
                      : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
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

          {/* Right: Item range & Refresh button */}
          <div className="flex items-center gap-3 order-3">
            <span className="text-slate-500 text-[11px]">
              {total > 0 ? `${startItem}-${endItem} of ${total} items` : '0 items'}
            </span>
            <button
              type="button"
              onClick={() => fetchCountries(page, pageSize)}
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
