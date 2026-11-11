'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  Activity,
  IndianRupee,
  RefreshCw,
  X,
  AlertTriangle,
  Eye,
  Plus,
  Edit2,
  Trash2,
  Search,
  Tractor,
  Check,
  SlidersHorizontal,
  ExternalLink,
  Image as ImageIcon,
  ShieldCheck,
  Fuel,
  Gauge,
  Weight,
  Layers,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';

// ─── Image Presets & Categories ────────────────────────────────────────────────

const RENTAL_IMAGE_PRESETS = [
  { label: '7 HP Power Weeder', url: '/images/products/prod_weeder_7hp.jpg' },
  { label: 'Paddy Reaper Binder', url: '/images/products/prod_reaper_binder.jpg' },
  { label: 'Battery Sprayer 16L', url: '/images/products/prod_sprayer_16l.jpg' },
  { label: '4WD Tractor Sunrise', url: '/images/gallery/01-hero-tractor-sunrise.jpg' },
  { label: 'Tractor Soil Tilling', url: '/images/gallery/03-tractor-soil.jpg' },
  { label: 'Rotavator Seed Sowing', url: '/images/gallery/04-seed-sowing.jpg' },
  { label: 'Combine Harvester', url: '/images/gallery/07-harvesting.jpg' },
  { label: 'Heavy Farm Equipment', url: '/images/gallery/08-farm-equipment.jpg' },
  { label: 'Agri Drone Sprayer', url: '/images/banners/hero_service_drone.jpg' },
  { label: 'Rental Fleet Banner', url: '/images/banners/hero_rental.jpg' },
];

const RENTAL_CATEGORY_PRESETS = [
  'Power Equipment',
  'Harvesting Machinery',
  'Spraying Equipment',
  'Heavy Tractors & Implements',
  'Soil Tillage & Rotavators',
  'Seed Drills & Planters',
  'Irrigation & Water Pumps',
  'Post-Harvest & Threshers',
  'Drone & Precision Tech',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RentalEquipmentItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  hourlyRate?: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  images: string[];
  powerRating: string;
  suitableFor: string;
  fuelType: string;
  weightKg: number;
  totalUnits: number;
  availableUnits: number;
  specifications: Record<string, string>;
  createdAt?: string;
}

interface RentalBooking {
  id: string;
  bookingNumber: string;
  productTitle: string;
  customerName: string;
  customerMobile: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  rentAmount: number;
  securityDeposit: number;
  totalPaid: number;
  status: string;
  paymentStatus: string;
  depositRefundStatus: string;
  createdAt: string;
}

interface ReturnForm {
  actualReturnDate: string;
  condition: 'ON_TIME' | 'LATE' | 'DAMAGED';
  damageNotes: string;
  damageCharge: number;
}

const STATUS_TABS = [
  'All',
  'PENDING_APPROVAL',
  'APPROVED',
  'ACTIVE',
  'RETURNED_ON_TIME',
  'RETURNED_LATE',
  'RETURNED_DAMAGED',
  'CANCELLED',
] as const;

