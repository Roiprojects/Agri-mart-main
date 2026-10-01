'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Plus,
  Download,
  Upload,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Edit,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  nameKn?: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  displayOrder: number;
  published?: boolean;
  isPublished?: boolean;
}

export default function AdminCategoriesPage() {
  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search Collapsible State
  const [searchOpen, setSearchOpen] = useState(true);

  // Filter States
  const [filterName, setFilterName] = useState('');
  const [filterPublished, setFilterPublished] = useState('All');

  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    published: 'All',
  });

  // Export Dropdown State
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Import Modal State
  const [importOpen, setImportOpen] = useState(false);
  const [importJson, setImportJson] = useState('');

  // Edit / Add Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
    displayOrder: 1,
    published: true,
  });

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogue/categories');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch (err: any) {
      showToast('Error loading categories: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Format category display name with hierarchical parent indicators (e.g. Sunglasses >> Aviator & Square)
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const getCategoryFullName = (cat: Category): string => {
    if (!cat.parentId) return cat.name;
    const parent = categoryMap.get(cat.parentId);
    if (!parent) return cat.name;
    return `${getCategoryFullName(parent)} >> ${cat.name}`;
  };

  // Filter Categories
  const handleSearch = () => {
    setAppliedFilters({
      name: filterName.trim().toLowerCase(),
      published: filterPublished,
    });
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const fullName = getCategoryFullName(cat).toLowerCase();
      if (appliedFilters.name && !fullName.includes(appliedFilters.name)) {
        return false;
      }
      const isPub = cat.published !== false && cat.isPublished !== false;
      if (appliedFilters.published === 'PublishedOnly' && !isPub) {
        return false;
      }
      if (appliedFilters.published === 'UnpublishedOnly' && isPub) {
        return false;
      }
      return true;
    });
  }, [categories, appliedFilters, categoryMap]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCategories.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Create Modal
  const openCreate = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      parentId: '',
      displayOrder: categories.length,
      published: true,
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      parentId: cat.parentId || '',
      displayOrder: cat.displayOrder !== undefined ? cat.displayOrder : 0,
      published: cat.published !== false && cat.isPublished !== false,
    });
    setModalOpen(true);
  };

  // Save Category
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    const slug =
      form.slug.trim() ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory?.id,
          name: form.name.trim(),
          slug,
          description: form.description,
          image: form.image,
          parentId: form.parentId || null,
          displayOrder: Number(form.displayOrder) || 0,
          published: form.published,
          isPublished: form.published,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setModalOpen(false);
        fetchCategories();
      } else {
        showToast(json.message || 'Error saving category', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Handlers
  const confirmDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast('No categories selected for deletion.', 'error');
      return;
    }
    setDeleteTargetIds(selectedIds);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    try {
      const res = await fetch(
        `/api/admin/catalogue/categories?ids=${deleteTargetIds.join(',')}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        showToast(`Deleted ${deleteTargetIds.length} category/categories successfully!`);
        setSelectedIds((prev) => prev.filter((id) => !deleteTargetIds.includes(id)));
        setDeleteConfirmOpen(false);
        setDeleteTargetIds([]);
        fetchCategories();
      } else {
        showToast(json.message || 'Error deleting category', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Export handlers
  const handleExportCSV = (onlySelected: boolean) => {
    const list = onlySelected
      ? categories.filter((c) => selectedIds.includes(c.id))
      : filteredCategories;

    if (list.length === 0) {
      showToast('No categories to export.', 'error');
      return;
    }

    const headers = ['Id', 'Name', 'Slug', 'ParentId', 'DisplayOrder', 'Published'];
    const rows = list.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.slug}"`,
      `"${c.parentId || ''}"`,
      c.displayOrder,
      c.published !== false && c.isPublished !== false ? 'True' : 'False',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `categories_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    showToast(`Exported ${list.length} categories to CSV/Excel!`);
  };

  const handleExportXML = (onlySelected: boolean) => {
    const list = onlySelected
      ? categories.filter((c) => selectedIds.includes(c.id))
      : filteredCategories;

    if (list.length === 0) {
      showToast('No categories to export.', 'error');
      return;
    }

    let xml = `<?xml version="1.0" encoding="utf-8"?>\n<Categories>\n`;
    list.forEach((c) => {
      xml += `  <Category>\n`;
      xml += `    <Id>${c.id}</Id>\n`;
      xml += `    <Name>${c.name}</Name>\n`;
      xml += `    <Slug>${c.slug}</Slug>\n`;
      xml += `    <ParentId>${c.parentId || ''}</ParentId>\n`;
      xml += `    <DisplayOrder>${c.displayOrder}</DisplayOrder>\n`;
      xml += `    <Published>${c.published !== false && c.isPublished !== false}</Published>\n`;
      xml += `  </Category>\n`;
    });
    xml += `</Categories>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `categories_export_${Date.now()}.xml`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    showToast(`Exported ${list.length} categories to XML!`);
  };

  // Helper Tooltip Component
  const Tooltip = ({ text }: { text: string }) => (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none"
    >
      ?
    </span>
  );

  const isAllSelected =
    filteredCategories.length > 0 &&
    filteredCategories.every((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
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

      {/* TOP HEADER: Title + Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Categories</h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add new button */}
          <Link
            href="/admin/catalogue/categories/new"
            className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add new</span>
          </Link>

          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded shadow-lg border border-slate-200 py-1 z-30 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => handleExportXML(false)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export to XML (all found)</span>
                </button>
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => handleExportXML(true)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-2"
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export to XML (selected)</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => handleExportCSV(false)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export to Excel (all found)</span>
                </button>
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => handleExportCSV(true)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export to Excel (selected)</span>
                </button>
              </div>
            )}
          </div>

          {/* Import button */}
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="bg-[#008d4c] hover:bg-[#00733e] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          {/* Delete selected button */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={confirmDeleteSelected}
            className="bg-[#dd4b39] hover:bg-[#c23321] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete (selected)</span>
          </button>
        </div>
      </div>

      {/* SEARCH CARD (Collapsible) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <Search className="w-4 h-4 text-slate-800" />
            <span>Search</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {searchOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {searchOpen && (
          <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Category name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                  <span>Category name</span>
                  <Tooltip text="A category name." />
                </div>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder=""
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                  />
                </div>
              </div>

              {/* Published */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                  <span>Published</span>
                  <Tooltip text="Search by a published status." />
                </div>
                <div className="sm:col-span-8">
                  <select
                    value={filterPublished}
                    onChange={(e) => setFilterPublished(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="PublishedOnly">Published only</option>
                    <option value="UnpublishedOnly">Unpublished only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Centered Search Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 py-2 bg-[#2585be] hover:bg-[#1f72a3] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Learn more link matching screenshot */}
        <div className="px-4 py-3 text-xs text-slate-600 border-b border-[#f4f4f4]">
          <span>Learn more about </span>
          <a
            href="https://docs.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            categories
          </a>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#d2d6de] bg-[#f9fafb] text-slate-800 font-semibold">
                <th className="py-3 px-4 border-r border-[#d2d6de] w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold">
                  Name
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold text-center w-36">
                  Published
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold text-center w-36">
                  Display order
                </th>
                <th className="py-3 px-4 font-bold text-center w-28">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d2d6de]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No categories found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => {
                  const isSelected = selectedIds.includes(cat.id);
                  const isPub = cat.published !== false && cat.isPublished !== false;
                  const fullName = getCategoryFullName(cat);

                  return (
                    <tr
                      key={cat.id}
                      className={`hover:bg-[#f5faff] transition ${
                        isSelected ? 'bg-blue-50/40' : idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-4 border-r border-[#d2d6de] text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(cat.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                        />
                      </td>

                      {/* Name (with hierarchy >> if subcategory) */}
                      <td className="py-2.5 px-4 border-r border-[#d2d6de] text-slate-800">
                        {fullName}
                      </td>

                      {/* Published Status Icon */}
                      <td className="py-2.5 px-4 border-r border-[#d2d6de] text-center">
                        {isPub ? (
                          <Check className="w-4 h-4 text-[#3c8dbc] stroke-[2.5] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[#dd4b39] stroke-[2.5] mx-auto" />
                        )}
                      </td>

                      {/* Display Order */}
                      <td className="py-2.5 px-4 border-r border-[#d2d6de] text-center text-slate-700">
                        {cat.displayOrder !== undefined ? cat.displayOrder : 0}
                      </td>

                      {/* Edit Button */}
                      <td className="py-2 px-3 text-center">
                        <Link
                          href={`/admin/catalogue/categories/${cat.id}/edit`}
                          className="px-3 py-1 bg-white hover:bg-slate-50 border border-[#d2d6de] text-slate-700 rounded text-xs inline-flex items-center gap-1.5 shadow-2xs font-normal cursor-pointer transition"
                        >
                          <Edit className="w-3 h-3 text-slate-700" />
                          <span>Edit</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT CATEGORY */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-sm text-slate-800">
                {editingCategory ? 'Edit category details' : 'Add a new category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs text-slate-700">
              {/* Category Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <label className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Name *
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <label className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Search engine name
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated from name"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Parent category */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <label className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Parent category
                </label>
                <div className="sm:col-span-8">
                  <select
                    value={form.parentId}
                    onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none cursor-pointer"
                  >
                    <option value="">[None]</option>
                    {categories
                      .filter((c) => !editingCategory || c.id !== editingCategory.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <label className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Display order
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm({ ...form, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Published */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <label className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Published
                </label>
                <div className="sm:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                <label className="sm:col-span-4 font-medium text-slate-700 sm:text-right pt-1">
                  Description
                </label>
                <div className="sm:col-span-8">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none resize-y"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-[#2585be] hover:bg-[#1f72a3] text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT CATEGORIES */}
      {importOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#008d4c]" />
                <span>Import Categories</span>
              </h3>
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700">
              <p className="text-slate-500">
                Paste JSON array of categories, or choose a file:
              </p>
              <textarea
                rows={6}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='[{"name": "Organic Manures", "slug": "organic-manures", "displayOrder": 1}]'
                className="w-full text-xs p-2.5 font-mono rounded border border-[#d2d6de] bg-slate-50 outline-none"
              />

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImportOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const items = JSON.parse(importJson);
                      if (!Array.isArray(items)) throw new Error('Expected JSON array');
                      for (const item of items) {
                        if (item.name) {
                          await fetch('/api/admin/catalogue/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: item.name,
                              slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                              description: item.description,
                              displayOrder: item.displayOrder || 1,
                              published: item.published !== false,
                            }),
                          });
                        }
                      }
                      showToast(`Imported ${items.length} category/categories successfully!`);
                      setImportOpen(false);
                      setImportJson('');
                      fetchCategories();
                    } catch (e: any) {
                      showToast('Invalid JSON: ' + e.message, 'error');
                    }
                  }}
                  className="px-4 py-1.5 bg-[#008d4c] hover:bg-[#00733e] text-white rounded font-semibold shadow-xs"
                >
                  Import Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Delete Category/Categories?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to delete {deleteTargetIds.length} selected category item(s)? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-1.5 bg-[#dd4b39] hover:bg-[#c23321] text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
