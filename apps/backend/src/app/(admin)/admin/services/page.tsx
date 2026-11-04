'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Clock,
  Activity,
  CheckCircle2,
  RefreshCw,
  X,
  AlertTriangle,
  UserCheck,
  Eye,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Search,
  Sparkles,
  Tractor,
  Check,
  SlidersHorizontal,
  ExternalLink,
  Image as ImageIcon,
  DollarSign,
  Info,
  CalendarDays,
  IndianRupee,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import {
  ServiceDefinition,
  JobWorkType,
  SERVICE_DEFAULT_IMAGES,
  getServiceDefaultImage,
} from '@/lib/services-data';

// ─── Image Presets & Categories ────────────────────────────────────────────────

const SERVICE_IMAGE_PRESETS = [
  { label: 'Tractor Ploughing', url: '/images/gallery/03-tractor-soil.jpg' },
  { label: 'Rotavator Tilling', url: '/images/gallery/04-seed-sowing.jpg' },
  { label: 'Combine Harvester', url: '/images/gallery/07-harvesting.jpg' },
  { label: 'Drone Spraying', url: '/images/banners/hero_service_drone.jpg' },
  { label: 'Power Weeder', url: '/images/gallery/08-farm-equipment.jpg' },
  { label: 'Skilled Labour', url: '/images/gallery/02-farmer-working.jpg' },
  { label: 'Soil Testing', url: '/images/gallery/05-irrigation.jpg' },
  { label: 'Agronomist Advisory', url: '/images/gallery/01-green-fields.jpg' },
  { label: 'Machinery Operators', url: '/images/gallery/09-vegetable-cultivation.jpg' },
  { label: 'Laser Land Leveling', url: '/images/banners/hero_rental.jpg' },
];

const CATEGORY_PRESETS = [
  'Heavy Farm Mechanization',
  'Soil Pulverization',
  'Crop Harvesting',
  'Plant Protection',
  'Crop Maintenance',
  'Farm Manpower',
  'Scientific Diagnostics',
  'Agronomy Advisory',
  'Machinery Operators',
  'Farm Infrastructure',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  customerMobile: string;
  serviceName: string;
  jobWorkName: string;
  farmAcreage: number;
  cropType: string;
  district: string;
  taluk: string;
  village: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  estimatedCost: number;
  assignedProviderName: string | null;
  createdAt: string;
}

interface AssignForm {
  providerName: string;
  operatorMobile: string;
  fleetUnit: string;
}

const STATUS_TABS = ['All', 'REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Assign Provider Modal ────────────────────────────────────────────────────

interface AssignModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onSuccess: () => void;
}

