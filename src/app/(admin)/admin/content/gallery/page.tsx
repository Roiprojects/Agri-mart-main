'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Settings,
  ExternalLink,
  Search,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  Copy,
  LayoutGrid,
  List,
  MapPin,
  Camera,
  Calendar,
  Tag,
  ShieldCheck,
  Save,
  Check,
  Sparkles,
  Layers,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImageEditorField } from '@/components/admin/ImageEditorField';

interface GalleryItem {
  id: string;
  title: string;
  subject: string;
  caption: string;
  image: string;
  photographer: string;
  sourceUrl?: string;
  license?: string;
  alt?: string;
  displayOrder: number;
  isPublished: boolean;
  category?: string;
  location?: string;
  cropType?: string;
  season?: string;
  farmingMethod?: string;
  cameraModel?: string;
  dateTaken?: string;
  tags?: string;
  aspectRatio?: string;
  isFeatured?: boolean;
  photographerEmail?: string;
}

interface GallerySettingsData {
  enabled: boolean;
  pageSize: number;
  allowLightbox: boolean;
  showPhotographer: boolean;
  showLocation: boolean;
  showLicense: boolean;
  enableCategories: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
  gridColumns?: number;
  layoutStyle?: string;
  allowDownload?: boolean;
  showCaptions?: boolean;
  defaultCategory?: string;
  enableSearch?: boolean;
}

