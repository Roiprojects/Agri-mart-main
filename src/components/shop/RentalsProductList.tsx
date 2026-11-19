'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Eye } from 'lucide-react';
import { mergeProductsWithOverrides } from '@/lib/admin-product-overrides';
import { mergeRentalsWithOverrides } from '@/lib/admin-rentals-services-storage';

interface RentalsProductListProps {
  rentalProducts: any[];
  catalogProducts: any[];
  categories: { id: string; name: string; parentId?: string | null }[];
  brands: { id: string; name: string }[];
}

export default function RentalsProductList({
  rentalProducts,
  catalogProducts,
  categories,
  brands,
}: RentalsProductListProps) {
  const [mergedCatalog, setMergedCatalog] = useState<any[]>(catalogProducts);
  const [mergedRentals, setMergedRentals] = useState<any[]>(rentalProducts);

  useEffect(() => {
    setMergedCatalog(mergeProductsWithOverrides(catalogProducts, categories, brands));
    setMergedRentals(mergeRentalsWithOverrides(rentalProducts));
  }, [catalogProducts, rentalProducts, categories, brands]);

  const rentFlaggedProducts = useMemo(() => {
    const rentalIds = new Set(mergedRentals.map((r) => r.id));
    return mergedCatalog.filter((p) => Boolean(p?.isRental) && !p?.isDraft && !rentalIds.has(p.id));
  }, [mergedCatalog, mergedRentals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rentFlaggedProducts.map((prod) => {
        const prodImg =
          (Array.isArray(prod.images) && prod.images[0]) ||
          prod.image ||
          '/images/products/agrimart/product_1646_2.jpg';
        const catName =
          typeof prod.category === 'object' ? prod.category?.name : prod.category || 'Rent a Product';
        const periodLabel = `${prod.rentalPeriodLength || 1} ${prod.rentalPeriod || 'Days'}`;

        return (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
              <img
                src={prodImg}
                alt={prod.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">
                {catName}
              </span>
              <span className="absolute top-3 right-3 bg-emerald-700 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Rent a Product</span>
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  <Link href={`/products/${prod.slug}`} className="hover:text-emerald-700 transition">
                    {prod.name}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {prod.shortDescription || prod.description || 'Available for equipment rental.'}
                </p>

                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-700">
                  <div>
                    <strong>Rental Period:</strong> {periodLabel}
                  </div>
                  {prod.sku && (
                    <div>
                      <strong>SKU:</strong> {prod.sku}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-base font-black text-emerald-800">
                    ₹{(Number(prod.price) || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500">Per {periodLabel}</div>
                </div>

                <Link
                  href={`/products/${prod.slug}`}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1"
                >
                  <span>Rent Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {mergedRentals.map((machine) => {
        const hourlyRate =
          (machine as any).hourlyRate || Math.max(50, Math.round((machine.dailyRate || 1200) / 6));
        const equipImg =
          (Array.isArray(machine.images) && machine.images[0]) ||
          '/images/gallery/01-hero-tractor-sunrise.jpg';

        return (
          <div
            key={machine.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
              <img
                src={equipImg}
                alt={machine.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">
                {machine.category}
              </span>
              <span className="absolute top-3 right-3 bg-emerald-700 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
                ₹{hourlyRate}/hr Available
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  <Link
                    href={`/rentals/${machine.slug}`}
                    className="hover:text-emerald-700 transition"
                  >
                    {machine.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{machine.description}</p>

                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-700">
                  <div>
                    <strong>Power:</strong> {machine.powerRating}
                  </div>
                  <div>
                    <strong>Suitable for:</strong> {machine.suitableFor}
                  </div>
                  <div className="text-emerald-700 font-semibold">
                    <strong>Security Deposit:</strong> ₹
                    {(Number(machine.securityDeposit) || 0).toLocaleString('en-IN')} (Refundable)
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-base font-black text-emerald-800">
                    ₹{hourlyRate}/hr{' '}
                    <span className="text-slate-400 font-normal">&bull;</span>{' '}
                    <span className="text-slate-900">₹{machine.dailyRate}/day</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ₹{machine.weeklyRate}/week | ₹{machine.monthlyRate}/month
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/rentals/${machine.slug}`}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1"
                  >
                    <span>View</span>
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