function AssignProviderModal({ request, onClose, onSuccess }: AssignModalProps) {
  const [form, setForm] = useState<AssignForm>({
    providerName: '',
    operatorMobile: '',
    fleetUnit: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.providerName.trim()) {
      setError('Provider name is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/services/admin/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id, ...form }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Assignment failed');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Assign Service Provider</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {request.requestNumber} · {request.serviceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Request Summary */}
        <div className="mx-6 mt-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Customer</span>
            <p className="text-slate-900 font-semibold">{request.customerName}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">District</span>
            <p className="text-slate-900 font-semibold">{request.district}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Acreage</span>
            <p className="text-slate-900 font-semibold">{request.farmAcreage} acres</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Preferred Date</span>
            <p className="text-slate-900 font-semibold">{fmtDate(request.preferredDate)}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Provider Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.providerName}
              onChange={(e) => setForm((f) => ({ ...f, providerName: e.target.value }))}
              placeholder="e.g. Krishna Agri Services"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Operator Mobile
            </label>
            <input
              type="tel"
              value={form.operatorMobile}
              onChange={(e) => setForm((f) => ({ ...f, operatorMobile: e.target.value }))}
              placeholder="+91 9999999999"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fleet / Unit
            </label>
            <input
              type="text"
              value={form.fleetUnit}
              onChange={(e) => setForm((f) => ({ ...f, fleetUnit: e.target.value }))}
              placeholder="e.g. Combine Harvester KA-01 AB 1234"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-xs transition"
            >
              <UserCheck className="h-4 w-4" />
              {loading ? 'Assigning…' : 'Assign Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Service Form Modal (Create & Edit) ───────────────────────────────────────

interface ServiceFormModalProps {
  service?: ServiceDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: any) => Promise<void>;
}

function ServiceFormModal({ service, isOpen, onClose, onSave }: ServiceFormModalProps) {
  const isEditing = Boolean(service && service.id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Heavy Farm Mechanization',
    badge: 'Popular',
    image: '/images/gallery/03-tractor-soil.jpg',
    baseRatePerAcre: 1200,
    timeEstimate: '1.5 to 2.5 hours / acre',
    equipmentUsed: '45–55 HP 4WD Tractors with MB Plough, Disc Harrow & Cultivator',
    shortDescription: '',
    description: '',
  });

  const [jobWorkTypes, setJobWorkTypes] = useState<JobWorkType[]>([]);
  const [newJwName, setNewJwName] = useState('');
  const [newJwRate, setNewJwRate] = useState<number>(1000);
  const [newJwRateUnit, setNewJwRateUnit] = useState('per acre');
  const [newJwEquipment, setNewJwEquipment] = useState('');
  const [newJwDuration, setNewJwDuration] = useState('1.5 hours/acre');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        slug: service.slug || '',
        category: service.category || 'Heavy Farm Mechanization',
        badge: service.badge || '',
        image: service.image || service.imageUrl || getServiceDefaultImage(service.id),
        baseRatePerAcre: service.baseRatePerAcre || 1000,
        timeEstimate: service.timeEstimate || '1.0 to 2.0 hours / acre',
        equipmentUsed: service.equipmentUsed || '',
        shortDescription: service.shortDescription || '',
        description: service.description || '',
      });
      setJobWorkTypes(service.jobWorkTypes || []);
    } else {
      setFormData({
        name: '',
        slug: '',
        category: 'Heavy Farm Mechanization',
        badge: 'High Demand',
        image: '/images/gallery/03-tractor-soil.jpg',
        baseRatePerAcre: 1200,
        timeEstimate: '1.5 to 2.5 hours / acre',
        equipmentUsed: '45–55 HP 4WD Tractors with MB Plough, Disc Harrow & Cultivator',
        shortDescription: 'Deep primary tillage, disc harrowing, and field leveling with certified operators.',
        description:
          'Agri Mart Mega dispatches modern 4WD tractors with seasoned operators directly to your farm parcel coordinates.',
      });
      setJobWorkTypes([
        {
          id: `jw-${Date.now()}-1`,
          name: 'Primary Precision Ploughing',
          description: 'Deep furrow inversion to optimize root aeration.',
          rate: 1300,
          rateUnit: 'per acre',
          equipmentNeeded: '45HP Tractor + MB Plough',
          estimatedDuration: '1.5 hours/acre',
        },
      ]);
    }
    setError(null);
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleAddJobWork = () => {
    if (!newJwName.trim()) return;
    const newJw: JobWorkType = {
      id: `jw-${Date.now()}`,
      name: newJwName.trim(),
      description: 'Standard documented job-work operation.',
      rate: Number(newJwRate) || 1000,
      rateUnit: newJwRateUnit || 'per acre',
      equipmentNeeded: newJwEquipment.trim() || formData.equipmentUsed,
      estimatedDuration: newJwDuration.trim() || '1.5 hours/acre',
    };
    setJobWorkTypes((prev) => [...prev, newJw]);
    setNewJwName('');
    setNewJwRate(1000);
    setNewJwEquipment('');
  };

  const handleRemoveJobWork = (id: string) => {
    setJobWorkTypes((prev) => prev.filter((j) => j.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }
    setSaving(true);
    setError(null);

    const generatedSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    try {
      await onSave({
        ...(service?.id ? { id: service.id } : {}),
        ...formData,
        slug: generatedSlug,
        image: formData.image || '/images/gallery/03-tractor-soil.jpg',
        imageUrl: formData.image || '/images/gallery/03-tractor-soil.jpg',
        baseRatePerAcre: Number(formData.baseRatePerAcre) || 1000,
        jobWorkTypes,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Mechanized Service' : 'Add New Service (Rent Services)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? `Updating ${service?.name}` : 'Create a new on-field agricultural service for farmer booking'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              1. Basic Service Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tractor Precision Ploughing & Land Preparation"
                className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. High Demand, DGCA Certified"
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="tractor-services"
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Image Selection & Preview */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              2. Service Card Image
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Image Preview Box */}
              <div className="w-full sm:w-44 h-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 relative group shadow-xs">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = '/images/gallery/03-tractor-soil.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px]">
                    <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                    <span>No Image</span>
                  </div>
                )}
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  Card Preview
                </span>
              </div>

              {/* Image URL Input & Presets */}
              <div className="flex-1 space-y-2 w-full">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image URL or File Path <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/gallery/03-tractor-soil.jpg or https://..."
                    className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Quick Select Preset Image:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                    {SERVICE_IMAGE_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: p.url })}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer border ${
                          formData.image === p.url
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing, Fleet & Operational Speed */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              3. Rates & Machinery Specs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Base Rate (₹ / acre) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    required
                    value={formData.baseRatePerAcre}
                    onChange={(e) =>
                      setFormData({ ...formData, baseRatePerAcre: Number(e.target.value) })
                    }
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Hourly rate is automatically calculated (~65% of acre rate)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operational Speed / Time Estimate <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.timeEstimate}
                  onChange={(e) => setFormData({ ...formData, timeEstimate: e.target.value })}
                  placeholder="e.g. 1.5 to 2.5 hours / acre"
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Equipment Fleet Used <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.equipmentUsed}
                onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                placeholder="e.g. 45–55 HP 4WD Tractors with MB Plough, Disc Harrow & Cultivator"
                className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Descriptions */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              4. Descriptions (Detail Page)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary displayed inside service details view..."
                className="w-full rounded-xl bg-white border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Agronomic Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive agronomy and machinery description for the detail page..."
                className="w-full rounded-xl bg-white border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 5: Job-Work Sub-Operations Manager */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                5. Job-Work Operations ({jobWorkTypes.length})
              </h3>
              <span className="text-[10px] text-slate-400">Available sub-tasks for this service</span>
            </div>

            {/* List Existing Job Works */}
            <div className="space-y-2">
              {jobWorkTypes.map((jw, index) => (
                <div
                  key={jw.id || index}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="space-y-0.5 max-w-[75%]">
                    <div className="font-bold text-slate-900">{jw.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {jw.equipmentNeeded} &bull; {jw.estimatedDuration}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700 text-xs shrink-0">
                      ₹{jw.rate} {jw.rateUnit}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveJobWork(jw.id)}
                      className="p-1 rounded-md text-rose-500 hover:bg-rose-100 transition cursor-pointer"
                      title="Remove operation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Job Work Row */}
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <div className="text-[11px] font-bold text-emerald-900">+ Add Job-Work Sub-Operation:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Operation Name (e.g. Laser Leveling)"
                  value={newJwName}
                  onChange={(e) => setNewJwName(e.target.value)}
                  className="rounded-lg bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Rate"
                    value={newJwRate}
                    onChange={(e) => setNewJwRate(Number(e.target.value))}
                    className="w-20 rounded-lg bg-white border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Unit (per acre)"
                    value={newJwRateUnit}
                    onChange={(e) => setNewJwRateUnit(e.target.value)}
                    className="flex-1 rounded-lg bg-white border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddJobWork}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                >
                  Add Operation
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Service...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Changes' : 'Create Service'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── View Service Modal (Read Operation) ──────────────────────────────────────

interface ViewServiceModalProps {
  service: ServiceDefinition | null;
  onClose: () => void;
  onEdit: (service: ServiceDefinition) => void;
}

function ViewServiceModal({ service, onClose, onEdit }: ViewServiceModalProps) {
  if (!service) return null;

  const serviceImage = service.image || service.imageUrl || getServiceDefaultImage(service.id);
  const hourlyRate = Math.max(250, Math.round(service.baseRatePerAcre * 0.65));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Image with Badge */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 shrink-0">
          <img src={serviceImage} alt={service.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-1.5 transition"
          >
            <X className="h-4 w-4" />
          </button>
          {service.badge && (
            <span className="absolute bottom-3 left-3 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {service.badge}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              {service.category}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{service.name}</h2>
            <div className="text-emerald-800 font-bold text-sm mt-1 flex items-center gap-2">
              <span>₹{hourlyRate}/hour</span>
              <span className="text-slate-400">&bull;</span>
              <span>₹{service.baseRatePerAcre}/acre</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div>
              <strong className="text-slate-900">Fleet Units:</strong> {service.equipmentUsed}
            </div>
            <div>
              <strong className="text-slate-900">Operational Speed:</strong> {service.timeEstimate}
            </div>
            <div>
              <strong className="text-slate-900">Public Slug:</strong>{' '}
              <span className="font-mono text-slate-600">/services/{service.slug}</span>
            </div>
          </div>

          {service.description && (
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Agronomic Service Description</h4>
              <p className="text-slate-600 leading-relaxed text-xs">{service.description}</p>
            </div>
          )}

          {/* Job Work Types */}
          {service.jobWorkTypes && service.jobWorkTypes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900">
                Documented Job-Work Types ({service.jobWorkTypes.length})
              </h4>
              <div className="space-y-1.5">
                {service.jobWorkTypes.map((jw) => (
                  <div
                    key={jw.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{jw.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {jw.equipmentNeeded} &bull; {jw.estimatedDuration}
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700 shrink-0">
                      ₹{jw.rate} {jw.rateUnit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <Link
            href={`/services/${service.slug}`}
            target="_blank"
            className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
          >
            Open Live Farmer Page <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(service);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Service</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Service Confirmation Modal (Delete Operation) ────────────────────

interface DeleteServiceModalProps {
  service: ServiceDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

function DeleteServiceModal({ service, isOpen, onClose, onConfirm }: DeleteServiceModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !service) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(service.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900">Delete Agricultural Service?</h3>
          <p className="text-xs text-slate-500">
            Are you sure you want to delete <strong>{service.name}</strong>? It will immediately be removed from the public Rent Services catalogue.
          </p>
        </div>

        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs">
          <strong>Warning:</strong> This operation is permanent and cannot be undone.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Yes, Delete Service'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ServicesAdminPage() {
  const [mainView, setMainView] = useState<'REQUESTS' | 'CATALOGUE'>('CATALOGUE');

  // Requests state
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [assignRequest, setAssignRequest] = useState<ServiceRequest | null>(null);

  // Catalogue state
  const [catalogue, setCatalogue] = useState<ServiceDefinition[]>([]);
  const [loadingCatalogue, setLoadingCatalogue] = useState(false);
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [catalogueCategory, setCatalogueCategory] = useState('All');

  // Modal states for full CRUD
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDefinition | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceDefinition | null>(null);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<ServiceDefinition | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/services/admin');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Failed to load service requests');
      setRequests(json.data.requests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCatalogue = useCallback(async () => {
    try {
      setLoadingCatalogue(true);
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setCatalogue(json.services ?? []);
      }
    } catch (err) {
      console.error('Failed to load services catalogue:', err);
    } finally {
      setLoadingCatalogue(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchCatalogue();
  }, [fetchRequests, fetchCatalogue]);

  const handleStatusChange = async (requestId: string, status: string) => {
    setActionLoading(requestId);
    try {
      const res = await fetch('/api/services/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Action failed');
      await fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  // ─── CRUD Handlers ──────────────────────────────────────────────────────────

  // Create Service Handler (POST)
  const handleCreateService = async (serviceData: any) => {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create service');
    await fetchCatalogue();
  };

  // Update Service Handler (PUT)
  const handleSaveService = async (updated: Partial<ServiceDefinition>) => {
    const res = await fetch('/api/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update service');
    await fetchCatalogue();
  };

  // Delete Service Handler (DELETE)
  const handleDeleteService = async (id: string) => {
    const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete service');
    await fetchCatalogue();
  };

  // Stats
  const total = requests.length;
  const requested = requests.filter((r) => r.status === 'REQUESTED').length;
  const inProgress = requests.filter((r) => r.status === 'IN_PROGRESS').length;
  const completed = requests.filter((r) => r.status === 'COMPLETED').length;

  // Filtered requests
  const filteredRequests =
    activeTab === 'All' ? requests : requests.filter((r) => r.status === activeTab);

  // Filtered catalogue
  const filteredCatalogue = catalogue.filter((item) => {
    const matchesCat =
      catalogueCategory === 'All' || item.category.toLowerCase() === catalogueCategory.toLowerCase();
    const q = catalogueSearch.toLowerCase();
    const matchesSearch =
      !catalogueSearch ||
      item.name.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.equipmentUsed && item.equipmentUsed.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const uniqueCategories = ['All', ...Array.from(new Set(catalogue.map((c) => c.category)))];

  // Columns for Requests
  const requestColumns: Column<ServiceRequest>[] = [
    {
      key: 'requestNumber',
      header: 'Request #',
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-emerald-700">{r.requestNumber}</span>
      ),
    },
    {
      key: 'serviceName',
      header: 'Service',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-900 font-semibold text-sm">{r.serviceName}</p>
          {r.jobWorkName && <p className="text-slate-500 text-xs">{r.jobWorkName}</p>}
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-800 font-medium">{r.customerName}</p>
          <p className="text-slate-500 text-xs font-mono">{r.customerMobile}</p>
        </div>
      ),
    },
    {
      key: 'district',
      header: 'District',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-800 font-medium">{r.district}</p>
          <p className="text-slate-500 text-xs">
            {r.taluk}, {r.village}
          </p>
        </div>
      ),
    },
    {
      key: 'preferredDate',
      header: 'Date',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-slate-800 text-xs font-medium">{fmtDate(r.preferredDate)}</p>
          <p className="text-slate-500 text-xs">{r.preferredTime}</p>
        </div>
      ),
    },
    {
      key: 'farmAcreage',
      header: 'Acreage',
      render: (r) => <span className="text-slate-700 text-xs font-medium">{r.farmAcreage} ac</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'assignedProviderName',
      header: 'Assigned Provider',
      render: (r) =>
        r.assignedProviderName ? (
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-800 text-xs font-medium">{r.assignedProviderName}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Unassigned</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Modals for CRUD & Operations ── */}

      {/* 1. Assign Modal */}
      {assignRequest && (
        <AssignProviderModal
          request={assignRequest}
          onClose={() => setAssignRequest(null)}
          onSuccess={fetchRequests}
        />
      )}

      {/* 2. Create Service Modal */}
      <ServiceFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateService}
      />

      {/* 3. Edit Service Modal */}
      <ServiceFormModal
        service={editingService}
        isOpen={Boolean(editingService)}
        onClose={() => setEditingService(null)}
        onSave={handleSaveService}
      />

      {/* 4. View Service Details Modal */}
      <ViewServiceModal
        service={selectedServiceDetails}
        onClose={() => setSelectedServiceDetails(null)}
        onEdit={(srv) => {
          setSelectedServiceDetails(null);
          setEditingService(srv);
        }}
      />

      {/* 5. Delete Service Confirmation Modal */}
      <DeleteServiceModal
        service={deletingService}
        isOpen={Boolean(deletingService)}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDeleteService}
      />

      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Full CRUD operations for mechanized agricultural services, pricing, implements & live GPS dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main View Mode Selector */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setMainView('CATALOGUE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mainView === 'CATALOGUE'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Services Catalogue ({catalogue.length})
            </button>
            <button
              onClick={() => setMainView('REQUESTS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mainView === 'REQUESTS'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bookings & Dispatch ({requests.length})
            </button>
          </div>

          {/* Add New Service Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </button>

          <button
            onClick={() => {
              fetchRequests();
              fetchCatalogue();
            }}
            disabled={loading || loadingCatalogue}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading || loadingCatalogue ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── VIEW 1: SERVICES CATALOGUE (Full CRUD) ── */}
      {mainView === 'CATALOGUE' && (
        <div className="space-y-6">
          {/* Controls: Search, Category filter & Add button */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search services, operations, implements, fleet…"
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-500 font-medium">Category:</span>
              <select
                value={catalogueCategory}
                onChange={(e) => setCatalogueCategory(e.target.value)}
                className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {uniqueCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services Grid with Real Images & CRUD Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalogue.map((service) => {
              const serviceImg = service.image || service.imageUrl || getServiceDefaultImage(service.id);
              const hourlyRate = Math.max(250, Math.round(service.baseRatePerAcre * 0.65));

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Real Image Header */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={serviceImg}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as any).src = '/images/gallery/03-tractor-soil.jpg';
                        }}
                      />
                      {service.badge && (
                        <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 shadow-sm uppercase tracking-wider">
                          {service.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2 bg-slate-950/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {service.id}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        {service.category}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {service.name}
                      </h3>

                      <div className="text-emerald-800 font-bold text-xs flex items-center gap-2">
                        <span>₹{hourlyRate}/hour</span>
                        <span className="text-slate-400">&bull;</span>
                        <span>₹{service.baseRatePerAcre}/acre</span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 space-y-1 text-[11px] text-slate-600 border border-slate-100">
                        <div>
                          <strong className="text-slate-700">Fleet:</strong>{' '}
                          <span className="line-clamp-1">{service.equipmentUsed}</span>
                        </div>
                        <div>
                          <strong className="text-slate-700">Operational Speed:</strong> {service.timeEstimate}
                        </div>
                        {service.jobWorkTypes && service.jobWorkTypes.length > 0 && (
                          <div className="pt-1 text-[10px] text-slate-500 font-medium border-t border-slate-200">
                            {service.jobWorkTypes.length} Documented Job-Work Operations
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions (CRUD) */}
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedServiceDetails(service)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      <span>View</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingService(service)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingService(service)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCatalogue.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">No services found</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Try changing your search query or add a new service
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── VIEW 2: REQUESTS & DISPATCH ── */}
      {mainView === 'REQUESTS' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Requests"
              value={total}
              icon={Wrench}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatsCard
              title="Requested"
              value={requested}
              icon={Clock}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
            />
            <StatsCard
              title="In Progress"
              value={inProgress}
              icon={Activity}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-50"
            />
            <StatsCard
              title="Completed"
              value={completed}
              icon={CheckCircle2}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => {
              const count =
                tab === 'All' ? requests.length : requests.filter((r) => r.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === tab
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab === 'All' ? 'All' : tab.replace(/_/g, ' ')}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg" />
                ))}
              </div>
            ) : (
              <DataTable<ServiceRequest>
                data={filteredRequests}
                columns={requestColumns}
                rowKey={(r) => r.id}
                searchPlaceholder="Search requests…"
                searchKeys={['requestNumber', 'customerName', 'serviceName', 'district']}
                emptyMessage="No service requests found."
                actions={(r) => {
                  const busy = actionLoading === r.id;
                  return (
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/services/${r.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Link>
                      {r.status === 'REQUESTED' && (
                        <button
                          disabled={busy}
                          onClick={() => setAssignRequest(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50"
                        >
                          <UserCheck className="h-3 w-3" />
                          {busy ? '…' : 'Assign'}
                        </button>
                      )}
                      {r.status === 'ASSIGNED' && (
                        <button
                          disabled={busy}
                          onClick={() => handleStatusChange(r.id, 'IN_PROGRESS')}
                          className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition disabled:opacity-50"
                        >
                          {busy ? '…' : 'Start'}
                        </button>
                      )}
                      {r.status === 'IN_PROGRESS' && (
                        <button
                          disabled={busy}
                          onClick={() => handleStatusChange(r.id, 'COMPLETED')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {busy ? '…' : 'Complete'}
                        </button>
                      )}
                    </div>
                  );
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
