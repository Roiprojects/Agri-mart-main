'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronUp,
  ChevronDown,
  Package,
} from 'lucide-react';

interface SpecGroup {
  id: string;
  name: string;
  displayOrder: number;
}

interface UsedByProductSpec {
  id: string;
  name: string;
  sku: string;
  price: number;
  published: boolean;
  categoryHierarchy: string;
  specValue: string;
}

interface SpecAttribute {
  id: string;
  name: string;
  displayOrder: number;
  groupId?: string;
  usedByProducts?: UsedByProductSpec[];
}

export default function SpecificationAttributesPage() {
  const [groups, setGroups] = useState<SpecGroup[]>([]);
  const [attributes, setAttributes] = useState<SpecAttribute[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Advanced / Basic Mode State
  const [advancedMode, setAdvancedMode] = useState(true);

  // Search State (Single Unified Search Bar for Specification Attribute Name, Product ID, Product Name, and Product SKU)
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Expand / Collapse group state (by group ID) — expanded by default so attributes are immediately visible
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'group-default': true,
  });

  // Selection for bulk delete
  const [selectedAttrIds, setSelectedAttrIds] = useState<string[]>([]);

  // Modals
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupFormName, setGroupFormName] = useState('');
  const [groupFormDisplayOrder, setGroupFormDisplayOrder] = useState<number>(0);

  const [attrModalOpen, setAttrModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<SpecAttribute | null>(null);
  const [attrFormName, setAttrFormName] = useState('');
  const [attrFormGroupId, setAttrFormGroupId] = useState('group-default');
  const [attrFormDisplayOrder, setAttrFormDisplayOrder] = useState<number>(1);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'bulk' | 'single'>('bulk');
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(15);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogue/attributes/specification');
      const json = await res.json();
      if (json.success) {
        setAttributes(json.data || []);
        if (Array.isArray(json.products)) {
          setAllProducts(json.products);
        }
        const loadedGroups =
          json.groups && json.groups.length > 0
            ? json.groups
            : [
                {
                  id: 'group-default',
                  name: 'Default group (non-grouped specification attributes)',
                  displayOrder: 0,
                },
              ];
        setGroups(loadedGroups);
        // Ensure groups are expanded so attributes and search results are immediately visible
        const expandedMap: Record<string, boolean> = {};
        loadedGroups.forEach((g: SpecGroup) => {
          expandedMap[g.id] = true;
        });
        setExpandedGroups((prev) => ({ ...expandedMap, ...prev }));
      } else {
        showToast(json.error || 'Failed to load specification attributes', 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchName.trim());
    // Expand all groups when searching
    const expandedMap: Record<string, boolean> = {};
    groups.forEach((g) => {
      expandedMap[g.id] = true;
    });
    setExpandedGroups(expandedMap);
  };

  // Unified query (live + button triggered)
  const query = (searchName.trim() || activeSearch.trim()).toLowerCase();

  // Products matching the single search bar (by Product ID, Product Name, or Product SKU)
  const matchedProducts = useMemo(() => {
    if (!query) return [];
    return allProducts.filter(
      (p) =>
        (p.id || '').toLowerCase().includes(query) ||
        (p.name || '').toLowerCase().includes(query) ||
        (p.sku || '').toLowerCase().includes(query)
    );
  }, [allProducts, query]);

  // Filtered Specification Attributes matching Attribute Name, ID, Group, Spec Value, OR Product ID / Product Name / Product SKU
  const filteredAttributes = useMemo(() => {
    if (!query) return attributes;
    const matchedProdIds = new Set(matchedProducts.map((p) => p.id));

    return attributes.filter((a) => {
      const matchName = (a.name || '').toLowerCase().includes(query);
      const matchId = (a.id || '').toLowerCase().includes(query);
      const matchUsedProduct =
        Array.isArray(a.usedByProducts) &&
        a.usedByProducts.some(
          (p) =>
            matchedProdIds.has(p.id) ||
            (p.id || '').toLowerCase().includes(query) ||
            (p.name || '').toLowerCase().includes(query) ||
            (p.sku || '').toLowerCase().includes(query) ||
            (p.specValue || '').toLowerCase().includes(query)
        );
      return matchName || matchId || matchUsedProduct;
    });
  }, [attributes, query, matchedProducts]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Selection handlers
  const handleToggleSelectAllInGroup = (groupId: string, groupAttrs: SpecAttribute[]) => {
    const groupAttrIds = groupAttrs.map((a) => a.id);
    const allSelected = groupAttrIds.every((id) => selectedAttrIds.includes(id));

    if (allSelected) {
      setSelectedAttrIds((prev) => prev.filter((id) => !groupAttrIds.includes(id)));
    } else {
      setSelectedAttrIds((prev) => Array.from(new Set([...prev, ...groupAttrIds])));
    }
  };

  const handleToggleSelectAttr = (id: string) => {
    setSelectedAttrIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Group Modal Handlers
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormName.trim()) {
      showToast('Group name is required', 'error');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/specification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isGroup: true,
          name: groupFormName.trim(),
          displayOrder: Number(groupFormDisplayOrder) || 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Specification attribute group added!');
        setGroupModalOpen(false);
        fetchAttributes();
      } else {
        showToast(json.error || 'Failed to add group', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAttr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attrFormName.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    try {
      setSaving(true);
      const isEdit = !!editingAttr;
      const res = await fetch('/api/admin/catalogue/attributes/specification', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAttr?.id,
          name: attrFormName.trim(),
          groupId: attrFormGroupId,
          displayOrder: Number(attrFormDisplayOrder) || 1,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(isEdit ? 'Specification attribute updated!' : 'Specification attribute created!');
        setAttrModalOpen(false);
        fetchAttributes();
      } else {
        showToast(json.error || 'Failed to save specification attribute', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Handlers
  const handleConfirmDeleteSelected = () => {
    if (selectedAttrIds.length === 0) {
      showToast('Please select at least one attribute to delete', 'error');
      return;
    }
    setDeleteMode('bulk');
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteSingle = (id: string) => {
    setSingleDeleteId(id);
    setDeleteMode('single');
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    try {
      setSaving(true);
      const idsToDelete = deleteMode === 'bulk' ? selectedAttrIds : singleDeleteId ? [singleDeleteId] : [];
      if (idsToDelete.length === 0) return;

      const res = await fetch('/api/admin/catalogue/attributes/specification', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Deleted ${idsToDelete.length} attribute(s) successfully!`);
        setSelectedAttrIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
        setDeleteConfirmOpen(false);
        setSingleDeleteId(null);
        fetchAttributes();
      } else {
        showToast(json.error || 'Failed to delete attributes', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER: Title + Advanced/Basic Toggle + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Specification attributes</h1>

          {/* ADVANCED / BASIC TOGGLE SWITCH */}
          <button
            type="button"
            onClick={() => setAdvancedMode(!advancedMode)}
            className={`inline-flex items-center justify-between px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer select-none min-w-[96px] h-7 shadow-2xs ${
              advancedMode
                ? 'bg-[#2585be] border-[#2585be] text-white hover:bg-[#1f72a3]'
                : 'bg-white border-[#3c8dbc] text-[#3c8dbc] hover:bg-slate-50'
            }`}
            title={
              advancedMode
                ? 'Click to switch to Basic mode (show only mandatory & important fields)'
                : 'Click to switch to Advanced mode (show all hidden fields)'
            }
          >
            {advancedMode ? (
              <>
                <span className="text-white font-semibold text-xs">Advanced</span>
                <span className="w-3.5 h-5 rounded-xs bg-white shadow-xs ml-2" />
              </>
            ) : (
              <>
                <span className="w-3.5 h-5 rounded-xs bg-[#3c8dbc] border border-[#3c8dbc] shadow-xs mr-2" />
                <span className="text-[#3c8dbc] font-semibold text-xs">Basic</span>
              </>
            )}
          </button>

          <span
            className={`text-[11px] px-2.5 py-0.5 rounded border font-medium ${
              advancedMode
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {advancedMode
              ? 'Advanced mode: All fields visible'
              : 'Basic mode: Showing only mandatory & important fields'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Add group button */}
          <Link
            href="/admin/catalogue/attributes/specification/group/new"
            className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add group</span>
          </Link>

          {/* Add attribute button */}
          <Link
            href="/admin/catalogue/attributes/specification/new"
            className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add attribute</span>
          </Link>

          {/* Delete attributes (selected) button */}
          <button
            type="button"
            onClick={handleConfirmDeleteSelected}
            className="bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete attributes (selected)</span>
          </button>
        </div>
      </div>

      {/* SEARCH CARD (Single Unified Search Bar for Specification Attribute Name, Product ID, Product Name, and Product SKU) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header: 🔍 Search with collapsible chevron */}
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <Search className="w-4 h-4 text-slate-700" />
            <span>Search</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {searchOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Body */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="p-4 sm:p-6 space-y-4">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-xs text-slate-700">
                  <span>Name</span>
                  <span
                    title="Search by Specification Attribute Name, Product ID (e.g. prod-001), Product Name, or Product SKU (e.g. AGP-PW-7HP) all in one search bar."
                    className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none ml-1"
                  >
                    ?
                  </span>
                </div>
                <div className="sm:col-span-9">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchName}
                      onChange={(e) => {
                        setSearchName(e.target.value);
                        setActiveSearch(e.target.value.trim());
                      }}
                      placeholder="Search by Specification Name, Product ID (prod-001), Product Name, or SKU (AGP-PW-7HP)..."
                      className="w-full text-xs px-2.5 py-1.5 pr-8 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                    />
                    {searchName && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchName('');
                          setActiveSearch('');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Centered Search Button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-6 py-1.5 rounded inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* MATCHED PRODUCT(S) SUMMARY BANNER WHEN SEARCHING BY PRODUCT ID, NAME, OR SKU */}
      {query && matchedProducts.length > 0 && (
        <div className="bg-emerald-50/70 rounded border border-emerald-200 p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs sm:text-sm">
              <Package className="w-4 h-4" />
              <span>
                Matched Product(s) for &quot;{searchName || activeSearch}&quot; ({matchedProducts.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-600">
              Showing {filteredAttributes.length} associated specification attribute(s) below
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matchedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded border border-emerald-200 p-3 flex flex-col justify-between gap-2 text-xs shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{prod.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                      ₹{Number(prod.price || 0).toLocaleString('en-IN')} INR
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-0.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-800">
                      <strong>Product ID:</strong> {prod.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-blue-800">
                      <strong>SKU:</strong> {prod.sku}
                    </span>
                    {prod.categoryHierarchy && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
                        {prod.categoryHierarchy}
                      </span>
                    )}
                  </div>
                </div>
                {Array.isArray(prod.specifications) && prod.specifications.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[11px] text-slate-500 font-medium">Product Technical Specifications:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {prod.specifications.map((sp: any) => (
                        <span
                          key={sp.id || sp.name}
                          className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700"
                        >
                          <strong>{sp.name}:</strong> {sp.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <Link
                    href={`/admin/catalogue/products?productId=${encodeURIComponent(prod.id)}&sku=${encodeURIComponent(prod.sku || '')}&name=${encodeURIComponent(prod.name || '')}`}
                    className="inline-flex items-center gap-1 bg-[#2585be] hover:bg-[#1f72a3] text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-2xs transition shrink-0"
                  >
                    <span>View in Products →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN DATA CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Explanatory Paragraph matching screenshot copy */}
          <p className="text-xs text-slate-600 leading-relaxed">
            Specification attributes are product features i.e, screen size, number of USB-ports, visible on product details page. Specification attributes can be used for filtering products on the category details page. Unlike product attributes, specification attributes are used for information purposes only. You can add attributes to existing product on a product details page. Learn more about{' '}
            <a
              href="https://docs.nopcommerce.com/en/running-your-store/catalog/products/specification-attributes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3c8dbc] hover:underline"
            >
              specification attributes
            </a>
          </p>

          {/* Table Container */}
          <div className="border border-[#e5e7eb] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                    <th className="px-3 py-2.5 w-10 border-r border-[#e5e7eb]"></th>
                    <th className="px-4 py-2.5 border-r border-[#e5e7eb]">Name</th>
                    <th className="px-4 py-2.5 text-right w-36">Display order</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                          <RotateCw className="w-6 h-6 animate-spin text-[#3c8dbc]" />
                          <span className="text-xs font-normal">Loading specification attributes...</span>
                        </div>
                      </td>
                    </tr>
                  ) : groups.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500 font-normal">
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    groups.map((group) => {
                      const groupAttrs = filteredAttributes.filter(
                        (a) => (a.groupId || 'group-default') === group.id
                      );
                      const isExpanded = expandedGroups[group.id] !== false;

                      return (
                        <React.Fragment key={group.id}>
                          {/* Group Row */}
                          <tr
                            onClick={() => toggleGroup(group.id)}
                            className="border-b border-[#e5e7eb] hover:bg-slate-50/80 cursor-pointer select-none bg-white transition"
                          >
                            <td className="px-3 py-2.5 text-center border-r border-[#e5e7eb] w-10">
                              <span className="inline-block text-slate-800 text-[11px] font-bold transform transition-transform duration-150">
                                {isExpanded ? '▼' : '▶'}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 border-r border-[#e5e7eb] font-medium text-slate-800">
                              {group.name}{' '}
                              <span className="text-slate-500 font-normal text-[11px]">
                                ({groupAttrs.length} attributes)
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right text-slate-700 font-medium w-36">
                              {group.displayOrder}
                            </td>
                          </tr>

                          {/* Expanded Nested Attributes Table */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={3} className="p-0 bg-slate-50/60 border-b border-[#e5e7eb]">
                                <div className="p-3 sm:p-4 pl-8 sm:pl-10 space-y-2">
                                  <div className="border border-[#d2d6de] bg-white rounded overflow-hidden shadow-2xs">
                                    <table className="w-full text-xs text-left border-collapse">
                                      <thead>
                                        <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                                          <th className="p-2 w-10 text-center border-r border-[#e5e7eb]">
                                            <input
                                              type="checkbox"
                                              checked={
                                                groupAttrs.length > 0 &&
                                                groupAttrs.every((a) => selectedAttrIds.includes(a.id))
                                              }
                                              onChange={() => handleToggleSelectAllInGroup(group.id, groupAttrs)}
                                              className="w-3.5 h-3.5 rounded text-[#3c8dbc] cursor-pointer"
                                            />
                                          </th>
                                          <th className="px-3 py-2 border-r border-[#e5e7eb] min-w-[200px]">
                                            Attribute Name
                                          </th>
                                          <th className="px-3 py-2 border-r border-[#e5e7eb] min-w-[320px]">
                                            Used by Products (Product ID, Name, SKU &amp; Spec Value)
                                          </th>
                                          <th className="px-3 py-2 text-center w-28 border-r border-[#e5e7eb]">
                                            Display order
                                          </th>
                                          <th className="px-3 py-2 text-center w-20 border-r border-[#e5e7eb]">Edit</th>
                                          <th className="px-3 py-2 text-center w-20">Delete</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {groupAttrs.length === 0 ? (
                                          <tr>
                                            <td colSpan={6} className="py-6 text-center text-slate-400">
                                              No specification attributes matching &quot;{searchName || activeSearch}&quot;.
                                            </td>
                                          </tr>
                                        ) : (
                                          groupAttrs.map((attr) => {
                                            const usedProducts = attr.usedByProducts || [];
                                            const sortedUsed = query
                                              ? [...usedProducts].sort((a, b) => {
                                                  const aMatch =
                                                    (a.id || '').toLowerCase().includes(query) ||
                                                    (a.name || '').toLowerCase().includes(query) ||
                                                    (a.sku || '').toLowerCase().includes(query) ||
                                                    (a.specValue || '').toLowerCase().includes(query);
                                                  const bMatch =
                                                    (b.id || '').toLowerCase().includes(query) ||
                                                    (b.name || '').toLowerCase().includes(query) ||
                                                    (b.sku || '').toLowerCase().includes(query) ||
                                                    (b.specValue || '').toLowerCase().includes(query);
                                                  return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
                                                })
                                              : usedProducts;

                                            return (
                                              <tr
                                                key={attr.id}
                                                className="border-b border-[#f0f0f0] hover:bg-slate-50 transition align-top"
                                              >
                                                <td className="p-2 text-center border-r border-[#f0f0f0]">
                                                  <input
                                                    type="checkbox"
                                                    checked={selectedAttrIds.includes(attr.id)}
                                                    onChange={() => handleToggleSelectAttr(attr.id)}
                                                    className="w-3.5 h-3.5 rounded text-[#3c8dbc] cursor-pointer"
                                                  />
                                                </td>
                                                <td className="px-3 py-2 border-r border-[#f0f0f0] font-medium text-slate-800">
                                                  <Link
                                                    href={`/admin/catalogue/attributes/specification/${attr.id}/edit`}
                                                    className="text-[#3c8dbc] hover:underline font-semibold"
                                                  >
                                                    {attr.name}
                                                  </Link>
                                                </td>
                                                <td className="px-3 py-2 border-r border-[#f0f0f0] text-slate-700">
                                                  {sortedUsed.length === 0 ? (
                                                    <span className="text-slate-400 text-[11px]">No products linked</span>
                                                  ) : (
                                                    <div className="space-y-1.5">
                                                      {sortedUsed.slice(0, query ? 6 : 3).map((p) => {
                                                        const isHighlighted =
                                                          Boolean(query) &&
                                                          ((p.id || '').toLowerCase().includes(query) ||
                                                            (p.name || '').toLowerCase().includes(query) ||
                                                            (p.sku || '').toLowerCase().includes(query) ||
                                                            (p.specValue || '').toLowerCase().includes(query));
                                                        return (
                                                          <div
                                                            key={p.id}
                                                            className={`p-1.5 rounded border text-[11px] flex flex-wrap items-center justify-between gap-1.5 ${
                                                              isHighlighted
                                                                ? 'bg-amber-50/90 border-amber-300 text-slate-900 font-medium'
                                                                : 'bg-white border-slate-200 text-slate-700'
                                                            }`}
                                                          >
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
                                                                ID: {p.id}
                                                              </span>
                                                              {p.sku && (
                                                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] border border-blue-200 font-semibold">
                                                                  SKU: {p.sku}
                                                                </span>
                                                              )}
                                                              <Link
                                                                href={`/admin/catalogue/products?productId=${encodeURIComponent(p.id)}&sku=${encodeURIComponent(p.sku || '')}&name=${encodeURIComponent(p.name || '')}`}
                                                                className="text-slate-800 hover:text-[#2585be] hover:underline font-medium"
                                                              >
                                                                {p.name}
                                                              </Link>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                              {p.specValue && (
                                                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                                                                  {p.specValue}
                                                                </span>
                                                              )}
                                                              <Link
                                                                href={`/admin/catalogue/products?productId=${encodeURIComponent(p.id)}&sku=${encodeURIComponent(p.sku || '')}&name=${encodeURIComponent(p.name || '')}`}
                                                                className="text-[10px] font-semibold text-[#2585be] hover:underline shrink-0"
                                                              >
                                                                View in Products →
                                                              </Link>
                                                            </div>
                                                          </div>
                                                        );
                                                      })}
                                                      {sortedUsed.length > (query ? 6 : 3) && (
                                                        <div className="text-[11px] text-[#3c8dbc] font-medium">
                                                          +{sortedUsed.length - (query ? 6 : 3)} more product(s)
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                                </td>
                                                <td className="px-3 py-2 text-center text-slate-700 border-r border-[#f0f0f0]">
                                                  {attr.displayOrder}
                                                </td>
                                                <td className="px-3 py-2 text-center border-r border-[#f0f0f0]">
                                                  <Link
                                                    href={`/admin/catalogue/attributes/specification/${attr.id}/edit`}
                                                    className="text-[#2585be] hover:underline font-medium cursor-pointer"
                                                  >
                                                    Edit
                                                  </Link>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleConfirmDeleteSingle(attr.id);
                                                    }}
                                                    className="text-red-500 hover:underline font-medium cursor-pointer"
                                                  >
                                                    Delete
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Table Footer */}
            <div className="bg-[#fcfcfc] border-t border-[#e5e7eb] px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              {/* Previous / Next */}
              <div className="flex items-center">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 border border-[#d2d6de] bg-white text-slate-400 rounded-l cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 border-t border-b border-r border-[#d2d6de] bg-white text-slate-400 rounded-r cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Next
                </button>
              </div>

              {/* Show [ 15 ▾ ] items */}
              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-[#d2d6de] bg-white rounded px-2 py-0.5 text-xs text-slate-700 outline-none cursor-pointer"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>items</span>
              </div>

              {/* Records count & Refresh button */}
              <div className="flex items-center gap-3">
                <span>
                  {filteredAttributes.length === 0
                    ? 'No records'
                    : `1-${filteredAttributes.length} of ${filteredAttributes.length} attributes`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    fetchAttributes();
                    showToast('Specification attributes refreshed', 'success');
                  }}
                  className="p-1 border border-[#d2d6de] bg-white text-slate-600 hover:text-slate-900 rounded hover:bg-slate-50 transition cursor-pointer"
                  title="Refresh"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Add Group */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800">Add a new specification attribute group</h3>
              <button
                type="button"
                onClick={() => setGroupModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveGroup} className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="col-span-8">
                  <input
                    type="text"
                    required
                    value={groupFormName}
                    onChange={(e) => setGroupFormName(e.target.value)}
                    placeholder="e.g. Dimensions, Performance"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Display order
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    value={groupFormDisplayOrder}
                    onChange={(e) => setGroupFormDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Attribute */}
      {attrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800">
                {editingAttr ? 'Edit specification attribute' : 'Add a new specification attribute'}
              </h3>
              <button
                type="button"
                onClick={() => setAttrModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveAttr} className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="col-span-8">
                  <input
                    type="text"
                    required
                    value={attrFormName}
                    onChange={(e) => setAttrFormName(e.target.value)}
                    placeholder="e.g. Engine Displacement (cc)"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Group
                </label>
                <div className="col-span-8">
                  <select
                    value={attrFormGroupId}
                    onChange={(e) => setAttrFormGroupId(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Display order
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    value={attrFormDisplayOrder}
                    onChange={(e) => setAttrFormDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAttrModalOpen(false)}
                  className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-sm overflow-hidden animate-fadeIn">
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-red-600 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </h3>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-4 sm:p-5 text-xs text-slate-700 space-y-3">
              <p>
                {deleteMode === 'bulk'
                  ? `Are you sure you want to delete ${selectedAttrIds.length} selected specification attribute(s)?`
                  : 'Are you sure you want to delete this specification attribute?'}
              </p>
              <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={executeDelete}
                  className="bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-semibold px-4 py-1.5 rounded disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-8 border-t border-[#d2d6de] pt-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <a
            href="https://www.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            nopCommerce
          </a>
        </div>
        <div>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          {new Date().toLocaleTimeString()}
        </div>
        <div>nopCommerce version 4.90.0</div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-2.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] text-white shadow-lg transition cursor-pointer z-40"
        title="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
