'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  mergeProductsWithOverrides,
  saveProductOverridesBulk,
} from '@/lib/admin-product-overrides';
import { mergeCategoriesWithOverrides } from '@/lib/admin-category-overrides';
import { mergeBrandsWithOverrides } from '@/lib/admin-brand-overrides';

interface BulkProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stockQuantity?: number;
  isPublished: boolean;
  categoryId: string;
  brandId?: string;
  productType?: string;
  category?: { id?: string; name: string };
  brand?: { id?: string; name: string };
  variants?: { stockQuantity?: number }[];
}

export default function BulkEditProductsPage() {
  const router = useRouter();

  // Data states
  const [products, setProducts] = useState<BulkProductItem[]>([]);
  const [editedProducts, setEditedProducts] = useState<{ [id: string]: BulkProductItem }>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Search Collapsible State
  const [searchOpen, setSearchOpen] = useState(true);

  // Filter States
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSubcategories, setFilterSubcategories] = useState(false);
  const [filterManufacturer, setFilterManufacturer] = useState('All');
  const [filterProductType, setFilterProductType] = useState('All');
  const [filterPublished, setFilterPublished] = useState('All');

  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    category: 'All',
    subcategories: false,
    manufacturer: 'All',
    productType: 'All',
    published: 'All',
  });

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch data
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/catalogue/products', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/admin/catalogue/categories', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/admin/brands', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([prodRes, catRes, brandRes]) => {
        const cats = mergeCategoriesWithOverrides(catRes.success && Array.isArray(catRes.data) ? catRes.data : []);
        const brs = mergeBrandsWithOverrides(brandRes.success && Array.isArray(brandRes.data) ? brandRes.data : []);
        setCategories(cats);
        setBrands(brs);

        if (prodRes.success && Array.isArray(prodRes.data)) {
          const mergedRaw = mergeProductsWithOverrides(prodRes.data, cats, brs);
          const list: BulkProductItem[] = mergedRaw.map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            price: Number(p.price) || 0,
            comparePrice: p.comparePrice !== undefined ? Number(p.comparePrice) : 0,
            stockQuantity:
              p.stockQuantity !== undefined
                ? Number(p.stockQuantity)
                : p.variants?.[0]?.stockQuantity !== undefined
                ? Number(p.variants[0].stockQuantity)
                : 0,
            isPublished: Boolean(p.isPublished),
            categoryId: p.categoryId,
            brandId: p.brandId,
            productType: p.productType || 'Simple',
            category: p.category,
            brand: p.brand,
            variants: p.variants,
          }));
          setProducts(list);
          const initialMap: { [id: string]: BulkProductItem } = {};
          list.forEach((item) => {
            initialMap[item.id] = { ...item };
          });
          setEditedProducts(initialMap);
        }
      })
      .catch((err) => {
        showToast('Error loading products: ' + err.message, 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter apply handler
  const handleSearch = () => {
    setAppliedFilters({
      name: filterName.trim().toLowerCase(),
      category: filterCategory,
      subcategories: filterSubcategories,
      manufacturer: filterManufacturer,
      productType: filterProductType,
      published: filterPublished,
    });
    setCurrentPage(1);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const current = editedProducts[p.id] || p;

      // Name filter
      if (appliedFilters.name && !current.name.toLowerCase().includes(appliedFilters.name)) {
        return false;
      }
      // Category filter
      if (appliedFilters.category !== 'All' && current.categoryId !== appliedFilters.category) {
        return false;
      }
      // Manufacturer filter
      if (appliedFilters.manufacturer !== 'All' && current.brandId !== appliedFilters.manufacturer) {
        return false;
      }
      // Product type filter
      if (appliedFilters.productType !== 'All' && current.productType !== appliedFilters.productType) {
        return false;
      }
      // Published filter
      if (appliedFilters.published === 'PublishedOnly' && !current.isPublished) {
        return false;
      }
      if (appliedFilters.published === 'UnpublishedOnly' && current.isPublished) {
        return false;
      }
      return true;
    });
  }, [products, editedProducts, appliedFilters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentRangeProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Handle cell edit
  const handleFieldChange = (id: string, field: keyof BulkProductItem, value: any) => {
    setEditedProducts((prev) => {
      const existing = prev[id] || products.find((p) => p.id === id);
      if (!existing) return prev;
      return {
        ...prev,
        [id]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentRangeProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Save selected products
  const handleSaveSelected = async () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one product to save.', 'error');
      return;
    }

    try {
      setSaving(true);
      const itemsToSave = selectedIds.map((id) => editedProducts[id]);
      const res = await fetch('/api/admin/catalogue/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemsToSave),
      });
      const data = await res.json();
      if (data.success) {
        saveProductOverridesBulk(itemsToSave);
        showToast(`Saved ${selectedIds.length} selected product(s) successfully!`);
        // Update baseline products
        setProducts((prev) =>
          prev.map((p) => (editedProducts[p.id] ? { ...editedProducts[p.id] } : p))
        );
      } else {
        showToast(data.message || 'Failed to save selected products', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save all matching products
  const handleSaveAll = async () => {
    if (filteredProducts.length === 0) {
      showToast('No products available to save.', 'error');
      return;
    }

    try {
      setSaving(true);
      const itemsToSave = filteredProducts.map((p) => editedProducts[p.id] || p);
      const res = await fetch('/api/admin/catalogue/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemsToSave),
      });
      const data = await res.json();
      if (data.success) {
        saveProductOverridesBulk(itemsToSave);
        showToast(`Saved all ${itemsToSave.length} product(s) successfully!`);
        // Update baseline products
        setProducts((prev) =>
          prev.map((p) => (editedProducts[p.id] ? { ...editedProducts[p.id] } : p))
        );
      } else {
        showToast(data.message || 'Failed to save products', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Helper Tooltip
  const Tooltip = ({ text }: { text: string }) => (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none"
    >
      ?
    </span>
  );

  const isAllCurrentSelected =
    currentRangeProducts.length > 0 &&
    currentRangeProducts.every((p) => selectedIds.includes(p.id));

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

      {/* TOP HEADER: Title + back link + action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            Bulk edit products
          </h1>
          <Link
            href="/admin/catalogue/products"
            className="text-[#3c8dbc] hover:underline flex items-center gap-1 text-xs font-semibold transition"
          >
            <span className="w-4 h-4 rounded-full bg-[#3c8dbc] text-white inline-flex items-center justify-center text-[10px]">
              ←
            </span>
            <span>back to product list</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Save selected button */}
          <button
            type="button"
            disabled={saving || selectedIds.length === 0}
            onClick={handleSaveSelected}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save selected'}</span>
          </button>

          {/* Save all button */}
          <button
            type="button"
            disabled={saving || filteredProducts.length === 0}
            onClick={handleSaveAll}
            className="bg-[#00a65a] hover:bg-[#008d4c] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save all'}</span>
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
              {/* Left Column */}
              <div className="space-y-4">
                {/* Product name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Product name</span>
                    <Tooltip text="A product name." />
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

                {/* Category */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Category</span>
                    <Tooltip text="Search by a specific category." />
                  </div>
                  <div className="sm:col-span-8">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="All">All</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search subcategories */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span className="text-right">Search subcategories</span>
                    <Tooltip text="Check to search in subcategories." />
                  </div>
                  <div className="sm:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={filterSubcategories}
                      onChange={(e) => setFilterSubcategories(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Manufacturer */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Manufacturer</span>
                    <Tooltip text="Search by a specific manufacturer." />
                  </div>
                  <div className="sm:col-span-8">
                    <select
                      value={filterManufacturer}
                      onChange={(e) => setFilterManufacturer(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="All">All</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Product type */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Product type</span>
                    <Tooltip text="Search by a product type." />
                  </div>
                  <div className="sm:col-span-8">
                    <select
                      value={filterProductType}
                      onChange={(e) => setFilterProductType(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="All">All</option>
                      <option value="Simple">Simple</option>
                      <option value="Grouped">Grouped</option>
                    </select>
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

      {/* TABLE / GRID CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#d2d6de] bg-[#f9fafb] text-slate-800 font-semibold">
                <th className="py-3 px-4 border-r border-[#d2d6de] w-20">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllCurrentSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                    <span>Select</span>
                  </label>
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold">
                  Product name
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold w-40">
                  SKU
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold w-32">
                  Price
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold w-32">
                  Old price
                </th>
                <th className="py-3 px-4 border-r border-[#d2d6de] font-bold w-32">
                  Stock quantity
                </th>
                <th className="py-3 px-4 font-bold text-center w-24">
                  Published
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d2d6de]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading products for bulk editing...
                  </td>
                </tr>
              ) : currentRangeProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products found matching your search criteria.
                  </td>
                </tr>
              ) : (
                currentRangeProducts.map((prod) => {
                  const current = editedProducts[prod.id] || prod;
                  const isSelected = selectedIds.includes(prod.id);
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-[#f5faff] transition ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-4 border-r border-[#d2d6de]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(prod.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                        />
                      </td>

                      {/* Product Name */}
                      <td className="py-2.5 px-4 border-r border-[#d2d6de]">
                        <Link
                          href={`/admin/catalogue/products/${prod.id}/edit`}
                          className="text-[#3c8dbc] hover:underline font-medium"
                          title="Click to edit full product"
                        >
                          {current.name}
                        </Link>
                      </td>

                      {/* SKU */}
                      <td className="py-2.5 px-4 border-r border-[#d2d6de] text-slate-600 font-mono">
                        {current.sku}
                      </td>

                      {/* Price */}
                      <td className="py-2 px-3 border-r border-[#d2d6de]">
                        <input
                          type="number"
                          step="0.01"
                          value={current.price}
                          onChange={(e) =>
                            handleFieldChange(prod.id, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-xs px-2 py-1 rounded border border-[#d2d6de] text-right font-medium focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-800"
                        />
                      </td>

                      {/* Old Price */}
                      <td className="py-2 px-3 border-r border-[#d2d6de]">
                        <input
                          type="number"
                          step="0.01"
                          value={current.comparePrice !== undefined ? current.comparePrice : 0}
                          onChange={(e) =>
                            handleFieldChange(prod.id, 'comparePrice', parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-xs px-2 py-1 rounded border border-[#d2d6de] text-right focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-800"
                        />
                      </td>

                      {/* Stock quantity */}
                      <td className="py-2 px-3 border-r border-[#d2d6de]">
                        <input
                          type="number"
                          value={current.stockQuantity !== undefined ? current.stockQuantity : 0}
                          onChange={(e) =>
                            handleFieldChange(prod.id, 'stockQuantity', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-full text-xs px-2 py-1 rounded border border-[#d2d6de] text-right focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-800"
                        />
                      </td>

                      {/* Published */}
                      <td className="py-2.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={current.isPublished}
                          onChange={(e) => handleFieldChange(prod.id, 'isPublished', e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER: Pagination + Add New Button */}
        <div className="border-t border-[#d2d6de] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-xs text-slate-600">
          {/* Pagination */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white hover:bg-slate-50 disabled:opacity-40 transition font-medium select-none cursor-pointer"
            >
              First
            </button>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white hover:bg-slate-50 disabled:opacity-40 transition font-medium select-none cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1 font-medium text-slate-700">
              Page {currentPage} of {totalPages} ({filteredProducts.length} items)
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white hover:bg-slate-50 disabled:opacity-40 transition font-medium select-none cursor-pointer"
            >
              Next
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white hover:bg-slate-50 disabled:opacity-40 transition font-medium select-none cursor-pointer"
            >
              Last
            </button>
          </div>

          {/* Add New Button */}
          <div>
            <Link
              href="/admin/catalogue/products/new"
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add new</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
