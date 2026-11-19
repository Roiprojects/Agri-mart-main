'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { mergeProductsWithOverrides } from '@/lib/admin-product-overrides';

interface ServicesProductListProps {
  catalogProducts: any[];
  categories: { id: string; name: string; parentId?: string | null }[];
  brands: { id: string; name: string }[];
}

export default function ServicesProductList({
  catalogProducts,
  categories,
  brands,
}: ServicesProductListProps) {
  const [mergedCatalog, setMergedCatalog] = useState<any[]>(catalogProducts);

  useEffect(() => {
    setMergedCatalog(mergeProductsWithOverrides(catalogProducts, categories, brands));
  }, [catalogProducts, categories, brands]);

  const rentServiceProducts = useMemo(() => {
    return mergedCatalog.filter((p) => Boolean(p?.isRentService) && !p?.isDraft);
  }, [mergedCatalog]);

  if (rentServiceProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Rent a Service Offerings
          </h2>
          <p className="text-xs text-slate-500">
            Products and equipment available as bookable Rent a Service packages
          </p>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {rentServiceProducts.length} Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentServiceProducts.map((prod) => {
          const prodImg =
            (Array.isArray(prod.images) && prod.images[0]) ||
            prod.image ||
            '/images/gallery/03-tractor-soil.jpg';
          const catName =
            typeof prod.category === 'object' ? prod.category?.name : prod.category || 'Rent a Service';
          const periodLabel = `${prod.servicePeriodLength || 1} ${prod.servicePeriod || 'Days'}`;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 group">
                  <img
                    src={prodImg}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Rent a Service</span>
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    {catName}
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    <Link href={`/products/${prod.slug}`} className="hover:text-emerald-700 transition">
                      {prod.name}
                    </Link>
                  </h3>
                  <div className="text-emerald-800 font-bold text-xs flex items-center gap-2">
                    <span>₹{(Number(prod.price) || 0).toLocaleString('en-IN')}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span>Per {periodLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {prod.shortDescription || prod.description || 'Available under Rent a Service.'}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/products/${prod.slug}`}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View Details
                </Link>
                <Link
                  href="/services/book"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
