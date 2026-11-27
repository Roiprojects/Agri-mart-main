'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { Filter, Search, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '@/lib/seed-data';
import { mergeCategoriesWithOverrides } from '@/lib/admin-category-overrides';
import { mergeBrandsWithOverrides } from '@/lib/admin-brand-overrides';
import { mergeProductsWithOverrides } from '@/lib/admin-product-overrides';
import {
  getEffectiveProductAttributes,
  getEffectiveSpecificationAttributes,
} from '@/lib/product-attribute-defaults';

const DEFAULT_BRANDS = [
  { id: 'br-am-agrimate', name: 'AGRIMATE', slug: 'agrimate', published: true },
  { id: 'br-am-kasei', name: 'KASEI', slug: 'kasei', published: true },
  { id: 'br-am-oleo-mac', name: 'OLEO MAC', slug: 'oleo-mac', published: true },
];

const globalShopCache = globalThis as unknown as {
  __shopProducts?: any[];
  __shopCategories?: any[];
  __shopBrands?: any[];
};

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>(
    () => globalShopCache.__shopProducts || SEED_PRODUCTS
  );
  const [categories, setCategories] = useState<any[]>(
    () => globalShopCache.__shopCategories || SEED_CATEGORIES
  );
  const [brands, setBrands] = useState<any[]>(
    () => globalShopCache.__shopBrands || DEFAULT_BRANDS
  );
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedSpecFilters, setSelectedSpecFilters] = useState<Record<string, string[]>>({});
  const [selectedProdAttrFilters, setSelectedProdAttrFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  const fetchCatalogue = () => {
    Promise.all([
      fetch('/api/products', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/categories', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/admin/brands', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ success: false, data: [] })),
    ])
      .then(([prodData, catData, brandData]) => {
        const mergedCats = mergeCategoriesWithOverrides(
          catData.success && Array.isArray(catData.data) ? catData.data : SEED_CATEGORIES
        );
        globalShopCache.__shopCategories = mergedCats;
        setCategories(mergedCats);

        const rawBrands = brandData.success && Array.isArray(brandData.data) && brandData.data.length > 0
          ? brandData.data
          : DEFAULT_BRANDS;
        const mergedBrands = mergeBrandsWithOverrides(rawBrands).filter(
          (b: any) => b.published !== false && b.isPublished !== false
        );
        globalShopCache.__shopBrands = mergedBrands;
        setBrands(mergedBrands);

        if (prodData.success && Array.isArray(prodData.data)) {
          const mergedProds = mergeProductsWithOverrides(prodData.data, mergedCats, mergedBrands)
            .filter((p: any) => p.isPublished !== false && p.visibleIndividually !== false);
          globalShopCache.__shopProducts = mergedProds;
          setProducts(mergedProds);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load catalogue', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const getProductBrandName = (p: any): string => {
    if (p.brandId) {
      const matched = brands.find((b: any) => b.id === p.brandId);
      if (matched?.name) return matched.name;
    }
    if (typeof p.brand === 'object' && p.brand?.name) return p.brand.name;
    return p.brand || p.brandName || '';
  };

  // Extract filterable Specification Attributes (allowFiltering !== false) and Product Attributes
  const { specFilterGroups, prodAttrFilterGroups } = useMemo(() => {
    const specMap = new Map<string, Map<string, { count: number; rgbColor?: string }>>();
    const attrMap = new Map<string, Map<string, { count: number; rgbColor?: string }>>();

    for (const p of products) {
      const specsList = getEffectiveSpecificationAttributes(p);
      const seenPerProd = new Set<string>();
      for (const s of specsList) {
        if (s.allowFiltering === false) continue;
        const name = String(s.attributeName || '').trim();
        const val = String(s.value || '').trim();
        if (!name || !val) continue;
        if (!specMap.has(name)) specMap.set(name, new Map());
        const valMap = specMap.get(name)!;
        const key = `${name}:::${val}`;
        if (!seenPerProd.has(key)) {
          seenPerProd.add(key);
          const prev = valMap.get(val) || { count: 0 };
          valMap.set(val, { count: prev.count + 1 });
        }
      }

      const pAttrsList = getEffectiveProductAttributes(p);
      const seenAttrPerProd = new Set<string>();
      for (const a of pAttrsList) {
        const name = String(a.attributeName || '').trim();
        if (!name || !Array.isArray(a.values) || a.values.length === 0) continue;
        if (!attrMap.has(name)) attrMap.set(name, new Map());
        const valMap = attrMap.get(name)!;
        for (const v of a.values) {
          const valName = String(v.name || '').trim();
          if (!valName) continue;
          const key = `${name}:::${valName}`;
          if (!seenAttrPerProd.has(key)) {
            seenAttrPerProd.add(key);
            const prev = valMap.get(valName) || { count: 0, rgbColor: v.rgbColor };
            valMap.set(valName, { count: prev.count + 1, rgbColor: prev.rgbColor || v.rgbColor });
          }
        }
      }
    }

    return {
      specFilterGroups: Array.from(specMap.entries()).map(([name, valMap]) => ({
        name,
        values: Array.from(valMap.entries()).map(([value, meta]) => ({ value, ...meta })),
      })),
      prodAttrFilterGroups: Array.from(attrMap.entries()).map(([name, valMap]) => ({
        name,
        values: Array.from(valMap.entries()).map(([value, meta]) => ({ value, ...meta })),
      })),
    };
  }, [products]);

  const toggleSpecFilter = (attrName: string, val: string) => {
    setSelectedSpecFilters((prev) => {
      const curr = prev[attrName] || [];
      const next = curr.includes(val) ? curr.filter((x) => x !== val) : [...curr, val];
      const copy = { ...prev };
      if (next.length === 0) delete copy[attrName];
      else copy[attrName] = next;
      return copy;
    });
  };

  const toggleProdAttrFilter = (attrName: string, val: string) => {
    setSelectedProdAttrFilters((prev) => {
      const curr = prev[attrName] || [];
      const next = curr.includes(val) ? curr.filter((x) => x !== val) : [...curr, val];
      const copy = { ...prev };
      if (next.length === 0) delete copy[attrName];
      else copy[attrName] = next;
      return copy;
    });
  };

  const hasActiveAttributeFilters =
    Object.keys(selectedSpecFilters).length > 0 || Object.keys(selectedProdAttrFilters).length > 0;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL' && p.categoryId !== selectedCategory && p.parentCategoryId !== selectedCategory && p.subCategoryId !== selectedCategory) return false;
      if (selectedBrand !== 'ALL') {
        const pBrand = getProductBrandName(p);
        if (pBrand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // Specification attribute filters (AND across attributes, OR within same attribute's selected values)
      for (const [attrName, wantedVals] of Object.entries(selectedSpecFilters)) {
        if (!wantedVals || wantedVals.length === 0) continue;
        const specs = getEffectiveSpecificationAttributes(p);
        const matched = specs.some(
          (s) =>
            s.allowFiltering !== false &&
            String(s.attributeName || '').trim() === attrName &&
            wantedVals.includes(String(s.value || '').trim())
        );
        if (!matched) return false;
      }

      // Product attribute filters (AND across attributes, OR within same attribute's selected values)
      for (const [attrName, wantedVals] of Object.entries(selectedProdAttrFilters)) {
        if (!wantedVals || wantedVals.length === 0) continue;
        const pAttrs = getEffectiveProductAttributes(p);
        const matched = pAttrs.some(
          (a: any) =>
            String(a.attributeName || '').trim() === attrName &&
            Array.isArray(a.values) &&
            a.values.some((v: any) => wantedVals.includes(String(v.name || '').trim()))
        );
        if (!matched) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q) || (p.nameKn && p.nameKn.toLowerCase().includes(q));
        const matchDesc = p.description?.toLowerCase().includes(q);
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        const matchCat = catName?.toLowerCase().includes(q);
        const matchSku = p.sku?.toLowerCase().includes(q);
        const matchRipl = p.riplCode?.toLowerCase().includes(q);
        const matchBrand = getProductBrandName(p).toLowerCase().includes(q);
        const matchModel = p.modelNumber?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat && !matchSku && !matchRipl && !matchBrand && !matchModel) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [products, brands, selectedCategory, selectedBrand, selectedSpecFilters, selectedProdAttrFilters, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-agri-yellow text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            Database-Backed Live Catalogue
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Agri Mart Storefront</h1>
          <p className="text-xs text-emerald-100 mt-1">
            Genuine power weeders, battery sprayers, certified foundation seeds, bio-fertilizers &amp; drip systems.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCatalogue}
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition"
            title="Refresh catalogue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <Link
            href="/ai-advisory"
            className="inline-flex items-center gap-1.5 bg-agri-yellow hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Need Guidance? Ask AI</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-agri-green" /> Filters
            </h3>
            {(selectedCategory !== 'ALL' || selectedBrand !== 'ALL' || searchQuery || hasActiveAttributeFilters) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedBrand('ALL');
                  setSelectedSpecFilters({});
                  setSelectedProdAttrFilters({});
                  setSearchQuery('');
                }}
                className="text-[11px] text-agri-green font-bold hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs">Search Products</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Weeder, NPK, Seeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-agri-green outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-agri-pale text-agri-green-dark font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-agri-pale text-agri-green-dark font-extrabold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-agri-green text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs">Brand</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand('ALL')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition ${
                  selectedBrand === 'ALL'
                    ? 'bg-agri-pale text-agri-green-dark font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Brands ({products.length})
              </button>
              {brands.map((brandObj: any) => {
                const brandName = brandObj.name;
                const count = products.filter(
                  (p: any) => getProductBrandName(p).toLowerCase() === brandName.toLowerCase()
                ).length;
                const isSelected = selectedBrand.toLowerCase() === brandName.toLowerCase();
                return (
                  <button
                    key={brandObj.id || brandName}
                    onClick={() => setSelectedBrand(brandName)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-agri-pale text-agri-green-dark font-extrabold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{brandName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-agri-green text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Attribute Filters */}
          {prodAttrFilterGroups.map((group) => (
            <div key={`pattr-${group.name}`} className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {group.name}
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {group.values.map((item) => {
                  const isChecked = (selectedProdAttrFilters[group.name] || []).includes(item.value);
                  return (
                    <label
                      key={item.value}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                        isChecked
                          ? 'bg-emerald-50 text-agri-green-dark border border-emerald-200'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleProdAttrFilter(group.name, item.value)}
                          className="accent-emerald-700 rounded"
                        />
                        {item.rgbColor && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: item.rgbColor }}
                          />
                        )}
                        <span>{item.value}</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isChecked ? 'bg-agri-green text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Specification Attribute Filters */}
          {specFilterGroups.map((group) => (
            <div key={`spec-${group.name}`} className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {group.name}
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {group.values.map((item) => {
                  const isChecked = (selectedSpecFilters[group.name] || []).includes(item.value);
                  return (
                    <label
                      key={item.value}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                        isChecked
                          ? 'bg-emerald-50 text-agri-green-dark border border-emerald-200'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSpecFilter(group.name, item.value)}
                          className="accent-emerald-700 rounded"
                        />
                        {item.rgbColor && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: item.rgbColor }}
                          />
                        )}
                        <span>{item.value}</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isChecked ? 'bg-agri-green text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar: Count & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-600 font-semibold">
              Showing <strong>{filteredProducts.length}</strong> products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-agri-green"
              >
                <option value="popular">Most Popular &amp; Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-xs text-slate-500">
              Fetching dynamic catalogue from database...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-slate-600 font-bold">No products match your selected filters.</p>
              <p className="text-slate-400 text-xs">Try selecting 'All Categories' or clearing your search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
