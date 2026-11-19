import React from 'react';
import { ApiClient } from '@/lib/api-client';
import { devDb } from '@/lib/dev-db';
import { SEED_RENTAL_PRODUCTS } from '@/lib/seed-data';
import RentalsProductList from '@/components/shop/RentalsProductList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RentalsPage() {
  let rentalProducts: any[] = SEED_RENTAL_PRODUCTS;
  try {
    const dbItems = devDb.getRentalProducts();
    if (Array.isArray(dbItems) && dbItems.length > 0) {
      rentalProducts = dbItems;
    } else {
      const res = await ApiClient.getRentals();
      if (res.success && res.data && res.data.length > 0) {
        rentalProducts = res.data;
      }
    }
  } catch (err) {
    // Fallback to seed data
  }

  let catalogProducts: any[] = [];
  let categories: { id: string; name: string; parentId?: string | null }[] = [];
  let brands: { id: string; name: string }[] = [];
  try {
    const rawProducts = devDb.getProducts({ onlyPublished: true });
    catalogProducts = rawProducts.map((p) => {
      const detailed = devDb.getProductWithDetails(p.id);
      const mediaUrls = detailed?.media?.map((m) => m.url).filter(Boolean) || [];
      return {
        ...p,
        category: detailed?.category?.name || (p as any).category || 'Rent a Product',
        brand: detailed?.brand?.name || (p as any).brandName || 'AgriPro',
        images: mediaUrls.length > 0 ? mediaUrls : (p as any).images || [],
      };
    });
    categories = devDb.getCategories().map((c: any) => ({ id: c.id, name: c.name, parentId: c.parentId || null }));
    brands = devDb.getBrands().map((b: any) => ({ id: b.id, name: b.name }));
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Rent Equipment Module
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-1 text-white">
            Agricultural Equipment Rental Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-2xl">
            Mechanize your farm operations without heavy capital investment. Rent power weeders,
            brush cutters, sprayers, tractors, and reapers by Hour, Day, Week, or Month.
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-xs space-y-1">
          <div className="font-bold text-amber-300">✓ Hourly &amp; Daily Rental Options</div>
          <div className="text-slate-300">✓ 100% Refundable Deposits</div>
          <div className="text-slate-300">✓ Doorstep Dark Warehouse Dispatch</div>
        </div>
      </div>

      {/* Rentals List (Includes Admin "Rent a Product" items + Dedicated Rental Equipment) */}
      <RentalsProductList
        rentalProducts={rentalProducts}
        catalogProducts={catalogProducts}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