const fmt = (n: number) => `₹${(Number(n) || 0).toLocaleString('en-IN')}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Return Modal ─────────────────────────────────────────────────────────────

interface ReturnModalProps {
  booking: RentalBooking;
  onClose: () => void;
  onSuccess: () => void;
}

function ReturnModal({ booking, onClose, onSuccess }: ReturnModalProps) {
  const [form, setForm] = useState<ReturnForm>({
    actualReturnDate: new Date().toISOString().split('T')[0],
    condition: 'ON_TIME',
    damageNotes: '',
    damageCharge: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rentals/admin/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, ...form }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Return processing failed');
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Process Equipment Return</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {booking.bookingNumber} · {booking.productTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Actual Return Date
            </label>
            <input
              type="date"
              required
              value={form.actualReturnDate}
              onChange={(e) => setForm((f) => ({ ...f, actualReturnDate: e.target.value }))}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Return Condition
            </label>
            <select
              value={form.condition}
              onChange={(e) =>
                setForm((f) => ({ ...f, condition: e.target.value as ReturnForm['condition'] }))
              }
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            >
              <option value="ON_TIME">Returned On Time — Good Condition</option>
              <option value="LATE">Returned Late</option>
              <option value="DAMAGED">Returned Damaged</option>
            </select>
          </div>

          {(form.condition === 'LATE' || form.condition === 'DAMAGED') && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Damage / Late Notes
                </label>
                <textarea
                  rows={3}
                  value={form.damageNotes}
                  onChange={(e) => setForm((f) => ({ ...f, damageNotes: e.target.value }))}
                  placeholder="Describe the condition..."
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Charge (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.damageCharge}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, damageCharge: Number(e.target.value) }))
                  }
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs font-mono"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
            >
              {loading ? 'Processing…' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Rent Equipment Form Modal (Create & Edit) ────────────────────────────────

interface RentalEquipmentFormModalProps {
  equipment?: RentalEquipmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipmentData: any) => Promise<void>;
}

function RentalEquipmentFormModal({
  equipment,
  isOpen,
  onClose,
  onSave,
}: RentalEquipmentFormModalProps) {
  const isEditing = Boolean(equipment && equipment.id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Power Equipment',
    image: '/images/products/prod_weeder_7hp.jpg',
    hourlyRate: 250,
    dailyRate: 1200,
    weeklyRate: 7000,
    monthlyRate: 24000,
    securityDeposit: 5000,
    powerRating: '7 HP (4-Stroke)',
    fuelType: 'Petrol',
    suitableFor: 'Sugarcane, Cotton, Banana, Vegetables, Arecanut',
    weightKg: 85,
    totalUnits: 6,
    availableUnits: 6,
    description: '',
  });

  const [specEntries, setSpecEntries] = useState<{ key: string; value: string }[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (equipment) {
      setFormData({
        title: equipment.title || '',
        slug: equipment.slug || '',
        category: equipment.category || 'Power Equipment',
        image:
          (Array.isArray(equipment.images) && equipment.images[0]) ||
          '/images/products/prod_weeder_7hp.jpg',
        hourlyRate: equipment.hourlyRate || Math.round((equipment.dailyRate || 1200) / 6),
        dailyRate: equipment.dailyRate || 1200,
        weeklyRate: equipment.weeklyRate || 7000,
        monthlyRate: equipment.monthlyRate || 24000,
        securityDeposit: equipment.securityDeposit ?? 3000,
        powerRating: equipment.powerRating || '7 HP',
        fuelType: equipment.fuelType || 'Petrol / Diesel',
        suitableFor: equipment.suitableFor || 'Field & Horticultural Crops',
        weightKg: equipment.weightKg || 85,
        totalUnits: equipment.totalUnits ?? 5,
        availableUnits: equipment.availableUnits ?? equipment.totalUnits ?? 5,
        description: equipment.description || '',
      });
      const specs = equipment.specifications || {};
      setSpecEntries(Object.entries(specs).map(([key, value]) => ({ key, value: String(value) })));
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'Power Equipment',
        image: '/images/products/prod_weeder_7hp.jpg',
        hourlyRate: 250,
        dailyRate: 1200,
        weeklyRate: 7000,
        monthlyRate: 24000,
        securityDeposit: 5000,
        powerRating: '7 HP (4-Stroke)',
        fuelType: 'Petrol',
        suitableFor: 'Sugarcane, Cotton, Banana, Vegetables, Arecanut',
        weightKg: 85,
        totalUnits: 6,
        availableUnits: 6,
        description:
          'Heavy-duty field equipment inspected and serviced before every dispatch. Includes standard attachments and toolkit.',
      });
      setSpecEntries([
        { key: 'Engine Type', value: '4-Stroke, Single Cylinder, Air Cooled' },
        { key: 'Tilling Width', value: '900 mm – 1050 mm (Adjustable)' },
        { key: 'Fuel Consumption', value: '800 ml / hour' },
      ]);
    }
    setError(null);
  }, [equipment, isOpen]);

  if (!isOpen) return null;

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setSpecEntries((prev) => [
      ...prev.filter((s) => s.key.toLowerCase() !== newSpecKey.trim().toLowerCase()),
      { key: newSpecKey.trim(), value: newSpecValue.trim() },
    ]);
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (key: string) => {
    setSpecEntries((prev) => prev.filter((s) => s.key !== key));
  };

  const handleDailyRateChange = (val: number) => {
    const daily = Math.max(0, val);
    setFormData((prev) => ({
      ...prev,
      dailyRate: daily,
      hourlyRate: Math.max(50, Math.round(daily / 5)),
      weeklyRate: Math.round(daily * 5.8),
      monthlyRate: Math.round(daily * 20),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Equipment title is required');
      return;
    }
    setSaving(true);
    setError(null);

    const generatedSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const specifications: Record<string, string> = {};
    for (const entry of specEntries) {
      if (entry.key.trim()) {
        specifications[entry.key.trim()] = entry.value.trim();
      }
    }

    try {
      await onSave({
        ...(equipment?.id ? { id: equipment.id } : {}),
        ...formData,
        slug: generatedSlug,
        images: [formData.image || '/images/products/prod_weeder_7hp.jpg'],
        imageUrl: formData.image || '/images/products/prod_weeder_7hp.jpg',
        hourlyRate: Number(formData.hourlyRate) || 250,
        dailyRate: Number(formData.dailyRate) || 1200,
        weeklyRate: Number(formData.weeklyRate) || 7000,
        monthlyRate: Number(formData.monthlyRate) || 24000,
        securityDeposit: Number(formData.securityDeposit) || 0,
        weightKg: Number(formData.weightKg) || 50,
        totalUnits: Math.max(1, Number(formData.totalUnits) || 1),
        availableUnits: Math.max(0, Number(formData.availableUnits) ?? Number(formData.totalUnits) ?? 1),
        specifications,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save rent equipment');
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
              {isEditing ? 'Edit Rent Equipment' : 'Add New Rent Equipment'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? `Updating ${equipment?.title}`
                : 'Add a new machine or implement to the Rent Equipment catalogue'}
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

          {/* Section 1: Basic Equipment Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              1. Equipment Basic Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Equipment Name / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 7 HP Heavy-Duty Power Weeder (With Ridger)"
                className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {RENTAL_CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="power-weeder-7hp"
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Equipment Image & Presets */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              2. Equipment Photo
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-44 h-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 relative group shadow-xs">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = '/images/gallery/01-hero-tractor-sunrise.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px]">
                    <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                    <span>No Image</span>
                  </div>
                )}
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  Equipment Preview
                </span>
              </div>

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
                    placeholder="/images/products/prod_weeder_7hp.jpg or https://..."
                    className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Quick Select Preset Photo:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                    {RENTAL_IMAGE_PRESETS.map((p) => (
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

          {/* Section 3: Rental Rates & Security Deposit */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              3. Rental Pricing & Security Deposit
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Rate (₹/day) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.dailyRate}
                  onChange={(e) => handleDailyRateChange(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hourly (₹/hr)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData({ ...formData, hourlyRate: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weekly (₹/wk)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.weeklyRate}
                  onChange={(e) =>
                    setFormData({ ...formData, weeklyRate: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly (₹/mo)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.monthlyRate}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyRate: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deposit (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.securityDeposit}
                  onChange={(e) =>
                    setFormData({ ...formData, securityDeposit: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-amber-800 bg-amber-50/40"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Machine Hardware & Inventory Units */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              4. Power Rating, Fuel & Fleet Inventory
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Power Rating <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.powerRating}
                  onChange={(e) => setFormData({ ...formData, powerRating: e.target.value })}
                  placeholder="e.g. 7 HP (4-Stroke)"
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fuel / Power Type <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  placeholder="Petrol / Diesel / Electric"
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.totalUnits}
                    onChange={(e) => {
                      const total = Math.max(1, Number(e.target.value));
                      setFormData({
                        ...formData,
                        totalUnits: total,
                        availableUnits: Math.min(total, formData.availableUnits),
                      });
                    }}
                    className="w-full rounded-xl bg-white border border-slate-300 px-2.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Available
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={formData.totalUnits}
                    value={formData.availableUnits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableUnits: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full rounded-xl bg-white border border-slate-300 px-2.5 py-2 text-xs text-emerald-700 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suitable Crops / Applications <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.suitableFor}
                onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                placeholder="e.g. Sugarcane, Cotton, Banana, Vegetables, Arecanut"
                className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Equipment Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the rental machine, attachments included, and field capabilities..."
                className="w-full rounded-xl bg-white border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 5: Technical Specifications */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                5. Technical Specifications ({specEntries.length})
              </h3>
              <span className="text-[10px] text-slate-400">Displayed on equipment detail page</span>
            </div>

            <div className="space-y-1.5">
              {specEntries.map((spec) => (
                <div
                  key={spec.key}
                  className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{spec.key}:</span>{' '}
                    <span className="text-slate-600">{spec.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(spec.key)}
                    className="p-1 rounded-md text-rose-500 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <div className="text-[11px] font-bold text-emerald-900">
                + Add Technical Specification:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Spec Name (e.g. Working Width)"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="rounded-lg bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 900 mm Adjustable)"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="rounded-lg bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                >
                  Add Spec
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
                  <span>Saving Equipment...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Changes' : 'Add Rent Equipment'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── View Rent Equipment Modal (Read Operation) ───────────────────────────────

interface ViewRentalEquipmentModalProps {
  equipment: RentalEquipmentItem | null;
  onClose: () => void;
  onEdit: (equipment: RentalEquipmentItem) => void;
}

function ViewRentalEquipmentModal({
  equipment,
  onClose,
  onEdit,
}: ViewRentalEquipmentModalProps) {
  if (!equipment) return null;

  const equipImage =
    (Array.isArray(equipment.images) && equipment.images[0]) ||
    '/images/gallery/01-hero-tractor-sunrise.jpg';
  const hourlyRate = equipment.hourlyRate || Math.round((equipment.dailyRate || 1200) / 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src={equipImage}
            alt={equipment.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as any).src = '/images/gallery/01-hero-tractor-sunrise.jpg';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-1.5 transition"
          >
            <X className="h-4 w-4" />
          </button>
          <span
            className={`absolute bottom-3 left-3 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${
              equipment.availableUnits > 0
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {equipment.availableUnits} of {equipment.totalUnits} Units Available
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              {equipment.category}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{equipment.title}</h2>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-semibold block">Hourly</span>
                <span className="text-sm font-black text-emerald-900">{fmt(hourlyRate)}/hr</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                <span className="text-[10px] text-emerald-100 font-semibold block">Daily Rate</span>
                <span className="text-sm font-black">{fmt(equipment.dailyRate)}/day</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Weekly</span>
                <span className="text-sm font-bold text-slate-900">
                  {fmt(equipment.weeklyRate)}/wk
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Monthly</span>
                <span className="text-sm font-bold text-slate-900">
                  {fmt(equipment.monthlyRate)}/mo
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-semibold block">Deposit</span>
                <span className="text-sm font-bold text-amber-900">
                  {fmt(equipment.securityDeposit)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <strong className="text-slate-900">Power Rating:</strong> {equipment.powerRating}
            </div>
            <div>
              <strong className="text-slate-900">Fuel / Power:</strong> {equipment.fuelType}
            </div>
            <div>
              <strong className="text-slate-900">Machine Weight:</strong> {equipment.weightKg} kg
            </div>
            <div>
              <strong className="text-slate-900">Public URL:</strong>{' '}
              <span className="font-mono text-slate-600">/rentals/{equipment.slug}</span>
            </div>
            <div className="sm:col-span-2">
              <strong className="text-slate-900">Suitable Crops:</strong> {equipment.suitableFor}
            </div>
          </div>

          {equipment.description && (
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Equipment Description</h4>
              <p className="text-slate-600 leading-relaxed text-xs">{equipment.description}</p>
            </div>
          )}

          {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900">
                Technical Specifications ({Object.keys(equipment.specifications).length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(equipment.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center gap-2"
                  >
                    <span className="font-semibold text-slate-600">{key}</span>
                    <span className="font-bold text-slate-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <Link
            href={`/rentals/${equipment.slug}`}
            target="_blank"
            className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
          >
            Open Live Rental Page <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(equipment);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Equipment</span>
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

// ─── Delete Rent Equipment Confirmation Modal ─────────────────────────────────

interface DeleteRentalEquipmentModalProps {
  equipment: RentalEquipmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

function DeleteRentalEquipmentModal({
  equipment,
  isOpen,
  onClose,
  onConfirm,
}: DeleteRentalEquipmentModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !equipment) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(equipment.id);
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
          <h3 className="text-base font-bold text-slate-900">Delete Rent Equipment?</h3>
          <p className="text-xs text-slate-500">
            Are you sure you want to delete <strong>{equipment.title}</strong>? It will immediately
            be removed from the public Rent Equipment catalogue.
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
            {deleting ? 'Deleting…' : 'Yes, Delete Equipment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RentalsAdminPage() {
  const [mainView, setMainView] = useState<'CATALOGUE' | 'BOOKINGS'>('CATALOGUE');

  // Bookings state
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [returnBooking, setReturnBooking] = useState<RentalBooking | null>(null);

  // Rent Equipment Catalogue state
  const [catalogue, setCatalogue] = useState<RentalEquipmentItem[]>([]);
  const [loadingCatalogue, setLoadingCatalogue] = useState(false);
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [catalogueCategory, setCatalogueCategory] = useState('All');

  // CRUD Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<RentalEquipmentItem | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<RentalEquipmentItem | null>(null);
  const [selectedEquipmentDetails, setSelectedEquipmentDetails] =
    useState<RentalEquipmentItem | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/rentals/admin');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Failed to load rentals');
      setBookings(json.data.bookings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCatalogue = useCallback(async () => {
    try {
      setLoadingCatalogue(true);
      const res = await fetch('/api/rentals');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setCatalogue(json.data ?? json.equipment ?? []);
      }
    } catch (err) {
      console.error('Failed to load rent equipment catalogue:', err);
    } finally {
      setLoadingCatalogue(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchCatalogue();
  }, [fetchBookings, fetchCatalogue]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch('/api/rentals/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Action failed');
      await fetchBookings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Rent Equipment CRUD Handlers ───────────────────────────────────────────

  const handleCreateEquipment = async (equipmentData: any) => {
    const res = await fetch('/api/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(equipmentData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create rent equipment');
    await fetchCatalogue();
  };

  const handleUpdateEquipment = async (updatedData: Partial<RentalEquipmentItem>) => {
    const res = await fetch('/api/rentals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update rent equipment');
    await fetchCatalogue();
  };

  const handleDeleteEquipment = async (id: string) => {
    const res = await fetch(`/api/rentals?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete rent equipment');
    await fetchCatalogue();
  };

  // Stats
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'PENDING_APPROVAL').length;
  const active = bookings.filter((b) => b.status === 'ACTIVE').length;
  const revenue = bookings
    .filter((b) => !['CANCELLED', 'PENDING_APPROVAL'].includes(b.status))
    .reduce((sum, b) => sum + b.totalPaid, 0);

  // Filtered bookings
  const filteredBookings =
    activeTab === 'All' ? bookings : bookings.filter((b) => b.status === activeTab);

  // Filtered equipment catalogue
  const filteredCatalogue = catalogue.filter((item) => {
    const matchesCat =
      catalogueCategory === 'All' ||
      (item.category || '').toLowerCase() === catalogueCategory.toLowerCase();
    const q = catalogueSearch.toLowerCase();
    const matchesSearch =
      !catalogueSearch ||
      (item.title || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.powerRating || '').toLowerCase().includes(q) ||
      (item.suitableFor || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const uniqueCategories = [
    'All',
    ...Array.from(new Set(catalogue.map((c) => c.category).filter(Boolean))),
  ];

  // Columns for Bookings
  const columns: Column<RentalBooking>[] = [
    {
      key: 'bookingNumber',
      header: 'Booking #',
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-emerald-700">{r.bookingNumber}</span>
      ),
    },
    {
      key: 'productTitle',
      header: 'Equipment',
      sortable: true,
      render: (r) => (
        <span className="font-semibold text-slate-900 max-w-[160px] block truncate">
          {r.productTitle}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (r) => <span className="text-slate-800 font-medium">{r.customerName}</span>,
    },
    {
      key: 'customerMobile',
      header: 'Mobile',
      render: (r) => <span className="font-mono text-slate-500 text-xs">{r.customerMobile}</span>,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      render: (r) => <span className="text-slate-700 text-xs">{fmtDate(r.startDate)}</span>,
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (r) => <span className="text-slate-700 text-xs">{fmtDate(r.endDate)}</span>,
    },
    {
      key: 'totalDays',
      header: 'Days',
      render: (r) => <span className="text-slate-700">{r.totalDays}d</span>,
    },
    {
      key: 'totalPaid',
      header: 'Amount (₹)',
      sortable: true,
      render: (r) => <span className="font-bold text-slate-900">{fmt(r.totalPaid)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Modals for CRUD & Operations ── */}

      {/* 1. Return Modal */}
      {returnBooking && (
        <ReturnModal
          booking={returnBooking}
          onClose={() => setReturnBooking(null)}
          onSuccess={fetchBookings}
        />
      )}

      {/* 2. Add Rent Equipment Modal */}
      <RentalEquipmentFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateEquipment}
      />

      {/* 3. Edit Rent Equipment Modal */}
      <RentalEquipmentFormModal
        equipment={editingEquipment}
        isOpen={Boolean(editingEquipment)}
        onClose={() => setEditingEquipment(null)}
        onSave={handleUpdateEquipment}
      />

      {/* 4. View Rent Equipment Modal */}
      <ViewRentalEquipmentModal
        equipment={selectedEquipmentDetails}
        onClose={() => setSelectedEquipmentDetails(null)}
        onEdit={(eq) => {
          setSelectedEquipmentDetails(null);
          setEditingEquipment(eq);
        }}
      />

      {/* 5. Delete Rent Equipment Confirmation Modal */}
      <DeleteRentalEquipmentModal
        equipment={deletingEquipment}
        isOpen={Boolean(deletingEquipment)}
        onClose={() => setDeletingEquipment(null)}
        onConfirm={handleDeleteEquipment}
      />

      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rent Equipment Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Add, view, edit, and delete rental machinery & manage farmer equipment bookings and
            deposit returns
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
              Equipment Catalogue ({catalogue.length})
            </button>
            <button
              onClick={() => setMainView('BOOKINGS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mainView === 'BOOKINGS'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bookings & Returns ({bookings.length})
            </button>
          </div>

          {/* Add Rent Equipment Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Rent Equipment</span>
          </button>

          <button
            onClick={() => {
              fetchBookings();
              fetchCatalogue();
            }}
            disabled={loading || loadingCatalogue}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loading || loadingCatalogue ? 'animate-spin text-emerald-600' : ''
              }`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ── VIEW 1: RENT EQUIPMENT CATALOGUE (Add / View / Edit / Delete) ── */}
      {mainView === 'CATALOGUE' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search rent equipment, power rating, crop suitability…"
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

          {/* Rent Equipment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalogue.map((item) => {
              const equipImg =
                (Array.isArray(item.images) && item.images[0]) ||
                '/images/gallery/01-hero-tractor-sunrise.jpg';
              const hourlyRate = item.hourlyRate || Math.round((item.dailyRate || 1200) / 6);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Equipment Photo Header */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={equipImg}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as any).src = '/images/gallery/01-hero-tractor-sunrise.jpg';
                        }}
                      />
                      <span
                        className={`absolute top-2.5 right-2.5 rounded-full font-black text-[10px] px-2.5 py-0.5 shadow-sm uppercase tracking-wider ${
                          item.availableUnits > 0
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {item.availableUnits}/{item.totalUnits} Units Free
                      </span>
                      <span className="absolute bottom-2 left-2 bg-slate-950/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {item.id}
                      </span>
                    </div>

                    {/* Equipment Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        {item.category}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-emerald-800">
                        <span>{fmt(item.dailyRate)}/day</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-slate-600">{fmt(hourlyRate)}/hr</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-amber-700 text-[11px]">
                          Deposit: {fmt(item.securityDeposit)}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 space-y-1 text-[11px] text-slate-600 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span>
                            <strong className="text-slate-700">Power:</strong> {item.powerRating}
                          </span>
                          <span>
                            <strong className="text-slate-700">Fuel:</strong> {item.fuelType}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-700">Suitable For:</strong>{' '}
                          <span className="line-clamp-1">{item.suitableFor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions (View, Edit, Delete) */}
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedEquipmentDetails(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      <span>View</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingEquipment(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingEquipment(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                        title="Delete Rent Equipment"
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
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">No rent equipment found</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Try changing your search query or add a new rent equipment item
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Rent Equipment</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── VIEW 2: BOOKINGS & RETURNS ── */}
      {mainView === 'BOOKINGS' && (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-800 text-xs font-semibold">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>{error}</span>
              </div>
              <button
                onClick={fetchBookings}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Bookings"
              value={total}
              icon={CalendarDays}
              iconColor="text-blue-700"
              iconBg="bg-blue-50 border border-blue-100"
            />
            <StatsCard
              title="Pending Approval"
              value={pending}
              icon={Clock}
              iconColor="text-amber-700"
              iconBg="bg-amber-50 border border-amber-100"
            />
            <StatsCard
              title="Active Rentals"
              value={active}
              icon={Activity}
              iconColor="text-emerald-700"
              iconBg="bg-emerald-50 border border-emerald-100"
            />
            <StatsCard
              title="Rental Revenue"
              value={fmt(revenue)}
              icon={IndianRupee}
              iconColor="text-emerald-700"
              iconBg="bg-emerald-50 border border-emerald-100"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-200">
            {STATUS_TABS.map((tab) => {
              const count =
                tab === 'All' ? bookings.length : bookings.filter((b) => b.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    activeTab === tab
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab === 'All' ? 'All' : tab.replace(/_/g, ' ')}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeTab === tab
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-xs">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-sm">Loading rental bookings...</p>
            </div>
          ) : (
            <DataTable<RentalBooking>
              data={filteredBookings}
              columns={columns}
              rowKey={(r) => r.id}
              searchPlaceholder="Search bookings…"
              searchKeys={['bookingNumber', 'productTitle', 'customerName', 'customerMobile']}
              emptyMessage="No rental bookings found."
              actions={(r) => {
                const busy = actionLoading === r.id;
                return (
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/rentals/${r.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Link>
                    {r.status === 'PENDING_APPROVAL' && (
                      <button
                        disabled={busy}
                        onClick={() => handleStatusChange(r.id, 'APPROVED')}
                        className="px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
                      >
                        {busy ? '…' : 'Approve'}
                      </button>
                    )}
                    {r.status === 'APPROVED' && (
                      <button
                        disabled={busy}
                        onClick={() => handleStatusChange(r.id, 'ACTIVE')}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
                      >
                        {busy ? '…' : 'Activate'}
                      </button>
                    )}
                    {r.status === 'ACTIVE' && (
                      <button
                        disabled={busy}
                        onClick={() => setReturnBooking(r)}
                        className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition shadow-2xs"
                      >
                        Process Return
                      </button>
                    )}
                  </div>
                );
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
