'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Save,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Warehouse as WarehouseIcon,
  ArrowLeftCircle,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  country?: string;
  stateProvince?: string;
  county?: string;
  city?: string;
  address1?: string;
  address2?: string;
  zipPostalCode?: string;
  phoneNumber?: string;
  faxNumber?: string;
  adminComment?: string;
  managerName?: string;
  contactNumber?: string;
  serviceRadiusKm?: number;
  servicedPincodes?: string;
  addressLocation?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
  createdAt?: string;
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

function WarehousesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingWhId, setEditingWhId] = useState<string | null>(null);

  // Warehouses list state
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deletingWh, setDeletingWh] = useState<WarehouseData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Countries list for dropdown
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Form state combining Image 1 (Warehouse & Address Info) and Image 2 (Fulfillment Hub Info)
  const [form, setForm] = useState({
    // Image 1: nopCommerce Warehouse standard fields
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    country: 'India',
    stateProvince: 'Karnataka',
    county: '',
    city: 'Hubballi',
    address1: '',
    address2: '',
    zipPostalCode: '',
    phoneNumber: '',
    faxNumber: '',
    adminComment: '',

    // Image 2: Agri-mart Fulfillment Hub fields
    hubName: '',
    code: '',
    managerName: 'Operations Lead',
    contactNumber: '9480188000',
    serviceRadiusKm: 75,
    servicedPincodes: '580020, 580021, 580023, 580024',
    addressLocation: 'Agri Logistics Zone, Karnataka',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  // Fetch warehouses
  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/warehouses');
      const json = await res.json();
      if (json.success) {
        setWarehouses(json.data || []);
      } else {
        showToast(json.error || 'Failed to fetch warehouses', 'error');
      }
    } catch {
      showToast('Error connecting to warehouses API', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/countries');
      const json = await res.json();
      if (json.success && json.data) {
        setCountries(json.data);
      }
    } catch {
      // Fallback countries
      setCountries([
        { id: 'IN', name: 'India' },
        { id: 'US', name: 'United States' },
        { id: 'CA', name: 'Canada' },
        { id: 'AU', name: 'Australia' },
        { id: 'GB', name: 'United Kingdom' },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
    fetchCountries();
  }, [fetchWarehouses, fetchCountries]);

  // Sync with searchParams on initial load
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'create') {
      openCreate(false);
    } else if (editId) {
      const wh = warehouses.find((w) => String(w.id) === String(editId));
      if (wh) {
        openEdit(wh, false);
      }
    }
  }, [searchParams, warehouses]);

  // Switch to Create Mode
  const openCreate = (updateUrl = true) => {
    setViewMode('create');
    setEditingWhId(null);
    setForm({
      name: '',
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      country: 'India',
      stateProvince: 'Karnataka',
      county: '',
      city: 'Hubballi',
      address1: '',
      address2: '',
      zipPostalCode: '',
      phoneNumber: '',
      faxNumber: '',
      adminComment: '',
      hubName: '',
      code: 'WH-HBL-01',
      managerName: 'Operations Lead',
      contactNumber: '9480188000',
      serviceRadiusKm: 75,
      servicedPincodes: '580020, 580021, 580023, 580024',
      addressLocation: 'Agri Logistics Zone, Karnataka',
      isActive: true,
    });

    if (updateUrl && typeof window !== 'undefined') {
      window.history.pushState(null, '', '?action=create');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to Edit Mode
  const openEdit = (wh: WarehouseData, updateUrl = true) => {
    setViewMode('edit');
    setEditingWhId(wh.id);
    setForm({
      name: wh.name || '',
      firstName: wh.firstName || '',
      lastName: wh.lastName || '',
      email: wh.email || '',
      company: wh.company || '',
      country: wh.country || 'India',
      stateProvince: wh.stateProvince || 'Karnataka',
      county: wh.county || '',
      city: wh.city || 'Hubballi',
      address1: wh.address1 || '',
      address2: wh.address2 || '',
      zipPostalCode: wh.zipPostalCode || '',
      phoneNumber: wh.phoneNumber || wh.contactNumber || '',
      faxNumber: wh.faxNumber || '',
      adminComment: wh.adminComment || '',
      hubName: wh.name || '',
      code: wh.code || '',
      managerName: wh.managerName || 'Operations Lead',
      contactNumber: wh.contactNumber || wh.phoneNumber || '9480188000',
      serviceRadiusKm: wh.serviceRadiusKm ?? 75,
      servicedPincodes: wh.servicedPincodes || '580020, 580021, 580023, 580024',
      addressLocation: wh.addressLocation || wh.address1 || 'Agri Logistics Zone, Karnataka',
      isActive: wh.isActive !== undefined ? wh.isActive : true,
    });

    if (updateUrl && typeof window !== 'undefined') {
      window.history.pushState(null, '', `?edit=${wh.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to List View
  const backToList = () => {
    setViewMode('list');
    setEditingWhId(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Form Submission (Save or Save and Continue Edit)
  const handleSubmit = async (continueEditing = false) => {
    if (!form.name.trim()) {
      showToast('Warehouse Name is required.', 'error');
      return;
    }
    if (!form.code.trim()) {
      showToast('Hub Code is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: editingWhId || undefined,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        country: form.country,
        stateProvince: form.stateProvince,
        county: form.county.trim(),
        city: form.city.trim(),
        address1: form.address1.trim(),
        address2: form.address2.trim(),
        zipPostalCode: form.zipPostalCode.trim(),
        phoneNumber: form.phoneNumber.trim(),
        faxNumber: form.faxNumber.trim(),
        adminComment: form.adminComment.trim(),
        managerName: form.managerName.trim(),
        contactNumber: form.contactNumber.trim(),
        serviceRadiusKm: parseInt(String(form.serviceRadiusKm), 10) || 75,
        servicedPincodes: form.servicedPincodes.trim(),
        addressLocation: form.addressLocation.trim(),
        isActive: form.isActive,
      };

      const res = await fetch('/api/admin/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'The warehouse has been saved successfully.');
        await fetchWarehouses();

        if (continueEditing) {
          if (!editingWhId && json.data?.id) {
            setEditingWhId(json.data.id);
            setViewMode('edit');
            if (typeof window !== 'undefined') {
              window.history.pushState(null, '', `?edit=${json.data.id}`);
            }
          }
        } else {
          backToList();
        }
      } else {
        showToast(json.message || 'Failed to save warehouse.', 'error');
      }
    } catch {
      showToast('Error saving warehouse.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingWh) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/warehouses?id=${encodeURIComponent(deletingWh.id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'The warehouse has been deleted successfully.');
        setDeletingWh(null);
        fetchWarehouses();
      } else {
        showToast(json.message || 'Failed to delete warehouse.', 'error');
      }
    } catch {
      showToast('Error deleting warehouse.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered warehouses
  const filteredWarehouses = warehouses.filter((wh) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      wh.name?.toLowerCase().includes(term) ||
      wh.code?.toLowerCase().includes(term) ||
      wh.managerName?.toLowerCase().includes(term) ||
      wh.city?.toLowerCase().includes(term) ||
      wh.servicedPincodes?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5 pb-16 bg-[#f4f6f9] min-h-[calc(100vh-60px)] -m-6 p-6">
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
      {deletingWh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-semibold text-slate-800">Are you sure?</h3>
              <button
                type="button"
                onClick={() => setDeletingWh(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-slate-600">
              Are you sure you want to delete warehouse{' '}
              <strong className="text-slate-800">"{deletingWh.name}"</strong>?
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
                onClick={() => setDeletingWh(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-normal rounded shadow-2xs transition-colors cursor-pointer"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: COMBINED "ADD A NEW WAREHOUSE" / "EDIT WAREHOUSE" PAGE            */}
      {/* (Combining media_1791439357499.png AND media_1791439762839.png)          */}
      {/* ========================================================================= */}
      {viewMode === 'create' || viewMode === 'edit' ? (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Bar matching media_1791439357499.png */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-normal text-slate-800">
                {viewMode === 'create'
                  ? 'Add a new warehouse'
                  : `Edit warehouse details - ${form.name || 'Warehouse'}`}
              </h1>
              <button
                type="button"
                onClick={backToList}
                className="inline-flex items-center gap-1 text-xs text-[#2489c5] hover:underline font-normal cursor-pointer select-none ml-2"
              >
                <ArrowLeftCircle className="w-3.5 h-3.5" />
                <span>back to warehouse list</span>
              </button>
            </div>

            {/* Save & Save and Continue Edit buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSubmit(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSubmit(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save and Continue Edit</span>
              </button>
            </div>
          </div>

          {/* Form Card 1: Warehouse & Address Info (Matching media_1791439357499.png) */}
          <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Field 1: Name * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Name</span>
                  <HelpTooltip text="The name of the warehouse." />
                </div>
                <div className="md:col-span-9 flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({
                        ...form,
                        name: val,
                        hubName: form.hubName ? form.hubName : val,
                      });
                    }}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                  <span className="text-red-500 font-bold select-none">*</span>
                </div>
              </div>

              {/* Field 2: First name */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>First name</span>
                  <HelpTooltip text="The first name of the warehouse manager or contact person." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 3: Last name */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Last name</span>
                  <HelpTooltip text="The last name of the warehouse contact person." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 4: Email */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Email</span>
                  <HelpTooltip text="The warehouse contact email address." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 5: Company */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Company</span>
                  <HelpTooltip text="The company or entity operating this warehouse facility." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 6: Country * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Country</span>
                  <HelpTooltip text="The country where this warehouse is located." />
                </div>
                <div className="md:col-span-9 flex items-center gap-2">
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-red-500 font-bold select-none">*</span>
                </div>
              </div>

              {/* Field 7: State / province */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>State / province</span>
                  <HelpTooltip text="The state or province where this warehouse is located." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.stateProvince}
                    onChange={(e) => setForm({ ...form, stateProvince: e.target.value })}
                    placeholder="Other / State name"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 8: County / region */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>County / region</span>
                  <HelpTooltip text="The county or district region of the warehouse." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.county}
                    onChange={(e) => setForm({ ...form, county: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 9: City */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>City</span>
                  <HelpTooltip text="The city where this warehouse is located." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 10: Address 1 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Address 1</span>
                  <HelpTooltip text="The primary street address of the warehouse." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.address1}
                    onChange={(e) => setForm({ ...form, address1: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 11: Address 2 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Address 2</span>
                  <HelpTooltip text="The secondary address details (e.g. Building / Gate number)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.address2}
                    onChange={(e) => setForm({ ...form, address2: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 12: Zip / postal code * */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Zip / postal code</span>
                  <HelpTooltip text="The postal code or PIN code of this facility." />
                </div>
                <div className="md:col-span-9 flex items-center gap-2">
                  <input
                    type="text"
                    value={form.zipPostalCode}
                    onChange={(e) => setForm({ ...form, zipPostalCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                  <span className="text-red-500 font-bold select-none">*</span>
                </div>
              </div>

              {/* Field 13: Phone number */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Phone number</span>
                  <HelpTooltip text="The contact phone number for warehouse operations." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 14: Fax number */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Fax number</span>
                  <HelpTooltip text="The fax number for this facility." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={form.faxNumber}
                    onChange={(e) => setForm({ ...form, faxNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 15: Admin comment */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs pt-1.5">
                  <span>Admin comment</span>
                  <HelpTooltip text="Internal administrative notes or instructions for this warehouse." />
                </div>
                <div className="md:col-span-9">
                  <textarea
                    rows={4}
                    value={form.adminComment}
                    onChange={(e) => setForm({ ...form, adminComment: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Card 2: Fulfillment Hub & Proximity Logistics Settings (Combined from media_1791439762839.png) */}
          <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 bg-[#fbfbfb] border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Fulfillment Hub & Proximity Logistics Settings
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Agri-mart Dark Warehouse Dispatch Node</span>
            </div>

            <div className="p-6 space-y-4">
              {/* Row: Hub Name & Hub Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Hub Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.hubName || form.name}
                    onChange={(e) => setForm({ ...form, hubName: e.target.value })}
                    placeholder="e.g. Hubballi Central Dark Hub"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Hub Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="WH-HBL-01"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row: Manager Name & Contact Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={form.managerName}
                    onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                    placeholder="Operations Lead"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Contact Mobile
                  </label>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    placeholder="9480188000"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Field: Delivery Service Radius (km) */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Delivery Service Radius (km)
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={form.serviceRadiusKm}
                  onChange={(e) => setForm({ ...form, serviceRadiusKm: parseInt(e.target.value, 10) || 75 })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* Field: Serviced Pincodes (Comma-separated) */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Serviced Pincodes (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={form.servicedPincodes}
                  onChange={(e) => setForm({ ...form, servicedPincodes: e.target.value })}
                  placeholder="580020, 580021, 580023, 580024"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* Field: Address Location */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Address Location
                </label>
                <input
                  type="text"
                  value={form.addressLocation}
                  onChange={(e) => setForm({ ...form, addressLocation: e.target.value })}
                  placeholder="Agri Logistics Zone, Karnataka"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* Checkbox: Active Node (Receives Proximity Allocations) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Active Node (Receives Proximity Allocations)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: WAREHOUSES LIST VIEW WITH "+ ADD NEW" BUTTON                      */
        /* ========================================================================= */
        <div className="space-y-4 animate-in fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
            <div>
              <div className="flex items-center gap-2">
                <WarehouseIcon className="w-5 h-5 text-slate-600" />
                <h1 className="text-xl font-normal text-slate-800">Warehouses</h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage fulfillment hubs, dark warehouses, delivery radius, and proximity dispatch nodes.
              </p>
            </div>

            {/* Top Right: Add new button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openCreate(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add new</span>
              </button>
              <button
                type="button"
                onClick={fetchWarehouses}
                title="Refresh"
                className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded border border-slate-200 shadow-2xs p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search warehouses by name, hub code, manager, city, or pincode..."
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Warehouses Table Card */}
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
                    <th className="py-3 px-4 w-[28%]">Warehouse / Hub Name</th>
                    <th className="py-3 px-4 w-[16%]">Hub Code</th>
                    <th className="py-3 px-4 w-[20%]">Manager & Contact</th>
                    <th className="py-3 px-4 w-[14%] text-center">Service Radius</th>
                    <th className="py-3 px-4 w-[10%] text-center">Status</th>
                    <th className="py-3 px-4 w-[12%] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWarehouses.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No warehouses found. Click <strong>"Add new"</strong> to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredWarehouses.map((wh) => (
                      <tr key={wh.id} className="hover:bg-slate-50 transition-colors">
                        {/* Name & Location */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{wh.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {wh.city || wh.stateProvince || wh.addressLocation || 'Karnataka, India'}
                          </div>
                        </td>

                        {/* Hub Code */}
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-700 text-xs">
                          {wh.code}
                        </td>

                        {/* Manager & Contact */}
                        <td className="py-3 px-4 text-slate-700">
                          <div>{wh.managerName || 'Operations Lead'}</div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {wh.contactNumber || wh.phoneNumber || '—'}
                          </div>
                        </td>

                        {/* Service Radius */}
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                            {wh.serviceRadiusKm ?? 75} km
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          {wh.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                              Offline
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(wh, true)}
                              className="inline-flex items-center justify-center px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingWh(wh)}
                              className="p-1 border border-slate-300 rounded hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors shadow-2xs cursor-pointer"
                              title="Delete warehouse"
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

            {/* Pagination Controls */}
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
                  1 - {filteredWarehouses.length} of {filteredWarehouses.length} items
                </span>
                <button
                  type="button"
                  onClick={fetchWarehouses}
                  title="Refresh"
                  className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminWarehousesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
          Loading warehouse configuration...
        </div>
      }
    >
      <WarehousesContent />
    </Suspense>
  );
}
