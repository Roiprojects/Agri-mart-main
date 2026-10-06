'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductType } from '@/lib/seed-data';
import { Star, ShoppingCart, CheckCircle2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth-client';

interface ProductCardProps {
  product: ProductType;
  onAddToCart?: (product: ProductType) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAdd = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('agri_cart_items');
          let cart = stored ? JSON.parse(stored) : [];
          const existingIdx = cart.findIndex((i: any) => i.id === product.id);
          if (existingIdx >= 0) {
            cart[existingIdx].quantity += 1;
          } else {
            cart.push({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: (product.images && product.images[0]) || (product as any).image,
              category: product.category,
            });
          }
          localStorage.setItem('agri_cart_items', JSON.stringify(cart));
        } catch (e) {}
      }
    }

    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  // Normalize target crops safely (supports array, comma-separated string, or undefined)
  const cropsList: string[] = Array.isArray(product.targetCrops)
    ? product.targetCrops
    : typeof product.targetCrops === 'string'
    ? (product.targetCrops as string).split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  const productImage =
    (product.images && product.images[0]) ||
    (product as any).image ||
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white rounded-2xl border border-agri-border overflow-hidden shadow-subtle card-hover flex flex-col group relative">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 w-full bg-agri-cream/60 overflow-hidden block"
      >
        <Image
          src={productImage}
          alt={product.name}
          fill
          unoptimized
          className="object-cover img-zoom"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <Badge variant="golden" size="sm">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="brand" size="sm">
              Best Seller
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-[10px] font-bold text-agri-green uppercase tracking-wider mb-1">
            {product.category}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-sm text-agri-dark hover:text-agri-green line-clamp-2 transition-colors duration-150 mb-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-2.5 text-xs text-agri-secondary">
            <div className="flex items-center text-agri-yellow-dark">
              <Star className="w-3.5 h-3.5 fill-current text-agri-yellow" />
              <span className="font-bold ml-1 text-agri-dark text-xs">{product.rating || 5}</span>
            </div>
            <span>&bull;</span>
            <span>{product.reviewsCount || 0} reviews</span>
          </div>

          {/* Target Crops Pills */}
          {cropsList.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {cropsList.slice(0, 3).map((crop) => (
                <span
                  key={crop}
                  className="text-[10px] bg-agri-pale text-agri-green-dark px-2 py-0.5 rounded-md font-medium border border-emerald-200/50"
                >
                  {crop}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-agri-border/60 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-extrabold text-agri-dark tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.comparePrice > product.price && (
              <div className="text-xs text-slate-400 line-through">
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-agri-green hover:bg-agri-green-dark text-white'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white animate-scaleIn" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
