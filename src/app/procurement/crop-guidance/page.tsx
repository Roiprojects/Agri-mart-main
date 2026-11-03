'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Tractor,
  Layers,
  ExternalLink,
  ArrowLeft,
  FileText,
  Database,
  Save,
  Sparkles,
  BookOpen,
  LayoutTemplate,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
  DEFAULT_CROP_GUIDANCE_PAGE_CONTENT,
  DEFAULT_CROP_GUIDANCE_STAGES,
  DEFAULT_CROP_MASTER_GUIDES,
  type CropGuidancePageContent,
  type CropMasterGuide,
  type GuideTableSection,
} from '@/lib/crop-guidance-defaults';

const globalClientCache = globalThis as unknown as {
  __cgDataCache?: {
    stages?: CropGuidanceItem[];
    masterGuides?: CropMasterGuide[];
    pageContent?: CropGuidancePageContent;
  };
};

interface CropGuidanceItem {
  id: string;
  stageNumber: number;
  crop?: string;
  title: string;
  checklistTitle?: string;
  subtitle: string;
  summary: string;
  keyActions: string[];
  recommendedTools: string[];
  recommendedProducts?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProcurementCropGuidancePage() {
  const [activeTab, setActiveTab] = useState<'stages' | 'master-guides' | 'page-content'>('stages');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Data States — initialized immediately from cache or defaults for 0ms instant rendering
  const [stages, setStages] = useState<CropGuidanceItem[]>(
    () =>
      (globalClientCache.__cgDataCache?.stages as CropGuidanceItem[]) ||
      (DEFAULT_CROP_GUIDANCE_STAGES as unknown as CropGuidanceItem[])
  );
  const [masterGuides, setMasterGuides] = useState<CropMasterGuide[]>(
    () => globalClientCache.__cgDataCache?.masterGuides || DEFAULT_CROP_MASTER_GUIDES
  );
  const [pageContent, setPageContent] = useState<CropGuidancePageContent>(
    () => globalClientCache.__cgDataCache?.pageContent || DEFAULT_CROP_GUIDANCE_PAGE_CONTENT
  );

  // Filters for Tab 1 (7-Stage POP)
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ============================================================================
  // TAB 1 STATE: 7-STAGE POP MODAL (CREATE / EDIT / DELETE)
  // ============================================================================
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<CropGuidanceItem | null>(null);
  const [deleteStageTarget, setDeleteStageTarget] = useState<CropGuidanceItem | null>(null);
  const [deletingStage, setDeletingStage] = useState(false);

  const [stageNumber, setStageNumber] = useState<number | string>(1);
  const [crop, setCrop] = useState('All Crops');
  const [title, setTitle] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('Agronomist Action Checklist');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [keyActions, setKeyActions] = useState<string[]>(['']);
  const [newActionInput, setNewActionInput] = useState('');
  const [recommendedTools, setRecommendedTools] = useState<string[]>([]);
  const [newToolInput, setNewToolInput] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<string[]>([]);
  const [newProductInput, setNewProductInput] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

  // ============================================================================
  // TAB 2 STATE: CROP-SPECIFIC MASTER GUIDES CRUD
  // ============================================================================
  const [selectedMasterCropId, setSelectedMasterCropId] = useState<string>('rose');

  // Add/Edit Crop Guide Modal
  const [cropGuideModalOpen, setCropGuideModalOpen] = useState(false);
  const [editingCropGuide, setEditingCropGuide] = useState<CropMasterGuide | null>(null);
  const [cropGuideName, setCropGuideName] = useState('');
  const [cropGuideCategory, setCropGuideCategory] = useState('');
  const [cropGuideTagline, setCropGuideTagline] = useState('');

  // Add/Edit Section Modal & Inline Section Editing
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [inlineEditingSecIdx, setInlineEditingSecIdx] = useState<number | null>(null);
  const [secTitle, setSecTitle] = useState('');
  const [secBadge, setSecBadge] = useState('');
  const [secTheme, setSecTheme] = useState<'emerald' | 'amber' | 'rose' | 'sky'>('emerald');
  const [secHeaders, setSecHeaders] = useState<string[]>(['', '', '', '']);
  const [secRows, setSecRows] = useState<string[][]>([]);

  // Add/Edit Row Modal
  const [rowModalOpen, setRowModalOpen] = useState(false);
  const [activeRowSectionIdx, setActiveRowSectionIdx] = useState<number>(0);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [rowCells, setRowCells] = useState<string[]>(['', '', '', '']);

  // Fetch all Crop Guidance data silently in background without blocking initial UI render
  const fetchAllData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (cropFilter !== 'All') params.set('crop', cropFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/crop-guidance?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        const nextStages = json.data || [];
        const nextGuides =
          Array.isArray(json.masterGuides) && json.masterGuides.length > 0
            ? json.masterGuides
            : DEFAULT_CROP_MASTER_GUIDES;
        const nextContent = json.pageContent
          ? { ...DEFAULT_CROP_GUIDANCE_PAGE_CONTENT, ...json.pageContent }
          : DEFAULT_CROP_GUIDANCE_PAGE_CONTENT;

        if (!search && cropFilter === 'All' && statusFilter === 'all') {
          globalClientCache.__cgDataCache = {
            stages: nextStages,
            masterGuides: nextGuides,
            pageContent: nextContent,
          };
        }

        setStages(nextStages);
        setMasterGuides(nextGuides);
        setSelectedMasterCropId((prev) =>
          nextGuides.some((g: CropMasterGuide) => g.id === prev) ? prev : nextGuides[0].id
        );
        setPageContent(nextContent);
      }
    } catch {
      showToast('Error loading crop guidance data', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, cropFilter, statusFilter]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ============================================================================
  // TAB 1 HANDLERS: 7-STAGE POP CRUD
  // ============================================================================
  const openCreateStage = () => {
    setEditingStage(null);
    const nextNum = stages.length + 1;
    setStageNumber(nextNum);
    setCrop('All Crops');
    setTitle(`Stage ${nextNum}: `);
    setChecklistTitle('Agronomist Action Checklist');
    setSubtitle('');
    setSummary('');
    setKeyActions(['']);
    setRecommendedTools([]);
    setRecommendedProducts([]);
    setDisplayOrder(nextNum);
    setIsActive(true);
    setStageModalOpen(true);
  };

  const openEditStage = (it: CropGuidanceItem) => {
    setEditingStage(it);
    setStageNumber(it.stageNumber || 1);
    setCrop(it.crop || 'All Crops');
    setTitle(it.title || '');
    setChecklistTitle(it.checklistTitle || 'Agronomist Action Checklist');
    setSubtitle(it.subtitle || '');
    setSummary(it.summary || '');
    setKeyActions(it.keyActions && it.keyActions.length > 0 ? [...it.keyActions] : ['']);
    setRecommendedTools(it.recommendedTools || []);
    setRecommendedProducts(it.recommendedProducts || []);
    setDisplayOrder(it.displayOrder || 1);
    setIsActive(it.isActive !== false);
    setStageModalOpen(true);
  };

  const handleSaveStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Stage title is required', 'error');
      return;
    }
    try {
      setSaving(true);
      const cleanedActions = keyActions.map((a) => a.trim()).filter((a) => a.length > 0);
      const payload = {
        entity: 'stage',
        id: editingStage?.id,
        stageNumber: Number(stageNumber) || 1,
        crop,
        title: title.trim(),
        checklistTitle: checklistTitle.trim() || 'Agronomist Action Checklist',
        subtitle: subtitle.trim(),
        summary: summary.trim(),
        keyActions: cleanedActions,
        recommendedTools,
        recommendedProducts,
        displayOrder: Number(displayOrder) || 1,
        isActive,
      };

      const res = await fetch('/api/admin/crop-guidance', {
        method: editingStage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          editingStage
            ? `Updated "${title.trim()}" & synced to PostgreSQL/Storefront`
            : `Created "${title.trim()}" & synced to PostgreSQL/Storefront`
        );
        setStageModalOpen(false);
        fetchAllData();
      } else {
        showToast(json.message || 'Error saving stage', 'error');
      }
    } catch {
      showToast('Network error saving stage', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStage = async () => {
    if (!deleteStageTarget) return;
    try {
      setDeletingStage(true);
      const res = await fetch(
        `/api/admin/crop-guidance?entity=stage&id=${encodeURIComponent(deleteStageTarget.id)}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        showToast('Stage deleted & synced to Storefront');
        setDeleteStageTarget(null);
        fetchAllData();
      } else {
        showToast(json.message || 'Error deleting stage', 'error');
      }
    } catch {
      showToast('Network error deleting stage', 'error');
    } finally {
      setDeletingStage(false);
    }
  };

  const handleToggleStageActive = async (it: CropGuidanceItem) => {
    try {
      const res = await fetch('/api/admin/crop-guidance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'stage', ...it, isActive: !it.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Stage ${it.stageNumber} ${!it.isActive ? 'activated' : 'deactivated'}`);
        fetchAllData();
      }
    } catch {
      showToast('Error toggling stage status', 'error');
    }
  };

  // ============================================================================
  // TAB 2 HANDLERS: CROP-SPECIFIC MASTER GUIDES CRUD (CROPS, SECTIONS, ROWS)
  // ============================================================================
  const activeMasterCrop =
    masterGuides.find((g) => g.id === selectedMasterCropId) || masterGuides[0] || null;

  const openCreateCropModal = () => {
    setEditingCropGuide(null);
    setCropGuideName('');
    setCropGuideCategory('Commercial Horticulture & Field Crop');
    setCropGuideTagline('');
    setCropGuideModalOpen(true);
  };

  const openEditCropModal = (guide: CropMasterGuide) => {
    setEditingCropGuide(guide);
    setCropGuideName(guide.name);
    setCropGuideCategory(guide.category);
    setCropGuideTagline(guide.tagline);
    setCropGuideModalOpen(true);
  };

  const handleSaveCropGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropGuideName.trim()) {
      showToast('Crop name is required', 'error');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/crop-guidance', {
        method: editingCropGuide ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'masterGuide',
          cropId: editingCropGuide?.id,
          name: cropGuideName.trim(),
          category: cropGuideCategory.trim(),
          tagline: cropGuideTagline.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        if (!editingCropGuide && json.data?.id) {
          setSelectedMasterCropId(json.data.id);
        }
        setCropGuideModalOpen(false);
        showToast(
          editingCropGuide
            ? `Updated "${cropGuideName}" crop guide`
            : `Created "${cropGuideName}" crop guide`
        );
      } else {
        showToast(json.message || 'Failed to save crop guide', 'error');
      }
    } catch {
      showToast('Error saving crop guide', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCropGuide = async (guide: CropMasterGuide) => {
    if (!window.confirm(`Delete entire "${guide.name}" Master Guide and all its tables?`)) return;
    try {
      const res = await fetch(
        `/api/admin/crop-guidance?entity=masterGuide&cropId=${encodeURIComponent(guide.id)}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        if (json.masterGuides?.length > 0) {
          setSelectedMasterCropId(json.masterGuides[0].id);
        }
        showToast(`Deleted "${guide.name}" guide`);
      }
    } catch {
      showToast('Failed to delete crop guide', 'error');
    }
  };

  // Section CRUD — Blank boxes by default when adding a new section
  const getBlankSectionRows = (colCount = 4, rowCount = 4): string[][] =>
    Array.from({ length: rowCount }, () => Array(colCount).fill(''));

  // Opens the Full Section Table Modal with completely empty boxes when clicking "+ Add New Section Table"
  const handleAddCompleteNewSection = () => {
    if (!activeMasterCrop) return;
    setEditingSectionIndex(null);
    setSecTitle('');
    setSecBadge('');
    setSecTheme('emerald');
    setSecHeaders(['', '', '', '']);
    setSecRows(getBlankSectionRows(4, 4));
    setSectionModalOpen(true);
  };

  // Update a section in local state for inline editing
  const updateLocalSection = (
    secIdx: number,
    updater: (sec: GuideTableSection) => GuideTableSection
  ) => {
    if (!activeMasterCrop) return;
    setMasterGuides((prev) =>
      prev.map((g) => {
        if (g.id !== activeMasterCrop.id) return g;
        const nextSections = g.sections.map((s, idx) => (idx === secIdx ? updater(s) : s));
        return { ...g, sections: nextSections };
      })
    );
  };

  // Save inline-edited section to backend
  const handleSaveInlineSection = async (secIdx: number) => {
    if (!activeMasterCrop) return;
    const sec = activeMasterCrop.sections[secIdx];
    if (!sec) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/crop-guidance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'masterSection',
          cropId: activeMasterCrop.id,
          sectionIndex: secIdx,
          section: sec,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        setInlineEditingSecIdx(null);
        showToast('Section saved & synced to PostgreSQL/Storefront!');
      } else {
        showToast(json.message || 'Failed to save section', 'error');
      }
    } catch {
      showToast('Error saving section', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Add a blank row directly to a section on the page
  const handleAddBlankRowInline = async (secIdx: number) => {
    if (!activeMasterCrop) return;
    const sec = activeMasterCrop.sections[secIdx];
    if (!sec) return;
    const colCount = sec.headers?.length || 4;
    const updatedSec: GuideTableSection = {
      ...sec,
      rows: [...(sec.rows || []), Array(colCount).fill('')],
    };
    updateLocalSection(secIdx, () => updatedSec);
    setInlineEditingSecIdx(secIdx);
    try {
      const res = await fetch('/api/admin/crop-guidance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'masterSection',
          cropId: activeMasterCrop.id,
          sectionIndex: secIdx,
          section: updatedSec,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        showToast('Added new empty row');
      }
    } catch {
      showToast('Error adding row', 'error');
    }
  };

  // Add a blank column directly to a section on the page
  const handleAddColumnInline = async (secIdx: number) => {
    if (!activeMasterCrop) return;
    const sec = activeMasterCrop.sections[secIdx];
    if (!sec) return;
    const nextHeaders = [...(sec.headers || []), ''];
    const nextColCount = nextHeaders.length;
    const nextRows = (sec.rows || []).map((r) => {
      const copy = [...r];
      while (copy.length < nextColCount) copy.push('');
      return copy;
    });
    const updatedSec: GuideTableSection = {
      ...sec,
      headers: nextHeaders,
      rows: nextRows,
    };
    updateLocalSection(secIdx, () => updatedSec);
    setInlineEditingSecIdx(secIdx);
    try {
      const res = await fetch('/api/admin/crop-guidance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'masterSection',
          cropId: activeMasterCrop.id,
          sectionIndex: secIdx,
          section: updatedSec,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        showToast('Added new empty column');
      }
    } catch {
      showToast('Error adding column', 'error');
    }
  };

  // Delete a column from a section on the page
  const handleDeleteColumnInline = async (secIdx: number, colIdx: number) => {
    if (!activeMasterCrop) return;
    const sec = activeMasterCrop.sections[secIdx];
    if (!sec || (sec.headers?.length || 0) <= 1) {
      showToast('Section must have at least 1 column', 'error');
      return;
    }
    const nextHeaders = sec.headers.filter((_, idx) => idx !== colIdx);
    const nextRows = (sec.rows || []).map((r) => r.filter((_, idx) => idx !== colIdx));
    const updatedSec: GuideTableSection = {
      ...sec,
      headers: nextHeaders,
      rows: nextRows,
    };
    updateLocalSection(secIdx, () => updatedSec);
    try {
      const res = await fetch('/api/admin/crop-guidance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'masterSection',
          cropId: activeMasterCrop.id,
          sectionIndex: secIdx,
          section: updatedSec,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        showToast('Column removed');
      }
    } catch {
      showToast('Error removing column', 'error');
    }
  };

  const openEditSectionModal = (sec: GuideTableSection, idx: number) => {
    setEditingSectionIndex(idx);
    setSecTitle(sec.title || '');
    setSecBadge(sec.badge || '');
    setSecTheme(sec.theme || 'emerald');
    const hdrs = sec.headers?.length ? [...sec.headers] : ['', '', '', ''];
    setSecHeaders(hdrs);
    setSecRows(
      Array.isArray(sec.rows) && sec.rows.length > 0
        ? sec.rows.map((r) => Array.from({ length: hdrs.length }, (_, i) => r[i] ?? ''))
        : getBlankSectionRows(hdrs.length, 4)
    );
    setSectionModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMasterCrop) return;
    try {
      setSaving(true);
      const isEdit = editingSectionIndex !== null;
      const res = await fetch('/api/admin/crop-guidance', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'masterSection',
          cropId: activeMasterCrop.id,
          sectionIndex: editingSectionIndex,
          section: {
            title: secTitle.trim(),
            badge: secBadge.trim(),
            theme: secTheme,
            headers: secHeaders.map((h) => h.trim()),
            rows: secRows,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        setSectionModalOpen(false);
        showToast(isEdit ? 'Section updated & synced' : 'New section table added & synced');
      }
    } catch {
      showToast('Error saving section', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (secIdx: number, secTitleText: string) => {
    if (!activeMasterCrop) return;
    if (!window.confirm(`Delete section "${secTitleText}" and all its rows?`)) return;
    try {
      const res = await fetch(
        `/api/admin/crop-guidance?entity=masterSection&cropId=${encodeURIComponent(
          activeMasterCrop.id
        )}&sectionIndex=${secIdx}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        showToast('Section deleted');
      }
    } catch {
      showToast('Error deleting section', 'error');
    }
  };

  // Row CRUD
  const openAddRowModal = (sectionIdx: number) => {
    if (!activeMasterCrop) return;
    const sec = activeMasterCrop.sections[sectionIdx];
    const colCount = sec?.headers?.length || 4;
    setActiveRowSectionIdx(sectionIdx);
    setEditingRowIndex(null);
    setRowCells(Array(colCount).fill(''));
    setRowModalOpen(true);
  };

  const openEditRowModal = (sectionIdx: number, rowIdx: number, row: string[]) => {
    if (!activeMasterCrop) return;
    const sec = activeMasterCrop.sections[sectionIdx];
    const colCount = sec?.headers?.length || 4;
    const padded = Array.from({ length: colCount }, (_, i) => row[i] || '');
    setActiveRowSectionIdx(sectionIdx);
    setEditingRowIndex(rowIdx);
    setRowCells(padded);
    setRowModalOpen(true);
  };

  const handleSaveRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMasterCrop) return;
    try {
      setSaving(true);
      const isEdit = editingRowIndex !== null;
      const res = await fetch('/api/admin/crop-guidance', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'masterRow',
          cropId: activeMasterCrop.id,
          sectionIndex: activeRowSectionIdx,
          rowIndex: editingRowIndex,
          row: rowCells,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        setRowModalOpen(false);
        showToast(isEdit ? 'Row updated & synced to Storefront' : 'New row added & synced');
      }
    } catch {
      showToast('Error saving row', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRow = async (sectionIdx: number, rowIdx: number) => {
    if (!activeMasterCrop) return;
    try {
      const res = await fetch(
        `/api/admin/crop-guidance?entity=masterRow&cropId=${encodeURIComponent(
          activeMasterCrop.id
        )}&sectionIndex=${sectionIdx}&rowIndex=${rowIdx}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        setMasterGuides(json.masterGuides || []);
        showToast('Row deleted & synced');
      }
    } catch {
      showToast('Error deleting row', 'error');
    }
  };

  // ============================================================================
  // TAB 3 HANDLER: PAGE HERO & BANNER CONTENT SAVE
  // ============================================================================
  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/crop-guidance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'pageContent',
          pageContent,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPageContent(json.pageContent);
        showToast('Crop Guidance Hero & Banner Content saved & synced to Storefront!');
      }
    } catch {
      showToast('Error saving page content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const totalMasterRows = masterGuides.reduce(
    (acc, g) => acc + (g.sections || []).reduce((sAcc, s) => sAcc + (s.rows?.length || 0), 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-800 text-xs">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-bold border animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-500 text-white'
              : 'bg-rose-950 border-rose-500 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Back Button */}
      <div>
        <Link
          href="/procurement"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Back</span>
        </Link>
      </div>

      {/* Top Procurement & Agronomy Tracker Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#183526] to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-900/40 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B4D334] text-slate-950 uppercase tracking-wide">
              Crop Guidance
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Database className="w-3 h-3" /> PostgreSQL &amp; Storefront Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Sprout className="w-7 h-7 text-[#F7C629]" />
            Crop Guidance — Complete Backend Content &amp; CRUD Manager
          </h1>
          <p className="text-slate-300 text-xs max-w-2xl">
            Full Create, Read, Update, and Delete (CRUD) control over all 7 Agricultural Production
            Stages, Agronomist Action Checklists, Crop-Specific Master Guides (Rose, Chrysanthemum,
            Pomegranate, Grape &amp; custom crops), and Hero Banner content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/crop-guidance"
            className="bg-[#F7C629] hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <span>View Live Crop Guidance</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive KPI Navigation Card Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab('stages');
            setTimeout(() => {
              document
                .getElementById('cg-section-stages')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }}
          className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'stages'
              ? 'bg-emerald-50/70 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              7-Stage Guidance Modules
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{stages.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('master-guides');
            setTimeout(() => {
              document
                .getElementById('cg-section-master-guides')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }}
          className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'master-guides'
              ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              Master Crop Guides
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              {masterGuides.length} Crops
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('master-guides');
            setTimeout(() => {
              document
                .getElementById('cg-active-crop-tables')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
          }}
          className="bg-white p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-sm text-left transition-all flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              Total IPM &amp; Stage Rows
            </div>
            <div className="text-2xl font-black text-indigo-700 mt-0.5">{totalMasterRows}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: 7-STAGE AGRICULTURAL PRODUCTION CRUD                           */}
      {/* ===================================================================== */}
      {activeTab === 'stages' && (
        <div id="cg-section-stages" className="space-y-4">
          {/* Filter & Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search stage title, subtitle, or checklist items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <button
              type="button"
              onClick={openCreateStage}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Production Stage</span>
            </button>
          </div>

          {/* Stages Cards List */}
          <div className="space-y-4">
            {stages.map((st) => (
              <div
                key={st.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500/60 p-5 shadow-xs transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                        Stage #{st.stageNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {st.crop || 'All Crops'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleStageActive(st)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                          st.isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.isActive ? 'Active on Storefront' : 'Hidden'}
                      </button>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">{st.title}</h3>
                    <div className="text-xs font-bold text-emerald-700">{st.subtitle}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditStage(st)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs border border-emerald-300 flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Stage &amp; Checklist</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteStageTarget(st)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition"
                      title="Delete Stage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{st.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                    <div className="text-xs font-extrabold uppercase text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {st.checklistTitle || 'Agronomist Action Checklist'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {(st.keyActions || []).length} items
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {(st.keyActions || []).map((act, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">&bull;</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 space-y-3">
                    <div>
                      <div className="text-xs font-extrabold uppercase text-emerald-950 flex items-center gap-1.5 mb-2">
                        <Tractor className="w-4 h-4 text-emerald-700" /> Mechanized Tools &amp;
                        Equipment
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(st.recommendedTools || []).map((t, i) => (
                          <span
                            key={i}
                            className="bg-white text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {(st.recommendedProducts || []).length > 0 && (
                      <div className="pt-2 border-t border-emerald-200/70">
                        <div className="text-[11px] font-bold text-emerald-900 mb-1.5">
                          Recommended Products:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(st.recommendedProducts || []).map((p, i) => (
                            <span
                              key={i}
                              className="bg-amber-50 text-amber-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-amber-200"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: CROP-SPECIFIC MASTER GUIDES CRUD (ROSE, CHRYSANTHEMUM, ETC.)   */}
      {/* ===================================================================== */}
      {activeTab === 'master-guides' && (
        <div id="cg-section-master-guides" className="space-y-6">
          {/* Crop Selector & Add New Crop Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              {masterGuides.map((g, idx) => {
                const isSelected = activeMasterCrop?.id === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedMasterCropId(g.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                        isSelected
                          ? 'bg-amber-300 text-emerald-950'
                          : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span>{g.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openCreateCropModal}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Crop Master Guide</span>
              </button>
            </div>
          </div>

          {activeMasterCrop && (
            <div id="cg-active-crop-tables" className="space-y-6">
              {/* Active Crop Header Card */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-800">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    {activeMasterCrop.category}
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {activeMasterCrop.name} — Complete Field &amp; Protection Guide
                  </h2>
                  <p className="text-xs text-emerald-100">{activeMasterCrop.tagline}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditCropModal(activeMasterCrop)}
                    className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Crop Info</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleAddCompleteNewSection}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Section Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCropGuide(activeMasterCrop)}
                    className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 border border-rose-400/30 cursor-pointer"
                    title="Delete Crop Guide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* All Tables / Sections for the Selected Crop */}
              {activeMasterCrop.sections.map((section, sIdx) => {
                const isNewOrBlank =
                  !section.title?.trim() &&
                  section.headers.every((h) => !h?.trim()) &&
                  section.rows.every((r) => r.every((c) => !c?.trim()));
                const isEditingBoxes = inlineEditingSecIdx === sIdx || isNewOrBlank;

                return (
                  <div
                    id={`crop-sec-${activeMasterCrop.id}-${sIdx}`}
                    key={`${activeMasterCrop.id}-sec-${sIdx}`}
                    className="bg-white rounded-2xl border-2 border-slate-200 shadow-xs overflow-hidden"
                  >
                    <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex-1 min-w-[240px]">
                        {isEditingBoxes ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl">
                            <input
                              type="text"
                              value={section.badge || ''}
                              onChange={(e) =>
                                updateLocalSection(sIdx, (s) => ({
                                  ...s,
                                  badge: e.target.value,
                                }))
                              }
                              placeholder="Enter section badge (e.g. Cultivation Stages)..."
                              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-amber-300 placeholder:text-slate-400 font-bold text-xs focus:outline-none focus:border-amber-400"
                            />
                            <input
                              type="text"
                              value={section.title || ''}
                              onChange={(e) =>
                                updateLocalSection(sIdx, (s) => ({
                                  ...s,
                                  title: e.target.value,
                                }))
                              }
                              placeholder="Enter section title..."
                              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-400 font-extrabold text-xs focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                                {section.badge || 'Section'}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                ({section.headers.length} columns • {section.rows.length} rows)
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                              {section.title || `Section #${sIdx + 1}`}
                            </h3>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditSectionModal(section, sIdx)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Section</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sIdx, section.title || `Section #${sIdx + 1}`)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 cursor-pointer"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                        <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] border-b border-slate-200">
                          <tr>
                            {section.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2.5 border-r border-slate-200 align-middle">
                                {isEditingBoxes ? (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={h || ''}
                                      onChange={(e) =>
                                        updateLocalSection(sIdx, (s) => {
                                          const nextH = [...s.headers];
                                          nextH[hIdx] = e.target.value;
                                          return { ...s, headers: nextH };
                                        })
                                      }
                                      placeholder={`Column ${hIdx + 1} Header`}
                                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
                                    />
                                    {section.headers.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteColumnInline(sIdx, hIdx)}
                                        className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 shrink-0 cursor-pointer"
                                        title="Delete Column"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between gap-2">
                                    <span>{h || `Column ${hIdx + 1}`}</span>
                                    {section.headers.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteColumnInline(sIdx, hIdx)}
                                        className="p-1 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 shrink-0 cursor-pointer"
                                        title="Delete Column"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </th>
                            ))}
                            <th className="p-3 w-28 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {section.rows.length === 0 ? (
                            <tr>
                              <td
                                colSpan={section.headers.length + 1}
                                className="p-6 text-center text-slate-400"
                              >
                                No rows in this section yet. Click &quot;+ Add Row&quot; to add an
                                entry.
                              </td>
                            </tr>
                          ) : (
                            section.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/80 align-top">
                                {section.headers.map((_, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`p-2.5 border-r border-slate-200 leading-relaxed ${
                                      cIdx === 0 && !isEditingBoxes
                                        ? 'font-bold text-emerald-950 bg-emerald-50/30 w-44'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {isEditingBoxes ? (
                                      <textarea
                                        rows={2}
                                        value={row[cIdx] || ''}
                                        onChange={(e) =>
                                          updateLocalSection(sIdx, (s) => {
                                            const nextRows = s.rows.map((r, ri) => {
                                              if (ri !== rIdx) return r;
                                              const padded = Array.from(
                                                { length: s.headers.length },
                                                (__, ci) => r[ci] ?? ''
                                              );
                                              padded[cIdx] = e.target.value;
                                              return padded;
                                            });
                                            return { ...s, rows: nextRows };
                                          })
                                        }
                                        placeholder=""
                                        className={`w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 ${
                                          cIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-700'
                                        }`}
                                      />
                                    ) : (
                                      row[cIdx] || ''
                                    )}
                                  </td>
                                ))}
                                <td className="p-3 text-center align-middle">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => openEditRowModal(sIdx, rIdx, row)}
                                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                                      title="Edit Row"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRow(sIdx, rIdx)}
                                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                                      title="Delete Row"
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: HERO BANNER & PAGE HEADERS CONTENT                             */}
      {/* ===================================================================== */}
      {activeTab === 'page-content' && (
        <form
          id="cg-section-page-content"
          onSubmit={handleSavePageContent}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Crop Guidance Page — Hero Banner, Section Titles &amp; Bottom CTA
              </h2>
              <p className="text-xs text-slate-500">
                Edit all headings, badges, descriptions, and call-to-action buttons displayed on{' '}
                <code>/crop-guidance</code>.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Page Content'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Badge Text</label>
              <input
                type="text"
                value={pageContent.heroBadge}
                onChange={(e) => setPageContent({ ...pageContent, heroBadge: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Top Subtitle
              </label>
              <input
                type="text"
                value={pageContent.heroSubtitle}
                onChange={(e) => setPageContent({ ...pageContent, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Main Hero Title</label>
              <input
                type="text"
                value={pageContent.heroTitle}
                onChange={(e) => setPageContent({ ...pageContent, heroTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Description
              </label>
              <textarea
                rows={2}
                value={pageContent.heroDescription}
                onChange={(e) =>
                  setPageContent({ ...pageContent, heroDescription: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={pageContent.primaryCtaText}
                onChange={(e) => setPageContent({ ...pageContent, primaryCtaText: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                value={pageContent.secondaryCtaText}
                onChange={(e) =>
                  setPageContent({ ...pageContent, secondaryCtaText: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2 pt-3 border-t border-slate-200">
              <h3 className="text-xs font-black uppercase text-emerald-800 mb-2">
                Master Crop Guides Section Header
              </h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
              <input
                type="text"
                value={pageContent.masterSectionBadge}
                onChange={(e) =>
                  setPageContent({ ...pageContent, masterSectionBadge: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
              <input
                type="text"
                value={pageContent.masterSectionTitle}
                onChange={(e) =>
                  setPageContent({ ...pageContent, masterSectionTitle: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section Description
              </label>
              <textarea
                rows={2}
                value={pageContent.masterSectionDescription}
                onChange={(e) =>
                  setPageContent({ ...pageContent, masterSectionDescription: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2 pt-3 border-t border-slate-200">
              <h3 className="text-xs font-black uppercase text-emerald-800 mb-2">
                Bottom AI Crop Doctor Call-to-Action Banner
              </h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Banner Badge</label>
              <input
                type="text"
                value={pageContent.aiBannerBadge}
                onChange={(e) => setPageContent({ ...pageContent, aiBannerBadge: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title</label>
              <input
                type="text"
                value={pageContent.aiBannerTitle}
                onChange={(e) => setPageContent({ ...pageContent, aiBannerTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Banner Description
              </label>
              <textarea
                rows={2}
                value={pageContent.aiBannerDescription}
                onChange={(e) =>
                  setPageContent({ ...pageContent, aiBannerDescription: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </form>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: ADD / EDIT 7-STAGE POP STAGE & CHECKLIST                     */}
      {/* ===================================================================== */}
      {stageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-extrabold">
                  {editingStage
                    ? `Edit Stage #${editingStage.stageNumber}: ${editingStage.title}`
                    : 'Add New Crop Guidance Stage'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStageModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveStage}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stage Number *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={stageNumber}
                    onChange={(e) => setStageNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Scope</label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Checklist Heading</label>
                  <input
                    type="text"
                    value={checklistTitle}
                    onChange={(e) => setChecklistTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stage Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stage 3: General Manuring Practices"
                  className="w-full px-3 py-2 font-bold border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stage Summary</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Checklist Bullet Points CRUD */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800">
                    Agronomist Action Checklist Points ({keyActions.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setKeyActions([...keyActions, ''])}
                    className="text-emerald-700 font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                  </button>
                </div>

                {keyActions.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={act}
                      onChange={(e) => {
                        const copy = [...keyActions];
                        copy[idx] = e.target.value;
                        setKeyActions(copy);
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setKeyActions(keyActions.filter((_, i) => i !== idx))}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type new checklist action and click Add..."
                    value={newActionInput}
                    onChange={(e) => setNewActionInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-dashed border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newActionInput.trim()) {
                        setKeyActions([...keyActions, newActionInput.trim()]);
                        setNewActionInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tools CRUD */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
                <label className="block font-extrabold text-emerald-950">
                  Mechanized Tools &amp; Equipment
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedTools.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 font-semibold"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setRecommendedTools(recommendedTools.filter((_, idx) => idx !== i))
                        }
                        className="text-rose-600 hover:text-rose-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tool (e.g. Drip Irrigation Kits)..."
                    value={newToolInput}
                    onChange={(e) => setNewToolInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newToolInput.trim()) {
                        setRecommendedTools([...recommendedTools, newToolInput.trim()]);
                        setNewToolInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Add Tool
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Stage & Sync'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ADD / EDIT CROP MASTER GUIDE                                 */}
      {/* ===================================================================== */}
      {cropGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="text-sm font-extrabold">
                {editingCropGuide
                  ? `Edit Crop Master Guide: ${editingCropGuide.name}`
                  : 'Create New Crop Master Guide'}
              </h3>
              <button
                type="button"
                onClick={() => setCropGuideModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCropGuide} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rose, Tomato, Chilli, Pomegranate"
                  value={cropGuideName}
                  onChange={(e) => setCropGuideName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Category</label>
                <input
                  type="text"
                  placeholder="e.g. Floriculture & Commercial Cut Flowers"
                  value={cropGuideCategory}
                  onChange={(e) => setCropGuideCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline / Overview</label>
                <textarea
                  rows={2}
                  value={cropGuideTagline}
                  onChange={(e) => setCropGuideTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCropGuideModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-extrabold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Crop Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: ADD / EDIT SECTION TABLE                                     */}
      {/* ===================================================================== */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="text-sm font-extrabold">
                {editingSectionIndex !== null
                  ? 'Edit Full Section Table (Headers & All Rows)'
                  : 'Add Complete New Section Table'}
              </h3>
              <button
                type="button"
                onClick={() => setSectionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSection} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Title *</label>
                  <input
                    type="text"
                    required
                    value={secTitle}
                    onChange={(e) => setSecTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={secBadge}
                    onChange={(e) => setSecBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Color Theme</label>
                  <select
                    value={secTheme}
                    onChange={(e) => setSecTheme(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="emerald">Emerald (Cultivation Stages)</option>
                    <option value="amber">Amber (Pest Diagnostics &amp; IPM)</option>
                    <option value="rose">Rose (Disease Management)</option>
                    <option value="sky">Sky Blue (Nutrient &amp; Disorders)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    Table Column Headers ({secHeaders.length} Columns)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const nextHeaders = [...secHeaders, ''];
                      setSecHeaders(nextHeaders);
                      setSecRows(
                        secRows.map((r) => {
                          const copy = [...r];
                          while (copy.length < nextHeaders.length) copy.push('');
                          return copy;
                        })
                      );
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Column</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {secHeaders.map((h, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const copy = [...secHeaders];
                          copy[i] = e.target.value;
                          setSecHeaders(copy);
                        }}
                        placeholder={`Column ${i + 1} Header`}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold bg-slate-50"
                      />
                      {secHeaders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextH = secHeaders.filter((_, idx) => idx !== i);
                            setSecHeaders(nextH);
                            setSecRows(secRows.map((r) => r.filter((_, idx) => idx !== i)));
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 shrink-0 cursor-pointer"
                          title="Remove Column"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                    Section Table Rows ({secRows.length} Rows)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSecRows([...secRows, Array(secHeaders.length || 4).fill('')])
                    }
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse min-w-[780px]">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        {secHeaders.map((h, i) => (
                          <th key={i} className="p-2.5 border-r border-slate-200">
                            {h || `Column ${i + 1}`}
                          </th>
                        ))}
                        <th className="p-2.5 w-16 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {secRows.map((r, rIdx) => (
                        <tr key={rIdx} className="align-top hover:bg-slate-50/70">
                          {secHeaders.map((_, cIdx) => (
                            <td key={cIdx} className="p-2 border-r border-slate-100">
                              <textarea
                                rows={2}
                                value={r[cIdx] || ''}
                                onChange={(e) => {
                                  const next = secRows.map((row, idx) => {
                                    if (idx !== rIdx) return row;
                                    const padded = Array.from(
                                      { length: secHeaders.length },
                                      (__, ci) => row[ci] ?? ''
                                    );
                                    padded[cIdx] = e.target.value;
                                    return padded;
                                  });
                                  setSecRows(next);
                                }}
                                placeholder=""
                                className={`w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 focus:outline-none ${
                                  cIdx === 0 ? 'font-extrabold text-slate-900' : 'text-slate-700'
                                }`}
                              />
                            </td>
                          ))}
                          <td className="p-2 text-center align-middle">
                            <button
                              type="button"
                              onClick={() =>
                                setSecRows(secRows.filter((_, idx) => idx !== rIdx))
                              }
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                              title="Remove Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-extrabold cursor-pointer"
                >
                  Save Complete Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: ADD / EDIT TABLE ROW                                         */}
      {/* ===================================================================== */}
      {rowModalOpen && activeMasterCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="text-sm font-extrabold">
                {editingRowIndex !== null ? 'Edit Table Row' : 'Add New Table Row'} —{' '}
                {activeMasterCrop.sections[activeRowSectionIdx]?.title}
              </h3>
              <button
                type="button"
                onClick={() => setRowModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveRow} className="p-6 space-y-4 text-xs">
              {(activeMasterCrop.sections[activeRowSectionIdx]?.headers || []).map(
                (headerLabel, colIdx) => (
                  <div key={colIdx}>
                    <label className="block font-bold text-slate-700 mb-1">{headerLabel}</label>
                    <textarea
                      rows={colIdx === 0 ? 1 : 3}
                      value={rowCells[colIdx] || ''}
                      onChange={(e) => {
                        const copy = [...rowCells];
                        copy[colIdx] = e.target.value;
                        setRowCells(copy);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                )
              )}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRowModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-extrabold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Row & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Stage Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteStageTarget}
        title="Delete Crop Guidance Stage"
        message={
          deleteStageTarget
            ? `Are you sure you want to delete "${deleteStageTarget.title}"? This will immediately update the storefront.`
            : ''
        }
        confirmLabel={deletingStage ? 'Deleting...' : 'Delete Stage'}
        onConfirm={handleDeleteStage}
        onCancel={() => setDeleteStageTarget(null)}
      />
    </div>
  );
}
