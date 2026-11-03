'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Settings,
  MapPin,
  Plus,
  Trash2,
  Building2,
  Clock,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

interface PickupPointProviderItem {
  id: string;
  friendlyName: string;
  systemName: string;
  displayOrder: number;
  isActive: boolean;
  pointsCount?: number;
  config?: Record<string, any>;
}

interface PickupLocationItem {
  id: string;
  providerId: string;
  name: string;
  description: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  zipPostalCode: string;
  openingHours: string;
  pickupFee: number;
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

export default function PickupPointsPage() {
  const [providers, setProviders] = useState<PickupPointProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<number | string>(0);
  const [editIsActive, setEditIsActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  // Add New Provider Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingProvider, setAddingProvider] = useState(false);
  const [newForm, setNewForm] = useState({
    friendlyName: '',
    systemName: '',
    displayOrder: 5,
    isActive: true,
    pickupFee: 0,
    openingHours: 'Mon-Sat 8:00 AM - 8:00 PM',
    allowSelectDate: true,
    displayOnMap: true,
    locationName: '',
    address1: '',
    city: 'Hubballi',
    state: 'Karnataka',
    zipPostalCode: '580020',
  });

  // Delete Provider Modal state
  const [deletingProvider, setDeletingProvider] = useState<PickupPointProviderItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Configure Modal state
  const [configuringProvider, setConfiguringProvider] = useState<PickupPointProviderItem | null>(null);
  const [providerLocations, setProviderLocations] = useState<PickupLocationItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Configure form fields
  const [cfgPickupFee, setCfgPickupFee] = useState<number | string>(0);
  const [cfgAllowSelectDate, setCfgAllowSelectDate] = useState(true);
  const [cfgDisplayOnMap, setCfgDisplayOnMap] = useState(true);
  const [cfgOpeningHours, setCfgOpeningHours] = useState('08:00 AM - 08:00 PM');

  // Add location sub-form inside configure modal
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [locName, setLocName] = useState('');
  const [locDesc, setLocDesc] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [locCity, setLocCity] = useState('Hubballi');
  const [locState, setLocState] = useState('Karnataka');
  const [locPincode, setLocPincode] = useState('580020');
  const [locHours, setLocHours] = useState('Mon-Sat 8:00 AM - 8:00 PM');
  const [locFee, setLocFee] = useState<number | string>(0);
  const [addingLoc, setAddingLoc] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch providers
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pickup-points');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProviders(json.data || []);
        }
      } else {
        showToast('Failed to load pickup point providers from server.', 'error');
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

  // Fetch locations for configuring provider
  const fetchLocations = async (providerId: string) => {
    setLoadingLocations(true);
    try {
      const res = await fetch(`/api/admin/pickup-points?type=locations&providerId=${providerId}`);
      const json = await res.json();
      if (json.success) {
        setProviderLocations(json.data || []);
      }
    } catch {
      console.error('Failed to load locations');
    } finally {
      setLoadingLocations(false);
    }
  };

  // Open Add Modal with smart defaults
  const handleOpenAdd = () => {
    const nextOrder = providers.length > 0 ? Math.max(...providers.map((p) => p.displayOrder || 0)) + 1 : 1;
    setNewForm({
      friendlyName: '',
      systemName: '',
      displayOrder: nextOrder,
      isActive: true,
      pickupFee: 0,
      openingHours: 'Mon-Sat 8:00 AM - 8:00 PM',
      allowSelectDate: true,
      displayOnMap: true,
      locationName: '',
      address1: '',
      city: 'Hubballi',
      state: 'Karnataka',
      zipPostalCode: '580020',
    });
    setShowAddModal(true);
  };

  // Auto-generate system name when friendly name changes
  const handleFriendlyNameChange = (val: string) => {
    const cleanSystem = 'Shipping.Pickup' + val.replace(/[^a-zA-Z0-9]/g, '');
    setNewForm((prev) => ({
      ...prev,
      friendlyName: val,
      systemName: prev.systemName ? prev.systemName : cleanSystem,
      locationName: prev.locationName ? prev.locationName : (val ? `${val} Primary Counter` : ''),
    }));
  };

  // Handle Add New Provider Submission
  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.friendlyName.trim()) {
      showToast('Friendly name is required.', 'error');
      return;
    }
    if (!newForm.systemName.trim()) {
      showToast('System name is required.', 'error');
      return;
    }

