import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '@/lib/seed-data';
import ProductCard from '@/components/shop/ProductCard';
import { ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const currentCategory = SEED_CATEGORIES.find((c) => c.slug === resolvedParams.category);

  if (!currentCategory) {
    notFound();
  }

  const categoryProducts = SEED_PRODUCTS.filter((p) => p.categoryId === currentCategory.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to All Products
      </Link>

      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Category</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold mt-1">{currentCategory.name}</h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-2xl">{currentCategory.description}</p>
      </div>

      <div className="space-y-4">
        <div className="text-xs text-slate-500">
          Showing <strong>{categoryProducts.length}</strong> products in this category
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">No products currently available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
