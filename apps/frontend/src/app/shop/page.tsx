'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { Filter, Search, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '@/lib/seed-data';

const globalShopCache = globalThis as unknown as {
  __shopProducts?: any[];
  __shopCategories?: any[];
};

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>(
    () => globalShopCache.__shopProducts || SEED_PRODUCTS
  );
  const [categories, setCategories] = useState<any[]>(
    () => globalShopCache.__shopCategories || SEED_CATEGORIES
  );
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  const fetchCatalogue = () => {
    Promise.all([
      fetch('/api/products', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/categories', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([prodData, catData]) => {
        if (prodData.success && Array.isArray(prodData.data)) {
          globalShopCache.__shopProducts = prodData.data;
          setProducts(prodData.data);
        }
        if (catData.success && Array.isArray(catData.data)) {
          globalShopCache.__shopCategories = catData.data;
          setCategories(catData.data);
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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL' && p.categoryId !== selectedCategory) return false;
      if (selectedCrop !== 'ALL' && !p.targetCrops?.toLowerCase().includes(selectedCrop.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q) || (p.nameKn && p.nameKn.toLowerCase().includes(q));
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        const matchSku = p.sku?.toLowerCase().includes(q);
        const matchRipl = p.riplCode?.toLowerCase().includes(q);
        const matchBrand = (p.brand || p.brandName)?.toLowerCase().includes(q);
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
  }, [products, selectedCategory, selectedCrop, searchQuery, sortBy]);

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
            {(selectedCategory !== 'ALL' || selectedCrop !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedCrop('ALL');
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

          {/* Target Crop Filter */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs">Suitability by Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-agri-green outline-none"
            >
              <option value="ALL">All Crops</option>
              <option value="Paddy">Paddy / Rice</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Maize">Maize</option>
              <option value="Tomato">Tomato / Vegetables</option>
              <option value="Chili">Chili (Byadgi)</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>

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