    setAddingProvider(true);
    try {
      const payload: any = {
        friendlyName: newForm.friendlyName.trim(),
        systemName: newForm.systemName.trim(),
        displayOrder: parseInt(String(newForm.displayOrder), 10) || 1,
        isActive: newForm.isActive,
        config: {
          pickupFee: parseFloat(String(newForm.pickupFee)) || 0,
          allowCustomerToSelectDate: newForm.allowSelectDate,
          displayOnMap: newForm.displayOnMap,
          defaultOpeningHours: newForm.openingHours,
        },
      };

      if (newForm.locationName.trim()) {
        payload.initialLocation = {
          name: newForm.locationName.trim(),
          address1: newForm.address1.trim(),
          city: newForm.city.trim(),
          state: newForm.state.trim(),
          country: 'India',
          zipPostalCode: newForm.zipPostalCode.trim(),
          openingHours: newForm.openingHours.trim(),
          pickupFee: parseFloat(String(newForm.pickupFee)) || 0,
        };
      }

      const res = await fetch('/api/admin/pickup-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'New pickup point provider has been added successfully.');
        setShowAddModal(false);
        fetchProviders();
      } else {
        showToast(json.message || 'Failed to add provider.', 'error');
      }
    } catch {
      showToast('Error adding provider.', 'error');
    } finally {
      setAddingProvider(false);
    }
  };

  // Start inline editing
  const startEdit = (provider: PickupPointProviderItem) => {
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
      const res = await fetch('/api/admin/pickup-points', {
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
        showToast(json.message || 'Pickup point provider updated successfully.');
        setEditingId(null);
        fetchProviders();
      } else {
        showToast(json.message || 'Failed to update provider.', 'error');
      }
    } catch {
      showToast('Error updating provider.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Provider
  const handleConfirmDelete = async () => {
    if (!deletingProvider) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/pickup-points?id=${encodeURIComponent(deletingProvider.id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Pickup point provider deleted successfully.');
        setDeletingProvider(null);
        fetchProviders();
      } else {
        showToast(json.message || 'Failed to delete provider.', 'error');
      }
    } catch {
      showToast('Error deleting provider.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Configure Modal
  const handleOpenConfigure = (provider: PickupPointProviderItem) => {
    setConfiguringProvider(provider);
    const cfg = provider.config || {};
    setCfgPickupFee(cfg.pickupFee ?? 0);
    setCfgAllowSelectDate(cfg.allowCustomerToSelectDate ?? true);
    setCfgDisplayOnMap(cfg.displayOnMap ?? true);
    setCfgOpeningHours(cfg.defaultOpeningHours || '08:00 AM - 08:00 PM');
    setShowAddLocation(false);
    fetchLocations(provider.id);
  };

  // Save Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringProvider) return;

    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/pickup-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveConfig',
          id: configuringProvider.id,
          config: {
            pickupFee: parseFloat(String(cfgPickupFee)) || 0,
            allowCustomerToSelectDate: cfgAllowSelectDate,
            displayOnMap: cfgDisplayOnMap,
            defaultOpeningHours: cfgOpeningHours,
          },
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

  // Add new location point inside configure modal
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringProvider || !locName.trim()) return;

    setAddingLoc(true);
    try {
      const res = await fetch('/api/admin/pickup-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addLocation',
          providerId: configuringProvider.id,
          name: locName.trim(),
          description: locDesc.trim(),
          address1: locAddress.trim(),
          city: locCity.trim(),
          state: locState.trim(),
          country: 'India',
          zipPostalCode: locPincode.trim(),
          openingHours: locHours.trim(),
          pickupFee: parseFloat(String(locFee)) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('New pickup point location added successfully.');
        setLocName('');
        setLocDesc('');
        setLocAddress('');
        setShowAddLocation(false);
        fetchLocations(configuringProvider.id);
        fetchProviders();
      } else {
        showToast(json.message || 'Failed to add location.', 'error');
      }
    } catch {
      showToast('Error adding location.', 'error');
    } finally {
      setAddingLoc(false);
    }
  };

  // Delete location point
  const handleDeleteLocation = async (pointId: string) => {
    if (!configuringProvider) return;
    try {
      const res = await fetch('/api/admin/pickup-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteLocation',
          pointId,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Pickup point location deleted.');
        fetchLocations(configuringProvider.id);
        fetchProviders();
      }
    } catch {
      showToast('Error deleting location.', 'error');
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

      {/* Delete Provider Confirmation Modal */}
      {deletingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-semibold text-slate-800">Are you sure?</h3>
              <button
                type="button"
                onClick={() => setDeletingProvider(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-slate-600">
              Are you sure you want to delete pickup provider{' '}
              <strong className="text-slate-800">"{deletingProvider.friendlyName}"</strong>?
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
                onClick={() => setDeletingProvider(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW PICKUP POINT PROVIDER WITH ALL FIELDS & CONTENT EXAMPLES */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#2489c5]" />
                <span>Add new pickup point provider</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateProvider} className="p-6 overflow-y-auto space-y-5">
              {/* Provider Info Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-1">
                  Provider Details
                </h4>

                {/* Friendly Name */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Friendly name</span>
                    <HelpTooltip text="The display name shown to store customers during checkout." />
                  </div>
                  <div className="md:col-span-8 flex items-center gap-1.5">
                    <input
                      type="text"
                      required
                      value={newForm.friendlyName}
                      onChange={(e) => handleFriendlyNameChange(e.target.value)}
                      placeholder="e.g. Agri-mart Gram Panchayat Hub - Dharwad"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
                </div>

                {/* System Name */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>System name</span>
                    <HelpTooltip text="The unique system identifier for this provider plugin." />
                  </div>
                  <div className="md:col-span-8 flex items-center gap-1.5">
                    <input
                      type="text"
                      required
                      value={newForm.systemName}
                      onChange={(e) => setNewForm({ ...newForm, systemName: e.target.value })}
                      placeholder="e.g. Shipping.PickupRuralHub"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
                </div>

                {/* Display Order */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Display order</span>
                    <HelpTooltip text="Sort priority in the table and checkout list. 1 is top." />
                  </div>
                  <div className="md:col-span-8">
                    <input
                      type="number"
                      value={newForm.displayOrder}
                      onChange={(e) => setNewForm({ ...newForm, displayOrder: parseInt(e.target.value, 10) || 1 })}
                      className="w-28 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Is active</span>
                    <HelpTooltip text="Check to activate this provider at checkout." />
                  </div>
                  <div className="md:col-span-8">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newForm.isActive}
                        onChange={(e) => setNewForm({ ...newForm, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-700">Active (Visible and available for customers)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Initial Pickup Location Details Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b pb-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pickup Location & Timing Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      Pickup Location Name
                    </label>
                    <input
                      type="text"
                      value={newForm.locationName}
                      onChange={(e) => setNewForm({ ...newForm, locationName: e.target.value })}
                      placeholder="e.g. Hubballi APMC Krishi Kendra Pickup Store"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={newForm.address1}
                      onChange={(e) => setNewForm({ ...newForm, address1: e.target.value })}
                      placeholder="e.g. APMC Yard, Gate 3, Amargol"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={newForm.city}
                      onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                      placeholder="Hubballi"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      PIN / Zip Code
                    </label>
                    <input
                      type="text"
                      value={newForm.zipPostalCode}
                      onChange={(e) => setNewForm({ ...newForm, zipPostalCode: e.target.value })}
                      placeholder="580025"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={newForm.openingHours}
                      onChange={(e) => setNewForm({ ...newForm, openingHours: e.target.value })}
                      placeholder="e.g. Mon-Sat 8:00 AM - 8:00 PM"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      Pickup Fee (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newForm.pickupFee}
                      onChange={(e) => setNewForm({ ...newForm, pickupFee: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newForm.allowSelectDate}
                      onChange={(e) => setNewForm({ ...newForm, allowSelectDate: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-xs text-slate-700">Allow customer to select pickup date</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newForm.displayOnMap}
                      onChange={(e) => setNewForm({ ...newForm, displayOnMap: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-xs text-slate-700">Display pickup points on map</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingProvider}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{addingProvider ? 'Saving...' : 'Add pickup provider'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIGURE PROVIDER & MANAGE PICKUP POINT LOCATIONS               */}
      {/* ========================================================================= */}
      {configuringProvider && (
        <div
          onClick={() => setConfiguringProvider(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
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
            <div className="p-6 overflow-y-auto space-y-6">
              {/* General Provider Settings */}
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-1">
                  General Pickup Settings
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Default Pickup Fee ($/₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cfgPickupFee}
                      onChange={(e) => setCfgPickupFee(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Standard Opening Hours
                    </label>
                    <input
                      type="text"
                      value={cfgOpeningHours}
                      onChange={(e) => setCfgOpeningHours(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cfgAllowSelectDate}
                      onChange={(e) => setCfgAllowSelectDate(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-xs text-slate-700">Allow customers to choose pickup date</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cfgDisplayOnMap}
                      onChange={(e) => setCfgDisplayOnMap(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-xs text-slate-700">Display pickup points on map</span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="px-3.5 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    {savingConfig ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>

              {/* Pickup Locations Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b pb-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Configured Pickup Point Locations ({providerLocations.length})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddLocation(!showAddLocation)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{showAddLocation ? 'Cancel' : 'Add Pickup Point'}</span>
                  </button>
                </div>

                {/* Sub-form: Add Location */}
                {showAddLocation && (
                  <form onSubmit={handleAddLocation} className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3 animate-in fade-in">
                    <h5 className="text-xs font-semibold text-slate-800">Add New Pickup Location</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Point Name *</label>
                        <input
                          type="text"
                          required
                          value={locName}
                          onChange={(e) => setLocName(e.target.value)}
                          placeholder="e.g. Hubballi Krishi Kendra Counter"
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Pickup Fee (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={locFee}
                          onChange={(e) => setLocFee(e.target.value)}
                          placeholder="0"
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Street Address</label>
                        <input
                          type="text"
                          value={locAddress}
                          onChange={(e) => setLocAddress(e.target.value)}
                          placeholder="APMC Yard, Gate 3"
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">City</label>
                        <input
                          type="text"
                          value={locCity}
                          onChange={(e) => setLocCity(e.target.value)}
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">PIN / Zip Code</label>
                        <input
                          type="text"
                          value={locPincode}
                          onChange={(e) => setLocPincode(e.target.value)}
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Hours / Description</label>
                        <input
                          type="text"
                          value={locHours}
                          onChange={(e) => setLocHours(e.target.value)}
                          placeholder="Mon-Sat 8:00 AM - 8:00 PM"
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddLocation(false)}
                        className="px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addingLoc}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded shadow-2xs cursor-pointer"
                      >
                        {addingLoc ? 'Saving...' : 'Add Point'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Locations List Table */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  {loadingLocations ? (
                    <div className="p-4 text-center text-xs text-slate-500">Loading locations...</div>
                  ) : providerLocations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No pickup points added yet. Click "+ Add Pickup Point" above.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                      {providerLocations.map((loc) => (
                        <div key={loc.id} className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-semibold text-slate-800">{loc.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {loc.address1 ? `${loc.address1}, ` : ''}{loc.city}, {loc.zipPostalCode}
                            </div>
                            <div className="text-[10px] text-emerald-700 mt-0.5 font-mono">
                              Hours: {loc.openingHours} | Fee: ₹{loc.pickupFee}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteLocation(loc.id)}
                            className="p-1 border border-slate-200 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete location"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setConfiguringProvider(null)}
                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Title & Add New Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <h1 className="text-xl font-normal text-slate-800">Pickup point providers</h1>

        {/* Top Right Action: Add new button & Refresh */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add new</span>
          </button>
          <button
            type="button"
            onClick={fetchProviders}
            title="Refresh"
            className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Table Card (Notice: "Learn more about pickup points" banner removed as requested) */}
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
                <th className="py-3 px-4 w-[26%]">System name</th>
                <th className="py-3 px-4 w-[11%] text-center">Display order</th>
                <th className="py-3 px-4 w-[9%] text-center">Is active</th>
                <th className="py-3 px-4 w-[10%] text-center">Configure</th>
                <th className="py-3 px-4 w-[10%] text-center">Edit</th>
                <th className="py-3 px-4 w-[6%] text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No pickup point providers found. Click <strong>"Add new"</strong> to create one.
                  </td>
                </tr>
              ) : (
                providers.map((p) => {
                  const isEditing = editingId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      {/* Friendly Name with demo locations count badge */}
                      <td className="py-3 px-4 text-slate-800 font-normal">
                        <div className="flex items-center gap-2">
                          <span>{p.friendlyName}</span>
                          {p.pointsCount !== undefined && p.pointsCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                              {p.pointsCount} {p.pointsCount === 1 ? 'point' : 'points'}
                            </span>
                          )}
                        </div>
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
                            className="w-16 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs mx-auto"
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

                      {/* Delete Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setDeletingProvider(p)}
                          className="p-1 border border-slate-200 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                          title="Delete provider"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Controls */}
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
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
