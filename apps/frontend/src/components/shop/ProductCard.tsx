'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductType } from '@/lib/seed-data';
import { Star, ShoppingCart, CheckCircle2, Lock, Camera, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth-client';
import { getProductAvailability } from '@/lib/product-availability';
import { resolveProductDiscounts, ResolvedProductDiscounts } from '@/lib/admin-discounts-storage';

interface ProductCardProps {
  product: ProductType;
  onAddToCart?: (product: ProductType) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isAdded, setIsAdded] = useState(false);
  const [resolvedDiscount, setResolvedDiscount] = useState<ResolvedProductDiscounts | null>(null);

  useEffect(() => {
    setResolvedDiscount(resolveProductDiscounts(product as any, Number(product.price) || 0));
  }, [product]);

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const availability = getProductAvailability(product as any);
  const canPreOrder =
    availability.isBeforeStart && Boolean(product.availableForPreOrder) && !product.disableBuyButton;

  const handleAdd = () => {
    if (
      product.disableBuyButton ||
      product.callForPrice ||
      product.customerEntersPrice ||
      (!availability.isAvailableNow && !canPreOrder)
    )
      return;
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
              image:
                (product.images && product.images[0]) ||
                (product as any).image ||
                '/images/products/agrimart/product_1646_2.jpg',
              category:
                typeof product.category === 'object' && product.category !== null
                  ? (product.category as any)?.name || 'Agricultural Input'
                  : product.category || 'Agricultural Input',
            });
          }
          localStorage.setItem('agri_cart_items', JSON.stringify(cart));
          window.dispatchEvent(new Event('cartUpdated'));
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

  // Resolve image list with safe fallbacks
  const rawImages: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img && typeof img === 'string') rawImages.push(img);
    });
  }
  if (rawImages.length === 0 && (product as any).image) {
    rawImages.push((product as any).image);
  }
  if (rawImages.length === 0 && Array.isArray((product as any).media)) {
    (product as any).media.forEach((m: any) => {
      if (m?.url) rawImages.push(m.url);
    });
  }

  const defaultImage =
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80';
  const productImages = rawImages.length > 0 ? rawImages : [defaultImage];
  const primaryImage = productImages[0] || defaultImage;
  const secondaryImage = productImages[1] || primaryImage;

  return (
    <div className="bg-white rounded-2xl border border-agri-border overflow-hidden shadow-subtle card-hover flex flex-col group relative">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] min-h-[190px] sm:min-h-[210px] w-full bg-slate-100 overflow-hidden block"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          unoptimized
          className={`object-cover img-zoom ${
            availability.shouldBlurImage ? 'blur-md scale-110 brightness-90' : ''
          } ${productImages.length > 1 ? 'group-hover:opacity-0 transition-opacity duration-300' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {productImages.length > 1 && (
          <Image
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            fill
            unoptimized
            className={`object-cover img-zoom absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              availability.shouldBlurImage ? 'blur-md scale-110 brightness-90' : ''
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {availability.isBeforeStart && (
          <>
            {/* Automatic Realistic Gold Satin Ribbon & Bow Overlay (Product Card Only) */}
            <img
              src="/images/ribbons/gold-ribbon-bow.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 w-[46%] h-auto z-20 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
            />

            <div className="absolute inset-0 z-10 bg-slate-900/35 flex flex-col items-center justify-center p-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 text-amber-300 font-bold text-[11px] border border-amber-400/40 shadow-md">
                <Clock className="w-3.5 h-3.5" />
                <span>Coming Soon</span>
              </span>
              {availability.formattedStart && (
                <span className="mt-1.5 text-[10px] font-semibold text-white bg-black/60 px-2.5 py-0.5 rounded-full">
                  Available: {availability.formattedStart}
                </span>
              )}
            </div>
          </>
        )}

        {availability.isAfterEnd && (
          <div className="absolute inset-0 z-10 bg-slate-900/45 flex flex-col items-center justify-center p-3 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 text-rose-200 font-bold text-[11px] border border-rose-400/40 shadow-md">
              <span>Availability Ended</span>
            </span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-10">
          {(product as any).markAsNew && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
              NEW
            </span>
          )}
          {discountPercent > 0 && !product.callForPrice && (
            <Badge variant="golden" size="sm">
              {discountPercent}% OFF
            </Badge>
          )}
          {resolvedDiscount?.primaryDiscount && !product.callForPrice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
              <Tag className="w-2.5 h-2.5" />
              {resolvedDiscount.primaryDiscount.usePercentage
                ? `${resolvedDiscount.primaryDiscount.discountPercentage}% OFF`
                : `₹${resolvedDiscount.primaryDiscount.discountAmount} OFF`}
            </span>
          )}
          {product.isBestSeller && (
            <Badge variant="brand" size="sm">
              Best Seller
            </Badge>
          )}
        </div>

        {/* Multiple Photos Pill */}
        {productImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-slate-900/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
            <Camera className="w-3 h-3 text-agri-yellow" />
            <span>{productImages.length}</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="text-agri-green">
              {typeof product.category === 'object' ? (product.category as any)?.name : product.category}
            </span>
            {(product.brand || (product as any).brandName) && (
              <span className="text-slate-500 font-extrabold bg-slate-100 px-2 py-0.5 rounded text-[9px] border border-slate-200">
                {typeof product.brand === 'object'
                  ? (product.brand as any)?.name
                  : product.brand || (product as any).brandName}
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-sm text-agri-dark hover:text-agri-green line-clamp-2 transition-colors duration-150 mb-1 leading-snug"
          >
            {product.name}
          </Link>

          {(product.riplCode || product.sku) && (
            <div className="text-[10px] font-mono text-slate-400 mb-2">
              Code: <strong className="text-slate-700">{product.riplCode || product.sku}</strong>
            </div>
          )}

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
            {product.callForPrice ? (
              <div className="text-sm font-extrabold text-emerald-800">
                Call for Price
              </div>
            ) : product.customerEntersPrice ? (
              <>
                <div className="text-sm font-extrabold text-agri-green-dark">
                  Enter Your Price
                </div>
                <div className="text-[9px] text-slate-400 font-medium">
                  Suggested: ₹{product.price.toLocaleString('en-IN')}
                </div>
              </>
            ) : (
              <>
                {resolvedDiscount?.hasAutomaticDiscount ? (
                  <>
                    <div className="text-base font-extrabold text-emerald-700 tracking-tight">
                      ₹{resolvedDiscount.discountedPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-slate-400 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-base font-extrabold text-agri-dark tracking-tight">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    {product.comparePrice > product.price && (
                      <div className="text-xs text-slate-400 line-through">
                        ₹{product.comparePrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </>
                )}
                {resolvedDiscount?.primaryDiscount && (
                  <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                    {resolvedDiscount.primaryDiscount.name}
                    {resolvedDiscount.primaryDiscount.requiresCouponCode &&
                      resolvedDiscount.primaryDiscount.couponCode &&
                      ` • Code: ${resolvedDiscount.primaryDiscount.couponCode}`}
                  </div>
                )}
                <div className="text-[9px] text-slate-400 font-medium">
                  {(product as any).priceNote || 'MRP (Incl. taxes)'}
                </div>
              </>
            )}
          </div>

          {!availability.isAvailableNow ? (
            canPreOrder ? (
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Pre-order ${product.name}`}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-xs ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white animate-scaleIn" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pre-Order</span>
                  </>
                )}
              </button>
            ) : (
              <Link
                href={`/products/${product.slug}`}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition"
              >
                {availability.isBeforeStart ? 'Coming Soon' : 'Unavailable'}
              </Link>
            )
          ) : product.callForPrice ? (
            <a
              href="tel:+918001234567"
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition"
            >
              Call
            </a>
          ) : product.customerEntersPrice ? (
            <Link
              href={`/products/${product.slug}`}
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition"
            >
              Enter Price
            </Link>
          ) : product.disableBuyButton ? (
            <Link
              href={`/products/${product.slug}`}
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
            >
              Details
            </Link>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
