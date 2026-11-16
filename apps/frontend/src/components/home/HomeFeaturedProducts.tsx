'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { mergeProductsWithOverrides } from '@/lib/admin-product-overrides';

interface HomeFeaturedProductsProps {
  initialProducts: any[];
}

export default function HomeFeaturedProducts({ initialProducts }: HomeFeaturedProductsProps) {
  const [products, setProducts] = useState<any[]>(() =>
    (initialProducts || []).filter((p: any) => Boolean(p?.showOnHomePage))
  );

  useEffect(() => {
    const merged = mergeProductsWithOverrides(initialProducts || []);
    setProducts(merged.filter((p: any) => Boolean(p?.showOnHomePage)));
  }, [initialProducts]);

  // Only display on the home page when at least one product has "Show on home page" checked
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
        <div>
          <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
            Top Selling Inputs
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Featured Agricultural Equipment &amp; Care
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
        >
          View all products <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
