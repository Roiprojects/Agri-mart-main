import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/config';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Wishlist & Saved Farm Equipment | AGRI MART MEGA',
  description: 'Your saved agricultural machinery, fertilizers, and tools on Agri Mart Mega.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Customer Account', href: '/account' },
    { label: 'Wishlist' },
  ];

  // Saved items preview from seed data
  const wishlistItems = [SEED_PRODUCTS[0], SEED_PRODUCTS[2], SEED_PRODUCTS[5]].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-wider">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Farmer Saved Items
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
        >
          Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Your wishlist is empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save power tillers, certified seeds, and bio-nutrients you want to purchase later.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs px-6 py-3 rounded-xl transition"
          >
            Explore Agricultural Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-slate-100">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant="success" size="sm">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.brand} &bull; SKU: {item.sku}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1 line-clamp-2">
                    <Link href={`/products/${item.slug}`} className="hover:text-brand-green">
                      {item.name}
                    </Link>
                  </h3>
                  <div className="mt-2 text-lg font-black text-slate-900">
                    ₹{item.price.toLocaleString('en-IN')}
                    {item.comparePrice && (
                      <span className="text-xs text-slate-400 line-through font-normal ml-2">
                        ₹{item.comparePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href="/cart"
                    className="flex-1 bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs py-2.5 px-4 rounded-xl transition text-center flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </Link>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