const CATEGORIES = [
  'All',
  'Farm Fields',
  'Field Preparation',
  'Soil & Tillage',
  'Sowing & Planting',
  'Irrigation',
  'Crop Protection',
  'Harvesting',
  'Farm Machinery',
  'Organic Farming',
  'Post-Harvest & Storage',
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFTS' | 'FEATURED'>('ALL');

  // Modals & Drawers
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'MEDIA' | 'AGRI' | 'ATTRIBUTION' | 'TECH'>('GENERAL');
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<GallerySettingsData>({
    enabled: true,
    pageSize: 12,
    allowLightbox: true,
    showPhotographer: true,
    showLocation: true,
    showLicense: true,
    enableCategories: true,
    pageTitle: 'Life on the Farm - Visual Agronomy Archive',
    pageSubtitle: 'A visual journey across agricultural rhythms in Karnataka.',
    gridColumns: 4,
    layoutStyle: 'grid',
    allowDownload: true,
    showCaptions: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Comprehensive Form State (All fields editable)
  const [form, setForm] = useState({
    title: '',
    subject: 'Farm Fields',
    caption: '',
    image: '',
    alt: '',
    location: '',
    photographer: 'Agri Mart Archive',
    photographerEmail: '',
    sourceUrl: '',
    license: 'Unsplash License (Free commercial & non-commercial use)',
    displayOrder: 1,
    isPublished: true,
    isFeatured: false,
    cropType: '',
    season: 'Kharif 2026',
    farmingMethod: 'Precision Mechanized',
    cameraModel: '',
    dateTaken: '',
    tags: '',
    aspectRatio: '4:3',
  });

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/gallery');
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      }
    } catch (e: any) {
      showToast('Error loading gallery: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/gallery');
      const json = await res.json();
      if (json.success && json.data) {
        setSettings(json.data);
      }
    } catch (e) {
      console.error('Error loading gallery settings:', e);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchSettings();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setActiveTab('GENERAL');
    setForm({
      title: '',
      subject: selectedCategory !== 'All' ? selectedCategory : 'Farm Fields',
      caption: '',
      image: '',
      alt: '',
      location: 'Karnataka, India',
      photographer: 'Agri Mart Archive',
      photographerEmail: '',
      sourceUrl: '',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      displayOrder: items.length + 1,
      isPublished: true,
      isFeatured: false,
      cropType: 'Paddy / Rice',
      season: 'Kharif 2026',
      farmingMethod: 'Precision Mechanized',
      cameraModel: '',
      dateTaken: new Date().toISOString().split('T')[0],
      tags: 'agriculture, karnataka, farm, crop',
      aspectRatio: '4:3',
    });
    setEditModalOpen(true);
  };

  const openEdit = (it: GalleryItem) => {
    setEditingItem(it);
    setActiveTab('GENERAL');
    setForm({
      title: it.title || '',
      subject: it.subject || it.category || 'Farm Fields',
      caption: it.caption || '',
      image: it.image || '',
      alt: it.alt || it.title || '',
      location: it.location || '',
      photographer: it.photographer || 'Agri Mart Archive',
      photographerEmail: it.photographerEmail || '',
      sourceUrl: it.sourceUrl || '',
      license: it.license || 'Unsplash License (Free commercial & non-commercial use)',
      displayOrder: it.displayOrder || 1,
      isPublished: it.isPublished ?? true,
      isFeatured: it.isFeatured ?? false,
      cropType: it.cropType || '',
      season: it.season || 'Kharif 2026',
      farmingMethod: it.farmingMethod || 'Precision Mechanized',
      cameraModel: it.cameraModel || '',
      dateTaken: it.dateTaken || '',
      tags: it.tags || '',
      aspectRatio: it.aspectRatio || '4:3',
    });
    setEditModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image.trim()) {
      showToast('Photo Title and Image URL are required', 'error');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem?.id,
          ...form,
          category: form.subject,
          alt: form.alt || form.title,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(editingItem ? 'Photograph details updated successfully' : 'New photograph added to gallery');
        setEditModalOpen(false);
        fetchGallery();
      } else {
        showToast(json.message || 'Error saving photo', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast(`"${deleteTarget.title}" deleted from gallery`);
        setDeleteTarget(null);
        fetchGallery();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleTogglePublish = async (it: GalleryItem) => {
    try {
      const nextStatus = !it.isPublished;
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...it,
          isPublished: nextStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(nextStatus ? `Published "${it.title}"` : `Moved "${it.title}" to Drafts`);
        fetchGallery();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (it: GalleryItem) => {
    try {
      const nextFeatured = !it.isFeatured;
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...it,
          isFeatured: nextFeatured,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(nextFeatured ? `Marked "${it.title}" as Featured` : `Removed "${it.title}" from Featured`);
        fetchGallery();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDuplicate = async (it: GalleryItem) => {
    try {
      const copyPayload = {
        ...it,
        id: `gal-${Date.now()}`,
        title: `${it.title} (Copy)`,
        displayOrder: items.length + 1,
      };
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copyPayload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Duplicated "${it.title}"`);
        fetchGallery();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const res = await fetch('/api/admin/settings/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Gallery settings synchronized and saved successfully');
        setSettingsDrawerOpen(false);
      } else {
        showToast(json.message || 'Error saving settings', 'error');
      }
    } catch (e: any) {
      showToast('Network error saving settings: ' + e.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      // Category filter
      const categoryMatch =
        selectedCategory === 'All' ||
        (it.subject || it.category || '').toLowerCase().includes(selectedCategory.toLowerCase());

      // Status filter
      let statusMatch = true;
      if (statusFilter === 'PUBLISHED') statusMatch = it.isPublished === true;
      if (statusFilter === 'DRAFTS') statusMatch = it.isPublished === false;
      if (statusFilter === 'FEATURED') statusMatch = it.isFeatured === true;

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const searchMatch =
        !q ||
        it.title.toLowerCase().includes(q) ||
        (it.caption || '').toLowerCase().includes(q) ||
        (it.subject || it.category || '').toLowerCase().includes(q) ||
        (it.location || '').toLowerCase().includes(q) ||
        (it.photographer || '').toLowerCase().includes(q) ||
        (it.cropType || '').toLowerCase().includes(q) ||
        (it.tags || '').toLowerCase().includes(q);

      return categoryMatch && statusMatch && searchMatch;
    });
  }, [items, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-white text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agricultural Gallery</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {items.length} Photographs
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synced with Settings
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Curate, manage, and edit every detail of agricultural showcase photography shown on the public /gallery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Settings Drawer Toggle */}
          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <Settings className="h-3.5 w-3.5 text-emerald-600" /> Gallery Settings
          </button>

          <Link
            href="/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" /> View Storefront
          </Link>

          <button
            onClick={() => {
              fetchGallery();
              fetchSettings();
            }}
            title="Refresh from database"
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
          >
            <Plus className="h-4 w-4" /> Add Photograph
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, Status, and View Switcher */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, location, crop, photographer, tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Status Filter */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium shrink-0">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition ${
                  statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setStatusFilter('PUBLISHED')}
                className={`px-2.5 py-1 rounded-md transition ${
                  statusFilter === 'PUBLISHED' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Published ({items.filter((i) => i.isPublished).length})
              </button>
              <button
                onClick={() => setStatusFilter('DRAFTS')}
                className={`px-2.5 py-1 rounded-md transition ${
                  statusFilter === 'DRAFTS' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Drafts ({items.filter((i) => !i.isPublished).length})
              </button>
              <button
                onClick={() => setStatusFilter('FEATURED')}
                className={`px-2.5 py-1 rounded-md transition ${
                  statusFilter === 'FEATURED' ? 'bg-white text-yellow-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ★ Featured ({items.filter((i) => i.isFeatured).length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shrink-0">
              <button
                onClick={() => setViewMode('GRID')}
                title="Grid Cards View"
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'GRID' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                title="Table Spreadsheet View"
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'TABLE' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pr-1 shrink-0">
            Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN VIEW: GRID OF CARDS */}
      {viewMode === 'GRID' && (
        <>
          {loading ? (
            <div className="p-16 text-center text-slate-500">
              <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Loading photographs from database...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
              <ImageIcon className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800">No photographs found</h3>
              <p className="text-xs text-slate-500">Try adjusting your search query, status, or category filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setStatusFilter('ALL');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition duration-200"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.alt || item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback image if broken
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-[10px] font-semibold text-white border border-white/20">
                        {item.subject || item.category || 'Farm Fields'}
                      </span>
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shadow-xs">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Published status badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.isPublished
                            ? 'bg-emerald-500/90 text-white backdrop-blur-xs'
                            : 'bg-amber-500/90 text-white backdrop-blur-xs'
                        }`}
                      >
                        {item.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    {/* Bottom overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <p className="text-[11px] text-white font-medium line-clamp-1">
                        📸 {item.photographer || 'Agri Mart Archive'}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1 leading-snug" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.caption || 'High-resolution agricultural field photo.'}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        {item.location && (
                          <span className="flex items-center gap-0.5 truncate" title={item.location}>
                            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </span>
                        )}
                        {item.cropType && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                            🌾 {item.cropType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 font-mono font-bold text-[11px]">
                        #{item.displayOrder || 1}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* 1-Click Feature Toggle */}
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`p-1.5 rounded-md transition ${
                            item.isFeatured
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                          }`}
                          title={item.isFeatured ? 'Remove Featured' : 'Mark as Featured'}
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </button>

                        {/* 1-Click Publish/Draft Toggle */}
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`p-1.5 rounded-md transition ${
                            item.isPublished
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={item.isPublished ? 'Unpublish (move to draft)' : 'Publish (make live)'}
                        >
                          {item.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(item)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Duplicate photograph"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>

                        {/* Full Edit Modal */}
                        <button
                          onClick={() => openEdit(item)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold text-[11px] transition"
                          title="Edit all details"
                        >
                          <Edit2 className="h-3 w-3 text-emerald-600" />
                          <span>Edit</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: TABLE / SPREADSHEET VIEW (For batch detail editing) */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4 w-20">Photo</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Photographer</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-500">
                      {item.displayOrder || 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.caption}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                        {item.subject || item.category || 'Farm Fields'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {item.location || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {item.photographer || 'Agri Mart Archive'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          item.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1 rounded transition cursor-pointer ${
                          item.isFeatured ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`h-4 w-4 ${item.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(item)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPREHENSIVE "EDIT EVERYTHING" MODAL                                     */}
      {/* ========================================================================= */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingItem ? `Edit Photograph: ${editingItem.title}` : 'Add New Photograph to Gallery'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure all visual, agricultural, attribution, and SEO details.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('GENERAL')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'GENERAL'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                General &amp; Description
              </button>
              <button
                onClick={() => setActiveTab('MEDIA')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'MEDIA'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Photo &amp; Visuals
              </button>
              <button
                onClick={() => setActiveTab('AGRI')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'AGRI'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Agricultural Context
              </button>
              <button
                onClick={() => setActiveTab('ATTRIBUTION')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'ATTRIBUTION'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Attribution &amp; License
              </button>
              <button
                onClick={() => setActiveTab('TECH')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'TECH'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Publishing &amp; Technical
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSavePhoto} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: GENERAL */}
              {activeTab === 'GENERAL' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Photograph Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Emerald Terraces & Open Fields"
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Category / Subject
                      </label>
                      <input
                        type="text"
                        list="category-suggestions"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="e.g. Farm Fields"
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <datalist id="category-suggestions">
                        {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Display Order Priority
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.displayOrder}
                        onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 1 })}
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Descriptive Caption &amp; Story
                    </label>
                    <textarea
                      rows={3}
                      value={form.caption}
                      onChange={(e) => setForm({ ...form, caption: e.target.value })}
                      placeholder="Describe what farming operation, machinery, or crop growth stage is shown in this photograph..."
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & VISUALS */}
              {activeTab === 'MEDIA' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Photograph Source (Local / URL / Unsplash) <span className="text-red-500">*</span>
                    </label>
                    <ImageEditorField
                      value={form.image}
                      onChange={(url) => setForm({ ...form, image: url })}
                      previewHeight="h-44"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Alt Text (SEO &amp; Accessibility)
                      </label>
                      <input
                        type="text"
                        value={form.alt}
                        onChange={(e) => setForm({ ...form, alt: e.target.value })}
                        placeholder="Descriptive alt text for screen readers and Google image search"
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Aspect Ratio Proportion
                      </label>
                      <select
                        value={form.aspectRatio}
                        onChange={(e) => setForm({ ...form, aspectRatio: e.target.value })}
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="4:3">4:3 (Standard Field Photography)</option>
                        <option value="16:9">16:9 (Landscape Panorama)</option>
                        <option value="1:1">1:1 (Square Focus)</option>
                        <option value="9:16">9:16 (Portrait / Reel)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AGRICULTURAL CONTEXT */}
              {activeTab === 'AGRI' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        📍 Farm Location &amp; Region
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. Mandya District, Karnataka, India"
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        🌾 Crop Variety / Specimen
                      </label>
                      <input
                        type="text"
                        value={form.cropType}
                        onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                        placeholder="e.g. Paddy / Basmati, Sugarcane, Maize, Cotton"
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        📅 Agricultural Season
                      </label>
                      <select
                        value={form.season}
                        onChange={(e) => setForm({ ...form, season: e.target.value })}
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Kharif 2026">Kharif Season (Monsoon)</option>
                        <option value="Rabi 2026">Rabi Season (Winter)</option>
                        <option value="Zaid / Summer 2026">Zaid / Summer Season</option>
                        <option value="Perennial / Year-Round">Perennial / Year-Round</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        🚜 Farming Methodology
                      </label>
                      <select
                        value={form.farmingMethod}
                        onChange={(e) => setForm({ ...form, farmingMethod: e.target.value })}
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Precision Mechanized">Precision Mechanized (4WD Tractor &amp; GPS)</option>
                        <option value="Drip Fertigation Automated">Drip Fertigation Automated</option>
                        <option value="Certified Organic / Bio-Dynamic">Certified Organic / Bio-Dynamic</option>
                        <option value="Drone Micron-Spraying">Drone Micron-Spraying</option>
                        <option value="Traditional Wetland Puddling">Traditional Wetland Puddling</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ATTRIBUTION & LICENSE */}
              {activeTab === 'ATTRIBUTION' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Photographer / Contributor Credit
                      </label>
                      <input
                        type="text"
                        value={form.photographer}
                        onChange={(e) => setForm({ ...form, photographer: e.target.value })}
                        placeholder="e.g. Dan Meyers, or Agri Mart Staff"
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Photographer Contact Email (Private)
                      </label>
                      <input
                        type="email"
                        value={form.photographerEmail}
                        onChange={(e) => setForm({ ...form, photographerEmail: e.target.value })}
                        placeholder="contributor@agrimart.com"
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Original Source / Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={form.sourceUrl}
                      onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                      placeholder="https://unsplash.com/photos/..."
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      License &amp; Usage Rights
                    </label>
                    <select
                      value={form.license}
                      onChange={(e) => setForm({ ...form, license: e.target.value })}
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Unsplash License (Free commercial & non-commercial use)">
                        Unsplash License (Free commercial &amp; non-commercial use)
                      </option>
                      <option value="All Rights Reserved - AGRI MART MEGA Private Archive">
                        All Rights Reserved - AGRI MART MEGA Private Archive
                      </option>
                      <option value="Creative Commons CC-BY 4.0">Creative Commons CC-BY 4.0</option>
                      <option value="Public Domain (CC0)">Public Domain (CC0)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 5: PUBLISHING & TECHNICAL */}
              {activeTab === 'TECH' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Published on Public Showcase</span>
                        <span className="text-[11px] text-slate-500">Photo will be visible on storefront /gallery</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">★ Featured Spotlight Photo</span>
                        <span className="text-[11px] text-slate-500">Highlighted with gold border in hero section</span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Camera / Drone Equipment
                      </label>
                      <input
                        type="text"
                        value={form.cameraModel}
                        onChange={(e) => setForm({ ...form, cameraModel: e.target.value })}
                        placeholder="e.g. Sony A7 IV 24-70mm, or DJI Mavic 3"
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Capture Date
                      </label>
                      <input
                        type="date"
                        value={form.dateTaken}
                        onChange={(e) => setForm({ ...form, dateTaken: e.target.value })}
                        className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Search Tags &amp; Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="e.g. irrigation, sprinkler, karnataka, drip, monsoon, crops"
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : editingItem ? 'Save All Changes' : 'Create Photograph'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTEGRATED GALLERY SETTINGS SLIDE-OVER DRAWER                             */}
      {/* ========================================================================= */}
      {settingsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Gallery Settings</h2>
                  <p className="text-[11px] text-slate-500">Sync display rules directly with storefront</p>
                </div>
              </div>
              <button
                onClick={() => setSettingsDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-800">
                  General Showcase Display
                </h3>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 block">Enable Gallery Showcase</span>
                    <span className="text-[11px] text-slate-500">Toggle public /gallery page availability</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Showcase Page Title</label>
                  <input
                    type="text"
                    value={settings.pageTitle || ''}
                    onChange={(e) => setSettings({ ...settings, pageTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Showcase Subtitle</label>
                  <textarea
                    rows={2}
                    value={settings.pageSubtitle || ''}
                    onChange={(e) => setSettings({ ...settings, pageSubtitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-800">
                  Layout &amp; Grid Columns
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Desktop Columns</label>
                    <select
                      value={settings.gridColumns || 4}
                      onChange={(e) => setSettings({ ...settings, gridColumns: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                    >
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns</option>
                      <option value={4}>4 Columns (Default)</option>
                      <option value={6}>6 Columns</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Photos Per Page</label>
                    <input
                      type="number"
                      min={4}
                      max={48}
                      value={settings.pageSize}
                      onChange={(e) => setSettings({ ...settings, pageSize: Number(e.target.value) || 12 })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                    >
                    </input>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-800">
                  Interactive Features
                </h3>

                <label className="flex items-center justify-between py-1.5">
                  <span className="text-slate-700">Full-Screen Lightbox Zoom</span>
                  <input
                    type="checkbox"
                    checked={settings.allowLightbox}
                    onChange={(e) => setSettings({ ...settings, allowLightbox: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between py-1.5">
                  <span className="text-slate-700">Category Filter Tabs</span>
                  <input
                    type="checkbox"
                    checked={settings.enableCategories}
                    onChange={(e) => setSettings({ ...settings, enableCategories: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between py-1.5">
                  <span className="text-slate-700">Show Photographer Attribution</span>
                  <input
                    type="checkbox"
                    checked={settings.showPhotographer}
                    onChange={(e) => setSettings({ ...settings, showPhotographer: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between py-1.5">
                  <span className="text-slate-700">Show Farm Location</span>
                  <input
                    type="checkbox"
                    checked={settings.showLocation}
                    onChange={(e) => setSettings({ ...settings, showLocation: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between py-1.5">
                  <span className="text-slate-700">Show Copyright License</span>
                  <input
                    type="checkbox"
                    checked={settings.showLicense}
                    onChange={(e) => setSettings({ ...settings, showLicense: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Changes save directly to `dev-database.json` and immediately synchronize across all panels.</span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <Link
                href="/admin/configuration/settings/gallery"
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Advanced Settings Page &rarr;
              </Link>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for deletion */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Photo"
        message={`Are you sure you want to permanently remove "${deleteTarget?.title}" from the agricultural gallery?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
