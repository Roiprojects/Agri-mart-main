'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { getProductAvailability } from '@/lib/product-availability';
import { Heart, ShoppingCart, Trash2, ArrowRight, Ban } from 'lucide-react';

export interface WishlistProductItem {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  comparePrice?: number;
  images: string[];
  disableBuyButton?: boolean;
  disableWishlistButton?: boolean;
  availableStartDate?: string;
  availableEndDate?: string;
}

interface WishlistClientProps {
  products: WishlistProductItem[];
  defaultIds: string[];
}

export default function WishlistClient({ products, defaultIds }: WishlistClientProps) {
  const router = useRouter();
  const [wishlistIds, setWishlistIds] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('agri_wishlist');
      const rawIds: string[] = stored ? JSON.parse(stored) : defaultIds;
      const validIds = rawIds.filter((id) => {
        const prod = products.find((p) => p.id === id);
        return prod && !prod.disableWishlistButton;
      });

      // Prune any disabled-wishlist products from localStorage so they stay hidden
      if (stored && validIds.length !== rawIds.length) {
        localStorage.setItem('agri_wishlist', JSON.stringify(validIds));
      }
      setWishlistIds(validIds);
    } catch {
      setWishlistIds(defaultIds);
    }
  }, [products, defaultIds]);

  const wishlistItems = useMemo(() => {
    const activeIds = wishlistIds ?? defaultIds;
    return activeIds
      .map((id) => products.find((p) => p.id === id))
      .filter((item): item is WishlistProductItem => Boolean(item) && !item.disableWishlistButton);
  }, [wishlistIds, products, defaultIds]);

  const handleRemove = (id: string) => {
    const nextIds = (wishlistIds ?? defaultIds).filter((itemId) => itemId !== id);
    setWishlistIds(nextIds);
    try {
      localStorage.setItem('agri_wishlist', JSON.stringify(nextIds));
    } catch {}
  };

  const handleMoveToCart = (item: WishlistProductItem) => {
    const availability = getProductAvailability(item as any);
    if (item.disableBuyButton || !availability.isAvailableNow) return;

    try {
      const stored = localStorage.getItem('agri_cart_items');
      const cart = stored ? JSON.parse(stored) : [];
      const existingIdx = cart.findIndex((c: any) => c.id === item.id);
      if (existingIdx >= 0) {
        cart[existingIdx].quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.images[0],
          category: item.category,
        });
      }
      localStorage.setItem('agri_cart_items', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {}

    router.push('/cart');
  };

  return (
    <>
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
          {wishlistItems.map((item) => {
            const availability = getProductAvailability(item as any);
            const isPurchaseDisabled = Boolean(item.disableBuyButton) || !availability.isAvailableNow;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-slate-100">
                  <Image
                    src={item.images[0] || '/images/products/agrimart/product_1646_2.jpg'}
                    alt={item.name}
                    fill
                    unoptimized
                    className={`object-cover ${
                      availability.shouldBlurImage ? 'blur-md scale-110 brightness-90' : ''
                    }`}
                  />
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
                    {isPurchaseDisabled ? (
                      <button
                        type="button"
                        disabled
                        className="flex-1 bg-slate-100 text-slate-400 font-bold text-xs py-2.5 px-4 rounded-xl cursor-not-allowed text-center flex items-center justify-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{item.disableBuyButton ? 'Purchase Disabled' : 'Unavailable'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs py-2.5 px-4 rounded-xl transition text-center flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
